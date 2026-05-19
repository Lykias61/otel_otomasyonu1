using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.Auth;

public sealed class ResetPasswordRequest
{
    [Required]
    public string Identifier { get; init; } = string.Empty;

    [Required]
    public string Channel { get; init; } = string.Empty;

    [Required]
    public string NewPassword { get; init; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; init; } = string.Empty;
}
