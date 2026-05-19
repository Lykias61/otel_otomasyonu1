using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class Hotel : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StarRating { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid? ManagerId { get; set; }
    public AppUser? Manager { get; set; }

    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
