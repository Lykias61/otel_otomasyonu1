using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using HotelBooking.Application.Auth;
using HotelBooking.Domain.Enums;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HotelBooking.Infrastructure.Auth;

public sealed class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IPasswordHasher<AppUser> _passwordHasher;

    public AuthService(
        AppDbContext dbContext,
        IConfiguration configuration,
        IPasswordHasher<AppUser> passwordHasher)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail && x.IsActive, cancellationToken);

        if (user is null || user.Role != request.PortalRole)
        {
            return null;
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        var expiresAtUtc = DateTime.UtcNow.AddHours(8);
        var token = CreateToken(user, expiresAtUtc);

        return new LoginResponse(
            token,
            expiresAtUtc,
            ToAuthUserDto(user));
    }

    public async Task<(LoginResponse? Response, string? Error)> RegisterGuestAsync(
        GuestRegisterRequest request,
        CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();
        var normalizedUsername = username.ToLowerInvariant();
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var normalizedPhone = NormalizePhone(request.Phone);

        if (username.Length < 3)
        {
            return (null, "Kullanıcı adı minimum 3 karakter olmalıdır.");
        }

        if (!Regex.IsMatch(normalizedEmail, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
        {
            return (null, "Geçerli bir e-posta adresi giriniz.");
        }

        if (normalizedPhone is null)
        {
            return (null, "Geçerli bir telefon numarası giriniz.");
        }

        var passwordValidationError = ValidatePassword(request.Password);

        if (passwordValidationError is not null)
        {
            return (null, passwordValidationError);
        }

        if (request.Password != request.ConfirmPassword)
        {
            return (null, "Şifre ve şifre tekrar aynı olmalıdır.");
        }

        if (!request.KvkkAccepted || !request.UserAgreementAccepted)
        {
            return (null, "KVKK ve kullanıcı sözleşmesi onayı zorunludur.");
        }

        var usernameExists = await _dbContext.Users
            .AnyAsync(x => x.Username != null && x.Username.ToLower() == normalizedUsername, cancellationToken);

        if (usernameExists)
        {
            return (null, "Bu kullanıcı adı daha önce alınmış.");
        }

        var emailExists = await _dbContext.Users
            .AnyAsync(x => x.Email.ToLower() == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            return (null, "Bu e-posta adresi daha önce kullanılmış.");
        }

        var phoneExists = await _dbContext.Users
            .AnyAsync(x => x.Phone == normalizedPhone, cancellationToken);

        if (phoneExists)
        {
            return (null, "Bu telefon numarası daha önce kullanılmış.");
        }

        var user = new AppUser
        {
            Username = username,
            FirstName = "Misafir",
            LastName = "Kullanıcı",
            Email = normalizedEmail,
            Phone = normalizedPhone,
            Role = UserRole.Customer,
            IsActive = true,
            IsEmailVerified = true,
            LastLoginAtUtc = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var expiresAtUtc = DateTime.UtcNow.AddHours(8);
        var token = CreateToken(user, expiresAtUtc);

        return (new LoginResponse(token, expiresAtUtc, ToAuthUserDto(user)), null);
    }

    public async Task<string?> ResetPasswordAsync(
        ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var channel = request.Channel.Trim().ToLowerInvariant();
        AppUser? user;

        if (channel == "email")
        {
            var normalizedEmail = request.Identifier.Trim().ToLowerInvariant();

            if (!Regex.IsMatch(normalizedEmail, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
            {
                return "Geçerli bir e-posta adresi giriniz.";
            }

            user = await _dbContext.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail && x.IsActive, cancellationToken);
        }
        else if (channel == "phone")
        {
            var normalizedPhone = NormalizePhone(request.Identifier);

            if (normalizedPhone is null)
            {
                return "Geçerli bir telefon numarası giriniz.";
            }

            var candidates = await _dbContext.Users
                .Include(x => x.GuestProfile)
                .Where(x => x.IsActive && (x.Phone == normalizedPhone || x.GuestProfile != null))
                .ToListAsync(cancellationToken);

            user = candidates.FirstOrDefault(x =>
                x.Phone == normalizedPhone ||
                NormalizePhone(x.GuestProfile?.Phone ?? string.Empty) == normalizedPhone);
        }
        else
        {
            return "Şifre sıfırlama yöntemi geçerli değil.";
        }

        if (user is null)
        {
            return "Bu bilgilerle eşleşen aktif kullanıcı bulunamadı.";
        }

        var passwordValidationError = ValidatePassword(request.NewPassword);

        if (passwordValidationError is not null)
        {
            return passwordValidationError;
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return "Yeni şifre ve tekrar alanı eşleşmiyor.";
        }

        user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return null;
    }

    public async Task<GuestProfileDto?> GetGuestProfileAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var profile = await _dbContext.GuestProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        return profile is null ? null : ToGuestProfileDto(profile);
    }

    public async Task<(GuestProfileDto? Profile, string? Error)> CompleteGuestProfileAsync(
        Guid userId,
        CompleteGuestProfileRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .Include(x => x.GuestProfile)
            .FirstOrDefaultAsync(x => x.Id == userId && x.Role == UserRole.Customer && x.IsActive, cancellationToken);

        if (user is null)
        {
            return (null, "Misafir kullanıcı bulunamadı.");
        }

        if (request.BirthDate > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return (null, "Doğum tarihi gelecekte bir tarih olamaz.");
        }

        if (!Regex.IsMatch(request.TcKimlikNo, @"^\d{11}$"))
        {
            return (null, "T.C. Kimlik Numarası 11 haneli olmalıdır.");
        }

        if (!Regex.IsMatch(request.Phone, @"^\+?[0-9\s()\-]{10,20}$") ||
            !Regex.IsMatch(request.EmergencyContactPhone, @"^\+?[0-9\s()\-]{10,20}$"))
        {
            return (null, "Telefon numarası formatı geçerli değil.");
        }

        var normalizedPhone = NormalizePhone(request.Phone);

        if (normalizedPhone is null)
        {
            return (null, "Telefon numarası formatı geçerli değil.");
        }

        var phoneInUse = await _dbContext.Users
            .AnyAsync(x => x.Id != user.Id && x.Phone == normalizedPhone, cancellationToken);

        if (phoneInUse)
        {
            return (null, "Bu telefon numarası başka bir kullanıcı tarafından kullanılıyor.");
        }

        var profile = user.GuestProfile ?? new GuestProfile
        {
            UserId = user.Id
        };

        profile.FirstName = request.FirstName.Trim();
        profile.LastName = request.LastName.Trim();
        profile.TcKimlikNo = request.TcKimlikNo.Trim();
        profile.BirthDate = request.BirthDate;
        profile.Gender = request.Gender.Trim();
        profile.Phone = request.Phone.Trim();
        profile.Country = request.Country.Trim();
        profile.City = request.City.Trim();
        profile.Address = request.Address.Trim();
        profile.DocumentType = request.DocumentType.Trim();
        profile.PassportNumber = request.PassportNumber?.Trim();
        profile.Nationality = request.Nationality.Trim();
        profile.PreferredLanguage = request.PreferredLanguage.Trim();
        profile.InvoiceInfo = request.InvoiceInfo.Trim();
        profile.PaymentPreference = request.PaymentPreference.Trim();
        profile.SpecialRequests = request.SpecialRequests?.Trim();
        profile.AccessibilityNeeds = request.AccessibilityNeeds;
        profile.NonSmokingRoomPreference = request.NonSmokingRoomPreference;
        profile.BedTypePreference = request.BedTypePreference.Trim();
        profile.BreakfastPreference = request.BreakfastPreference;
        profile.PetInfo = request.PetInfo?.Trim();
        profile.EmergencyContactName = request.EmergencyContactName.Trim();
        profile.EmergencyContactPhone = request.EmergencyContactPhone.Trim();

        user.FirstName = profile.FirstName;
        user.LastName = profile.LastName;
        user.Phone = normalizedPhone;

        if (user.GuestProfile is null)
        {
            await _dbContext.GuestProfiles.AddAsync(profile, cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return (ToGuestProfileDto(profile), null);
    }

    private string CreateToken(AppUser user, DateTime expiresAtUtc)
    {
        var key = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(key) ||
            string.IsNullOrWhiteSpace(issuer) ||
            string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException("JWT settings are missing.");
        }

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string? ValidatePassword(string password)
    {
        if (password.Length < 8)
        {
            return "Şifre minimum 8 karakter olmalıdır.";
        }

        if (!password.Any(char.IsUpper) ||
            !password.Any(char.IsLower) ||
            !password.Any(char.IsDigit))
        {
            return "Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.";
        }

        return null;
    }

    private static string? NormalizePhone(string phone)
    {
        var trimmedPhone = phone.Trim();

        if (!Regex.IsMatch(trimmedPhone, @"^\+?[0-9\s()\-]{10,20}$"))
        {
            return null;
        }

        var digits = Regex.Replace(trimmedPhone, @"\D", string.Empty);

        return digits.Length is >= 10 and <= 15 ? digits : null;
    }

    private static AuthUserDto ToAuthUserDto(AppUser user)
    {
        return new AuthUserDto(user.Id, user.Username, user.FirstName, user.LastName, user.Email, user.Role);
    }

    private static GuestProfileDto ToGuestProfileDto(GuestProfile profile)
    {
        return new GuestProfileDto(
            profile.UserId,
            profile.FirstName,
            profile.LastName,
            profile.TcKimlikNo,
            profile.BirthDate,
            profile.Gender,
            profile.Phone,
            profile.Country,
            profile.City,
            profile.Address,
            profile.DocumentType,
            profile.PassportNumber,
            profile.Nationality,
            profile.PreferredLanguage,
            profile.InvoiceInfo,
            profile.PaymentPreference,
            profile.SpecialRequests,
            profile.AccessibilityNeeds,
            profile.NonSmokingRoomPreference,
            profile.BedTypePreference,
            profile.BreakfastPreference,
            profile.PetInfo,
            profile.EmergencyContactName,
            profile.EmergencyContactPhone);
    }
}
