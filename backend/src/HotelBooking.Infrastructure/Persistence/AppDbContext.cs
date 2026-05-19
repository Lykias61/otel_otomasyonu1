using HotelBooking.Domain.Common;
using HotelBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<RoomType> RoomTypes => Set<RoomType>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<SeasonalPrice> SeasonalPrices => Set<SeasonalPrice>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewPhoto> ReviewPhotos => Set<ReviewPhoto>();
    public DbSet<GuestProfile> GuestProfiles => Set<GuestProfile>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(entity =>
        {
            entity.ToTable("Users");
            entity.HasIndex(x => x.Email).IsUnique();
            entity.HasIndex(x => x.Username).IsUnique();
            entity.HasIndex(x => x.Phone).IsUnique();
            entity.Property(x => x.Username).HasMaxLength(80);
            entity.Property(x => x.FirstName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.LastName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(32);
            entity.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(x => x.Role).HasConversion<string>().HasMaxLength(40).IsRequired();
        });

        builder.Entity<GuestProfile>(entity =>
        {
            entity.ToTable("GuestProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.Property(x => x.FirstName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.LastName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.TcKimlikNo).HasMaxLength(11).IsRequired();
            entity.Property(x => x.Gender).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(32).IsRequired();
            entity.Property(x => x.Country).HasMaxLength(80).IsRequired();
            entity.Property(x => x.City).HasMaxLength(80).IsRequired();
            entity.Property(x => x.Address).HasMaxLength(300).IsRequired();
            entity.Property(x => x.DocumentType).HasMaxLength(40).IsRequired();
            entity.Property(x => x.PassportNumber).HasMaxLength(40);
            entity.Property(x => x.Nationality).HasMaxLength(80).IsRequired();
            entity.Property(x => x.PreferredLanguage).HasMaxLength(40).IsRequired();
            entity.Property(x => x.InvoiceInfo).HasMaxLength(500).IsRequired();
            entity.Property(x => x.PaymentPreference).HasMaxLength(80).IsRequired();
            entity.Property(x => x.SpecialRequests).HasMaxLength(1000);
            entity.Property(x => x.BedTypePreference).HasMaxLength(80).IsRequired();
            entity.Property(x => x.PetInfo).HasMaxLength(300);
            entity.Property(x => x.EmergencyContactName).HasMaxLength(120).IsRequired();
            entity.Property(x => x.EmergencyContactPhone).HasMaxLength(32).IsRequired();

            entity.HasOne(x => x.User)
                .WithOne(x => x.GuestProfile)
                .HasForeignKey<GuestProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Hotel>(entity =>
        {
            entity.ToTable("Hotels");
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(2000);
            entity.Property(x => x.Country).HasMaxLength(80).IsRequired();
            entity.Property(x => x.City).HasMaxLength(80).IsRequired();
            entity.Property(x => x.District).HasMaxLength(80);
            entity.Property(x => x.Address).HasMaxLength(300).IsRequired();

            entity.HasOne(x => x.Manager)
                .WithMany(x => x.ManagedHotels)
                .HasForeignKey(x => x.ManagerId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<RoomType>(entity =>
        {
            entity.ToTable("RoomTypes");
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(1200);
            entity.Property(x => x.BasePrice).HasPrecision(18, 2);
            entity.Property(x => x.Currency).HasMaxLength(3).IsRequired();

            entity.HasOne(x => x.Hotel)
                .WithMany(x => x.RoomTypes)
                .HasForeignKey(x => x.HotelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Reservation>(entity =>
        {
            entity.ToTable("Reservations");
            entity.Property(x => x.TotalPrice).HasPrecision(18, 2);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(40).IsRequired();

            entity.HasOne(x => x.User)
                .WithMany(x => x.Reservations)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.RoomType)
                .WithMany(x => x.Reservations)
                .HasForeignKey(x => x.RoomTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<SeasonalPrice>(entity =>
        {
            entity.ToTable("SeasonalPrices");
            entity.Property(x => x.Price).HasPrecision(18, 2);

            entity.HasOne(x => x.RoomType)
                .WithMany(x => x.SeasonalPrices)
                .HasForeignKey(x => x.RoomTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Coupon>(entity =>
        {
            entity.ToTable("Coupons");
            entity.HasIndex(x => x.Code).IsUnique();
            entity.Property(x => x.Code).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.DiscountAmount).HasPrecision(18, 2);
            entity.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
        });

        builder.Entity<Review>(entity =>
        {
            entity.ToTable("Reviews");
            entity.Property(x => x.Comment).HasMaxLength(2000);

            entity.HasOne(x => x.Hotel)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.User)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ReviewPhoto>(entity =>
        {
            entity.ToTable("ReviewPhotos");
            entity.Property(x => x.Url).HasMaxLength(600).IsRequired();
            entity.Property(x => x.AltText).HasMaxLength(160);

            entity.HasOne(x => x.Review)
                .WithMany(x => x.Photos)
                .HasForeignKey(x => x.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
