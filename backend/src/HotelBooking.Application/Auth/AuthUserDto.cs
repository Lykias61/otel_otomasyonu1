using HotelBooking.Domain.Enums;

namespace HotelBooking.Application.Auth;

public sealed record AuthUserDto(
    Guid Id,
    string? Username,
    string FirstName,
    string LastName,
    string Email,
    UserRole Role);
