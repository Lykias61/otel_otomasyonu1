using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.Auth;

public sealed class CompleteGuestProfileRequest
{
    [Required]
    [MaxLength(80)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string LastName { get; init; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{11}$")]
    public string TcKimlikNo { get; init; } = string.Empty;

    [Required]
    public DateOnly BirthDate { get; init; }

    [Required]
    [MaxLength(40)]
    public string Gender { get; init; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(32)]
    public string Phone { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string Country { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string City { get; init; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Address { get; init; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string DocumentType { get; init; } = string.Empty;

    [MaxLength(40)]
    public string? PassportNumber { get; init; }

    [Required]
    [MaxLength(80)]
    public string Nationality { get; init; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string PreferredLanguage { get; init; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string InvoiceInfo { get; init; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string PaymentPreference { get; init; } = string.Empty;

    [MaxLength(1000)]
    public string? SpecialRequests { get; init; }

    public bool AccessibilityNeeds { get; init; }
    public bool NonSmokingRoomPreference { get; init; }

    [Required]
    [MaxLength(80)]
    public string BedTypePreference { get; init; } = string.Empty;

    public bool BreakfastPreference { get; init; }

    [MaxLength(300)]
    public string? PetInfo { get; init; }

    [Required]
    [MaxLength(120)]
    public string EmergencyContactName { get; init; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(32)]
    public string EmergencyContactPhone { get; init; } = string.Empty;
}
