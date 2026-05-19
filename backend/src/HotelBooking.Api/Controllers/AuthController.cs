using HotelBooking.Application.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(request, cancellationToken);

        if (response is null)
        {
            return Unauthorized(new
            {
                message = "E-posta, şifre veya giriş rolü hatalı."
            });
        }

        return Ok(response);
    }

    [HttpPost("register/guest")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> RegisterGuest(
        GuestRegisterRequest request,
        CancellationToken cancellationToken)
    {
        var (response, error) = await _authService.RegisterGuestAsync(request, cancellationToken);

        if (response is null)
        {
            return BadRequest(new
            {
                message = error ?? "Misafir kaydı tamamlanamadı."
            });
        }

        return Ok(response);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var error = await _authService.ResetPasswordAsync(request, cancellationToken);

        if (error is not null)
        {
            return BadRequest(new
            {
                message = error
            });
        }

        return Ok(new
        {
            message = "Şifreniz başarıyla güncellendi."
        });
    }

    [HttpPost("guest/profile")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<GuestProfileDto>> CompleteGuestProfile(
        CompleteGuestProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı oturumu doğrulanamadı."
            });
        }

        var (profile, error) = await _authService.CompleteGuestProfileAsync(userId, request, cancellationToken);

        if (profile is null)
        {
            return BadRequest(new
            {
                message = error ?? "Profil bilgileri tamamlanamadı."
            });
        }

        return Ok(profile);
    }

    [HttpGet("guest/profile")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<GuestProfileDto>> GetGuestProfile(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Kullanıcı oturumu doğrulanamadı."
            });
        }

        var profile = await _authService.GetGuestProfileAsync(userId, cancellationToken);

        if (profile is null)
        {
            return NotFound(new
            {
                message = "Misafir profil bilgisi henüz tamamlanmamış."
            });
        }

        return Ok(profile);
    }
}
