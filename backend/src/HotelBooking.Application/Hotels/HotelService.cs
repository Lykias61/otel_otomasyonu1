using HotelBooking.Application.Common.Interfaces;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Hotels;

public sealed class HotelService : IHotelService
{
    private readonly IHotelRepository _hotelRepository;

    public HotelService(IHotelRepository hotelRepository)
    {
        _hotelRepository = hotelRepository;
    }

    public async Task<IReadOnlyList<HotelDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var hotels = await _hotelRepository.GetAllAsync(cancellationToken);
        return hotels.Select(MapToDto).ToList();
    }

    public async Task<HotelDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken);
        return hotel is null ? null : MapToDto(hotel);
    }

    public async Task<HotelDto> CreateAsync(CreateHotelRequest request, CancellationToken cancellationToken)
    {
        var hotel = new Hotel
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Country = request.Country.Trim(),
            City = request.City.Trim(),
            District = request.District.Trim(),
            Address = request.Address.Trim(),
            StarRating = request.StarRating,
            IsActive = true
        };

        await _hotelRepository.AddAsync(hotel, cancellationToken);
        await _hotelRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(hotel);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateHotelRequest request, CancellationToken cancellationToken)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken);
        if (hotel is null)
        {
            return false;
        }

        hotel.Name = request.Name.Trim();
        hotel.Description = request.Description.Trim();
        hotel.Country = request.Country.Trim();
        hotel.City = request.City.Trim();
        hotel.District = request.District.Trim();
        hotel.Address = request.Address.Trim();
        hotel.StarRating = request.StarRating;

        await _hotelRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id, cancellationToken);
        if (hotel is null)
        {
            return false;
        }

        hotel.IsActive = false;
        await _hotelRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static HotelDto MapToDto(Hotel hotel)
    {
        return new HotelDto(
            hotel.Id,
            hotel.Name,
            hotel.Description,
            hotel.Country,
            hotel.City,
            hotel.District,
            hotel.Address,
            hotel.StarRating,
            hotel.IsActive);
    }
}
