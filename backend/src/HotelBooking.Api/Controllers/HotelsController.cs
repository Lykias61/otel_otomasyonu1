using HotelBooking.Application.Hotels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelsController : ControllerBase
{
    private readonly IHotelService _hotelService;

    public HotelsController(IHotelService hotelService)
    {
        _hotelService = hotelService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HotelDto>>> GetAll(CancellationToken cancellationToken)
    {
        var hotels = await _hotelService.GetAllAsync(cancellationToken);
        return Ok(hotels);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<HotelDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var hotel = await _hotelService.GetByIdAsync(id, cancellationToken);
        return hotel is null ? NotFound() : Ok(hotel);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PropertyManager")]
    public async Task<ActionResult<HotelDto>> Create(CreateHotelRequest request, CancellationToken cancellationToken)
    {
        var hotel = await _hotelService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, hotel);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,PropertyManager")]
    public async Task<IActionResult> Update(Guid id, UpdateHotelRequest request, CancellationToken cancellationToken)
    {
        var updated = await _hotelService.UpdateAsync(id, request, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,PropertyManager")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _hotelService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
