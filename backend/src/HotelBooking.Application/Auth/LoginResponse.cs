namespace HotelBooking.Application.Auth;

public sealed record LoginResponse(
    string Token,
    DateTime ExpiresAtUtc,
    AuthUserDto User);
