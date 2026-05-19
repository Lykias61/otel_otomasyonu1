using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Common.Interfaces;

public interface IHotelRepository
{
    Task<IReadOnlyList<Hotel>> GetAllAsync(CancellationToken cancellationToken);
    Task<Hotel?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Hotel hotel, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
