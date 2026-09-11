# 🏨 Hotel Automation System

A multi-role (**guest · property owner · administrator**) **hotel booking and management platform**.
The backend is a .NET 8 Web API structured with **Clean Architecture**; the frontend is a modern
single-page application built with **React 19 + TypeScript + Vite**.

<p align="left">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/EF%20Core-8.0-512BD4" alt="EF Core" />
  <img src="https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

> 🇹🇷 Türkçe sürüm: [README.md](README.md)

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [API Endpoints](#-api-endpoints)
- [Data Model](#-data-model)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [License](#-license)

---

## 📖 About

The Hotel Automation System brings **reservations, rooms, pricing, guests and staff** together in a single
platform. It is built around three separate login portals with role-based authorization:

| Portal | Role | Capabilities |
|---|---|---|
| 🧳 **Guest** | `Customer` | Search properties, create and track reservations, favourites, reviews, support |
| 🏢 **Property Owner** | `PropertyManager` | Room and price management, occupancy/revenue tracking, campaigns and coupons |
| 🛡️ **Administrator** | `SuperAdmin` | Central control over all hotels, users, staff, security and finance |

The management interface also includes **Reception, Staff, Accounting and Technical Service** dashboards.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based session management with an 8-hour token lifetime
- Role-based access control (`SuperAdmin`, `PropertyManager`, `Customer`)
- Portal-aware login: a user cannot sign in through a portal that does not match their role
- Secure password storage via ASP.NET Core `PasswordHasher`
- Guest registration, password reset and a detailed guest-profile completion flow
- Two-factor verification flow (e-mail / phone)

### 🧳 Guest Dashboard
- Hotel search, filtering and detail pages
- Booking creation plus active, past and cancelled reservation tracking
- Favourite hotels and saved rooms
- Reviews and ratings with photo attachments
- Notification centre, hotel messaging, live support and support tickets
- Turkish / English language support

### 🏢 Property Owner Dashboard
- Room type management (capacity, inventory, base price, currency)
- Seasonal and dynamic pricing
- Reservation management with occupancy and revenue charts
- Campaign and coupon management (percentage or fixed-amount discounts)
- Hotel gallery, facility information and nearby places
- Guest messages and satisfaction tracking

### 🛡️ Administrator Dashboard
- Central management of all hotels and users
- Staff and permission management, record locking
- Violation/security logs and a security centre
- Finance centre, revenue reports and system performance indicators
- Notification and security preferences

### 🖥️ Operations Dashboards
- **Reception:** check-in/check-out flow, guest cards, room status, payments
- **Staff:** task lists, shift information, internal notifications
- **Accounting:** income & expenses, invoices, payment tracking, financial analysis
- **Technical Service:** fault/maintenance tracking and system health

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [.NET](https://dotnet.microsoft.com/) | 8.0 | Runtime and SDK |
| ASP.NET Core Web API | 8.0 | REST API layer |
| [Entity Framework Core](https://learn.microsoft.com/ef/core/) | 8.0.22 | ORM and migrations |
| [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.npgsql.org/efcore/) | 8.0.11 | PostgreSQL provider |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.22 | JWT validation |
| System.IdentityModel.Tokens.Jwt | 8.0.2 | Token generation |
| Microsoft.Extensions.Identity.Core | 8.0.22 | Password hashing |
| [Swashbuckle (Swagger)](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) | 6.6.2 | API documentation and testing UI |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.2 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Type safety |
| [Vite](https://vite.dev/) | 8.0 | Dev server and bundler |
| [lucide-react](https://lucide.dev/) | 1.14 | Icon set |
| ESLint + typescript-eslint | 10.x / 8.x | Linting and code quality |
| Plain CSS | — | Custom design system (`App.css`) |

### Database & Tooling
| Technology | Purpose |
|---|---|
| **PostgreSQL** | Relational database (`hotel_booking_db`) |
| **EF Core Migrations** | Schema versioning, applied automatically on startup |
| **Database Seeder** | Creates demo users automatically |
| **Git & GitHub** | Version control and collaboration |

---

## 🏗️ Architecture

The backend follows **Clean Architecture** across four projects, with dependencies always pointing inwards:

```
┌───────────────────────────────────────────────────────────┐
│  HotelBooking.Api          → Controllers, JWT, CORS, Swagger│
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Infrastructure → EF Core, repositories, auth, │
│                                migrations, seeder           │
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Application  → Service contracts, DTOs        │
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Domain       → Entities, enums, BaseEntity    │
└───────────────────────────────────────────────────────────┘
                 ▲
                 │  REST / JSON + JWT
                 │
        ┌────────┴─────────┐
        │  React SPA (Vite)│
        └──────────────────┘
```

- **Domain:** dependency-free business objects (`Hotel`, `Reservation`, `AppUser` …)
- **Application:** service contracts (`IAuthService`, `IHotelService`) and DTOs
- **Infrastructure:** EF Core `AppDbContext`, repositories, JWT issuing, database seeding
- **Api:** HTTP endpoints, authentication/authorization pipeline, CORS and Swagger configuration

---

## 📂 Project Structure

```
otel_otomasyonu1/
├── backend/
│   ├── HotelBooking.sln
│   └── src/
│       ├── HotelBooking.Api/                 # Web API entry point
│       │   ├── Controllers/                  # Auth, Hotels, Health
│       │   ├── Program.cs                    # DI, JWT, CORS, Swagger, migrate + seed
│       │   └── appsettings.json
│       ├── HotelBooking.Application/         # Service contracts and DTOs
│       ├── HotelBooking.Domain/              # Entities and enums
│       └── HotelBooking.Infrastructure/      # EF Core, repositories, auth
└── frontend/
    ├── src/
    │   ├── App.tsx                           # App shell and all dashboards
    │   ├── App.css                           # Design system
    │   └── main.tsx
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and npm
- [PostgreSQL 14+](https://www.postgresql.org/download/)

### 1) Clone the repository

```bash
git clone https://github.com/Lykias61/otel_otomasyonu1.git
cd otel_otomasyonu1
```

### 2) Prepare the database

```bash
createdb hotel_booking_db
```

Then update the connection string in `backend/src/HotelBooking.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=hotel_booking_db;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

> ℹ️ Migrations and demo users are applied **automatically on first run**
> (`Program.cs` → `MigrateAsync()` + `DatabaseSeeder.SeedAsync()`). No manual migration step is required.

### 3) Run the backend

```bash
cd backend
dotnet restore
dotnet run --project src/HotelBooking.Api
```

| URL | Description |
|---|---|
| `http://localhost:5071` | API root |
| `http://localhost:5071/swagger` | Swagger UI (Development only) |
| `http://localhost:5071/api/health` | Service health check |
| `http://localhost:5071/api/health/database` | Database connectivity check |

### 4) Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173` (the backend CORS policy is configured for this origin).

### Available npm scripts

```bash
npm run dev        # Development server
npm run build      # TypeScript build + production bundle
npm run preview    # Preview the production build
npm run lint       # Run ESLint
```

---

## 👤 Demo Accounts

These accounts are created automatically on first run. Sign in through the **matching portal**.

| Portal | E-mail | Password | Role |
|---|---|---|---|
| 🧳 Guest | `misafir@otel.local` | `Guest123!` | `Customer` |
| 🏢 Property Owner | `sahip@otel.local` | `Owner123!` | `PropertyManager` |
| 🛡️ Administrator | `yonetici@otel.local` | `Admin123!` | `SuperAdmin` |

Alternative accounts: `guest@hotelbooking.local`, `owner@hotelbooking.local`, `admin@hotelbooking.local` (same passwords).

> ⚠️ These accounts are for development/demo purposes only and should be removed in production.

---

## 🔌 API Endpoints

All endpoints live under `http://localhost:5071`. Protected endpoints require an
`Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Sign in with e-mail, password and portal role; returns a JWT |
| `POST` | `/api/auth/register/guest` | Public | Register a new guest (username, e-mail, phone validation) |
| `POST` | `/api/auth/reset-password` | Public | Reset password |
| `POST` | `/api/auth/guest/profile` | `Customer` | Complete the detailed guest profile |
| `GET` | `/api/auth/guest/profile` | `Customer` | Fetch the guest profile |

### Hotels — `/api/hotels`

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | Public | List all hotels |
| `GET` | `/api/hotels/{id}` | Public | Get a single hotel |
| `POST` | `/api/hotels` | `SuperAdmin`, `PropertyManager` | Create a hotel |
| `PUT` | `/api/hotels/{id}` | `SuperAdmin`, `PropertyManager` | Update a hotel |
| `DELETE` | `/api/hotels/{id}` | `SuperAdmin`, `PropertyManager` | Delete a hotel |

### Health — `/api/health`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Service status |
| `GET` | `/api/health/database` | Database connectivity (`503` when unreachable) |

**Example login request:**

```bash
curl -X POST http://localhost:5071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
        "email": "yonetici@otel.local",
        "password": "Admin123!",
        "portalRole": "SuperAdmin"
      }'
```

---

## 🗃️ Data Model

Every entity derives from `BaseEntity` (`Id: Guid`, `CreatedAtUtc`, `UpdatedAtUtc`).

| Entity | Description |
|---|---|
| `AppUser` | User account: role, password hash, active state, last login |
| `GuestProfile` | Guest identity, contact, preference and emergency details |
| `Hotel` | Hotel: location, star rating, assigned manager |
| `RoomType` | Room type: capacity, inventory, base price, currency |
| `SeasonalPrice` | Date-ranged seasonal price for a room type |
| `Reservation` | Booking: check-in/out dates, guest count, total price, status |
| `Review` | Hotel review: rating, comment, approval state |
| `ReviewPhoto` | Photos attached to a review |
| `Coupon` | Discount coupon: fixed or percentage based, with a validity window |

**Enums**

- `UserRole`: `SuperAdmin` · `PropertyManager` · `Customer`
- `ReservationStatus`: `Pending` · `Confirmed` · `Cancelled` · `Completed`

**Migration history**

1. `InitialCreate` — base schema
2. `AddGuestRegistration` — guest profile and registration fields
3. `AddUserPhoneForSecureGuestRegistration` — phone field for secure registration

---

## ⚙️ Environment Variables

### Frontend

Create `frontend/.env` to point the app at a different API:

```env
VITE_API_BASE_URL=http://localhost:5071
```

Defaults to `http://localhost:5071` when unset.

### Backend

Key settings in `appsettings.json`:

| Key | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `Jwt:Key` | Token signing key (at least 32 characters) |
| `Jwt:Issuer` | Token issuer — `HotelBooking.Api` |
| `Jwt:Audience` | Token audience — `HotelBooking.Client` |

> 🔒 **Security note:** the `Jwt:Key` in the repository is for local development only. In production use
> [user-secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) or environment variables:
> ```bash
> dotnet user-secrets set "Jwt:Key" "a-long-random-production-key"
> ```

---

## 🖼️ Screenshots

> Add your screenshots under `docs/screenshots/` and update the links below.

| Login Portals | Administrator Dashboard |
|---|---|
| _(screenshot pending)_ | _(screenshot pending)_ |

| Property Owner Dashboard | Guest Dashboard |
|---|---|
| _(screenshot pending)_ | _(screenshot pending)_ |

---

## 🗺️ Roadmap

- [ ] Move reservation flows to API endpoints (currently held client-side)
- [ ] REST endpoints for room types, seasonal prices and coupons
- [ ] Payment provider integration
- [ ] E-mail verification and real two-factor authentication
- [ ] Split `App.tsx` into component-level modules
- [ ] Unit and integration tests (xUnit + Vitest)
- [ ] One-command setup with Docker Compose
- [ ] CI/CD pipeline (GitHub Actions)

---

## 👥 Team

This project was built by a two-person team.

| Developer | GitHub | Focus |
|---|---|---|
| _(name pending)_ | [@Lykias61](https://github.com/Lykias61) | _(e.g. backend & database)_ |
| _(name pending)_ | _(github username)_ | _(e.g. frontend & UI design)_ |

### Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

Released under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>⭐ If you find this project useful, consider giving it a star!</sub>
</p>
