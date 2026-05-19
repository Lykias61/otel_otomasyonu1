using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class Review : BaseEntity
{
    public Guid HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; }

    public ICollection<ReviewPhoto> Photos { get; set; } = new List<ReviewPhoto>();
}
