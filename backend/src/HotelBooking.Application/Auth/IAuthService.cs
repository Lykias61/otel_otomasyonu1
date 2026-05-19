namespace HotelBooking.Application.Auth;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<(LoginResponse? Response, string? Error)> RegisterGuestAsync(GuestRegisterRequest request, CancellationToken cancellationToken);
    Task<string?> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken);
    Task<GuestProfileDto?> GetGuestProfileAsync(Guid userId, CancellationToken cancellationToken);
    Task<(GuestProfileDto? Profile, string? Error)> CompleteGuestProfileAsync(Guid userId, CompleteGuestProfileRequest request, CancellationToken cancellationToken);
}
