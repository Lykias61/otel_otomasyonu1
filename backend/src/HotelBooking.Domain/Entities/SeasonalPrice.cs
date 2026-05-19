using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class SeasonalPrice : BaseEntity
{
    public Guid RoomTypeId { get; set; }
    public RoomType RoomType { get; set; } = null!;

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Price { get; set; }
}
