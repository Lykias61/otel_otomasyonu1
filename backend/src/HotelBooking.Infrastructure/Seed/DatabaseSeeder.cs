using HotelBooking.Domain.Entities;
using HotelBooking.Domain.Enums;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, IPasswordHasher<AppUser> passwordHasher)
    {
        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "yonetici",
            "yonetici@otel.local",
            "Sistem",
            "Yöneticisi",
            UserRole.SuperAdmin,
            "Admin123!");

        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "otel-sahibi",
            "sahip@otel.local",
            "Otel",
            "Sahibi",
            UserRole.PropertyManager,
            "Owner123!");

        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "admin",
            "admin@hotelbooking.local",
            "Admin",
            "User",
            UserRole.SuperAdmin,
            "Admin123!");

        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "owner",
            "owner@hotelbooking.local",
            "Otel",
            "Sahibi",
            UserRole.PropertyManager,
            "Owner123!");

        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "misafir",
            "misafir@otel.local",
            "Misafir",
            "Kullanıcı",
            UserRole.Customer,
            "Guest123!");

        await SeedUserAsync(
            dbContext,
            passwordHasher,
            "guest",
            "guest@hotelbooking.local",
            "Misafir",
            "Kullanıcı",
            UserRole.Customer,
            "Guest123!");
    }

    private static async Task SeedUserAsync(
        AppDbContext dbContext,
        IPasswordHasher<AppUser> passwordHasher,
        string username,
        string email,
        string firstName,
        string lastName,
        UserRole role,
        string password)
    {
        var existingUser = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == email);

        if (existingUser is not null)
        {
            if (string.IsNullOrWhiteSpace(existingUser.Username))
            {
                existingUser.Username = username;
                await dbContext.SaveChangesAsync();
            }

            return;
        }

        var user = new AppUser
        {
            Username = username,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Role = role,
            IsActive = true
        };

        user.PasswordHash = passwordHasher.HashPassword(user, password);

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }
}
