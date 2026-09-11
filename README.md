# 🏨 Otel Otomasyon Sistemi

Çok rollü (misafir · otel sahibi · yönetici) bir **otel rezervasyon ve yönetim platformu**.
Backend tarafında **Clean Architecture** ile yapılandırılmış bir .NET 8 Web API, frontend tarafında ise
**React 19 + TypeScript + Vite** ile geliştirilmiş modern bir tek sayfa uygulaması (SPA) bulunur.

<p align="left">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/EF%20Core-8.0-512BD4" alt="EF Core" />
  <img src="https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

> 🇬🇧 English version: [README.en.md](README.en.md)

---

## 📑 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)
- [Mimari](#-mimari)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Demo Hesapları](#-demo-hesapları)
- [API Uç Noktaları](#-api-uç-noktaları)
- [Veri Modeli](#-veri-modeli)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Yol Haritası](#-yol-haritası)
- [Ekip](#-ekip)
- [Lisans](#-lisans)

---

## 📖 Proje Hakkında

Otel Otomasyon Sistemi; bir konaklama işletmesinin **rezervasyon, oda, fiyatlandırma, misafir ve personel**
süreçlerini tek bir platformda toplamayı hedefler. Sistem üç ayrı giriş portalı ve rol bazlı yetkilendirme
üzerine kuruludur:

| Portal | Rol | Ne yapar? |
|---|---|---|
| 🧳 **Misafir Girişi** | `Customer` | Tesis arama, rezervasyon oluşturma ve takibi, favoriler, değerlendirme, destek |
| 🏢 **Otel Sahibi Girişi** | `PropertyManager` | Oda ve fiyat yönetimi, doluluk/gelir takibi, kampanya ve kupon yönetimi |
| 🛡️ **Yönetici Girişi** | `SuperAdmin` | Tüm oteller, kullanıcılar, personel, güvenlik ve finans üzerinde merkezi kontrol |

Ayrıca yönetim arayüzü içinde **Resepsiyon, Personel, Muhasebe ve Teknik Servis** panelleri de yer alır.

---

## ✨ Öne Çıkan Özellikler

### 🔐 Kimlik Doğrulama & Yetkilendirme
- JWT (JSON Web Token) tabanlı oturum yönetimi — 8 saatlik token ömrü
- Rol bazlı erişim kontrolü (`SuperAdmin`, `PropertyManager`, `Customer`)
- Portal bazlı giriş doğrulaması: kullanıcı, rolüne ait olmayan portalden giriş yapamaz
- ASP.NET Core `PasswordHasher` ile güvenli parola saklama
- Misafir kaydı, şifre sıfırlama ve detaylı misafir profili tamamlama akışı
- İki faktörlü doğrulama (e-posta / telefon) arayüz akışı

### 🧳 Misafir Paneli
- Otel arama, filtreleme ve otel detay sayfaları
- Rezervasyon oluşturma; aktif, geçmiş ve iptal edilen rezervasyon takibi
- Favori oteller ve kaydedilen odalar
- Yorum & puanlama (fotoğraf ekleme desteğiyle)
- Bildirim merkezi, otel mesajlaşma, canlı destek ve destek talepleri
- Türkçe / İngilizce dil desteği

### 🏢 Otel Sahibi Paneli
- Oda tipi yönetimi (kapasite, stok, taban fiyat, para birimi)
- Sezonluk fiyatlandırma ve dinamik fiyat yönetimi
- Rezervasyon yönetimi ve doluluk/gelir grafikleri
- Kampanya ve kupon (yüzde veya tutar bazlı indirim) yönetimi
- Otel galerisi, tesis bilgileri ve çevredeki yerler düzenlemesi
- Misafir mesajları ve memnuniyet takibi

### 🛡️ Yönetici Paneli
- Tüm otellerin ve kullanıcıların merkezi yönetimi
- Personel ve yetki yönetimi, kayıt kilitleme
- İhlal/güvenlik kayıtları ve güvenlik merkezi
- Finans merkezi, gelir raporları ve sistem performans göstergeleri
- Bildirim ve güvenlik tercihleri

### 🖥️ Operasyon Panelleri
- **Resepsiyon:** giriş/çıkış akışı, misafir kartları, oda durumu, ödeme işlemleri
- **Personel:** görev listesi, vardiya bilgileri, iç bildirimler
- **Muhasebe:** gelir–gider, faturalar, ödeme takibi, finansal analiz
- **Teknik Servis:** arıza/bakım takibi ve sistem sağlığı

---

## 🛠️ Kullanılan Teknolojiler

### Backend
| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| [.NET](https://dotnet.microsoft.com/) | 8.0 | Çalışma zamanı ve SDK |
| ASP.NET Core Web API | 8.0 | REST API katmanı |
| [Entity Framework Core](https://learn.microsoft.com/ef/core/) | 8.0.22 | ORM, migration yönetimi |
| [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.npgsql.org/efcore/) | 8.0.11 | PostgreSQL sağlayıcısı |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.22 | JWT doğrulama |
| System.IdentityModel.Tokens.Jwt | 8.0.2 | Token üretimi |
| Microsoft.Extensions.Identity.Core | 8.0.22 | `PasswordHasher` ile parola özetleme |
| [Swashbuckle (Swagger)](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) | 6.6.2 | API dokümantasyonu ve test arayüzü |

### Frontend
| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| [React](https://react.dev/) | 19.2 | UI kütüphanesi |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Tip güvenliği |
| [Vite](https://vite.dev/) | 8.0 | Geliştirme sunucusu ve derleyici |
| [lucide-react](https://lucide.dev/) | 1.14 | İkon seti |
| ESLint + typescript-eslint | 10.x / 8.x | Kod kalitesi ve lint kuralları |
| Saf CSS | — | Özel tasarım sistemi (`App.css`) |

### Veritabanı & Araçlar
| Teknoloji | Kullanım Amacı |
|---|---|
| **PostgreSQL** | İlişkisel veritabanı (`hotel_booking_db`) |
| **EF Core Migrations** | Şema versiyonlama; uygulama açılışında otomatik uygulanır |
| **Database Seeder** | Demo kullanıcıların otomatik oluşturulması |
| **Git & GitHub** | Sürüm kontrolü ve iş birliği |

---

## 🏗️ Mimari

Backend, **Clean Architecture** (Katmanlı Mimari) prensiplerine göre dört projeye ayrılmıştır.
Bağımlılıklar her zaman içe doğru akar:

```
┌───────────────────────────────────────────────────────────┐
│  HotelBooking.Api          → Controller, JWT, CORS, Swagger│
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Infrastructure → EF Core, Repository, Auth,  │
│                                Migrations, Seeder          │
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Application  → Servis arayüzleri, DTO'lar    │
├───────────────────────────────────────────────────────────┤
│  HotelBooking.Domain       → Entity, Enum, BaseEntity      │
└───────────────────────────────────────────────────────────┘
                 ▲
                 │  REST / JSON + JWT
                 │
        ┌────────┴─────────┐
        │  React SPA (Vite)│
        └──────────────────┘
```

- **Domain:** Hiçbir dış bağımlılığı olmayan iş nesneleri (`Hotel`, `Reservation`, `AppUser` …)
- **Application:** Servis sözleşmeleri (`IAuthService`, `IHotelService`) ve DTO'lar
- **Infrastructure:** EF Core `AppDbContext`, repository'ler, JWT üretimi, veritabanı tohumlama
- **Api:** HTTP uç noktaları, kimlik doğrulama/yetkilendirme boru hattı, CORS ve Swagger yapılandırması

---

## 📂 Proje Yapısı

```
otel_otomasyonu1/
├── backend/
│   ├── HotelBooking.sln
│   └── src/
│       ├── HotelBooking.Api/                 # Web API giriş noktası
│       │   ├── Controllers/                  # Auth, Hotels, Health
│       │   ├── Program.cs                    # DI, JWT, CORS, Swagger, migrate + seed
│       │   └── appsettings.json
│       ├── HotelBooking.Application/         # Servis arayüzleri ve DTO'lar
│       │   ├── Auth/
│       │   ├── Hotels/
│       │   └── Common/Interfaces/
│       ├── HotelBooking.Domain/              # Entity ve enum'lar
│       │   ├── Entities/
│       │   ├── Enums/
│       │   └── Common/BaseEntity.cs
│       └── HotelBooking.Infrastructure/      # EF Core, repository, auth
│           ├── Auth/AuthService.cs
│           ├── Persistence/AppDbContext.cs
│           ├── Persistence/Migrations/
│           ├── Repositories/
│           └── Seed/DatabaseSeeder.cs
└── frontend/
    ├── src/
    │   ├── App.tsx                           # Uygulama kabuğu ve tüm paneller
    │   ├── App.css                           # Tasarım sistemi
    │   ├── main.tsx
    │   └── assets/
    ├── public/
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

## 🚀 Kurulum

### Gereksinimler

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) ve npm
- [PostgreSQL 14+](https://www.postgresql.org/download/)

### 1) Depoyu klonlayın

```bash
git clone https://github.com/Lykias61/otel_otomasyonu1.git
cd otel_otomasyonu1
```

### 2) Veritabanını hazırlayın

PostgreSQL üzerinde boş bir veritabanı oluşturun:

```bash
createdb hotel_booking_db
```

Ardından `backend/src/HotelBooking.Api/appsettings.Development.json` dosyasındaki bağlantı dizesini
kendi kullanıcı adınıza göre güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=hotel_booking_db;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

> ℹ️ Migration'lar ve demo kullanıcılar **uygulama ilk açıldığında otomatik olarak** uygulanır
> (`Program.cs` → `MigrateAsync()` + `DatabaseSeeder.SeedAsync()`). Elle migration çalıştırmanız gerekmez.

### 3) Backend'i çalıştırın

```bash
cd backend
dotnet restore
dotnet run --project src/HotelBooking.Api
```

| Adres | Açıklama |
|---|---|
| `http://localhost:5071` | API kök adresi |
| `http://localhost:5071/swagger` | Swagger arayüzü (yalnızca Development) |
| `http://localhost:5071/api/health` | Servis sağlık kontrolü |
| `http://localhost:5071/api/health/database` | Veritabanı bağlantı kontrolü |

### 4) Frontend'i çalıştırın

Yeni bir terminalde:

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır. (Backend'deki CORS politikası bu adrese göre tanımlıdır.)

### Kullanılabilir npm komutları

```bash
npm run dev        # Geliştirme sunucusu
npm run build      # TypeScript derlemesi + production build
npm run preview    # Production build önizlemesi
npm run lint       # ESLint kontrolü
```

---

## 👤 Demo Hesapları

Uygulama ilk çalıştığında aşağıdaki hesaplar otomatik oluşturulur. **İlgili portalden** giriş yapmanız gerekir.

| Portal | E-posta | Şifre | Rol |
|---|---|---|---|
| 🧳 Misafir | `misafir@otel.local` | `Guest123!` | `Customer` |
| 🏢 Otel Sahibi | `sahip@otel.local` | `Owner123!` | `PropertyManager` |
| 🛡️ Yönetici | `yonetici@otel.local` | `Admin123!` | `SuperAdmin` |

Alternatif hesaplar: `guest@hotelbooking.local`, `owner@hotelbooking.local`, `admin@hotelbooking.local` (aynı şifrelerle).

> ⚠️ Bu hesaplar yalnızca geliştirme/demo amaçlıdır; üretim ortamında kaldırılmalıdır.

---

## 🔌 API Uç Noktaları

Tüm uç noktalar `http://localhost:5071` altındadır. Korumalı uç noktalar için
`Authorization: Bearer <token>` başlığı gereklidir.

### Auth — `/api/auth`

| Metot | Yol | Yetki | Açıklama |
|---|---|---|---|
| `POST` | `/api/auth/login` | Herkes | E-posta + şifre + portal rolü ile giriş, JWT döner |
| `POST` | `/api/auth/register/guest` | Herkes | Yeni misafir kaydı (kullanıcı adı, e-posta, telefon doğrulamalı) |
| `POST` | `/api/auth/reset-password` | Herkes | Şifre sıfırlama |
| `POST` | `/api/auth/guest/profile` | `Customer` | Detaylı misafir profilini tamamlar |
| `GET` | `/api/auth/guest/profile` | `Customer` | Misafir profilini getirir |

### Oteller — `/api/hotels`

| Metot | Yol | Yetki | Açıklama |
|---|---|---|---|
| `GET` | `/api/hotels` | Herkes | Tüm otelleri listeler |
| `GET` | `/api/hotels/{id}` | Herkes | Tek bir oteli getirir |
| `POST` | `/api/hotels` | `SuperAdmin`, `PropertyManager` | Yeni otel oluşturur |
| `PUT` | `/api/hotels/{id}` | `SuperAdmin`, `PropertyManager` | Otel bilgilerini günceller |
| `DELETE` | `/api/hotels/{id}` | `SuperAdmin`, `PropertyManager` | Oteli siler |

### Sağlık — `/api/health`

| Metot | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/health` | Servis durumu |
| `GET` | `/api/health/database` | Veritabanı bağlantı durumu (`503` = bağlantı yok) |

**Örnek giriş isteği:**

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

## 🗃️ Veri Modeli

Tüm varlıklar `BaseEntity` sınıfından türer (`Id: Guid`, `CreatedAtUtc`, `UpdatedAtUtc`).

| Varlık | Açıklama |
|---|---|
| `AppUser` | Kullanıcı hesabı; rol, parola özeti, aktiflik ve son giriş bilgisi |
| `GuestProfile` | Misafirin kimlik, iletişim, tercih ve acil durum bilgileri |
| `Hotel` | Otel; konum, yıldız sayısı ve sorumlu yönetici (`Manager`) |
| `RoomType` | Oda tipi; kapasite, stok, taban fiyat ve para birimi |
| `SeasonalPrice` | Oda tipine bağlı tarih aralıklı sezon fiyatı |
| `Reservation` | Rezervasyon; giriş/çıkış tarihi, misafir sayısı, tutar, durum |
| `Review` | Otel değerlendirmesi; puan, yorum, onay durumu |
| `ReviewPhoto` | Değerlendirmeye eklenen fotoğraflar |
| `Coupon` | İndirim kuponu; tutar veya yüzde bazlı, geçerlilik aralığı |

**Enum'lar**

- `UserRole`: `SuperAdmin` · `PropertyManager` · `Customer`
- `ReservationStatus`: `Pending` · `Confirmed` · `Cancelled` · `Completed`

**Migration geçmişi**

1. `InitialCreate` — temel şema
2. `AddGuestRegistration` — misafir profili ve kayıt alanları
3. `AddUserPhoneForSecureGuestRegistration` — güvenli kayıt için telefon alanı

---

## ⚙️ Ortam Değişkenleri

### Frontend

`frontend/.env` dosyası oluşturarak API adresini değiştirebilirsiniz:

```env
VITE_API_BASE_URL=http://localhost:5071
```

Tanımlanmazsa varsayılan olarak `http://localhost:5071` kullanılır.

### Backend

`appsettings.json` içindeki başlıca ayarlar:

| Anahtar | Açıklama |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL bağlantı dizesi |
| `Jwt:Key` | Token imzalama anahtarı (en az 32 karakter) |
| `Jwt:Issuer` | Token yayıncısı — `HotelBooking.Api` |
| `Jwt:Audience` | Token hedef kitlesi — `HotelBooking.Client` |

> 🔒 **Güvenlik notu:** Depodaki `Jwt:Key` yalnızca yerel geliştirme içindir. Üretimde
> [user-secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) veya ortam değişkeni kullanın:
> ```bash
> dotnet user-secrets set "Jwt:Key" "üretim-icin-uzun-ve-rastgele-bir-anahtar"
> ```

---

## 🖼️ Ekran Görüntüleri

> Ekran görüntülerini `docs/screenshots/` klasörüne ekleyip aşağıdaki bağlantıları güncelleyebilirsiniz.

| Giriş Portalları | Yönetici Paneli |
|---|---|
| _(ekran görüntüsü eklenecek)_ | _(ekran görüntüsü eklenecek)_ |

| Otel Sahibi Paneli | Misafir Paneli |
|---|---|
| _(ekran görüntüsü eklenecek)_ | _(ekran görüntüsü eklenecek)_ |

---

## 🗺️ Yol Haritası

- [ ] Rezervasyon uç noktalarının API tarafına taşınması (şu an arayüzde yerel olarak tutuluyor)
- [ ] Oda tipi, sezon fiyatı ve kupon işlemleri için REST uç noktaları
- [ ] Ödeme sağlayıcısı entegrasyonu
- [ ] E-posta ile doğrulama ve gerçek iki faktörlü kimlik doğrulama
- [ ] `App.tsx` dosyasının bileşen bazlı modüllere ayrılması
- [ ] Birim ve entegrasyon testleri (xUnit + Vitest)
- [ ] Docker Compose ile tek komutla kurulum
- [ ] CI/CD boru hattı (GitHub Actions)

---

## 👥 Ekip

Bu proje iki kişilik bir ekip tarafından geliştirilmiştir.

| Geliştirici | GitHub | Katkı Alanı |
|---|---|---|
| _(isim eklenecek)_ | [@Lykias61](https://github.com/Lykias61) | _(ör. Backend & veritabanı)_ |
| _(isim eklenecek)_ | _(github kullanıcı adı)_ | _(ör. Frontend & arayüz tasarımı)_ |

### Katkıda Bulunma

1. Depoyu fork'layın
2. Yeni bir dal oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Yeni özellik eklendi'`)
4. Dalınızı push'layın (`git push origin feature/yeni-ozellik`)
5. Bir Pull Request açın

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.

---

<p align="center">
  <sub>⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!</sub>
</p>
