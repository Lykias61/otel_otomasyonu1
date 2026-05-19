namespace HotelBooking.Application.Hotels;

public interface IHotelService
{
    Task<IReadOnlyList<HotelDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<HotelDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<HotelDto> CreateAsync(CreateHotelRequest request, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Guid id, UpdateHotelRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
