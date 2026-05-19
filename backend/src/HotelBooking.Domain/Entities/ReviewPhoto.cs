using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class ReviewPhoto : BaseEntity
{
    public Guid ReviewId { get; set; }
    public Review Review { get; set; } = null!;

    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
}
