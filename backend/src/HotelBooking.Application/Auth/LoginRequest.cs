using System.ComponentModel.DataAnnotations;
using HotelBooking.Domain.Enums;

namespace HotelBooking.Application.Auth;

public sealed class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;

    [Required]
    public UserRole PortalRole { get; init; }
}
