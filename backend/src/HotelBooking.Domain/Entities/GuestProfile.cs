using HotelBooking.Domain.Common;

namespace HotelBooking.Domain.Entities;

public class GuestProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string TcKimlikNo { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string? PassportNumber { get; set; }
    public string Nationality { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public string InvoiceInfo { get; set; } = string.Empty;
    public string PaymentPreference { get; set; } = string.Empty;
    public string? SpecialRequests { get; set; }
    public bool AccessibilityNeeds { get; set; }
    public bool NonSmokingRoomPreference { get; set; }
    public string BedTypePreference { get; set; } = string.Empty;
    public bool BreakfastPreference { get; set; }
    public string? PetInfo { get; set; }
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;

    public AppUser User { get; set; } = null!;
}
