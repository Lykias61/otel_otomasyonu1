using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class RoomType : BaseEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CapacityAdults { get; set; }
    public int CapacityChildren { get; set; }
    public int TotalRooms { get; set; }
    public decimal BasePrice { get; set; }
    public string Currency { get; set; } = "TRY";
    public bool IsActive { get; set; } = true;

    public ICollection<SeasonalPrice> SeasonalPrices { get; set; } = new List<SeasonalPrice>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
