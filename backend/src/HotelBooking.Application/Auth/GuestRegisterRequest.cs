using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.Auth;

public sealed class GuestRegisterRequest
{
    [Required]
    [MaxLength(80)]
    public string Username { get; init; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Phone { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; init; } = string.Empty;

    [Required]
    public bool KvkkAccepted { get; init; }

    [Required]
    public bool UserAgreementAccepted { get; init; }
}
