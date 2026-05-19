namespace HotelBooking.Application.Hotels;

public sealed record HotelDto(
    Guid Id,
    string Name,
    string Description,
    string Country,
    string City,
    string District,
    string Address,
    int StarRating,
    bool IsActive);
