using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.Hotels;

public sealed class UpdateHotelRequest
{
    [Required]
    [MaxLength(160)]
    public string Name { get; init; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string Country { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string City { get; init; } = string.Empty;

    [MaxLength(80)]
    public string District { get; init; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Address { get; init; } = string.Empty;

    [Range(1, 5)]
    public int StarRating { get; init; }
}
