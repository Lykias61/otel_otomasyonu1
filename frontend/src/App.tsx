import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'
import {
  Activity,
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  CalendarCheck,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleAlert,
  ClipboardList,
  CreditCard,
  Database,
  DoorOpen,
  Eye,
  EyeOff,
  FileText,
  Hotel,
  Heart,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareText,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Utensils,
  UserCog,
  User,
  Users,
  WalletCards,
  Headphones,
} from 'lucide-react'
import './App.css'

type UserRole = 'Customer' | 'PropertyManager' | 'SuperAdmin'
type ManagementRole = Exclude<UserRole, 'Customer'>

type HotelRecord = {
  id: string
  name: string
  description: string
  country: string
  city: string
  district: string
  address: string
  starRating: number
  isActive: boolean
}

type DatabaseHealth = {
  status: string
  database: string
}

type AuthUser = {
  id: string
  username?: string | null
  firstName: string
  lastName: string
  email: string
  role: UserRole
}

type AuthSession = {
  token: string
  expiresAtUtc: string
  user: AuthUser
}

type LoginForm = {
  email: string
  password: string
  remember: boolean
  tcKimlikNo?: string
}

type AuthMode = 'login' | 'register' | 'profile'

type GuestRegisterForm = {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  kvkkAccepted: boolean
  userAgreementAccepted: boolean
}

type GuestProfileForm = {
  firstName: string
  lastName: string
  tcKimlikNo: string
  birthDate: string
  gender: string
  phone: string
  country: string
  city: string
  address: string
  documentType: string
  passportNumber: string
  nationality: string
  preferredLanguage: string
  invoiceInfo: string
  paymentPreference: string
  specialRequests: string
  accessibilityNeeds: boolean
  nonSmokingRoomPreference: boolean
  bedTypePreference: string
  breakfastPreference: boolean
  petInfo: string
  emergencyContactName: string
  emergencyContactPhone: string
}

type GuestProfileResponse = GuestProfileForm & {
  userId: string
}

type PortalConfig = {
  role: UserRole
  title: string
  eyebrow: string
  subtitle: string
  email: string
  password: string
  imageClass: string
}

type Metric = {
  label: string
  value: string
  detail: string
  accent: 'gold' | 'cyan' | 'white'
}

type SidebarSection = {
  id: string
  title: string
  items: string[]
}

type DashboardPanelId =
  | 'admin'
  | 'owner'
  | 'reception'
  | 'staff'
  | 'accounting'
  | 'technical'

type ProgressItem = {
  label: string
  value: number
  detail: string
}

type DashboardPanelConfig = {
  id: DashboardPanelId
  label: string
  sidebarTitle: string
  accessNote: string
  heroTitle: string
  heroSubtitle: string
  heroMetricLabel: string
  heroMetricValue: string
  statusLabel: string
  statusValue: string
  sections: SidebarSection[]
  metrics: Metric[]
  chartTitle: string
  chartSubtitle: string
  chartValues: number[]
  heatmapTitle: string
  heatmapSubtitle: string
  heatmapValues: number[]
  listTitle: string
  listSubtitle: string
  listRows: string[][]
  feedTitle: string
  feedSubtitle: string
  feedItems: string[]
  tableTitle: string
  tableSubtitle: string
  tableHeaders: string[]
  tableRows: string[][]
  progressTitle: string
  progressSubtitle: string
  progressItems: ProgressItem[]
}

type RoomOption = {
  id: string
  name: string
  type: string
  capacity: number
  size: string
  price: number
  oldPrice?: number
  campaignPrice?: number
  discountRate?: number
  minimumNights?: number
  seasonEnd?: string
  seasonMultiplier?: number
  seasonPrice?: number
  seasonStart?: string
  specialDayPrice?: number
  weekendMultiplier?: number
  available: number
  bedType: string
  balcony: string
  bathroom: string
  wifi: string
  breakfastIncluded: boolean
  refundPolicy: string
  seasonNote: string
  features: string[]
  imageClass: string
  includedServices?: string[]
  paidExtras?: PaidExtraOption[]
  unavailableServices?: string[]
  uploadedImages?: string[]
}

type PaidExtraType = 'perStay' | 'perNight' | 'perRoom' | 'perGuest'

type PaidExtraOption = {
  extraId: string
  extraName: string
  extraPrice: number
  extraType: PaidExtraType
  description: string
  isActive: boolean
}

type HotelNearbyPlace = {
  id: string
  name: string
  distance: string
  note: string
  type?: string
  x: string
  y: string
}

type HotelContactInfo = {
  phone: string
  email: string
  responseTime: string
  address: string
}

type HotelCustomization = {
  contact?: HotelContactInfo
  description?: string
  galleryImages?: string[]
  includedServices?: string[]
  nearbyPlaces?: HotelNearbyPlace[]
  paidExtras?: PaidExtraOption[]
  policies?: string[]
  services?: string[]
  unavailableServices?: string[]
  rooms?: RoomOption[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    website?: string
    x?: string
  }
}

type GuestReview = {
  comment: string
  createdAt: string
  hotelId: string
  id: string
  ownerReply?: string
  ownerReplyAt?: string
  rating: number
  updatedAt: string
  userId: string
  userName: string
}

type OwnerCoupon = {
  id: string
  couponId?: string
  hotelId: string
  ownerId?: string
  code: string
  discountType: 'Yüzde' | 'Tutar' | 'percentage' | 'fixed'
  discountValue?: number
  value: number
  minSpend?: number
  minimumSpend: number
  startDate: string
  endDate: string
  usageLimit: number
  usedCount?: number
  isActive: boolean
}

type OwnerCampaign = {
  id: string
  hotelId: string
  title: string
  condition: string
  campaignPrice?: number
  currentPrice?: number
  discountRate?: number
  endDate?: string
  roomId?: string
  isActive: boolean
  startDate?: string
  targetPrice?: number
  createdAt: string
}

type OwnerPageType = 'room' | 'price' | 'reservation' | 'gallery' | 'settings' | 'addHotel'

type ReservationStatus = 'Aktif' | 'Geçmiş' | 'İptal Edildi'

type GuestReservation = {
  id: string
  reservationId?: string
  hotelId?: string
  ownerId?: string
  roomId?: string
  guestId?: string
  hotelName: string
  roomName: string
  roomType?: string
  checkIn: string
  checkInDate?: string
  checkOut: string
  checkOutDate?: string
  code: string
  total: number
  totalPrice?: number
  appliedCouponCode?: string
  appliedCouponId?: string
  couponDiscountAmount?: number
  subtotalBeforeDiscount?: number
  totalPriceAfterDiscount?: number
  basePrice?: number
  baseRoomPrice?: number
  includedServices?: string[]
  nightCount?: number
  paidExtraTotal?: number
  selectedPaidExtras?: PaidExtraOption[]
  status: ReservationStatus
  reservationStatus?: ReservationStatus
  paymentStatus: string
  hotelImageClass: string
  roomImageClass: string
  guestCount?: number
  roomCount?: number
  guestName?: string
  notes?: string
  createdAt?: string
  cancelledAt?: string
  cancelledBy?: 'Misafir' | 'Otel Sahibi'
  cancellationReason?: string
}

type ConversationMessage = {
  createdAt?: string
  id?: string
  messageText?: string
  readStatus?: 'Gönderildi' | 'İletildi' | 'Okundu'
  receiverId?: string
  sender: 'Misafir' | 'Otel' | 'Otel Sahibi' | 'Yönetici' | 'Destek Botu' | 'Destek Temsilcisi'
  senderId?: string
  text: string
  time: string
  read: boolean
  status?: 'Gönderildi' | 'İletildi' | 'Okundu'
  imageLabel?: string
}

type GuestConversation = {
  id: string
  conversationId?: string
  guestId?: string
  guestName?: string
  hotelId?: string
  hotelName: string
  ownerId?: string
  receiverId?: string
  userId?: string
  category: string
  status: string
  reservationCode: string
  unreadCount: number
  updatedAt?: string
  messages: ConversationMessage[]
}

type GuestNotification = {
  id: string
  category: string
  title: string
  detail: string
  time: string
  unread: boolean
  target?: string
}

type SupportTicket = {
  id: string
  assignedAgent?: string
  category: string
  priority: string
  status: string
  subject: string
  lastUpdate: string
  unreadForAdmin?: boolean
  unreadForGuest?: boolean
  messages?: ConversationMessage[]
}

type LanguageCode = 'tr' | 'en'

type AdminHotelStatus = {
  hotelId: string
  status: 'Aktif' | 'Askıda' | 'Kaldırıldı' | 'Onay Bekliyor' | 'Reddedildi'
  reason?: string
  updatedAt: string
  updatedBy: string
}

type StoredAdminAccount = {
  username: string
  password: string
  email?: string
  tcKimlikNo?: string
  status: 'Aktif' | 'Pasif' | 'Silindi' | 'Kalıcı Kapatıldı' | 'Süreli Devre Dışı'
  reason?: string
  disabledUntil?: string
  createdAt: string
}

type StoredStaffAccount = {
  id: string
  firstName: string
  lastName: string
  tcKimlikNo: string
  phone: string
  role: string
  hotelId: string
  status: 'Aktif' | 'Pasif' | 'Silindi'
  reason?: string
  createdAt: string
}

type StoredOwnerAccount = {
  id: string
  username: string
  password: string
  tcKimlikNo: string
  fullName?: string
  phone?: string
  email?: string
  hotelId?: string
  hotelIds?: string[]
  status: 'Aktif' | 'Pasif' | 'İptal' | 'Silindi'
  reason?: string
  lastLoginAt?: string
  createdAt: string
}

type AdminViolation = {
  id: string
  username: string
  actionType: string
  target: string
  note: string
  risk: string
  createdAt: string
}

type AdminRecordLock = {
  recordId: string
  lockedBy: string
  lockedAt: string
  expiresAt: number
}

type AdminProfileSettings = {
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
  photoLabel: string
  username: string
}

type AdminNotificationPreferences = {
  emailEnabled: boolean
  financeReports: boolean
  hotelApprovals: boolean
  inAppEnabled: boolean
  reservations: boolean
  security: boolean
  support: boolean
}

type GuestNotificationPreferences = {
  campaigns: boolean
  emailEnabled: boolean
  hotelMessages: boolean
  inAppEnabled: boolean
  reservations: boolean
  security: boolean
  support: boolean
}

type AdminSecuritySettings = {
  twoFactorEnabled: boolean
  sessionNote: string
}

type SupportAgentAccount = {
  createdAt: string
  displayName: string
  password: string
  status: 'Online' | 'Müsait' | 'Meşgul' | 'Offline'
  username: string
}

type TwoFactorMethod = 'email' | 'phone'

type TwoFactorSettings = {
  enabled: boolean
  method: TwoFactorMethod
}

type StoredGuestAccount = {
  username: string
  email: string
  phone: string
}

type PendingTwoFactor = {
  code: string
  error: string
  expiresAt: number
  method: TwoFactorMethod
  remember: boolean
  session: AuthSession
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:5071'

const SESSION_STORAGE_KEY = 'hotelAutomation.authSession'
const GUEST_ACCOUNTS_STORAGE_KEY = 'hotelAutomation.guestAccounts'
const FAVORITE_HOTELS_STORAGE_KEY = 'hotelAutomation.favoriteHotels'
const SAVED_ROOMS_STORAGE_KEY = 'hotelAutomation.savedRooms'
const HOTEL_MESSAGES_STORAGE_KEY = 'hotelAutomation.hotelMessages'
const SUPPORT_TICKETS_STORAGE_KEY = 'hotelAutomation.supportTickets'
const NOTIFICATIONS_STORAGE_KEY = 'hotelAutomation.notifications'
const TWO_FACTOR_STORAGE_KEY = 'hotelAutomation.twoFactorSettings'
const HOTEL_CUSTOMIZATIONS_STORAGE_KEY = 'hotelAutomation.hotelCustomizations'
const HOTEL_REVIEWS_STORAGE_KEY = 'hotelAutomation.hotelReviews'
const GUEST_RESERVATIONS_STORAGE_KEY = 'hotelAutomation.guestReservations'
const CUSTOM_HOTELS_STORAGE_KEY = 'hotelAutomation.customHotels'
const ADMIN_HOTEL_STATUS_STORAGE_KEY = 'hotelAutomation.adminHotelStatuses'
const ADMIN_ACCOUNTS_STORAGE_KEY = 'hotelAutomation.adminAccounts'
const ADMIN_STAFF_STORAGE_KEY = 'hotelAutomation.adminStaff'
const OWNER_ACCOUNTS_STORAGE_KEY = 'hotelAutomation.ownerAccounts'
const ADMIN_VIOLATIONS_STORAGE_KEY = 'hotelAutomation.adminViolations'
const ADMIN_LOCKS_STORAGE_KEY = 'hotelAutomation.adminLocks'
const ADMIN_PROFILE_STORAGE_KEY = 'hotelAutomation.adminProfile'
const ADMIN_NOTIFICATION_PREFS_STORAGE_KEY = 'hotelAutomation.adminNotificationPrefs'
const GUEST_NOTIFICATION_PREFS_STORAGE_KEY = 'hotelAutomation.guestNotificationPrefs'
const ADMIN_SECURITY_STORAGE_KEY = 'hotelAutomation.adminSecurity'
const OWNER_COUPONS_STORAGE_KEY = 'hotelAutomation.ownerCoupons'
const OWNER_CAMPAIGNS_STORAGE_KEY = 'hotelAutomation.ownerCampaigns'
const SUPPORT_AGENTS_STORAGE_KEY = 'hotelAutomation.supportAgents'
const SUPPORT_ROUND_ROBIN_STORAGE_KEY = 'hotelAutomation.supportRoundRobin'
const LANGUAGE_STORAGE_KEY = 'hotelAutomation.language'
const LANGUAGE_PREFERENCE_MARKER_KEY = 'hotelAutomation.languagePreferenceSet'
const GLOBAL_SEARCH_STORAGE_KEY = 'hotelAutomation.navigation.globalSearch'
const DASHBOARD_ACTIVE_PANEL_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.activePanel'
const DASHBOARD_ACTIVE_ITEM_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.activeItem'
const DASHBOARD_OPEN_SECTIONS_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.openSections'
const DASHBOARD_SIDEBAR_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.sidebarCollapsed'
const DASHBOARD_PROFILE_MENU_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.profileMenuOpen'
const DASHBOARD_PROFILE_PANEL_STORAGE_KEY = 'hotelAutomation.navigation.dashboard.profilePanel'
const ADMIN_FILTER_STORAGE_KEY = 'hotelAutomation.navigation.admin.filter'
const ADMIN_SELECTED_HOTEL_STORAGE_KEY = 'hotelAutomation.navigation.admin.selectedHotel'
const ADMIN_SELECTED_RESERVATION_STORAGE_KEY = 'hotelAutomation.navigation.admin.selectedReservation'
const ADMIN_RESERVATION_FILTER_STORAGE_KEY = 'hotelAutomation.navigation.admin.reservationFilters'
const ADMIN_PENDING_ACTION_STORAGE_KEY = 'hotelAutomation.navigation.admin.pendingAction'
const ADMIN_PENDING_REASON_STORAGE_KEY = 'hotelAutomation.navigation.admin.pendingReason'
const OWNER_SELECTED_HOTEL_STORAGE_KEY = 'hotelAutomation.navigation.owner.selectedHotel'
const GUEST_ACTIVE_ITEM_STORAGE_KEY = 'hotelAutomation.navigation.guest.activeItem'
const GUEST_OPEN_SECTIONS_STORAGE_KEY = 'hotelAutomation.navigation.guest.openSections'
const GUEST_SIDEBAR_STORAGE_KEY = 'hotelAutomation.navigation.guest.sidebarCollapsed'
const GUEST_PROFILE_MENU_STORAGE_KEY = 'hotelAutomation.navigation.guest.profileMenuOpen'
const GUEST_SELECTED_HOTEL_STORAGE_KEY = 'hotelAutomation.navigation.guest.selectedHotel'
const GUEST_BOOKING_FORM_STORAGE_KEY = 'hotelAutomation.navigation.guest.bookingForm'
const GUEST_SELECTED_RESERVATION_STORAGE_KEY = 'hotelAutomation.navigation.guest.selectedReservation'
const GUEST_MESSAGES_NAV_STORAGE_KEY = 'hotelAutomation.navigation.guest.hotelMessages'
const GUEST_LIVE_SUPPORT_NAV_STORAGE_KEY = 'hotelAutomation.navigation.guest.liveSupport'
const GUEST_AVAILABLE_SORT_STORAGE_KEY = 'hotelAutomation.navigation.guest.availableSort'
const GUEST_HOTEL_GALLERY_STORAGE_KEY = 'hotelAutomation.navigation.guest.hotelGallery'
const SUPPORT_CONSOLE_AGENT_STORAGE_KEY = 'hotelAutomation.navigation.supportConsole.activeAgent'
const SUPPORT_CONSOLE_TICKET_STORAGE_KEY = 'hotelAutomation.navigation.supportConsole.activeTicket'
const SUPPORT_CONSOLE_MODE_STORAGE_KEY = 'hotelAutomation.navigation.supportConsole.mode'
const CURRENT_DEVICE_ID = 'device-1'
const defaultAdminReservationFilters = {
  endDate: '',
  guest: '',
  hotel: '',
  payment: 'Tümü',
  sort: 'newest',
  startDate: '',
}
const DEMO_VERIFICATION_CODE = '123456'
const VERIFICATION_TIMEOUT_MS = 180_000

function readStoredValue<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key)

  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

function writeStoredValue<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function editableNumberValue(value: number | string | undefined | null) {
  if (value === '' || value === undefined || value === null) {
    return ''
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) && numericValue !== 0 ? String(value) : ''
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDateInputValue(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const parsedDate = new Date(year, month - 1, day)

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null
  }

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

function getTodayDateInputValue() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return formatDateInputValue(today)
}

function addDaysToDateInputValue(value: string, days: number) {
  const baseDate = parseDateInputValue(value) ?? parseDateInputValue(getTodayDateInputValue()) ?? new Date()
  baseDate.setDate(baseDate.getDate() + days)

  return formatDateInputValue(baseDate)
}

function compareDateInputValues(first: string, second: string) {
  const firstDate = parseDateInputValue(first)
  const secondDate = parseDateInputValue(second)

  if (!firstDate || !secondDate) {
    return Number.NaN
  }

  return firstDate.getTime() - secondDate.getTime()
}

function getMinimumReservationCheckOut(checkIn: string) {
  const today = getTodayDateInputValue()
  const normalizedCheckIn = compareDateInputValues(checkIn, today) >= 0 ? checkIn : today

  return addDaysToDateInputValue(normalizedCheckIn, 1)
}

function normalizeReservationDateRange(checkIn: string, checkOut: string) {
  const today = getTodayDateInputValue()
  const safeCheckIn = compareDateInputValues(checkIn, today) >= 0 ? checkIn : today
  const minCheckOut = getMinimumReservationCheckOut(safeCheckIn)
  const safeCheckOut = compareDateInputValues(checkOut, minCheckOut) >= 0 ? checkOut : minCheckOut

  return {
    checkIn: safeCheckIn,
    checkOut: safeCheckOut,
  }
}

function reservationDateValidationMessage(checkIn: string, checkOut: string, language: LanguageCode) {
  const today = getTodayDateInputValue()

  if (!parseDateInputValue(checkIn) || !parseDateInputValue(checkOut)) {
    return language === 'en'
      ? 'Please select a valid check-in and check-out date.'
      : 'Lütfen geçerli bir giriş ve çıkış tarihi seçin.'
  }

  if (compareDateInputValues(checkIn, today) < 0) {
    return language === 'en'
      ? 'You cannot create a reservation for a past date.'
      : 'Geçmiş tarih için rezervasyon oluşturamazsınız.'
  }

  if (compareDateInputValues(checkOut, checkIn) <= 0) {
    return language === 'en'
      ? 'Check-out date must be after the check-in date.'
      : 'Çıkış tarihi giriş tarihinden sonra olmalıdır.'
  }

  return null
}

function createDefaultGuestBookingForm() {
  const checkIn = getTodayDateInputValue()

  return {
    adults: 2,
    checkIn,
    checkOut: addDaysToDateInputValue(checkIn, 3),
    children: 0,
    couponCode: '',
    extraServices: [],
    hasBreakfast: false,
    isReservationConfirmed: false,
    paymentMethod: 'Kredi Kartı',
    roomCount: 1,
    roomType: 'Tümü',
    selectedBookingHotelId: null as string | null,
    selectedRoomId: '',
  }
}

function mergeCustomHotels(baseHotels: HotelRecord[]) {
  const customHotels = readStoredValue<HotelRecord[]>(CUSTOM_HOTELS_STORAGE_KEY, [])
  const baseIds = new Set(baseHotels.map((hotel) => hotel.id))

  return [
    ...baseHotels,
    ...customHotels.filter((hotel) => !baseIds.has(hotel.id)),
  ]
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback))

  useEffect(() => {
    writeStoredValue(key, value)
  }, [key, value])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue) as T)
        } catch {
          setValue(fallback)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fallback, key])

  return [value, setValue] as const
}

function createSystemNotification(
  category: string,
  title: string,
  detail: string,
  target?: string,
): GuestNotification {
  return {
    id: `not-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    category,
    title,
    detail,
    target,
    time: formatDateTime(new Date()),
    unread: true,
  }
}

function isGuestVisibleNotification(notification: GuestNotification) {
  const normalizedText = normalizeSearch(`${notification.category} ${notification.title} ${notification.detail} ${notification.target ?? ''}`)
  const blockedAdminSignals = [
    'yönetici',
    'otel durumu',
    'askıya',
    'sistemden kaldır',
    'sistem log',
    'yetki ihlali',
    'otel listesi',
  ]

  if (notification.title === 'Yeni cihazdan giriş yapıldı') {
    return false
  }

  if (blockedAdminSignals.some((signal) => normalizedText.includes(signal))) {
    return false
  }

  if (notification.category === 'Güvenlik') {
    return ['Güvenlik Ayarları', 'Kişisel Bilgiler'].includes(notification.target ?? '')
  }

  return ['Rezervasyon', 'Mesaj', 'Kampanya', 'Favoriler', 'Destek', 'Yorum', 'Otel Duyurusu'].includes(notification.category)
}

function getStoredLanguage(): LanguageCode {
  if (localStorage.getItem(LANGUAGE_PREFERENCE_MARKER_KEY) !== 'true') {
    return 'tr'
  }

  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'tr'
}

function storeLanguagePreference(value: LanguageCode) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
  localStorage.setItem(LANGUAGE_PREFERENCE_MARKER_KEY, 'true')
}

function assignSupportAgent(tickets: SupportTicket[]) {
  const agents = readStoredValue<SupportAgentAccount[]>(SUPPORT_AGENTS_STORAGE_KEY, [])
  const availableAgents = agents.filter((agent) => agent.status !== 'Offline')

  if (availableAgents.length === 0) {
    return undefined
  }

  const activeTicketCount = (username: string) => tickets.filter((ticket) =>
    ticket.assignedAgent === username && !['Kapatıldı', 'Yanıtlandı'].includes(ticket.status),
  ).length
  const freeAgents = availableAgents.filter((agent) => agent.status !== 'Meşgul' && activeTicketCount(agent.username) === 0)
  const candidates = freeAgents.length > 0 ? freeAgents : availableAgents
  const lastIndex = Number(localStorage.getItem(SUPPORT_ROUND_ROBIN_STORAGE_KEY) ?? '0')
  const sortedCandidates = [...candidates].sort((first, second) => activeTicketCount(first.username) - activeTicketCount(second.username))
  const selected = sortedCandidates[lastIndex % sortedCandidates.length]

  localStorage.setItem(SUPPORT_ROUND_ROBIN_STORAGE_KEY, String(lastIndex + 1))
  return selected.username
}

function getAdminHotelStatuses() {
  return readStoredValue<AdminHotelStatus[]>(ADMIN_HOTEL_STATUS_STORAGE_KEY, [])
}

function getAdminHotelStatus(hotel: HotelRecord, statusRecords: AdminHotelStatus[] = getAdminHotelStatuses()) {
  return statusRecords.find((record) => record.hotelId === hotel.id)?.status ?? (hotel.isActive ? 'Aktif' : 'Askıda')
}

function getAdminHotelStatusRecord(hotel: HotelRecord, statusRecords: AdminHotelStatus[] = getAdminHotelStatuses()) {
  return statusRecords.find((record) => record.hotelId === hotel.id)
}

function filterGuestVisibleHotels(hotels: HotelRecord[], statusRecords: AdminHotelStatus[] = getAdminHotelStatuses()) {
  return hotels.filter((hotel) => {
    const status = getAdminHotelStatus(hotel, statusRecords)

    return status !== 'Askıda' && status !== 'Kaldırıldı' && status !== 'Reddedildi' && status !== 'Onay Bekliyor'
  })
}

function getGuestHotelConversationId(guestId: string, hotelId?: string) {
  return `guest-${guestId || 'anonymous'}-hotel-${hotelId || 'unknown'}`
}

function isConversationOwnedByGuest(conversation: GuestConversation, guestId: string) {
  return conversation.guestId === guestId || conversation.userId === guestId
}

function isGuestScopedConversation(conversation: GuestConversation) {
  return Boolean(conversation.guestId || conversation.userId)
}

function acquireAdminLock(recordId: string, lockedBy: string) {
  const now = Date.now()
  const locks = readStoredValue<AdminRecordLock[]>(ADMIN_LOCKS_STORAGE_KEY, [])
    .filter((lock) => lock.expiresAt > now)
  const existingLock = locks.find((lock) => lock.recordId === recordId && lock.lockedBy !== lockedBy)

  if (existingLock) {
    return existingLock
  }

  writeStoredValue<AdminRecordLock[]>(ADMIN_LOCKS_STORAGE_KEY, [
    ...locks.filter((lock) => lock.recordId !== recordId),
    {
      expiresAt: now + 180_000,
      lockedAt: formatDateTime(new Date()),
      lockedBy,
      recordId,
    },
  ])

  return null
}

function releaseAdminLock(recordId: string, lockedBy: string) {
  const locks = readStoredValue<AdminRecordLock[]>(ADMIN_LOCKS_STORAGE_KEY, [])
    .filter((lock) => !(lock.recordId === recordId && lock.lockedBy === lockedBy))

  writeStoredValue(ADMIN_LOCKS_STORAGE_KEY, locks)
}

function formatDateTime(date: Date) {
  return date.toLocaleString(getStoredLanguage() === 'en' ? 'en-US' : 'tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const portals: PortalConfig[] = [
  {
    role: 'Customer',
    title: 'Misafir Girişi',
    eyebrow: 'Konaklama deneyimi alanı',
    subtitle: 'Tesis arama, rezervasyon takibi ve favori konaklama planların için güvenli erişim.',
    email: 'misafir@otel.local',
    password: 'Guest123!',
    imageClass: 'guest-visual',
  },
  {
    role: 'SuperAdmin',
    title: 'Yönetici Girişi',
    eyebrow: 'Kurumsal güvenlik alanı',
    subtitle: 'Tüm oteller, kullanıcılar, finans ve sistem raporları için merkezi kontrol.',
    email: 'yonetici@otel.local',
    password: 'Admin123!',
    imageClass: 'admin-visual',
  },
  {
    role: 'PropertyManager',
    title: 'Otel Sahibi Girişi',
    eyebrow: 'Tesis yönetimi alanı',
    subtitle: 'Doluluk, gelir, rezervasyon ve oda performansını gerçek zamanlı izle.',
    email: 'sahip@otel.local',
    password: 'Owner123!',
    imageClass: 'owner-visual',
  },
]

const roleLabels: Record<UserRole, string> = {
  Customer: 'Misafir',
  PropertyManager: 'Otel Sahibi',
  SuperAdmin: 'Yönetici',
}

const englishRoleLabels: Record<UserRole, string> = {
  Customer: 'Guest',
  PropertyManager: 'Hotel Owner',
  SuperAdmin: 'Administrator',
}

const englishUiLabels: Record<string, string> = {
  'Aktif Cihazlar': 'Active Devices',
  'Aktif Personel': 'Active Staff',
  'Aktif Rezervasyonlar': 'Active Reservations',
  'Ana Sayfa': 'Home',
  'API Performansı': 'API Performance',
  'Askıya Alınan Oteller': 'Suspended Hotels',
  'Aylık Raporlar': 'Monthly Reports',
  'Bildirim Tercihleri': 'Notification Preferences',
  Bildirimler: 'Notifications',
  'Check-in / Check-out': 'Check-in / Check-out',
  'Çıkış Yap': 'Sign Out',
  'Canlı Destek': 'Live Support',
  'Destek Merkezi': 'Support Center',
  'Destek Talepleri': 'Support Requests',
  'Destek Talebi Oluştur': 'Create Support Request',
  'Dinamik Fiyatlandırma': 'Dynamic Pricing',
  'Doluluk Tahmini': 'Occupancy Forecast',
  Favoriler: 'Favorites',
  'Favori Oteller': 'Favorite Hotels',
  'Finans Merkezi': 'Finance Center',
  'Gelir Özeti': 'Revenue Summary',
  'Genel Durum': 'Overview',
  'Genel Sistem Yönetimi': 'General System Management',
  'Geçmiş Rezervasyonlar': 'Past Reservations',
  'Güvenlik Ayarları': 'Security Settings',
  'Güvenlik Logları': 'Security Logs',
  'Güvenlik Merkezi': 'Security Center',
  'Hafta Sonu Fiyatları': 'Weekend Prices',
  'Hizmet Bilgileri': 'Service Information',
  'İadeler': 'Refunds',
  'İndirim Tanımları': 'Discount Rules',
  'İptal İşlemleri': 'Cancellation Actions',
  'Kaydedilen Odalar': 'Saved Rooms',
  'Kampanya Yönetimi': 'Campaign Management',
  Kampanyalar: 'Campaigns',
  'Konum Yönetimi': 'Location Management',
  'Misafir Mesajları': 'Guest Messages',
  Mesajlar: 'Messages',
  'Oda Doluluk Durumu': 'Room Occupancy',
  'Oda Düzenleme': 'Room Editing',
  'Oda Görselleri': 'Room Images',
  'Oda Görsel Sıralama': 'Room Image Ordering',
  'Oda Listesi': 'Room List',
  'Oda Özellikleri': 'Room Features',
  'Oda Yönetimi': 'Room Management',
  'Onay Bekleyen Oteller': 'Pending Hotels',
  'Otel Açıklaması': 'Hotel Description',
  'Otel Ayarları': 'Hotel Settings',
  'Otel Bazlı Gelir': 'Revenue by Hotel',
  'Otel Genel Durumu': 'Hotel Overview',
  'Otel Görselleri': 'Hotel Images',
  'Otel Ekle': 'Add Hotel',
  'Otel Listesi': 'Hotel List',
  'Otel Mesajları': 'Hotel Messages',
  'Otel Önerileri': 'Hotel Recommendations',
  'Otel Politikaları': 'Hotel Policies',
  'Otel Sahipleri': 'Hotel Owners',
  'Müşteri Memnuniyeti': 'Guest Satisfaction',
  'Ödeme Yöntemleri': 'Payment Methods',
  'Personel Ekle': 'Add Staff',
  'Personel Kontrolü': 'Staff Control',
  'Personel Kullanıcıları': 'Staff Users',
  'Platform güvenliği ve operasyon izleme': 'Platform security and operations monitoring',
  'Popüler Oteller': 'Popular Hotels',
  Profilim: 'My Profile',
  'Profil Ayarları': 'Profile Settings',
  'Rezervasyon Yap': 'Make Reservation',
  'Rezervasyonlarım': 'My Reservations',
  'Sezonluk Fiyatlar': 'Seasonal Prices',
  'Sık Sorulan Sorular': 'FAQ',
  'Sistem Performansı': 'System Performance',
  'Sistem Yükü': 'System Load',
  'Sistemden Kaldırılan Oteller': 'Removed Hotels',
  'Son İşlemler': 'Recent Activity',
  'Sunucu Durumu': 'Server Status',
  'Talep Tahmini': 'Demand Forecast',
  'Tüm Oteller': 'All Hotels',
  'Uygun Oteller': 'Available Hotels',
  'Veri Tabanı Durumu': 'Database Status',
  'Yapay Zeka Analizleri': 'AI Analytics',
  'Yakındaki Yerler': 'Nearby Places',
  'Yardım Merkezi': 'Help Center',
  'Yeni Oda Ekle': 'Add New Room',
  'Yetki İhlalleri': 'Permission Violations',
  'Yetki Rolleri': 'Permission Roles',
  'Yoğunluk Analizi': 'Density Analysis',
  'Yönetici Hesapları': 'Administrator Accounts',
  'Yorum Özeti': 'Review Summary',
  'Yorumlar ve Puanlar': 'Reviews and Ratings',
}

function tLabel(value: string, language: LanguageCode) {
  return language === 'en' ? englishUiLabels[value] ?? value : value
}

const englishExactTextLabels: Record<string, string> = {
  ...englishUiLabels,
  'Açık': 'Open',
  'Açıklama': 'Description',
  'Ad': 'First Name',
  'Ad soyad': 'Full Name',
  'Adres': 'Address',
  'Aktif': 'Active',
  'Aktif Konuşmalar': 'Active Conversations',
  'Aktif Yap': 'Activate',
  'Alıcı': 'Recipient',
  'Ana sistem yöneticisi hesabı bu ekrandan pasife alınamaz veya silinemez.': 'The primary system administrator account cannot be deactivated or deleted from this screen.',
  'Ara': 'Search',
  'Ara toplam': 'Subtotal',
  'Arama': 'Search',
  'Aramanızla eşleşen kart bulunmuyor.': 'No cards match your search.',
  'Aramanızla eşleşen gösterge bulunmuyor.': 'No indicators match your search.',
  'Aramanızla eşleşen olay bulunmuyor.': 'No events match your search.',
  'Askıya Al': 'Suspend',
  'Askıda': 'Suspended',
  'Atama bekliyor': 'Waiting for assignment',
  'Bekleyen': 'Pending',
  'Beklemede': 'Waiting',
  'Bildirim Merkezi': 'Notification Center',
  'Bildirimleri temizle': 'Clear notifications',
  'Bu Odayı Seç': 'Select This Room',
  'Bu cihazdan çıkış yap': 'Sign out from this device',
  'Bu destek talebi zaten yanıtlandı. Ticket mantığında ek sürekli mesajlaşma yapılmaz.': 'This support request has already been answered. Ticket flow does not allow continuous messaging.',
  'Bu kayıt şu anda başka bir yönetici tarafından işleniyor.': 'This record is currently being processed by another administrator.',
  'Canlı Destek Girişi': 'Live Support Login',
  'Canlı Destek Konsolu': 'Live Support Console',
  'Canlı Destek Konsolu Kurulumu': 'Live Support Console Setup',
  'Canlı Destek Kuyruğu': 'Live Support Queue',
  'Canlı sistem': 'Live system',
  'Cevap': 'Reply',
  'Cihaz': 'Device',
  'Çıkış tarihi': 'Check-out date',
  'Çocuk': 'Children',
  'Çocuk sayısı': 'Children',
  'Destek Çalışanı Ekle': 'Add Support Agent',
  'Destek Çalışanları': 'Support Agents',
  'Destek Paneline Gir': 'Enter Support Panel',
  'Devre dışı bitiş tarihi': 'Disabled until',
  'Dil': 'Language',
  'Doğrulama maili gönder': 'Send verification email',
  'Doğrulama bekliyor': 'Verification pending',
  'Doğrulandı': 'Verified',
  'Durum': 'Status',
  'Durum Etiketi': 'Status Label',
  'Düşük': 'Low',
  'E-posta': 'Email',
  'E-posta Doğrulama': 'Email Verification',
  'Ek hizmetler': 'Extra services',
  'Eski şifre': 'Current password',
  'Favoride': 'Saved',
  'Favoriye Ekle': 'Add to Favorites',
  'Filtreler': 'Filters',
  'Fiyat': 'Price',
  'Gecelik fiyat': 'Nightly price',
  'Gece': 'Nights',
  'Gece sayısı': 'Nights',
  'Geçmiş': 'Past',
  'Genel görüşme': 'General conversation',
  'Geri Aktifleştir': 'Reactivate',
  'Geri Döndür': 'Restore',
  'Geri Getir': 'Restore',
  'Gönder': 'Send',
  'Gönderildi': 'Sent',
  'Görsel': 'Image',
  'Görüntüle': 'View',
  'Günlük Gelir': 'Daily Revenue',
  'Güvenli çıkış': 'Secure logout',
  'Hata Kontrolü': 'Error Check',
  'Henüz destek talebi bulunmuyor.': 'No support requests yet.',
  'Henüz grafik oluşturacak kayıt bulunmuyor.': 'No records available to generate a chart yet.',
  'Henüz kayıt bulunmuyor': 'No records yet',
  'Henüz kayıt bulunmuyor.': 'No records yet.',
  'Henüz sistem olayı oluşmadı. Rezervasyon, mesaj, destek veya güvenlik işlemleri yaptıkça bildirimler burada görünecek.': 'No system events yet. Reservation, message, support, or security events will appear here.',
  'Hesabı kapat': 'Close account',
  'Hesap Güvenliği': 'Account Security',
  'Hizmetler': 'Services',
  'İhlale Ekle': 'Add Violation',
  'İhlali Kaydet': 'Save Violation',
  'İki Adımlı Doğrulama': 'Two-Factor Authentication',
  'İletildi': 'Delivered',
  'İncele': 'View Details',
  'İnceleniyor': 'Under Review',
  'İptal Et': 'Cancel',
  'İptal Edildi': 'Cancelled',
  'İşlem nedeni': 'Action reason',
  'İşlem tipi': 'Action type',
  'İşlemi Onayla': 'Confirm Action',
  'İşlemler': 'Actions',
  'Kahvaltı': 'Breakfast',
  'Kahvaltı dahil': 'Breakfast included',
  'Kalıcı Kapatıldı': 'Permanently Closed',
  'Kaldırıldı': 'Removed',
  'Kapat': 'Close',
  'Kapatılan': 'Closed',
  'Kapatıldı': 'Closed',
  'Kategori': 'Category',
  'Kaydet': 'Save',
  'Kayıt': 'Record',
  'Kimlik ve İletişim': 'Identity and Contact',
  'Kişi / oda': 'Guests / rooms',
  'Kişi sayısı': 'Guests',
  'Kişisel Bilgiler': 'Personal Information',
  'Kod gönder': 'Send code',
  'Kodu doğrula': 'Verify code',
  'Konaklama Tercihleri': 'Stay Preferences',
  'Konu': 'Subject',
  'Konum': 'Location',
  'Kontrol ediliyor': 'Checking',
  'Kredi Kartı': 'Credit Card',
  'Kullanıcı adı': 'Username',
  'Kullanıcı seç': 'Select user',
  'Kupon indirimi': 'Coupon discount',
  'Kupon kodu': 'Coupon code',
  'Liste': 'List',
  'Lobi': 'Lobby',
  'MacBook Pro': 'MacBook Pro',
  'Manzara': 'View',
  'Mesaj': 'Message',
  'Mesaj yaz': 'Write a message',
  'Meşgul': 'Busy',
  'Meşgul Yap': 'Set Busy',
  'Misafir': 'Guest',
  'Misafir sayısı': 'Guests',
  'Müsait': 'Available',
  'Müsait Yap': 'Set Available',
  'Müsaitlik kontrol ediliyor': 'Checking availability',
  'Net gelir': 'Net revenue',
  'Oda': 'Room',
  'Oda değiştir': 'Change room',
  'Oda sayısı': 'Rooms',
  'Oda seçimi': 'Room selection',
  'Oda tipi': 'Room type',
  'Oda toplamı': 'Room total',
  'Okundu': 'Read',
  'Okunmadı': 'Unread',
  'Okunmamış': 'Unread',
  'Onay Bekliyor': 'Pending Approval',
  'Onayla': 'Approve',
  'Operasyon Göstergeleri': 'Operational Indicators',
  'Orta': 'Medium',
  'Ortalama puan': 'Average rating',
  'Otel': 'Hotel',
  'Otel değiştir': 'Change hotel',
  'Otel Detayı': 'Hotel Detail',
  'Otel kaydı yok': 'No hotel record',
  'Otel mesajları': 'Hotel messages',
  'Otel sahibi': 'Hotel owner',
  'Otellere dön': 'Back to hotels',
  'Otelle Mesajlaş': 'Message Hotel',
  'Otelle sohbet başlat': 'Start hotel chat',
  'Pasif': 'Inactive',
  'Pasif Personel': 'Inactive Staff',
  'Pasif Yap': 'Deactivate',
  'Pasife Düşür': 'Deactivate',
  'Personel Ekle': 'Add Staff',
  'Profil': 'Profile',
  'Profil paneli': 'Profile panel',
  'Profil fotoğrafı': 'Profile photo',
  'Reddet': 'Reject',
  'Reddedildi': 'Rejected',
  'Restoran': 'Restaurant',
  'Rezervasyon': 'Reservation',
  'Rezervasyon Akışı': 'Reservation Flow',
  'Rezervasyon Özeti': 'Reservation Summary',
  'Rezervasyonu Görüntüle': 'View Reservation',
  'Risk seviyesi': 'Risk level',
  'Sağlık': 'Health',
  'Seçili otel': 'Selected hotel',
  'Seçili otel ve oda': 'Selected hotel and room',
  'Sil': 'Delete',
  'Silinen Personel': 'Deleted Staff',
  'Sistem': 'System',
  'Sistemden kaldır': 'Remove from system',
  'Son Kayıtlar': 'Recent Records',
  'Son mesaj': 'Last message',
  'Sonuç': 'Result',
  'Spa': 'Spa',
  'Süreli Devre Dışı': 'Temporarily Disabled',
  'Şifre': 'Password',
  'Şifre Değiştir': 'Change Password',
  'Şifreyi Güncelle': 'Update Password',
  'Tamamen Sil': 'Delete Permanently',
  'Tarih': 'Date',
  'Tarih/saat': 'Date/time',
  'Tekrar Rezervasyon Yap': 'Book Again',
  'Telefon': 'Phone',
  'Telefon Doğrulama': 'Phone Verification',
  'Temsilci ataması bekleniyor': 'Waiting for agent assignment',
  'Tesiste Ödeme': 'Pay at Property',
  'Ticket Kuyruğu': 'Ticket Queue',
  'Toplam': 'Total',
  'Toplam ödeme': 'Total payment',
  'Tümünü okundu yap': 'Mark all as read',
  'Tümü': 'All',
  'Uygun Otel Ara': 'Search Available Hotels',
  'VIP Misafir': 'VIP Guest',
  'Yanıt bekliyor': 'Waiting for reply',
  'Yanıtlandı': 'Answered',
  'Yanıtı okundu yap': 'Mark reply as read',
  'Yaklaşan Konaklamalar': 'Upcoming Stays',
  'Yatak tercihi': 'Bed preference',
  'Yazıyor': 'Typing',
  'Yenile': 'Refresh',
  'Yenileniyor': 'Refreshing',
  'Yeni kart': 'New card',
  'Yeni kullanıcı adı': 'New username',
  'Yeni sohbet için otel seç': 'Select hotel for a new chat',
  'Yeni şifre': 'New password',
  'Yeni şifre tekrar': 'Confirm new password',
  'Yönetici': 'Administrator',
  'Yönetici hesabı': 'Administrator account',
  'Yönetici Oluştur': 'Create Administrator',
  'Yüksek': 'High',
  'Yüzme havuzu': 'Swimming pool',
  'Ödeme': 'Payment',
  'Ödeme Sorunları': 'Payment Issues',
  'Ödeme yöntemi': 'Payment method',
  'Ön Büro': 'Front Desk',
  'Öncelik': 'Priority',
}

const englishAdditionalExactTextLabels: Record<string, string> = {
  'Acil durum iletişim kişisi': 'Emergency contact person',
  'Acil durum telefon numarası': 'Emergency phone number',
  'Açık konuşma': 'Open conversations',
  'Açık Talepler': 'Open Requests',
  'Ad ve soyad zorunludur.': 'First name and last name are required.',
  'Admin paneline iletilen kalıcı talepler': 'Persistent requests sent to the admin panel',
  'Aktif check-in adayı var': 'Active check-in candidate available',
  'Aktif veri': 'Active data',
  'Bağlantı havuzu sağlıklı': 'Connection pool is healthy',
  'Belirtilmedi': 'Not specified',
  'Beni hatırla': 'Remember me',
  'Bu filtrede destek mesajı yok.': 'There are no support messages for this filter.',
  'Bu filtrede mesaj yok.': 'There are no messages for this filter.',
  'Bu otelle henüz mesajlaşma başlamadı.': 'Messaging with this hotel has not started yet.',
  'Bu talepte mesaj geçmişi yok.': 'This request has no message history.',
  'Canlı destek': 'Live support',
  'Canlı destek bildirimleri': 'Live support notifications',
  'Canlı destek görüşmesi başlatıldı': 'Live support conversation started',
  'Canlı destek mesajınız yanıtlandı': 'Your live support message has been answered',
  'Canlı destek yanıtı': 'Live support reply',
  'Canlı desteğe bağlanmak ister misiniz?': 'Would you like to connect to live support?',
  'Cevaplanan': 'Answered',
  'Cihaz oturumu sonlandırıldı': 'Device session ended',
  'Çevrim içi': 'Online',
  'Destek Botu': 'Support Bot',
  'Destek Çalışanı': 'Support Agent',
  'Destek Gelen Kutusu': 'Support Inbox',
  'Destek Geçmişi': 'Support History',
  'Destek Kuyruğu': 'Support Queue',
  'Destek mesajı yaz': 'Write a support message',
  'Destek Riski': 'Support Risk',
  'Destek riski': 'Support risk',
  'Destek talebi': 'Support request',
  'Destek Taleplerim': 'My Support Requests',
  'Destek Temsilcisi': 'Support Agent',
  'Destek yanıtı': 'Support reply',
  'Detaylar': 'Details',
  'Devam Et': 'Continue',
  'Doğrula': 'Verify',
  'Doğrulama kodu': 'Verification code',
  'Doğrulama kodu gönder': 'Send verification code',
  'Doğrulama kodu gönderildi': 'Verification code sent',
  'Doğrulama kodu hatalı.': 'Verification code is incorrect.',
  'Doğrulama yöntemi': 'Verification method',
  'Doğum tarihi': 'Date of birth',
  'E-posta adresi': 'Email address',
  'E-posta adresi giriniz.': 'Please enter an email address.',
  'E-posta doğrulama': 'Email verification',
  'E-posta doğrulama kodu hatalı.': 'Email verification code is incorrect.',
  'E-posta doğrulama kodu gönderildi.': 'Email verification code sent.',
  'E-posta doğrulandı.': 'Email verified.',
  'E-posta ile': 'By email',
  'E-posta kodu': 'Email code',
  'E-posta kodunun süresi doldu. Yeni kod isteyin.': 'The email code has expired. Please request a new code.',
  'E-posta / kullanıcı adı': 'Email / username',
  'Ek güvenlik': 'Extra security',
  'Engelli erişimi ihtiyacım var': 'I need accessible facilities',
  'En sık sorulan konaklama soruları': 'Most frequently asked stay questions',
  'Etkinlik alanı': 'Event area',
  'Favori Tesis': 'Favorite Properties',
  'Geçerli bir e-posta adresi giriniz.': 'Please enter a valid email address.',
  'Geçerli bir telefon numarası giriniz.': 'Please enter a valid phone number.',
  'Geri': 'Back',
  'Giriş ekranına dön': 'Back to login screen',
  'Giriş Yap': 'Sign In',
  'Giriş yapılıyor': 'Signing in',
  'Girişi Tamamla': 'Complete Sign-In',
  'Girişini doğrula': 'Verify your sign-in',
  'Gizli': 'Hidden',
  'Güncel': 'Current',
  'Güncelleniyor': 'Updating',
  'Güvenli hesap kurtarma': 'Secure account recovery',
  'Güvenli giriş kontrolü': 'Secure sign-in check',
  'Güvenli misafir kaydı': 'Secure guest registration',
  'Güvenlik odaklı yönetici erişimi': 'Security-focused administrator access',
  'Henüz admin destek talebi oluşturulmadı.': 'No admin support request has been created yet.',
  'Henüz admin destek talebi yok.': 'There are no admin support requests yet.',
  'Henüz destek talebi oluşturulmadı.': 'No support request has been created yet.',
  'Henüz işlem yok': 'No activity yet',
  'Henüz misafir mesajı yok.': 'No guest messages yet.',
  'Henüz otel sohbeti yok. Bir otel seçip mesaj başlatabilirsin.': 'No hotel chats yet. Select a hotel to start a conversation.',
  'Hesap Bilgileri': 'Account Information',
  'Hesap şifreni güvenli şekilde güncelle': 'Update your account password securely',
  'Hesap kurtarma ve bildirim güvenliği': 'Account recovery and notification security',
  'Hesap yalnızca şifre ile korunur.': 'The account is protected with password only.',
  'Hızlı yanıt': 'Quick reply',
  'İki aşamalı doğrulama': 'Two-factor authentication',
  'İki aşamalı doğrulama kodu gönderildi': 'Two-factor verification code sent',
  'İlgili ekran': 'Related screen',
  'İşlem': 'Action',
  'İşlem yapılmadı': 'No action taken',
  'Kahvaltı opsiyonel': 'Breakfast optional',
  'Kahvaltı tercihim var': 'I prefer breakfast',
  'Kapalı': 'Closed',
  'Kayıt Durumu': 'Registration Status',
  'Kayıt ekranına dön': 'Back to registration screen',
  'Kayıt oluşturuluyor': 'Creating account',
  'Kayıt Ol': 'Register',
  'Kayıt oturumu bulunamadı. Lütfen yeniden kayıt olun.': 'Registration session was not found. Please register again.',
  'Kayıt sırasında girilen profil verileri otomatik görüntülenir': 'Profile data entered during registration is shown automatically',
  'Kayıt Yok': 'No Records',
  'Kişisel bilgiler': 'Personal information',
  'Kimlik / pasaport tipi': 'ID / passport type',
  'Kimlik ve İletişim': 'Identity and Contact',
  'Kod bekleniyor': 'Waiting for code',
  'Kod Ekranı': 'Code Screen',
  'Kod ekranı': 'Code screen',
  'Kod gönder': 'Send code',
  'Kodu doğrula': 'Verify code',
  'Kodu gönder': 'Send code',
  'Kodu tekrar gönder': 'Resend code',
  'Kod süresi': 'Code duration',
  'Kod süresi doldu. Kodu tekrar gönderin.': 'Code expired. Please resend the code.',
  'Kod süresi doldu. Yeni kod isteyin.': 'Code expired. Please request a new code.',
  'Konaklama hesabını güvenle oluştur': 'Create your stay account securely',
  'Konaklamanı şık ve hızlı planla': 'Plan your stay with clarity and style',
  'Konu ve açıklama': 'Subject and description',
  'Kullanıcı adı, e-posta veya telefon numarası daha önce kullanılmış.': 'This username, email, or phone number has already been used.',
  'Kullanıcı adı, şifre veya T.C. Kimlik No hatalı.': 'Username, password, or national ID is incorrect.',
  'Kullanıcı adı zorunludur.': 'Username is required.',
  'Kullanıcı sözleşmesini kabul ediyorum.': 'I accept the user agreement.',
  'Kurumsal otel yönetimi': 'Enterprise hotel management',
  'KVKK aydınlatma metnini okudum ve onaylıyorum.': 'I have read and approve the data protection notice.',
  'KVKK uyumlu hesap açılışı': 'Data-protection compliant account setup',
  'KVKK ve kullanıcı sözleşmesi onayı zorunludur.': 'Data protection and user agreement approval is required.',
  'Mağaza ve kafe alanı': 'Shops and cafe area',
  'Manzara rotası': 'View route',
  'Mesajlaşmak için bir otel seç ve sohbet başlat.': 'Select a hotel and start a chat to message.',
  'Misafir konuşması': 'Guest conversation',
  'Misafir Kayıt Ekranı': 'Guest Registration Screen',
  'Misafir Kutusu': 'Guest Inbox',
  'Misafir Paneli': 'Guest Panel',
  'Müsaitlik': 'Availability',
  'Oda görseli': 'Room image',
  'Otel Mesajlaşma': 'Hotel Messaging',
  'Otel mesajlaşma': 'Hotel messaging',
  'Otel sahibi yetkisi': 'Hotel owner permission',
  'Otel Sahibi': 'Hotel Owner',
  'Otel Sahibi Girişi': 'Hotel Owner Login',
  'Otel Sahibi Paneli': 'Hotel Owner Panel',
  'Ödeme yardımı istiyorum': 'I need payment assistance',
  'Önce kod gönder': 'Send code first',
  'Önce otelleri incele': 'Browse hotels first',
  'Özel URL': 'Private URL',
  'Pasaport numarası': 'Passport number',
  'Profil Bilgilerini Tamamla': 'Complete Profile Information',
  'Profil kaydediliyor': 'Saving profile',
  'Profili Tamamla': 'Complete Profile',
  'Rezervasyon Bilgileri': 'Reservation Information',
  'Rezervasyon için gerekli misafir profilini oluştur': 'Create the guest profile required for reservation',
  'Rezervasyon ve tesis keşfi için misafir erişimi': 'Guest access for reservations and property discovery',
  'Rezervasyon, ödeme ve hesap konuları': 'Reservation, payment, and account topics',
  'Rezervasyonumu kontrol et': 'Check my reservation',
  'Şifre güncellenemedi.': 'Password could not be updated.',
  'Şifre güvenliği': 'Password security',
  'Şifre işlemleri': 'Password actions',
  'Şifre minimum 8 karakter olmalıdır.': 'Password must be at least 8 characters.',
  'Şifre sıfırlama': 'Password reset',
  'Şifre ve şifre tekrar aynı olmalıdır.': 'Password and confirmation must match.',
  'Şifre ve tekrar alanı eşleşmiyor.': 'Password and confirmation do not match.',
  'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.': 'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
  'Şifremi Unuttum': 'Forgot Password',
  'Şifremi unuttum': 'Forgot password',
  'Şifreyi güncelle': 'Update password',
  'Şifreniz başarıyla güncellendi.': 'Your password has been updated successfully.',
  'Sigara içilmeyen oda tercih ediyorum': 'I prefer a non-smoking room',
  'Sırada': 'In queue',
  'Sistem varsayılan hesabı': 'System default account',
  'Süre doldu': 'Expired',
  'T.C. Kimlik': 'Turkish National ID',
  'T.C. Kimlik Numarası': 'Turkish National ID Number',
  'T.C. Kimlik Numarası 11 haneli olmalıdır.': 'Turkish national ID number must be 11 digits.',
  'Talep filtresi ve öncelik': 'Request filter and priority',
  'Tamam, bot desteğiyle devam edelim. Sorunu birkaç kelimeyle yazman yeterli.': 'Sure, let’s continue with bot support. Just describe the issue in a few words.',
  'Telefon doğrulama': 'Phone verification',
  'Telefon doğrulama kodu hatalı.': 'Phone verification code is incorrect.',
  'Telefon doğrulandı': 'Phone verified',
  'Telefon ile': 'By phone',
  'Telefon kodu': 'Phone code',
  'Telefon kodunun süresi doldu. Yeni kod isteyin.': 'The phone code has expired. Please request a new code.',
  'Telefon numarası': 'Phone number',
  'Telefon numarası formatı geçerli değil.': 'Phone number format is invalid.',
  'Telefon numarası giriniz.': 'Please enter a phone number.',
  'Temsilci, hızlı yanıt ve akıllı öneriler': 'Agent support, quick replies, and smart suggestions',
  'Transfer noktası': 'Transfer point',
  'Tüm mesajlar': 'All messages',
  'Türkçe': 'Turkish',
  'Ulaşım kolay': 'Easy access',
  'Uygun temsilci bekleniyor': 'Waiting for an available agent',
  'Uyruk': 'Nationality',
  'Uyruk, fatura bilgileri ve ödeme tercihi zorunludur.': 'Nationality, invoice information, and payment preference are required.',
  'Ülke': 'Country',
  'Ülke, şehir ve adres alanları zorunludur.': 'Country, city, and address are required.',
  'Yabancı Kimlik': 'Foreign ID',
  'Yalnızca destek çalışanı hesabı ile erişilebilir.': 'Accessible only with a support agent account.',
  'Yanıtı Gönder': 'Send Reply',
  'Yardım Merkezi': 'Help Center',
  'Yazmaya hazır': 'Ready to type',
  'Yeni': 'New',
  'Yeni admin yanıtı': 'New admin reply',
  'Yeni Misafir Kaydı Oluştur': 'Create New Guest Account',
  'Yeni şifre minimum 8 karakter olmalıdır.': 'New password must be at least 8 characters.',
  'Yeni şifre ve tekrar alanı eşleşmiyor.': 'New password and confirmation do not match.',
  'Yönetici Girişi': 'Administrator Login',
  'Yönetici girişi': 'Administrator login',
  'Yönetici hesabınız': 'Your administrator account',
  'Yönetici yanıtı': 'Administrator reply',
  'Yönetici yanıtını okundu yap': 'Mark administrator reply as read',
  'Yoğunluk': 'Density',
  'Zayıf': 'Weak',
  'Şehir': 'City',
}

const englishAdditionalPhraseReplacements: Record<string, string> = {
  'adresi için doğrulama maili gönderilebilir.': 'address can receive a verification email.',
  'admin destek merkezi': 'admin support center',
  'admin paneline gönderildi.': 'has been sent to the admin panel.',
  'admin destek paneline iletildi.': 'has been forwarded to the admin support panel.',
  'bağlantılı operasyon notu': 'linked operation note',
  'canlı sohbet destek ekibine iletildi.': 'live chat has been forwarded to the support team.',
  'çevrim içi': 'online',
  'destek ekibine iletildi.': 'has been forwarded to the support team.',
  'Destek talebiniz oluşturuldu. Talep kodu:': 'Your support request has been created. Request code:',
  'durumunda. Giriş yapılamaz.': 'status. Sign-in is not allowed.',
  'E-posta doğrulama kodu gönderildi. Demo kod:': 'Email verification code sent. Demo code:',
  'Form adım adım ilerler; hassas bilgiler yalnızca yetkili sistem akışlarında kullanılır.': 'The form progresses step by step; sensitive data is used only in authorized system flows.',
  'Güvenli çıkış ve cihaz kontrolü': 'Secure logout and device control',
  'Hesabınız sınırsız yasaklandı.': 'Your account has been banned indefinitely.',
  'Hesabınız': 'Your account',
  'ile giriş doğrulama kodu oluşturuldu.': 'sign-in verification code has been generated.',
  'kaldı': 'remaining',
  'kart verisi PCI-DSS uyumlu ödeme sağlayıcı tokenı ile saklanmalıdır.': 'card data should be stored with a PCI-DSS compliant payment provider token.',
  'Kod süresi:': 'Code duration:',
  'Kalan süre:': 'Time remaining:',
  'Kullanıcı adın ve e-postan benzersiz olarak kontrol edilir; şifren güvenli şekilde hashlenerek saklanır.': 'Your username and email are checked for uniqueness; your password is securely stored as a hash.',
  'kullanıcısına atandı': 'assigned to user',
  'kodlu canlı sohbet': 'coded live chat',
  'kodlu destek talebi': 'coded support request',
  'kodlu destek talebi oluşturuldu': 'coded support request has been created',
  'kodlu destek talebinize yönetici yanıt verdi.': 'coded support request has received an administrator reply.',
  'kodlu kaydınıza destek ekibi yanıt verdi.': 'coded record has been answered by the support team.',
  'kodlu talebiniz destek ekibine iletildi.': 'coded request has been forwarded to the support team.',
  'kodu girerek oturumu tamamla.': 'code to complete the session.',
  'Kullanıcı adı, e-posta ve güçlü şifre ile güvenli misafir hesabı oluştur.': 'Create a secure guest account with a username, email, and strong password.',
  'Misafir Paneli > Mesajlar': 'Guest Panel > Messages',
  'Minimum 8 karakter, büyük harf, küçük harf ve rakam içermelidir.': 'Must contain at least 8 characters, uppercase, lowercase, and a number.',
  'Otel uygulaması destek konuları': 'Hotel app support topics',
  'ortalama 4 dakika': 'average 4 minutes',
  'Profilim > Güvenlik Ayarları': 'My Profile > Security Settings',
  'rezervasyon bağlantılı konuşma yönetimi': 'reservation-linked conversation management',
  'Rezervasyon, iptal, ödeme, oda bilgisi, check-in ve hesap güvenliği konularında hızlı rehberlik.': 'Quick guidance on reservations, cancellations, payments, room information, check-in, and account security.',
  'Şifre sıfırlama akışı başarıyla tamamlandı.': 'Password reset flow completed successfully.',
  'Şüpheli girişlerde e-posta ve panel bildirimi gönderilir.': 'Email and in-panel notifications are sent for suspicious sign-ins.',
  'Talep kodu:': 'Request code:',
  'Telefon doğrulama kodu gönderildi. Demo kod:': 'Phone verification code sent. Demo code:',
  'Tüm sistem bildirimleri tek listede, kategori ve okundu durumuyla gösterilir.': 'All system notifications are shown in one list with category and read status.',
  'yöntemiyle gönderilen': 'sent via',
}

const englishPanelExactTextLabels: Record<string, string> = {
  'Acil talepleri yüksek öncelik yap': 'Mark urgent requests as high priority',
  'Aktif Kullanıcı': 'Active Users',
  'Aktif Tesis Oranı': 'Active Property Ratio',
  'Aylık Gelir': 'Monthly Revenue',
  'Aydınlatma': 'Lighting',
  'Başlık': 'Title',
  'Bekleyen Bakım': 'Pending Maintenance',
  'Bekleyen Tahsilat': 'Pending Collection',
  'Bileşen': 'Component',
  'Boş': 'Empty',
  'Bugünkü Çıkışlar': 'Today’s Check-outs',
  'Bugünkü Girişler': 'Today’s Check-ins',
  'Canlı Güvenlik Skoru': 'Live Security Score',
  'Canlı Ön Büro Akışı': 'Live Front Office Flow',
  'Departman': 'Department',
  'Değer': 'Value',
  'Değişim': 'Change',
  'Dengeli': 'Balanced',
  'Durum Kontrolü': 'Status Control',
  'Ekip': 'Team',
  'Ekip notları': 'Team notes',
  'En Popüler Oda Tipleri': 'Most Popular Room Types',
  'Fatura': 'Invoice',
  'Fatura onayı': 'Invoice approval',
  'Filtreye giren tesis kaydı': 'Property records in the filter',
  'Finans raporu dışa aktarıldı': 'Finance report exported',
  'Geçen aya göre %12 artış': '12% increase compared with last month',
  'Gelir Raporları': 'Revenue Reports',
  'Gider Oranı': 'Expense Ratio',
  'Görev Durumu': 'Task Status',
  'Görev Tamamlama Grafiği': 'Task Completion Chart',
  'Görev kaydı yok': 'No task records',
  'Görev ilerleme': 'Task progress',
  'Günlük Gelir Grafikleri': 'Daily Revenue Charts',
  'Günlük İşlem İlerlemesi': 'Daily Process Progress',
  'Günlük kasa': 'Daily cash desk',
  'Günlük Kasa Kapanışı': 'Daily Cash Closing',
  'Güvenlik oturumu sonlandırıldı': 'Security session ended',
  'Haftalık Gelir': 'Weekly Revenue',
  'Haftalık Plan': 'Weekly Plan',
  'Hedef bandın içinde': 'Within the target range',
  'Hedef üstü': 'Above target',
  'Hedefin 7 dk altında': '7 minutes below target',
  'Hesap Güvenliği': 'Account Security',
  'İade talebi inceleniyor': 'Refund request under review',
  'İptal Yönetimi': 'Cancellation Management',
  'İşlem yapılan kayıt': 'Processed record',
  'Kalem': 'Item',
  'Kampanya Performansı': 'Campaign Performance',
  'Kat 4 temizliği onaylandı': 'Floor 4 cleaning approved',
  'Kat Görev Yoğunluğu': 'Floor Task Density',
  'Kimlik İşlemleri': 'Identity Operations',
  'Kimlik doğrulama': 'Identity verification',
  'Kontrol': 'Check',
  'Kontrollü': 'Controlled',
  'Kritik Sistem Uyarıları': 'Critical System Alerts',
  'Kurum hesabı': 'Corporate account',
  'Listelenen Otel': 'Listed Hotels',
  'Malzeme bekliyor': 'Waiting for materials',
  'Merkezi operasyon komuta paneli': 'Central operations command center',
  'Merkezi kurumsal operasyon kontrolü': 'Central enterprise operations control',
  'Misafir Destek Gelen Kutusu': 'Guest Support Inbox',
  'Misafir Puanı': 'Guest Rating',
  'Misafirlerden gelen gerçek destek mesajları': 'Real support messages from guests',
  'Muhasebe Konsolu': 'Accounting Console',
  'Müşteri Notları': 'Guest Notes',
  'Oda hazırlığı': 'Room preparation',
  'Oda müsaitlik kayıtlarından hesaplanır': 'Calculated from room availability records',
  'Oda sayısı': 'Room count',
  'Ortalama Müdahale': 'Average Response',
  'Ortalama Süre': 'Average Duration',
  'Otel Adı': 'Hotel Name',
  'Otel açıklaması': 'Hotel description',
  'Otel sahibine ait oda kayıtlarından hesaplanır': 'Calculated from room records owned by the hotel owner',
  'Otel Sahibi': 'Hotel Owner',
  'Otel talebi': 'Hotel request',
  'Panel içinde ara': 'Search within panel',
  'Pasif yapılabilir kullanıcılar': 'Users that can be deactivated',
  'Performans': 'Performance',
  'Personel Kontrolü': 'Staff Control',
  'Personel Listesi': 'Staff List',
  'Personel Takibi': 'Staff Tracking',
  'Personel Performans Tablosu': 'Staff Performance Table',
  'Planlı teknik işlerin ilerlemesi': 'Progress of scheduled technical work',
  'POS eşleştirme': 'POS reconciliation',
  'Profil görünürlüğü': 'Profile visibility',
  'Rapor': 'Report',
  'Rapor Hazırlığı': 'Report Preparation',
  'Rapor Tipi': 'Report Type',
  'Rapor üretilemedi': 'Report could not be generated',
  'Reddedilirken neden girme alanı olsun.': 'Require a reason when rejecting.',
  'Resepsiyon': 'Reception',
  'Resepsiyon Konsolu': 'Reception Console',
  'Rezervasyon Onayları': 'Reservation Approvals',
  'Rezervasyon yönetimi': 'Reservation management',
  'Saatlik Resepsiyon Yoğunluğu': 'Hourly Reception Density',
  'Sabit': 'Fixed',
  'Sahada': 'On site',
  'Sistem Sağlık Skoru': 'System Health Score',
  'Sistem Yükü': 'System Load',
  'Son güncelleme': 'Last update',
  'Son güvenli giriş kayıtları': 'Recent secure login records',
  'Son Kayıtlar': 'Recent Records',
  'Son yedek 02:10': 'Last backup at 02:10',
  'Sunucu': 'Server',
  'Tam sistem yetkisi': 'Full system permission',
  'Tahsilat Yoğunluğu': 'Collection Density',
  'Teknisyen atandı': 'Technician assigned',
  'Temizlik akışı normal': 'Housekeeping flow is normal',
  'Tesis Deneyimi': 'Property Experience',
  'Tesis gelirini ve memnuniyeti canlı yönet': 'Manage property revenue and satisfaction live',
  'Tesis Konsolu': 'Property Console',
  'Tesis onayı, güvenlik izleme, platform raporları': 'Property approval, security monitoring, platform reports',
  'Tesis performansını canlı yönet': 'Manage property performance live',
  'Tesis yönetimi alanı': 'Property management area',
  'Tesis yönetimi yetkisi': 'Property management permission',
  'Tutar': 'Amount',
  'Uygun Tesis Eşleşmesi': 'Available Property Matches',
  'Veri kaydı bekleniyor': 'Waiting for data record',
  'Veri kaynağı bekleniyor': 'Waiting for data source',
  'Veritabanı': 'Database',
  'VIP İşaretleme': 'VIP Marking',
  'Yayın Durumu': 'Publishing Status',
  'Yeni görev atandı': 'New task assigned',
  'Yetki Kapsamı': 'Permission Scope',
  'Yok': 'None',
  'Yorum Özeti': 'Review Summary',
  'Yoğun vardiya': 'Busy shift',
}

const englishFullCoveragePhraseReplacements: Record<string, string> = {
  'Akşam vardiyası bekleniyor': 'Waiting for the evening shift',
  'Aktif arıza': 'Active issue',
  'Aktif Rezervasyon Kartları': 'Active Reservation Cards',
  'Altyapı ve servis izleme': 'Infrastructure and service monitoring',
  'API isteği başarısız oldu': 'API request failed',
  'Araç hazır': 'Vehicle ready',
  'Arıza, bakım ve müdahale sürelerini yönet': 'Manage issues, maintenance, and response times',
  'Arıza Bildirimleri': 'Issue Notifications',
  'Aylık Gelir Grafikleri': 'Monthly Revenue Charts',
  'Bağlantılı operasyon notu': 'Linked operation note',
  'Bakım ve arıza yetkisi': 'Maintenance and issue permission',
  'Bekleyen işlem': 'Pending action',
  'Bekleyen ödeme': 'Pending payment',
  'Bilinmeyen hata': 'Unknown error',
  'Bilişim': 'IT',
  'Blokajlı Odalar': 'Blocked Rooms',
  'Bölge ve tesis yoğunluk dağılımı': 'Regional and property density distribution',
  'Bugün tamamlanan işler': 'Tasks completed today',
  'Canlı API ölçümü bekleniyor': 'Waiting for live API measurement',
  'Canlı performans verisi yoksa sıfır gösterilir': 'Shows zero when live performance data is not available',
  'Check-in dosyaları': 'Check-in files',
  'Check-in formu tamamlandı': 'Check-in form completed',
  'Check-in hazır': 'Check-in ready',
  'Check-out saati kaçtır?': 'What time is check-out?',
  'Check-out tahsilatı': 'Check-out collection',
  'Çıkış saati': 'Check-out time',
  'Departman bazlı canlı verimlilik ölçümü': 'Live productivity measurement by department',
  'Destek botu hazır': 'Support bot ready',
  'Destek hızlandırıcı cevaplar': 'Support accelerator replies',
  'Destek Merkezi içindeki Destek Talebi Oluştur alanından konu, kategori, öncelik ve açıklama girerek canlı destek ekibine kayıt açabilirsiniz.': 'From Create Support Request in the Support Center, enter a subject, category, priority, and description to open a record with the live support team.',
  'Destek talebi nasıl oluşturulur?': 'How do I create a support request?',
  'Doluluk sınırı yaklaşıyor': 'Occupancy threshold is approaching',
  'E-fatura kuyruğa alındı': 'E-invoice queued',
  'Ek depolama': 'Extra storage',
  'Ek doğrulama kapalı.': 'Additional verification is off.',
  'Ekip Mesajları': 'Team Messages',
  'Ekip ve görev bazlı ölçüm': 'Team and task-based measurement',
  'Ekip ve yönetim bildirimleri': 'Team and management notifications',
  'Erken giriş talebi otel müsaitliğine göre mesajlaşma ekranından iletilebilir.': 'Early check-in requests can be sent from the messaging screen based on hotel availability.',
  'Fatura ve tahsilatları denetle': 'Audit invoices and collections',
  'Favori otellerimi nerede görebilirim?': 'Where can I see my favorite hotels?',
  'Favoriler bölümünde Favori Oteller alanı altında kaydettiğiniz tesisleri görebilir ve tek tıkla rezervasyon akışına geçebilirsiniz.': 'In Favorites, under Favorite Hotels, you can view saved properties and start the reservation flow with one click.',
  'Finans akışını, fatura ve tahsilatları denetle': 'Audit financial flow, invoices, and collections',
  'Finans öncelik kuyruğu': 'Finance priority queue',
  'Gelir ve doluluk bazlı oda performansı': 'Room performance by revenue and occupancy',
  'Gelir-gider operasyon özeti': 'Income-expense operation summary',
  'Gelir-gider, fatura, ödeme takibi, vergi raporları ve günlük kasa işlemleri için finans merkezi.': 'A finance center for income-expense tracking, invoices, payment follow-up, tax reports, and daily cash desk operations.',
  'Genel Bakım': 'General Maintenance',
  'Genel Bakış': 'Overview',
  'Gerçek Zamanlı Sistem Yükü': 'Real-Time System Load',
  'Gerçek doluluk oranı': 'Real occupancy rate',
  'Giriş, çıkış ve misafir akışını hızlandır': 'Accelerate check-in, check-out, and guest flow',
  'Giriş saati': 'Check-in time',
  'Giriş ve çıkış bankosu trafiği': 'Check-in and check-out desk traffic',
  'Gün içi iş akışı performansı': 'In-day workflow performance',
  'Günlük Konaklayanlar': 'Daily In-House Guests',
  'Günlük görevleri ve ekip iletişimini takip et': 'Track daily tasks and team communication',
  'Güçlü': 'Strong',
  'Güvenlik ve altyapı olayları': 'Security and infrastructure events',
  'Güvenlik bildirimleri': 'Security notifications',
  'Hafta Sonu Fiyatları': 'Weekend Prices',
  'Haftalık Gelir Chart': 'Weekly Revenue Chart',
  'Haftalık hedef üstünde': 'Above weekly target',
  'Haftalık plan içinde': 'Within the weekly plan',
  'Hata kayıtları': 'Error logs',
  'Hedefin altında': 'Below target',
  'Kahvaltı bilgisi oda kartında ayrı olarak gösterilir. Rezervasyon sırasında kahvaltı tercihini değiştirebilirsiniz.': 'Breakfast information is shown separately on the room card. You can change your breakfast preference during reservation.',
  'Kahvaltı dahil mi?': 'Is breakfast included?',
  'Kahvaltı ekibi bilgilendirildi': 'Breakfast team has been informed',
  'Kahvaltı puanı yükseldi': 'Breakfast score increased',
  'Kapalı Talep': 'Closed Request',
  'Kapanan Arızalar': 'Closed Issues',
  'Karlılık Analizi': 'Profitability Analysis',
  'Kartlı kilit': 'Card lock',
  'Kasa devri onaylandı': 'Cash handover approved',
  'Kasa mutabakatı tamam': 'Cash reconciliation completed',
  'Kasa Mutabakatı': 'Cash Reconciliation',
  'Kat hizmetleri görevlendirildi': 'Housekeeping assigned',
  'Kaydettiğim odaları nereden görebilirim?': 'Where can I see my saved rooms?',
  'Kimlik taraması doğrulandı': 'ID scan verified',
  'Kişisel vardiya hedefleri': 'Personal shift targets',
  'Klima arızası': 'Air conditioning issue',
  'Kod göndermek için geçerli bir e-posta giriniz.': 'Please enter a valid email to send the code.',
  'Kod göndermek için geçerli bir telefon numarası giriniz.': 'Please enter a valid phone number to send the code.',
  'Konaklama deneyimi alanı': 'Stay experience area',
  'Konaklama, hizmet ve restoran kırılımı': 'Breakdown of accommodation, service, and restaurant revenue',
  'Kredi kartı, sanal POS ve tesiste ödeme seçenekleri desteklenir. Kayıtlı kartlar maskeli ve güvenli şekilde görüntülenir.': 'Credit card, virtual POS, and pay-at-property options are supported. Saved cards are displayed securely and masked.',
  'Kritik olayları e-posta kanalına gönder': 'Send critical events through email',
  'Kullanıcılar': 'Users',
  'Küvet ve ayrı duş alanı': 'Bathtub and separate shower area',
  'Küvetli premium banyo': 'Premium bathroom with bathtub',
  'Malzeme talebi onaylandı': 'Material request approved',
  'Mekanik': 'Mechanical',
  'Menüyü daralt': 'Collapse menu',
  'Menüyü genişlet': 'Expand menu',
  'Merhaba, canlı destek botuna hoş geldiniz. Rezervasyon, ödeme, otel mesajları veya hesap güvenliği için kısa cevaplar verebilirim.': 'Hello, welcome to the live support bot. I can provide quick answers about reservations, payments, hotel messages, or account security.',
  'Merhaba, talebinizi inceledik. Gerekli kontrol tamamlandı ve size çözüm adımlarını iletiyoruz.': 'Hello, we reviewed your request. The required check is complete and we are sharing the solution steps with you.',
  'Merhaba, talebinizi rezervasyon kaydınızla eşleştirdik ve ilgili ekibe aktardık.': 'Hello, we matched your request with your reservation record and forwarded it to the relevant team.',
  'Misafir akışını hızlandır': 'Accelerate guest flow',
  'Misafir destek mesajları ve talep güncellemeleri': 'Guest support messages and request updates',
  'Müdahale öncelik listesi': 'Response priority list',
  'Müdahale Süresi Grafiği': 'Response Time Chart',
  'Müsait, dolu ve hazırlıkta odalar': 'Available, occupied, and preparing rooms',
  'Müsaitlik varsa otel sahibi veya resepsiyon ekibi rezervasyon bağlantılı mesaj üzerinden oda değişikliği talebinizi değerlendirebilir.': 'If available, the hotel owner or reception team can evaluate your room change request through the reservation-linked message.',
  'Oda 504 arızası kapandı': 'Room 504 issue closed',
  'Oda 512 hazırlık': 'Room 512 preparation',
  'Oda Durumu Haritası': 'Room Status Map',
  'Oda kartı yenilendi': 'Room card renewed',
  'Oda teknik durumu, bakım takvimi, görev atamaları ve teknik performans raporları tek panelde.': 'Room technical status, maintenance calendar, task assignments, and technical performance reports in one panel.',
  'Ödeme bekliyor': 'Payment pending',
  'Ödeme Geçmişi': 'Payment History',
  'Ödeme kanalı ve saat dağılımı': 'Payment channel and time distribution',
  'Ödeme ve müsaitlik kontrolü tamamlandığında rezervasyon kodu oluşturulur. Otel onayı gereken durumlarda bildirim merkezinden güncelleme alırsınız.': 'A reservation code is created once payment and availability checks are complete. If hotel approval is required, you receive updates from the notification center.',
  'Ödeme yöntemi tercihi': 'Payment method preference',
  'Ön büro operasyon kapanışı': 'Front office operation closing',
  'Ön büro operasyon yetkisi': 'Front office operation permission',
  'Ön Büro operasyon kapanışı': 'Front office operation closing',
  'Öncelikli operasyon takibi': 'Priority operation tracking',
  'Otele ulaşamıyorum': 'I cannot reach the hotel',
  'Otelle nasıl mesajlaşırım?': 'How do I message the hotel?',
  'Otel detay sayfasındaki mesaj kısayolunu veya Misafir Paneli > Mesajlar bölümünü kullanarak ilgili otele özel konuşma başlatabilirsiniz.': 'You can start a hotel-specific conversation using the message shortcut on the hotel detail page or the Guest Panel > Messages section.',
  'Otel onay bildirimleri': 'Hotel approval notifications',
  'Otel sahibi mesajı açınca okundu bilgisi ve yanıtlar konuşmaya düşer.': 'When the hotel owner opens the message, read status and replies appear in the conversation.',
  'Otel sahibi veya resepsiyon ekibi': 'hotel owner or reception team',
  'Otel teknik durumu': 'Hotel technical status',
  'Panel içinde okunmamış bildirim üret': 'Create unread in-panel notifications',
  'Pasaport numarası alanı': 'Passport number field',
  'Planlı bakım başlatıldı': 'Scheduled maintenance started',
  'Premium oda': 'Premium room',
  'Profilim > Ödeme Yöntemleri bölümünden yeni kart ekleyebilir ve tercih edilen ödeme yöntemini seçebilirsiniz. Kart numaraları arayüzde maskeli gösterilir.': 'From My Profile > Payment Methods, you can add a new card and choose the preferred payment method. Card numbers are masked in the interface.',
  'Raporlandı': 'Reported',
  'Resepsiyon öncelik sırası': 'Reception priority queue',
  'Rezervasyon, oda fiyatı, kampanya ve personel performansını iş odaklı görünümle takip et.': 'Track reservations, room prices, campaigns, and staff performance with a business-focused view.',
  'Rezervasyon, ödeme, otel mesajları veya hesap güvenliği başlıklarından biriyle ilerleyebiliriz.': 'We can continue with reservation, payment, hotel messages, or account security topics.',
  'Rezervasyon özetindeki kupon alanına kodu yazdığınızda indirim tutarı toplam fiyat içinde ayrı satır olarak hesaplanır.': 'When you enter the code in the coupon field of the reservation summary, the discount is calculated as a separate line in the total price.',
  'Rezervasyonumu nasıl iptal ederim?': 'How do I cancel my reservation?',
  'Rezervasyonlarım bölümünde ilgili karttaki iptal işlemi üzerinden talep oluşturabilirsiniz. İade koşulları otelin iptal politikasına göre hesaplanır.': 'In My Reservations, you can create a request through the cancellation action on the relevant card. Refund terms are calculated according to the hotel cancellation policy.',
  'Sana hızlıca yardımcı olabilmem için konuyu seç.': 'Choose a topic so I can help you quickly.',
  'Saat ve oda tipine göre talep dağılımı': 'Demand distribution by time and room type',
  'Saatlik teknik servis performansı': 'Hourly technical service performance',
  'Servis çağrıları': 'Service calls',
  'Son bakım ve görev hareketleri': 'Recent maintenance and task activity',
  'Son finans hareketleri': 'Recent financial transactions',
  'Son resepsiyon işlemleri': 'Recent reception actions',
  'Sözleşme ödeme günü': 'Contract payment day',
  'Spa Alanı': 'Spa Area',
  'Spa deneyimi olumlu yorum aldı': 'Spa experience received positive feedback',
  'Standart check-in saati 14:00 sonrasıdır. Erken giriş talebi otel müsaitliğine göre mesajlaşma ekranından iletilebilir.': 'Standard check-in time is after 14:00. Early check-in requests can be sent from the messaging screen depending on hotel availability.',
  'Standart çıkış saati çoğu tesiste 12:00 olarak uygulanır. Geç çıkış talebi için rezervasyon bağlantılı otel sohbetini kullanabilirsiniz.': 'Standard check-out time is 12:00 at most properties. For late check-out requests, use the reservation-linked hotel chat.',
  'Standart giriş ve çıkış saatleri otel politikalarında yer alır. Erken giriş veya geç çıkış taleplerini otelle mesajlaşma üzerinden iletebilirsin.': 'Standard check-in and check-out times are listed in hotel policies. You can send early check-in or late check-out requests through hotel messaging.',
  'Şifre değiştirme, iki adımlı doğrulama, aktif cihazlar ve oturum geçmişi Profilim > Güvenlik Ayarları altında yönetilir. Şüpheli giriş bildirimi açık olduğunda yeni cihaz olayları bildirim üretir.': 'Password changes, two-factor authentication, active devices, and session history are managed under My Profile > Security Settings. When suspicious login alerts are enabled, new device events create notifications.',
  'Tarih, kişi sayısı ve oda seçimlerini rezervasyon akışından düzenleyebilirsin. Müsaitlik kontrolü seçtiğin otele ve odaya göre yeniden hesaplanır. Onay sonrası rezervasyon kodu Rezervasyonlarım alanında görünür.': 'You can edit dates, guest count, and room selections from the reservation flow. Availability is recalculated based on the selected hotel and room. After confirmation, the reservation code appears in My Reservations.',
  'Teknik Aktivite Logları': 'Technical Activity Logs',
  'Temizlik ve servis önceliği': 'Housekeeping and service priority',
  'Tesis arama, rezervasyon takibi ve favori konaklama planların için güvenli erişim.': 'Secure access for property search, reservation tracking, and favorite stay plans.',
  'Tüm kritik notlar okundu': 'All critical notes read',
  'Tüm oteller, kullanıcılar, finans ve sistem raporları için merkezi kontrol.': 'Central control for all hotels, users, finance, and system reports.',
  'Tüm tesislerin birleşik gelir ivmesi': 'Combined revenue momentum of all properties',
  'Vardiya bilgileri, günlük işler, iç bildirimler ve izin talepleri tek çalışma alanında.': 'Shift information, daily tasks, internal notifications, and leave requests in one workspace.',
  'Vardiya planı güncellendi': 'Shift plan updated',
  'Vergi karşılığı': 'Tax provision',
  'VIP karşılama notu eklendi': 'VIP welcome note added',
  'Yaklaşan yoğun girişler': 'Upcoming high-volume arrivals',
  'Yanıtlanan Talepler': 'Answered Requests',
  'Yeni destek kullanıcısı için kullanıcı adı ve şifre zorunludur.': 'Username and password are required for the new support user.',
  'Yeni kupon önerildi': 'New coupon suggested',
  'Yeni teknik talep açıldı': 'New technical request opened',
  'Yeni rezervasyon, iptal ve yaklaşan konaklama olayları': 'New reservation, cancellation, and upcoming stay events',
  'Yönetici avatarı': 'Administrator avatar',
  'Yükseliyor': 'Rising',
  'Yüksek sezonda oda bazlı fiyat artırımı aktif': 'Room-based price increase is active in high season',
  'Ödeme ekran görüntüsü ekle': 'Attach payment screenshot',
  'Ödeme yöntemimi nasıl eklerim?': 'How do I add my payment method?',
  'Ödeme yardımı istiyorum': 'I need payment help',
}

const englishLastPassExactTextLabels: Record<string, string> = {
  'Aç': 'Enable',
  'Açık İş': 'Open Task',
  'Aktif hesap sayısı': 'Active account count',
  'Aktif rezervasyon kayıtları': 'Active reservation records',
  'Aktif rezervasyon oranı': 'Active reservation ratio',
  'Aktif rezervasyon sayısı': 'Active reservation count',
  'Aktif rezervasyonların tesis kırılımı': 'Property breakdown of active reservations',
  'Aktif rezervasyonların toplam rezervasyona oranı': 'Ratio of active reservations to total reservations',
  'Aktif rezervasyon / oda oranı': 'Active reservation / room ratio',
  'Aktif yönetici oturumu ve bildirim kayıtları': 'Active administrator session and notification records',
  'Analiz Başlığı': 'Analysis Title',
  'Analiz Kapsamı': 'Analysis Scope',
  'API Çağrısı': 'API Call',
  'Askıya alınan otel sayısı': 'Suspended hotel count',
  'Askıya/kaldırma nedeni': 'Suspension/removal reason',
  'Bağlantı': 'Connection',
  'Bağlantı bekleniyor': 'Waiting for connection',
  'Başarı Oranı': 'Success Rate',
  'Başarılı istek oranı': 'Successful request rate',
  'Başarısız': 'Failed',
  'Başarısız İstek': 'Failed Request',
  'Başarısız İşlem': 'Failed Action',
  'Başarısız veya riskli olaylar': 'Failed or risky events',
  'Bildirim İzleme': 'Notification Monitoring',
  'Bildirim Yoğunluğu': 'Notification Density',
  'Boş oda sayısı': 'Vacant room count',
  'Bu oturumda çağrılan ana API kayıtları': 'Main API records called in this session',
  'Çalışma Durumu': 'Operating Status',
  'Destek kuyruğunu önceliklendir': 'Prioritize the support queue',
  'Destek talebi yoğunluğu': 'Support request density',
  'Destek Yoğunluğu': 'Support Density',
  'Dönem': 'Period',
  'Düzenle|Durdur': 'Edit|Pause',
  'Düşük doluluk için önerilebilir oda sayısı': 'Recommended room count for low occupancy',
  'Favori kullanıcılar için kampanya bildirimi önerilir': 'Campaign notification is recommended for favorite users',
  'Favoriye alınan tesis sinyali': 'Favorited property signal',
  'Fiyat, oda ve kampanya düzenleme otel sahibindedir': 'Price, room, and campaign editing belongs to the hotel owner',
  'Fiyat Yönetimi': 'Price Management',
  'Geçmiş konaklama kayıtları': 'Past stay records',
  'Geçmiş rezervasyon kayıtları': 'Past reservation records',
  'Geçmiş rezervasyon sayısı': 'Past reservation count',
  'Gelir özeti ve dönemsel rapor hatırlatmaları': 'Revenue summary and periodic report reminders',
  'Gelir üreten rezervasyon kaydı': 'Revenue-generating reservation record',
  'Görsel Yönetimi': 'Visual Management',
  'Görev İlerleme Barı': 'Task Progress Bar',
  'Güvenlik Sağlığı': 'Security Health',
  'Hata cevabı kayıtları': 'Error response records',
  'Hata Kayıtları': 'Error Logs',
  'Henüz ödeme kaydı bulunmuyor.': 'No payment record exists yet.',
  'Henüz performans kaydı bulunmuyor.': 'No performance record exists yet.',
  'Henüz sistem kaydı bulunmuyor.': 'No system record exists yet.',
  'Henüz tahmin oluşturacak kayıt bulunmuyor.': 'No records exist to generate a forecast yet.',
  'İç Mesaj': 'Internal Message',
  'İç Mesajlaşma Paneli': 'Internal Messaging Panel',
  'İhlal': 'Violation',
  'İhlal kaydı': 'Violation record',
  'İhlal Kaydı': 'Violation Record',
  'İndirim Kuralları': 'Discount Rules',
  'İptal edilen rezervasyonlar': 'Cancelled reservations',
  'İptal rezervasyon sayısı': 'Cancelled reservation count',
  'İptal Riski': 'Cancellation Risk',
  'İzin talebi değerlendiriliyor': 'Leave request is being reviewed',
  'İzin Talepleri': 'Leave Requests',
  'İzlendi': 'Monitored',
  'Kaldırma kayıtları': 'Removal records',
  'Kalıcı rezervasyon kayıtları': 'Persistent reservation records',
  'Kampanya Adayı': 'Campaign Candidate',
  'Kampanya Kullanımı': 'Campaign Usage',
  'Kampanya Önerileri': 'Campaign Recommendations',
  'Kampanya önerildi': 'Campaign recommended',
  'Kampanyalı rezervasyon verisinden hesaplanır': 'Calculated from promotional reservation data',
  'Kapatılmamış destek talepleri': 'Unclosed support requests',
  'Kapandı': 'Closed',
  'Kayıtlı otel toplamı': 'Saved hotel total',
  'Kayıtlı kullanıcı toplamı': 'Saved user total',
  'Kayıtlı veri bulunamadı': 'No saved data found',
  'Kullanıcı Adı': 'Username',
  'Kullanıcı rolleri, son giriş bilgileri ve hesap durumları': 'User roles, last login information, and account statuses',
  'Kullanıcı Sayısı': 'User Count',
  'Mevcut akışı izle': 'Monitor the current flow',
  'Mevcut hesap kayıtları': 'Current account records',
  'Mevcut tarayıcı': 'Current browser',
  'Mevcut tarayıcı oturumu aktif': 'Current browser session active',
  'Mesaj Yoğunluğu': 'Message Density',
  'Mesaj Yükü': 'Message Load',
  'Misafir Yorumları': 'Guest Reviews',
  'Misafir/otel mesajları': 'Guest/hotel messages',
  'Moderasyon kayıtları': 'Moderation records',
  'Oda Sayısı': 'Room Count',
  'Oda tipi sayısı': 'Room type count',
  'Oda, fiyat, kampanya ve tesis operasyonları': 'Room, price, campaign, and property operations',
  'Okunmamış mesaj sayısı': 'Unread message count',
  'Okunmamış mesaj yoğunluğu': 'Unread message density',
  'Otel adı': 'Hotel name',
  'Otel API bağlantısı': 'Hotel API connection',
  'Otel bazlı yoğunluk kapsamı': 'Hotel-based density scope',
  'Otel Kapsamı': 'Hotel Scope',
  'Otel sahibine oda müsaitlik kontrolü önerilir': 'Room availability check is recommended for the hotel owner',
  'Otel sahibinin yalnızca kendi oteline ait gerçek kayıtları': 'Only real records belonging to the hotel owner’s own hotel',
  'Otel sahibi oda kayıtları': 'Hotel owner room records',
  'Oteli Görüntüle|Askıya Al|Sistemden Kaldır': 'View Hotel|Suspend|Remove from System',
  'Oteli Görüntüle|Geri Aktifleştir|Sistemden Kaldır': 'View Hotel|Reactivate|Remove from System',
  'Oteli Görüntüle|Geri Getir|Kalıcı Sil': 'View Hotel|Restore|Permanently Delete',
  'Oturum İzleme': 'Session Monitoring',
  'Ölçüm': 'Metric',
  'Ölçülmedi': 'Not measured',
  'Öneri': 'Recommendation',
  'Öneri Var': 'Recommendation Available',
  'Personel localStorage kayıtları': 'Staff localStorage records',
  'Platform onayı, güvenlik, destek ve rapor izleme': 'Platform approval, security, support, and report monitoring',
  'Planlı': 'Scheduled',
  'Rezervasyon Doluluğu': 'Reservation Occupancy',
  'Rezervasyon kayıtları': 'Reservation records',
  'Rezervasyon kayıtlarından hesaplandı': 'Calculated from reservation records',
  'Rezervasyon tarihi bulunan yoğunluk sinyalleri': 'Density signals with reservation dates',
  'Rezervasyon ve favori verisi arttıkça tahmin güçlenir': 'Forecast accuracy improves as reservation and favorite data grows',
  'Rezervasyon Yönetimi': 'Reservation Management',
  'Riskli güvenlik kayıtları': 'Risky security records',
  'Sağlıklı': 'Healthy',
  'Sınırlı': 'Limited',
  'Sistem olaylarından üretilen kayıtlar': 'Records generated from system events',
  'Sistem Sağlığı': 'System Health',
  'Sistem sağlık durumu': 'System health status',
  'Sistemde kayıtlı gerçek otel sayısı': 'Real hotel count saved in the system',
  'Statü': 'Status',
  'Sunucu, API, veri tabanı ve hata kayıtları': 'Server, API, database, and error records',
  'Şifre Değişiklikleri': 'Password Changes',
  'Şimdi': 'Now',
  'Şüpheli işlem, oturum ve yetki uyarıları': 'Suspicious action, session, and permission alerts',
  'Tahmini Artış': 'Estimated Increase',
  'Tahmin için kullanılan otel sayısı': 'Hotel count used for forecasting',
  'Tanımlı yetki bulunmuyor': 'No defined permissions found',
  'Tarayıcı oturumu': 'Browser session',
  'Tarih aralığına göre rezervasyon kaydı': 'Reservation records by date range',
  'Tarih bazlı kapasite takibi önerilir': 'Date-based capacity tracking is recommended',
  'Toplam kullanıcı sayısı': 'Total user count',
  'Toplam oda sayısı': 'Total room count',
  'Toplam otel sayısı': 'Total hotel count',
  'Toplam rezervasyon sayısı': 'Total reservation count',
  'Üretilecek öneri satırı': 'Recommendation rows to generate',
  'Veri tabanı': 'Database',
  'Veri Tabanı': 'Database',
  'Veri tabanı bağlantısı bekleniyor': 'Waiting for database connection',
  'Veri tabanı bağlantısı henüz ölçülmedi': 'Database connection has not been measured yet',
  'Yapay zeka görünümü mevcut rezervasyon, favori ve destek verilerinden tahmin üretir': 'The AI view generates forecasts from current reservation, favorite, and support data',
  'Yayında olan tesisler': 'Published properties',
  'Yetki dışı işlem': 'Unauthorized action',
  'Yetki ihlali olarak işaretlenen olaylar': 'Events marked as permission violations',
  'Yetki Kısıtı': 'Permission Restriction',
  'Yük Var': 'Load Present',
  'Yüksek riskli güvenlik kayıtları': 'High-risk security records',
}

const englishSystemWordFallbacks: Record<string, string> = {
  'Acil': 'Urgent',
  'aktif': 'active',
  'Aktif': 'Active',
  'Alışveriş': 'Shopping',
  'Araç': 'Vehicle',
  'arıza': 'issue',
  'Arıza': 'Issue',
  'Atandı': 'Assigned',
  'Başarılı': 'Successful',
  'Bekliyor': 'Waiting',
  'bekliyor': 'waiting',
  'bildirim': 'notification',
  'Bildirim': 'Notification',
  'Bugün': 'Today',
  'bugün': 'today',
  'çıkış': 'check-out',
  'Çıkış': 'Check-out',
  'Dolu': 'Occupied',
  'dolu': 'occupied',
  'Doğrulama': 'Verification',
  'doğrulama': 'verification',
  'Eklendi': 'Added',
  'eklendi': 'added',
  'Geç': 'Late',
  'geç': 'late',
  'Gelen': 'Incoming',
  'gelen': 'incoming',
  'giriş': 'check-in',
  'Giriş': 'Check-in',
  'Görev': 'Task',
  'görev': 'task',
  'gün': 'day',
  'Gün': 'Day',
  'Günlük': 'Daily',
  'günlük': 'daily',
  'Güvenli': 'Secure',
  'güvenli': 'secure',
  'Hazır': 'Ready',
  'hazır': 'ready',
  'İade': 'Refund',
  'iade': 'refund',
  'İleri': 'Next',
  'iş': 'work',
  'İş': 'Work',
  'İşlem': 'Action',
  'işlem': 'action',
  'kapatıldı': 'closed',
  'Kapatıldı': 'Closed',
  'kaydı': 'record',
  'Kaydı': 'Record',
  'Kayıtlı': 'Saved',
  'kayıtlı': 'saved',
  'kullanıcı': 'user',
  'Kullanıcı': 'User',
  'Müsaitlik': 'Availability',
  'müsaitlik': 'availability',
  'Ödeme': 'Payment',
  'ödeme': 'payment',
  'Öncelikli': 'Priority',
  'öncelikli': 'priority',
  'Rapor': 'Report',
  'rapor': 'report',
  'Seçili': 'Selected',
  'seçili': 'selected',
  'Servis': 'Service',
  'servis': 'service',
  'Son': 'Last',
  'son': 'last',
  'Talep': 'Request',
  'talep': 'request',
  'Tamamlandı': 'Completed',
  'tamamlandı': 'completed',
  'Tarih': 'Date',
  'tarih': 'date',
  'Teknik': 'Technical',
  'teknik': 'technical',
  'Temizlik': 'Housekeeping',
  'temizlik': 'housekeeping',
  'Yanıt': 'Reply',
  'yanıt': 'reply',
  'Yarın': 'Tomorrow',
  'yarın': 'tomorrow',
  'Yeni': 'New',
  'yeni': 'new',
  'Yükleniyor': 'Loading',
  'yükleniyor': 'loading',
  'Ücretsiz': 'Free',
  'ücretsiz': 'free',
}

const englishPhraseReplacements: Record<string, string> = {
  'Açık destek talepleri': 'Open support requests',
  'Açık talep': 'Open request',
  'Ad, soyad ve T.C. Kimlik No zorunludur.': 'First name, last name, and national ID are required.',
  'Aktif cihaz kaydı kalmadı.': 'No active device records remain.',
  'Aktif oturum': 'Active session',
  'Aktif oturum kayıtlarından hesaplanır': 'Calculated from active session records',
  'Aktif rezervasyon': 'Active reservation',
  'Aktif satış aksiyonları': 'Active sales actions',
  'Aktif tesis yayında': 'active properties are published',
  'Anlık sohbet': 'Live chat',
  'Aramana göre listelenen gerçek tesisler': 'Real properties listed by your search',
  'Aylık gelir': 'Monthly revenue',
  'Bağlı otel': 'Assigned hotel',
  'Başarılı kayıt': 'Successful record',
  'Bekleyen ödeme': 'Pending payment',
  'Bildirimler aktif': 'Notifications active',
  'Bildirimler kapalı': 'Notifications off',
  'Bir otel seçip mesaj başlatabilirsin.': 'You can select a hotel and start a conversation.',
  'Bugün takip edilmesi gereken onaylı konaklamalar': 'Confirmed stays that need attention today',
  'Bu destek kullanıcısı zaten var.': 'This support user already exists.',
  'Bu tesis': 'This property',
  'Canlı destek ekibiyle anlık yazışma': 'Chat instantly with the live support team',
  'Canlı destek görüşmesi': 'Live support conversation',
  'Canlı destek mesajı yaz': 'Write a live support message',
  'Canlı destek için ilk mesajınızı yazın.': 'Write your first message for live support.',
  'Canlı sohbet yanıtı yaz': 'Write a live chat reply',
  'Cevaplanan': 'Answered',
  'Check-in / Check-out': 'Check-in / Check-out',
  'Çıkış Yap': 'Sign Out',
  'Destek ekibi şu anda offline': 'The support team is currently offline',
  'Destek kullanıcısı bulunamadı veya şifre hatalı.': 'Support user not found or password is incorrect.',
  'Destek talebi oluşturuldu': 'Support request created',
  'Destek talebiniz oluşturuldu': 'Your support request has been created',
  'Destek talebiniz yanıtlandı': 'Your support request has been answered',
  'Destek yanıtlarını okundu yap': 'Mark support replies as read',
  'Destek çalışanı oluşturuldu.': 'Support agent created.',
  'Destek çalışanıyla anlık yazışma': 'Instant chat with a support agent',
  'Destek çalışanı hesabını oluşturun.': 'Create a support agent account.',
  'Destek çalışanı için kullanıcı adı ve şifre zorunludur.': 'Username and password are required for the support agent.',
  'Detay görüntüleme': 'Detail view',
  'Doğrulama maili gönderildi. Gelen kutunu kontrol edebilirsin.': 'Verification email sent. You can check your inbox.',
  'Doluluk oranı': 'Occupancy rate',
  'E-posta ve telefon doğrulaması tamamlanarak misafir hesabı oluşturuldu.': 'Guest account created after email and phone verification.',
  'En düşük fiyat': 'Lowest price',
  'En yüksek fiyat': 'Highest price',
  'En yüksek puan': 'Highest rating',
  'En popüler': 'Most popular',
  'Favori listenizde güncellendi.': 'has been updated in your favorites.',
  'Favori tesislerinin ortalama puanı': 'Average rating of your favorite properties',
  'Fatura ve Ödeme Tercihi': 'Invoice and Payment Preference',
  'Gece için': 'for nights',
  'Geçerli session': 'Valid session',
  'Geçmiş Konaklamalar': 'Past Stays',
  'Gecelik oda fiyatı': 'Nightly room price',
  'Gelen kod': 'Received code',
  'Gerçek destek kayıtlarından hesaplandı': 'Calculated from real support records',
  'Gerçek Veri Grafiği': 'Real Data Chart',
  'Gerçek zamanlı sohbet ekranı': 'Real-time chat screen',
  'Giriş tarihi': 'Check-in date',
  'Girişlerde ikinci doğrulama istenir.': 'A second verification step is required during login.',
  'Görev / Rol': 'Task / Role',
  'Görüntülenecek destek görüşmesi yok.': 'No support conversation to display.',
  'Güvenli Saklama Notu': 'Secure Storage Note',
  'Güvenlik ayarlarından şifre güncellemesi yapıldı.': 'Password was updated from security settings.',
  'Güvenlik merkezi': 'Security center',
  'Günlük gelir': 'Daily revenue',
  'Haftalık gelir': 'Weekly revenue',
  'Hassas alanlar maskeli gösterilir': 'Sensitive fields are shown masked',
  'Havalimanı transferi': 'Airport transfer',
  'Hesap yalnızca şifre ile korunur.': 'The account is protected only by password.',
  'İade edilen ödeme': 'Refunded payment',
  'İlk Hesabı Oluştur': 'Create First Account',
  'İlk destek çalışanı hesabını oluşturun.': 'Create the first support agent account.',
  'İndirim kodu nasıl kullanılır?': 'How do I use a discount code?',
  'İşlem yapılan kayıt': 'Processed record',
  'Kart bilgileri arayüzde maskeli gösterilir': 'Card information is shown masked in the interface',
  'Kaydedilen odalar listeniz kalıcı olarak güncellendi.': 'Your saved rooms list has been permanently updated.',
  'Konaklama sırasında sunulan servisler': 'Services offered during the stay',
  'Konu ve açıklama alanı zorunludur.': 'Subject and description are required.',
  'Kullanıcı adı, şifre ve 11 haneli T.C. Kimlik No zorunludur.': 'Username, password, and 11-digit national ID are required.',
  'Kullanıcı adı ve T.C. Kimlik No benzersiz olmalıdır': 'Username and national ID must be unique',
  'Kullanıcı adı ve şifre zorunludur.': 'Username and password are required.',
  'Lütfen gelen doğrulama kodunu gir.': 'Please enter the verification code you received.',
  'Maskeli kart görüntüleme ve tercih edilen ödeme seçimi': 'Masked card display and preferred payment selection',
  'Mevcut tarayıcı oturumu aktif': 'Current browser session is active',
  'Misafir destek mesajları': 'Guest support messages',
  'Misafir hesabı doğrulandı': 'Guest account verified',
  'Misafir paneli': 'Guest panel',
  'Misafirlerden gelen gerçek destek mesajları': 'Real support messages from guests',
  'Müsait oda': 'Available rooms',
  'Müsaitlik kontrolü': 'Availability check',
  'Oda kartında ayrı olarak gösterilir': 'shown separately on the room card',
  'Oda kaydedildi': 'Room saved',
  'Odayı Ekle': 'Add Room',
  'Odayı Kaydet': 'Save Room',
  'Odayı kaydet': 'Save room',
  'Odayı kaydedilenlerden çıkar': 'Remove room from saved list',
  'Otel detay sayfasından mesaj gönderebilirsiniz.': 'You can send a message from the hotel detail page.',
  'Otel durumu güncellendi': 'Hotel status updated',
  'Otel ile ilgili sorularınız için': 'For hotel-related questions',
  'Otel listelerinden hesaplandı': 'Calculated from hotel lists',
  'Otel mesajları, canlı destek ve destek talepleri tek merkezde ayrı akışlarla yönetilir.': 'Hotel messages, live support, and support requests are managed in one center with separate workflows.',
  'Otel onay bildirimleri': 'Hotel approval notifications',
  'Otel seçimi tamamlandı': 'Hotel selection completed',
  'Otel sohbeti': 'Hotel chat',
  'Otele mesaj gönderildi': 'Message sent to hotel',
  'Otellere dön': 'Back to hotels',
  'Otelin iptal politikasına göre hesaplanır.': 'Calculated according to the hotel cancellation policy.',
  'Panel içinde ara': 'Search within panel',
  'Pasaport bilgileri': 'Passport information',
  'Personel kaydedildi ve Aktif Personel tablosuna eklendi.': 'Staff member saved and added to the Active Staff table.',
  'Premium konaklama deneyimi': 'Premium stay experience',
  'Premium otel deneyimi': 'Premium hotel experience',
  'Premium rezervasyon deneyimi': 'Premium reservation experience',
  'Profil tamamlanmadı': 'Profile incomplete',
  'Rezervasyon bildirimleri': 'Reservation notifications',
  'Rezervasyon iptali için': 'For reservation cancellation',
  'Rezervasyon onayı ne zaman gelir?': 'When does reservation confirmation arrive?',
  'Rezervasyon yaptığın tesisler': 'Properties you booked',
  'Rezervasyon özetindeki kupon alanına': 'In the coupon field of the reservation summary',
  'Rezervasyonunuz onaylandı': 'Your reservation has been confirmed',
  'Rezervasyonunuz yaklaşıyor': 'Your reservation is approaching',
  'Risk uyarıları pasif durumda.': 'Risk alerts are inactive.',
  'Sadece destek çalışanı hesabı ile erişilebilir.': 'Accessible only with a support agent account.',
  'Sayfa yenilense bile': 'Even after page refresh',
  'Seçili bölge için': 'For the selected area',
  'Seçtiğin tarih': 'Selected date',
  'Seçtiğin tarihlere göre müsait tesisler': 'Available properties for your selected dates',
  'Seyahat kartı': 'Travel card',
  'Sistem sağlık skoru': 'System health score',
  'Sohbet ara': 'Search chat',
  'Spa erişimi': 'Spa access',
  'Standart': 'Standard',
  'Sanal POS': 'Virtual POS',
  'Şifre başarıyla güncellendi.': 'Password updated successfully.',
  'Şifre ve tekrar alanı eşleşmiyor.': 'Password and confirmation do not match.',
  'Şifreniz değiştirildi': 'Your password has been changed',
  'Şüpheli Giriş Bildirimleri': 'Suspicious Login Alerts',
  'T.C. Kimlik No': 'National ID Number',
  'Tablosu': 'Table',
  'Talebinizi kısa ve net şekilde yazın.': 'Write your request briefly and clearly.',
  'Tek cevap mantığıyla ilerleyen ticket listesi': 'Ticket list with single-response flow',
  'Telefon doğrulama kodu gönderildi.': 'Phone verification code sent.',
  'Telefon numaranı doğrulamak için SMS kodu gönderebilirsin.': 'You can send an SMS code to verify your phone number.',
  'Tercih edilen': 'Preferred',
  'Türkçe': 'Turkish',
  'Tercih et': 'Set preferred',
  'Tesiste ödeme seçildi': 'Pay at property selected',
  'Toplam gelir': 'Total revenue',
  'Toplam otel': 'Total hotels',
  'Toplam kullanıcı': 'Total users',
  'Toplam rezervasyon': 'Total reservations',
  'Tüm sistem bildirimleri tek listede': 'All system notifications in one list',
  'Uygun temsilci bekleniyor': 'Waiting for an available agent',
  'VIP olarak işaretli kayıt var': 'There is a record marked as VIP',
  'Yeni cihaz': 'New device',
  'Yeni destek çalışanı için kullanıcı adı ve şifre zorunludur.': 'Username and password are required for the new support agent.',
  'Yeni rezervasyon': 'New reservation',
  'Yönetici hesabı başarıyla oluşturuldu.': 'Administrator account created successfully.',
  'Yönetici seç': 'Select administrator',
  'Yüksek öncelik': 'High priority',
  'Ödeme sorunları için': 'For payment issues',
  'Ön ödeme alındı': 'Prepayment received',
  'Örn. ödeme onayı görünmüyor': 'Example: payment confirmation is not visible',
  'Örn. politika ihlali, eksik belge, kullanıcı şikayeti...': 'Example: policy violation, missing document, user complaint...',
  'Üzerinde': 'Assigned to',
}

const englishNoTurkishExactTextLabels: Record<string, string> = {
  'Otel Sahibi Yönetimi': 'Hotel Owner Management',
  'Otel Sahibi Ekle': 'Add Hotel Owner',
  'Otel Sahibi Düzenle': 'Edit Hotel Owner',
  'Otel Sahibi Kaydet': 'Save Hotel Owner',
  'Yönetilen Oteller': 'Managed Hotels',
  'Varsayılan Otel Sahibi': 'Default Hotel Owner',
  'Sistem başlangıç verisi': 'System seed data',
  'Bu hesapla bağlı oteller arasında geçiş yaparak operasyonları yönetebilirsin.': 'You can switch between hotels linked to this account and manage operations.',
  'Bağlı otellere ait aktif rezervasyonlar': 'Active reservations for linked hotels',
  'Bağlı otellere ait rezervasyon toplamı': 'Reservation total for linked hotels',
  'Yönetilen oteller': 'Managed hotels',
  'Otel Hakkında': 'About the Hotel',
  'Yorumlar': 'Reviews',
  'Stok adedi': 'Stock quantity',
  'Oda Detayı': 'Room Detail',
  'Oda Fotoğrafları': 'Room Photos',
  'Görseller bu detay ekranından yönetilir; fiyat Fiyat Yönetimi sayfasındadır.': 'Images are managed from this detail screen; pricing is managed on the Price Management page.',
  'Yeni Görsel Ekle': 'Add New Image',
  'Görsel Sil': 'Delete Image',
  'Temel fiyat': 'Base price',
  'Sezon bitişi': 'Season end',
  'Sezon fiyatı': 'Season price',
  'Hafta sonu çarpanı': 'Weekend multiplier',
  'Sezon çarpanı': 'Season multiplier',
  'Özel gün fiyatı': 'Special day price',
  'Minimum gece şartı': 'Minimum night requirement',
  'Kampanya fiyatı': 'Campaign price',
  'Rezervasyonu İptal Et': 'Cancel Reservation',
  'İptali Onayla': 'Confirm Cancellation',
  'Vazgeç': 'Cancel',
  'Misafir tarafından iptal edilenler': 'Cancelled by guests',
  'Otel sahibi tarafından iptal edilenler': 'Cancelled by the hotel owner',
  'Cevabı Kaydet': 'Save Reply',
  'Yoruma Cevap Ver': 'Reply to Review',
  'Otel sahibi cevabı': 'Hotel owner reply',
  'Kupon Oluştur': 'Create Coupon',
  'Kampanya Ekle': 'Add Campaign',
  'Kupon kodu': 'Coupon code',
  'İndirim tipi': 'Discount type',
  'Minimum harcama': 'Minimum spend',
  'Kullanım limiti': 'Usage limit',
  'Kampanya adı': 'Campaign name',
  'Şart': 'Condition',
  'Yakındaki Yer Ekle': 'Add Nearby Place',
  'Kaydedilen otel sahibi hesapları giriş ekranında kullanıcı adı, şifre ve T.C. Kimlik No ile doğrulanır.': 'Saved hotel owner accounts are verified on the login screen with username, password, and national ID.',
  'Otel sahibi hesabı kaydedildi.': 'Hotel owner account saved.',
  'Otel sahibi hesabı güncellendi.': 'Hotel owner account updated.',
  'Bu kullanıcı adı ile otel sahibi hesabı zaten var.': 'A hotel owner account already exists with this username.',
  'Bu T.C. Kimlik No ile otel sahibi hesabı zaten var.': 'A hotel owner account already exists with this national ID.',
  'Hesabınız pasif duruma alınmıştır.': 'Your account has been deactivated.',
  'Hesabınız devre dışı bırakılmıştır.': 'Your account has been disabled.',
  'Kullanıcı bulunamadı': 'User not found',
  'Şifre yanlış': 'Incorrect password',
  'T.C. Kimlik No yanlış': 'Incorrect national ID number',
  'Eksik alan': 'Missing required field',
  'Pasif veya iptal işlemi için açıklama zorunludur.': 'A reason is required for deactivation or cancellation.',
  'Pasif nedeni': 'Deactivation reason',
  'İptal nedeni': 'Cancellation reason',
  'Açıklamayı yazın...': 'Write the explanation...',
  'Değişiklikleri Kaydet': 'Save Changes',
  'Bağlı Otel': 'Linked Hotel',
  'Bağlı otel': 'Linked hotel',
  'Bağlı otel yok': 'No linked hotel',
  'Ad Soyad': 'Full Name',
  'Düzenle': 'Edit',
  'Düzenle|Pasif Yap|İptal Et|Sil': 'Edit|Deactivate|Cancel|Delete',
  'Düzenle|Aktif Yap|Sil': 'Edit|Activate|Delete',
  'İptal': 'Cancelled',
  'Yeni cihazdan giriş yapıldı': 'New device login detected',
  'Kurumsal güvenlik alanı': 'Corporate security area',
  'Doluluk, gelir, rezervasyon ve oda performansını gerçek zamanlı izle.': 'Monitor occupancy, revenue, reservations, and room performance in real time.',
  'Kampanya Önerileri': 'Campaign Recommendations',
  'Fiyat Yönetimi': 'Price Management',
  'Rezervasyon Yönetimi': 'Reservation Management',
  'Görsel Yönetimi': 'Media Management',
  'İndirim Kuralları': 'Discount Rules',
  'Misafir Yorumları': 'Guest Reviews',
  'İzin Talepleri': 'Leave Requests',
  'Kendi oteline ait aktif rezervasyonlardan hesaplanır': 'Calculated from active reservations for your own hotel',
  'Kendi oteline ait rezervasyon toplamından hesaplanır': 'Calculated from total reservations for your own hotel',
  'Kendi oteline ait rezervasyon toplamı': 'Total reservations for your own hotel',
  'Kalıcı rezervasyon kayıtlarından hesaplandı': 'Calculated from persistent reservation records',
  'Otel oda listelerinden hesaplandı': 'Calculated from hotel room lists',
  'İstanbul şehir otelleri': 'Istanbul city hotels',
  'Spa ve kahvaltı dahil': 'Spa and breakfast included',
  'Süit': 'Suite',
  'King yatak + dinlenme koltuğu': 'King bed + lounge chair',
  'Buhar duşlu banyo': 'Bathroom with steam shower',
  'Kapandı': 'Closed',
  'Kampanya Kullanımı': 'Campaign Usage',
  'Gerçek zamanlı performans': 'Real-time performance',
  'Rezervasyon Yoğunluğu': 'Reservation Density',
  'Müşteri Yorum Analizi': 'Guest Review Analysis',
  'Kampanya önerildi': 'Campaign recommended',
  'Kampanya ve Fiyat Yönetimi': 'Campaign and Price Management',
  'Hafta sonu fiyatı': 'Weekend rate',
  'İç Mesaj': 'Internal Message',
  'Sıradaki operasyon işleri': 'Next operational tasks',
  'Mini bar kontrolü': 'Mini bar check',
  'İç Mesajlaşma Paneli': 'Internal Messaging Panel',
  'İzin talebi değerlendiriliyor': 'Leave request is under review',
  'İyi': 'Good',
  'Yoğun': 'Busy',
  'Tamamlanıyor': 'Completing',
  'Görev İlerleme Barı': 'Task Progress Bar',
  'Ön ödeme bekliyor': 'Prepayment pending',
  'POS tahsilatı eşleşti': 'POS collection matched',
  'Muhasebe kontrol adımları': 'Accounting control steps',
  'Kat ve arıza yoğunluğu haritası': 'Floor and issue density map',
  'Açık İş': 'Open Task',
  'Planlı': 'Planned',
  'Acil müdahale': 'Emergency response',
  'Bu kullanıcı adı, e-posta veya telefon numarası daha önce kullanılmış.': 'This username, email, or phone number has already been used.',
  'İlk destek kullanıcısı için kullanıcı adı ve şifre zorunludur.': 'Username and password are required for the first support user.',
  'Bu destek kullanıcı adı zaten kullanılıyor.': 'This support username is already in use.',
  'Ticket yanıtı yaz': 'Write a ticket reply',
  'Yeni şifreler eşleşmiyor.': 'New passwords do not match.',
  'Şüpheli işlem, oturum ve yetki uyarıları': 'Suspicious action, session, and permission alerts',
  'Onay, askıya alma ve kaldırma süreçleri': 'Approval, suspension, and removal workflows',
  'Gelir özeti ve dönemsel rapor hatırlatmaları': 'Revenue summary and periodic report reminders',
  'Yetki dışı işlem': 'Unauthorized action',
  'aktif-yönetici': 'active-admin',
  'Bu kullanıcı adı daha önce kullanılmış.': 'This username has already been used.',
  'Bu T.C. Kimlik No ile yönetici hesabı zaten var.': 'An administrator account already exists with this national ID.',
  'Yönetici panelinden pasife alındı': 'Deactivated from the administrator panel',
  'Yönetici panelinden aktifleştirildi': 'Activated from the administrator panel',
  'Hesabı Kapat': 'Close Account',
  'Süreli devre dışı bırak': 'Disable temporarily',
  'Veri tabanı bağlantısı henüz ölçülmedi': 'Database connection has not been measured yet',
  'Toplam otel sayısı': 'Total hotel count',
  'Aktif otel sayısı': 'Active hotel count',
  'Yayında olan tesisler': 'Published properties',
  'Toplam kullanıcı sayısı': 'Total user count',
  'Yönetici, otel sahibi ve misafir hesapları': 'Administrator, hotel owner, and guest accounts',
  'Toplam rezervasyon sayısı': 'Total reservation count',
  'Kalıcı rezervasyon kayıtları': 'Persistent reservation records',
  'Sistem sağlık durumu': 'System health status',
  'Ölçülmedi': 'Not measured',
  'Sağlıklı': 'Healthy',
  'Oda Sayısı': 'Room Count',
  'Kullanıcı Sayısı': 'User Count',
  'Kullanıcı Adı': 'Username',
  'Oda, fiyat, kampanya ve tesis operasyonları': 'Room, price, campaign, and property operations',
  'Görev, vardiya ve iç bildirim akışları': 'Task, shift, and internal notification workflows',
  'Check-in, check-out ve misafir kartları': 'Check-in, check-out, and guest cards',
  'Platform onayı, güvenlik, destek ve rapor izleme': 'Platform approval, security, support, and report monitoring',
  'Tanımlı yetki bulunmuyor': 'No defined permissions found',
  'İhlal Kaydı': 'Violation Record',
  'Tarayıcı oturumu': 'Browser session',
  'İzlendi': 'Monitored',
  'Mevcut tarayıcı': 'Current browser',
  'Şifre Değişiklikleri': 'Password Changes',
  'Dönem': 'Period',
  'Destek kuyruğunu önceliklendir': 'Prioritize the support queue',
  'Mevcut akışı izle': 'Monitor the current workflow',
  'Öneri Var': 'Recommendation Available',
  'Favori kullanıcılar için kampanya bildirimi önerilir': 'Campaign notifications are recommended for favorite users',
  'Aktif rezervasyon oranı': 'Active reservation ratio',
  'Otel sahibine oda müsaitlik kontrolü önerilir': 'Room availability checks are recommended for the hotel owner',
  'Rezervasyon yoğunluğu': 'Reservation density',
  'Tarih bazlı kapasite takibi önerilir': 'Date-based capacity tracking is recommended',
  'Rezervasyon ve favori verisi arttıkça tahmin güçlenir': 'Forecast accuracy improves as reservation and favorite data grows',
  'Analiz Başlığı': 'Analysis Title',
  'Öneri': 'Recommendation',
  'Hata Kayıtları': 'Error Logs',
  'Ölçüm': 'Metric',
  'Veri Tabanı': 'Database',
  'Bağlantı bekleniyor': 'Waiting for connection',
  'Yük Var': 'Load Present',
  'Kart doğrulama ve provizyon sorunlarında destek talebi açabilir veya ödeme yöntemini güncelleyebilirsiniz.': 'For card verification and authorization issues, you can create a support request or update your payment method.',
  'Bu bilgi tesis politikasına göre değişir. Detay bölümünden ilgili otelin kahvaltı bilgisini doğrulayabilirsiniz.': 'This information varies by property policy. You can verify the breakfast details from the relevant hotel detail section.',
  'Favoriler > Kaydedilen Odalar alanında oda görseli, kapasite ve hızlı rezervasyon butonu ile listelenir.': 'They are listed under Favorites > Saved Rooms with room image, capacity, and a quick reservation button.',
  'Check-in, check-out, oda durumu ve kimlik işlemleri aynı akışta yönetilir.': 'Check-in, check-out, room status, and identity operations are managed in the same workflow.',
  'Sana özel lüks tesis önerileri': 'Luxury property recommendations curated for you',
  'Bu hafta en çok incelenen tesisler': 'Most viewed properties this week',
  'Seçili tarihler için premium kampanyalar': 'Premium offers for the selected dates',
  'Rezervasyon için önce otel seç': 'Select a hotel before booking',
  'Luxury booking app vitrini': 'Luxury booking app showcase',
  'Havuz, rooftop ve deniz atmosferi güçlü tesisler': 'Properties with strong pool, rooftop, and sea atmospheres',
  'Profiline göre seçildi': 'Selected for your profile',
  'Sessiz kat, premium suit ve hızlı check-in odaklı öneriler': 'Recommendations focused on quiet floors, premium suites, and fast check-in',
  'Eski fiyat / yeni fiyat': 'Old price / new price',
  'Kampanyalı oda fiyatı ve sezon farkı hazır tesisler': 'Properties with promotional room rates and seasonal price logic ready',
  'Otel seçimi': 'Hotel selection',
  'Rezervasyona başlamadan önce konaklamak istediğin tesisi seç': 'Choose the property you want to stay at before starting the reservation',
  'Rezervasyon İçin Otel Seçimi': 'Hotel Selection for Reservation',
  'Tesisler yükleniyor': 'Properties are loading',
  'Büyük görseller, gerçekçi fiyat sinyalleri, otel atmosferi ve oda müsaitliğiyle': 'Large visuals, realistic price signals, hotel atmosphere, and room availability create',
  'sinematik bir konaklama vitrini.': 'a cinematic stay showcase.',
  'Hızlı Rezervasyon': 'Quick Reservation',
  'Hızlı Rezervasyon Yap': 'Quick Reservation',
  'Aramana uygun tesis bulunamadı. Otel adı, şehir veya bölge bilgisini sadeleştirerek tekrar deneyebilirsin.': 'No property matched your search. Simplify the hotel name, city, or area and try again.',
  'Rezervasyon yalnızca otel kartındaki Rezervasyon Yap butonuyla başlar.': 'A reservation only starts from the Make Reservation button on a hotel card.',
  'Seçtiğin tarih, kişi ve oda bilgisine uygun tesis bulunamadı. Misafir veya oda sayısını değiştirerek tekrar ara.': 'No property matches the selected date, guest, and room details. Change the guest or room count and search again.',
  'Aramana göre listelenen gerçek tesisler': 'Real properties listed according to your search',
  'Şu an görüntülenen uygun tesisler': 'Available properties currently being viewed',
  'Onaylanmış yaklaşan konaklama planı': 'Approved upcoming stay plan',
  'Kalıcı favori listendeki tesisler': 'Properties in your saved favorites list',
  'Favori tesislerinin ortalama puanı': 'Average rating of your favorite properties',
  'Görüntülenen tesislerin ortalama puanı': 'Average rating of the displayed properties',
  'Konaklama deneyimi alanı': 'Stay experience area',
  'Konaklama, hizmet ve restoran kırılımı': 'Breakdown of stay, service, and restaurant revenue',
  'Konaklama sırasında sunulan servisler': 'Services offered during the stay',
  'Ödeme İşlemleri': 'Payment Operations',
  'Kaydedilen premium tesisler': 'Saved premium properties',
  'Yoga matı': 'Yoga mat',
  'Kart doğrulama, provizyon veya ödeme hatalarında önce kayıtlı ödeme yöntemini kontrol et. Sorun devam ederse canlı destekten talep açabilir ve ödeme ekranı detayını paylaşabilirsin.': 'For card verification, authorization, or payment errors, first check your saved payment method. If the issue continues, you can open a live support request and share the payment screen details.',
  'Bu bilgi tesis politikasına göre değişir. Otel detayındaki politikalar bölümünden veya otel mesajlarından doğrulayabilirsiniz.': 'This information varies by property policy. You can verify it in the hotel detail policies section or through hotel messages.',
  'Favoriler > Kaydedilen Odalar alanında oda görselleri, kapasite ve hızlı rezervasyon butonlarıyla kayıtlı odalarınız listelenir.': 'Your saved rooms are listed under Favorites > Saved Rooms with room images, capacity details, and quick reservation buttons.',
  'VIP ve Kritik Misafirler': 'VIP and Critical Guests',
  'Oda, restoran ve hizmet gelirleri': 'Room, restaurant, and service revenue',
  'Check-in, check-out, kimlik işlemleri, oda durumu ve ödeme adımlarını aynı akışta yönet.': 'Manage check-in, check-out, identity operations, room status, and payment steps in one workflow.',
  '6 ödeme doğrulaması var': '6 payment verifications pending',
  'Görev ve vardiya yetkisi': 'Task and shift permission',
  '7 çağrıdan 4 çağrı kapandı': '4 of 7 calls closed',
  'Finans ve kasa yetkisi': 'Finance and cash desk permission',
  '5 / 6 talep kapandı': '5 / 6 requests closed',
  '3 parça bekleniyor': '3 parts pending',
  'Telefon doğrulandı.': 'Phone verified.',
  'Dil seçimi': 'Language selection',
  'Okunmamış sistem bildirimi': 'Unread system notification',
  'Çalışma alanı seçimi': 'Workspace selection',
  'Seçili menüye göre gerçekçi operasyon içeriği': 'Realistic operational content based on the selected menu',
  'Bu T.C. Kimlik No ile personel kaydı zaten var.': 'A staff record already exists with this national ID.',
  'Kullanıcı adı ve T.C. Kimlik No benzersiz olmalıdır; hesaplar kalıcı saklanır.': 'Username and national ID must be unique; accounts are stored persistently.',
  'Personel kayıtları aktif/pasif/silinen listelerinde gerçek kayıt olarak görünür.': 'Staff records appear as real records in active, inactive, and deleted lists.',
  'Açıklama zorunludur; işlem yönetici hesabı üzerinde kalıcı saklanır.': 'Description is required; the action is stored persistently on the administrator account.',
  'Mevcut sistem olaylarından üretildi': 'Generated from current system events',
  'Bu işlem için açıklama/neden zorunludur.': 'A description or reason is required for this action.',
  'Admin görüntüler; fiyat, oda ve kampanya düzenleyemez.': 'Admin can view only; prices, rooms, and campaigns cannot be edited.',
  'Geri Döndür|Tamamen Sil': 'Restore|Delete Permanently',
  'Pasif Yap|İptal Et': 'Deactivate|Cancel',
  'Rezervasyon, favori, mesaj ve profil işlemleri': 'Reservation, favorite, message, and profile actions',
  'erişim': 'access',
  'şüpheli': 'suspicious',
  'Destek ve operasyon riski': 'Support and operational risk',
  'Favori ve rezervasyon sinyali': 'Favorite and reservation signal',
  'Sistemden kaldırılan otel sayısı': 'Number of hotels removed from the system',
  'Açık destek talebi sayısı': 'Number of open support requests',
  'Operasyon Kuyruğu': 'Operations Queue',
  'Otel, kullanıcı, rezervasyon ve platform olaylarının gerçek zamanlı özeti': 'Real-time summary of hotel, user, reservation, and platform events',
  'Tesislere bağlı oda tipi sayısı': 'Number of room types linked to properties',
  'Admin yalnızca izleme ve hesap durum işlemi yapar': 'Admin only monitors and manages account status actions',
  'Admin fiyat, oda ve kampanya içeriğini düzenleyemez; yalnızca sistem durumunu yönetir': 'Admin cannot edit prices, rooms, or campaign content; only system status can be managed',
  'Yetki Güvenliği': 'Permission Security',
  'Giriş, şifre, cihaz ve yetki olayları': 'Login, password, device, and permission events',
  'Tesiste ödeme veya bekleyen kayıtlar': 'Pay-at-property or pending records',
  'İptal/iade durumundaki ödeme': 'Payment in cancellation/refund status',
  'Admin fiyat değiştiremez, yalnızca rapor görüntüler': 'Admin cannot change prices and can only view reports',
  'Admin yalnızca finans raporu görüntüler; oda fiyatı ve kampanya yönetimi otel sahibindedir': 'Admin only views financial reports; room prices and campaign management belong to the hotel owner',
  'Doluluk Oranı': 'Occupancy Rate',
  'Açık Destek': 'Open Support',
  'Favori Sinyali': 'Favorite Signal',
  'Rezervasyon üretmeyen oteller': 'Hotels without reservation generation',
  'Canlı ölçüm kaydı yoksa durumla gösterilir': 'Shown by status when no live measurement record exists',
  'İletişim Kaydı': 'Contact Record',
  'Okunmamış mesajlar': 'Unread messages',
  'Rezervasyon Yükü': 'Reservation Load',
  'Okunmamış bildirimler': 'Unread notifications',
  'Bu sayfa için veri bekleniyor': 'Waiting for data for this page',
  'İzleme': 'Monitoring',
  'Bu sayfada ara': 'Search on this page',
  'Bu otele ait hareketler': 'Activity belonging to this hotel',
  'Oda müsaitlik alanları': 'Room availability areas',
  'İndirimli oda kayıtları': 'Discounted room records',
  'İndirim': 'Discount',
  'Kampanya Kapsamı': 'Campaign Scope',
  'Satış Sinyali': 'Sales Signal',
  'Kupon kaydı bulunursa burada yükselir': 'If a coupon record exists, it appears here',
  'Kupon Kullanımı': 'Coupon Usage',
  'Kampanyalar oda fiyat kayıtlarından ve indirimli odalardan hesaplanır': 'Campaigns are calculated from room price records and discounted rooms',
  'Otel sahibine bağlı personel kaydı': 'Staff record linked to the hotel owner',
  'Personel Kapsamı': 'Staff Scope',
  'Personel kayıtları eklendiğinde bu sayfa otomatik dolacaktır': 'This page will populate automatically when staff records are added',
  'Oda Bazlı Kapsam': 'Room-Based Scope',
  'Yorum Kapsamı': 'Review Scope',
  'İletişim Sinyali': 'Contact Signal',
  'Yorum ve memnuniyet verileri yalnızca gerçek misafir kayıtlarından gelir': 'Review and satisfaction data comes only from real guest records',
  'Ekleme, düzenleme, silme ve kapasite yönetimi': 'Add, edit, delete, and capacity management',
  'Açıklama, kapasite ve özellik seçimi': 'Description, capacity, and feature selection',
  'Seçilebilir tesis özellikleri': 'Selectable property features',
  'Akıllı kilit': 'Smart lock',
  'Misafir detay sayfasına anlık yansır': 'Reflected instantly on the guest detail page',
  'Kupon ve indirim kurgusu': 'Coupon and discount setup',
  'Rezervasyon Operasyonları': 'Reservation Operations',
  'Operasyon ve VIP işaretleri': 'Operation and VIP markers',
  'Yükleme Alanı': 'Upload Area',
  'Otel ve oda görselleri': 'Hotel and room images',
  'Sıralama ve görünürlük': 'Ordering and visibility',
  'Lüks şehir konaklaması, yüksek hizmet standardı ve merkezi lokasyon.': 'Luxury city accommodation, high service standards, and a central location.',
  'Misafir detay sayfasında gösterilir': 'Displayed on the guest detail page',
  'Profil tamamlığı': 'Profile completeness',
  'Politika kapsamı': 'Policy scope',
  'Favori otel kaldırıldı': 'Favorite hotel removed',
  'Favori otel kaydedildi': 'Favorite hotel saved',
  'Kaydedilen oda kaldırıldı': 'Saved room removed',
  'Otel seçimi tamamlandı, şimdi tarih ve oda filtrelerini kontrol et': 'Hotel selection completed; now review the date and room filters',
  'Örn. LUX20': 'Ex. LUX20',
  'Yalnızca seçilen otele ait özel oda seçenekleri': 'Exclusive room options belonging only to the selected hotel',
  'Seçilen oda, hizmet ve ödeme bilgileri': 'Selected room, service, and payment information',
  'Favori, fiyat ve müsaitlik uyarıları': 'Favorite, price, and availability alerts',
  'Favori tesislerinde iki oda tipi için indirim aktif': 'Discounts are active for two room types in your favorite properties',
  'Arama niyetine göre rota': 'Route based on search intent',
  'Favorilerden çıkar': 'Remove from favorites',
  'Otel kartlarını inceledikten sonra tarih, kişi ve oda bilgisini netleştir': 'Review hotel cards, then confirm date, guest, and room details',
  'Şehir, bölge veya tesis ara': 'Search city, area, or property',
  'Harita ve ulaşım önizlemesi': 'Map and transport preview',
  'Otel İletişimi': 'Hotel Contact',
  'Rezervasyon öncesi hızlı temas': 'Quick contact before reservation',
  'Oda bazlı fiyat, özellik ve kaydetme işlemleri': 'Room-based price, feature, and save actions',
  'Yorum Gönder': 'Submit Review',
  'Önceki fotoğraf': 'Previous photo',
  'Sonraki fotoğraf': 'Next photo',
  'Tamamlanan konaklamalar ve tekrar rezervasyon fırsatları': 'Completed stays and rebooking opportunities',
  'İade ve yeniden planlama akışı tamamlanan rezervasyonlar': 'Reservations with completed refund and rescheduling flow',
  'İptal Edilen Rezervasyonlar': 'Cancelled Reservations',
  'Bu konaklama tamamlandı. Kart yalnızca geçmiş rezervasyon kaydı olarak görüntülenir.': 'This stay has been completed. The card is displayed only as a past reservation record.',
  'Bu rezervasyon iptal edildi. Ödeme ve iade süreci kayıt altında tutulur.': 'This reservation was cancelled. The payment and refund process is kept on record.',
  'Rezervasyon onaylıdır. Check-in sırasında kimlik doğrulama ve ödeme durumu kontrol edilir.': 'The reservation is approved. Identity verification and payment status are checked during check-in.',
  'Fatura ön izlemesi güvenli şekilde hazırlandı.': 'Invoice preview has been prepared securely.',
  'Operasyon notları': 'Operation notes',
  'Kaydedilen favoriler': 'Saved favorites',
  'Favori listesi önerileri': 'Favorite list recommendations',
  'Gerekli değil': 'Not required',
  'Sigara içilmeyen oda': 'Non-smoking room',
  'Evet': 'Yes',
  'Hayır': 'No',
  'Erişilebilirlik': 'Accessibility',
  'İhtiyaç var': 'Required',
  'Rezervasyon ödeme adımına aktarılır': 'Transferred to the reservation payment step',
  'Şu an aktif': 'Currently active',
  'Dün 22:18': 'Yesterday 22:18',
  'Tüm şifre alanlarını doldurmalısın.': 'You must fill in all password fields.',
  'E-posta doğrulandı': 'Email verified',
  'Telefon başarıyla doğrulandı.': 'Phone verified successfully.',
  'Telefon doğrulama kodu başarıyla onaylandı.': 'Phone verification code approved successfully.',
  'Ek giriş güvenliği': 'Additional login security',
  'Yeni cihaz ve risk uyarıları': 'New device and risk alerts',
  'güven': 'trust',
  'Ödeme sorunları için kayıtlı kartınızı kontrol edebilir veya yeni ödeme yöntemi ekleyebilirsiniz.': 'For payment issues, check your saved card or add a new payment method.',
  'Otel ile ilgili sorularınız için otel detay sayfasından mesaj gönderebilirsiniz.': 'For hotel-related questions, you can send a message from the hotel detail page.',
  'Talebinizi anladım. Rezervasyon, ödeme, otel mesajları veya hesap güvenliği başlıklarından biriyle ilerleyebiliriz.': 'I understand your request. We can continue with reservation, payment, hotel messages, or account security topics.',
  'Destek çalışanıyla anlık yazışma, okundu bilgisi ve kalıcı mesaj geçmişi': 'Instant messaging with a support agent, read status, and persistent message history',
  'Canlı sohbetten ayrı, konu bazlı ticket süreci oluşturun.': 'Create a topic-based ticket flow separate from live chat.',
  'Canlı desteğe bağlanmak istiyorum.': 'I want to connect to live support.',
  'evet': 'yes',
  'hayır': 'no',
  'Rezervasyon kodunu paylaş': 'Share the reservation code',
  'Rezervasyon ve konaklama hakkında profesyonel yanıtlar': 'Professional answers about reservations and stays',
  'Mesajınıza geri dönüş yapıldı': 'Your message has received a reply',
  'Filtre ve destek durumu': 'Filter and support status',
  'Oda ekleme, düzenleme, silme, kapasite, açıklama ve özellik seçimi için tam sayfa yönetim deneyimi.': 'Full-page management experience for adding, editing, deleting rooms, managing capacity, descriptions, and feature selection.',
  'Günlük fiyat, sezonluk fiyat, hafta sonu kuralı, indirim ve dinamik fiyatlandırma ayarları.': 'Daily price, seasonal price, weekend rule, discount, and dynamic pricing settings.',
  'Rezervasyon onayı, iptal yönetimi, müşteri notları, VIP işaretleme ve check-in/check-out kontrolü.': 'Reservation approval, cancellation management, customer notes, VIP marking, and check-in/check-out control.',
  'Otel kapak görseli, galeri düzeni, oda görsel sıralaması ve yüksek çözünürlüklü medya yönetimi.': 'Hotel cover image, gallery layout, room image ordering, and high-resolution media management.',
  'Otel açıklaması, hizmet bilgileri, iletişim, konum ve sosyal medya bağlantıları yönetimi.': 'Hotel description, service information, contact, location, and social media link management.',
  '7 dk yürüyüş': '7 min walk',
  '12 dk yürüyüş': '12 min walk',
  'Kültür merkezi': 'Cultural center',
  'Restoran ve yürüyüş aksı': 'Restaurant and walking corridor',
  'Şehir parkı': 'City park',
  '8 dk yürüyüş': '8 min walk',
  'Sabah yürüyüş rotası': 'Morning walking route',
  'Müze': 'Museum',
  'Kültür gezisi': 'Cultural visit',
  'Toplantı bölgesi': 'Meeting district',
  '10 dk yürüyüş': '10 min walk',
  'Havalimanı bağlantısı': 'Airport connection',
  'Şehir manzaralı balkon': 'City-view balcony',
  'Sezonluk fiyat altyapısı hazır': 'Seasonal pricing infrastructure is ready',
  'Doğum tarihi boş veya gelecekte bir tarih olamaz.': 'Birth date cannot be empty or in the future.',
  'Acil durum iletişim kişisi ve geçerli telefon numarası zorunludur.': 'Emergency contact person and a valid phone number are required.',
  'gece': 'night',
  'yıldızlı tesis': 'star property',
  'yıldız': 'star',
  'için': 'for',
  'ile': 'with',
  've': 'and',
  'veya': 'or',
  'favori': 'favorite',
  'Devam ediyor': 'In progress',
  '16:00 öncesi': 'Before 16:00',
  '18 odadan 15 oda tamam': '15 of 18 rooms completed',
  '32 / 36 işlem tamam': '32 / 36 actions completed',
  'Yönetici hesap izleme': 'Administrator account monitoring',
  'Rezervasyon Kodu': 'Reservation Code',
  'Riskli Olay': 'Risk Event',
  'Toplam odadan kalan kapasite': 'Remaining capacity from total rooms',
  'Sistem izlemeye devam ediyor': 'System monitoring continues',
  'Rezervasyon öncesi bilgilendirme': 'Pre-reservation briefing',
  '3 gün önce': '3 days ago',
  'SMS kodu ile güvenli doğrulama': 'Secure verification with SMS code',
  'Gecelik başlangıç': 'Nightly from',
  'Başlangıç fiyatı': 'Starting price',
  'Başlangıç fiyat': 'Starting price',
  'Galeriyi aç': 'Open gallery',
  'Yanıt süresi': 'Response time',
  'Yanıt süresi:': 'Response time:',
  'Yanıt süresi: ortalama 5 dakika': 'Response time: average 5 minutes',
  'ortalama 5 dakika': 'average 5 minutes',
  'ortalama': 'average',
  'Oda Tipi': 'Room Type',
  'Oda tipi': 'Room type',
  'Room Tipi': 'Room Type',
  'Konaklama deneyimini yaz': 'Write about your stay experience',
  'Konaklamalar': 'Stays',
  'konaklamalar': 'stays',
  'Beğendiğin tesisleri tek listede takip et, son eklenenleri gör ve hızlı rezervasyon': 'Track the properties you like in one list, see the latest additions, and continue with the quick reservation',
  'kısayoluyla akışı devam ettir.': 'shortcut.',
  'Beğendiğin tesisleri tek listede takip et, son eklenenleri gör ve hızlı rezervasyon kısayoluyla akışı devam ettir.': 'Track the properties you like in one list, see the latest additions, and continue with the quick reservation shortcut.',
  'Son eklenen favoriler ve hızlı rezervasyon önizlemesi.': 'Recently added favorites and quick reservation preview.',
  'Sonradan incelemek için kaydettiğin oda seçenekleri': 'Room options you saved to review later',
  'Henüz kaydedilen oda yok. Aşağıdaki oda kartlarından kalp ikonuyla liste oluşturabilirsin.': 'No saved rooms yet. Use the heart icon on the room cards below to create your list.',
  'Henüz favori otel eklenmedi. Aşağıdaki önerilerden kalp ikonuyla favori oluşturabilirsin.': 'No favorite hotels have been added yet. Use the heart icon on the recommendations below to create favorites.',
  'Kaydedilen': 'Saved',
  'En uygun fiyat': 'Best price',
  'Müsait oda': 'Available rooms',
  'Arama bekleniyor': 'Waiting for search',
  'Rezervasyon Akışına Geç': 'Continue to Reservation Flow',
  'özel oda tipi': 'exclusive room types',
  'müsait oda': 'available rooms',
  'Kampanya aktif': 'Campaign active',
}

const englishProtectedProperNames = [
  'Kıyı Premium Konaklama',
  'Vadi Teras Otel',
  'Şehir Işıkları Süitleri',
  'Selin A.',
  'Mert K.',
  'Ayça D.',
  'İstanbul',
  'İzmir',
  'Antalya',
  'Beşiktaş',
  'Muratpaşa',
  'Konak',
]

const englishTurkishStemFallbacks: Array<[string, string]> = [
  ['yönetici', 'administrator'], ['yonetici', 'administrator'], ['otel', 'hotel'], ['misafir', 'guest'], ['tesis', 'property'],
  ['rezervasyon', 'reservation'], ['oda', 'room'], ['fiyat', 'price'], ['kampanya', 'campaign'], ['destek', 'support'],
  ['mesaj', 'message'], ['bildirim', 'notification'], ['güvenlik', 'security'], ['guvenlik', 'security'], ['şifre', 'password'],
  ['sifre', 'password'], ['kullanıcı', 'user'], ['kullanici', 'user'], ['hesap', 'account'], ['durum', 'status'],
  ['işlem', 'action'], ['islem', 'action'], ['giriş', 'login'], ['giris', 'login'], ['çıkış', 'logout'], ['cikis', 'logout'],
  ['ödeme', 'payment'], ['odeme', 'payment'], ['gelir', 'revenue'], ['finans', 'finance'], ['sistem', 'system'],
  ['performans', 'performance'], ['rapor', 'report'], ['veri', 'data'], ['bağlantı', 'connection'], ['baglanti', 'connection'],
  ['bekle', 'waiting'], ['aktif', 'active'], ['pasif', 'inactive'], ['askı', 'suspension'], ['aski', 'suspension'],
  ['kaldır', 'remove'], ['kaldir', 'remove'], ['onay', 'approval'], ['iptal', 'cancellation'], ['iade', 'refund'],
  ['yorum', 'review'], ['puan', 'rating'], ['yakın', 'nearby'], ['yakin', 'nearby'], ['yer', 'place'], ['hizmet', 'service'],
  ['iletişim', 'contact'], ['iletisim', 'contact'], ['konum', 'location'], ['kişisel', 'personal'], ['kisisel', 'personal'],
  ['kişi', 'guest'], ['kisi', 'guest'], ['konaklama', 'stay'], ['vitrin', 'showcase'], ['büyük', 'large'], ['buyuk', 'large'],
  ['görsel', 'visual'], ['gorsel', 'visual'], ['gerçekçi', 'realistic'], ['gercekci', 'realistic'], ['sinyal', 'signal'],
  ['sinematik', 'cinematic'], ['lüks', 'luxury'], ['luks', 'luxury'], ['özel', 'curated'], ['ozel', 'curated'],
  ['uygun', 'available'], ['müsaitlik', 'availability'], ['musaitlik', 'availability'], ['yaklaşan', 'upcoming'], ['yaklasan', 'upcoming'],
  ['başlangıç', 'starting'], ['baslangic', 'starting'], ['süre', 'duration'], ['sure', 'duration'], ['galeri', 'gallery'],
  ['ortalama', 'average'], ['dakika', 'minutes'],
  ['galeriyi', 'gallery'], ['tipi', 'type'], ['tip', 'type'], ['kaydedil', 'saved'], ['sonradan', 'later'],
  ['aşağıdaki', 'below'], ['asagidaki', 'below'], ['kalp', 'heart'], ['ikon', 'icon'], ['incele', 'review'],
  ['beğen', 'like'], ['begen', 'like'], ['takip', 'track'], ['kısayol', 'shortcut'], ['kisayol', 'shortcut'],
  ['devam', 'continue'], ['ettir', 'continue'], ['önizleme', 'preview'], ['onizleme', 'preview'],
  ['bilgi', 'information'], ['tercih', 'preference'], ['geçerli', 'valid'], ['gecerli', 'valid'], ['zorunlu', 'required'],
  ['hatalı', 'invalid'], ['hatali', 'invalid'], ['tamamla', 'complete'], ['oluştur', 'create'], ['olustur', 'create'],
  ['kaydet', 'save'], ['güncelle', 'update'], ['guncelle', 'update'], ['ara', 'search'], ['detay', 'detail'],
  ['görüntüle', 'view'], ['goruntule', 'view'], ['ekle', 'add'], ['sil', 'delete'], ['değiştir', 'change'], ['degistir', 'change'],
  ['düzenle', 'edit'], ['duzenle', 'edit'], ['sırada', 'queued'], ['sirada', 'queued'], ['açık', 'open'], ['acik', 'open'],
  ['kapalı', 'closed'], ['kapali', 'closed'], ['yüksek', 'high'], ['yuksek', 'high'], ['düşük', 'low'], ['dusuk', 'low'],
  ['orta', 'medium'], ['yoğun', 'busy'], ['yogun', 'busy'], ['günlük', 'daily'], ['gunluk', 'daily'], ['haftalık', 'weekly'],
  ['haftalik', 'weekly'], ['aylık', 'monthly'], ['aylik', 'monthly'], ['bugün', 'today'], ['bugun', 'today'], ['yarın', 'tomorrow'],
  ['yarin', 'tomorrow'], ['mayıs', 'May'], ['mayis', 'May'], ['sayı', 'count'], ['sayi', 'count'], ['toplam', 'total'],
  ['boş', 'vacant'], ['bos', 'vacant'], ['dolu', 'occupied'], ['müsait', 'available'], ['musait', 'available'], ['geçmiş', 'past'],
  ['gecmis', 'past'], ['yeni', 'new'], ['canlı', 'live'], ['canli', 'live'], ['gerçek', 'real'],
  ['gercek', 'real'], ['zamanlı', 'time'], ['zamanli', 'time'], ['özet', 'summary'], ['ozet', 'summary'], ['yetki', 'permission'],
  ['ihlal', 'violation'], ['risk', 'risk'], ['talep', 'request'], ['öncelik', 'priority'], ['oncelik', 'priority'], ['personel', 'staff'],
  ['vardiya', 'shift'], ['görev', 'task'], ['gorev', 'task'], ['muhasebe', 'accounting'], ['kasa', 'cash desk'], ['tahsilat', 'collection'],
  ['fatura', 'invoice'], ['teknik', 'technical'], ['bakım', 'maintenance'], ['bakim', 'maintenance'], ['arıza', 'issue'], ['ariza', 'issue'],
  ['müdahale', 'response'], ['mudahale', 'response'], ['temizlik', 'housekeeping'], ['kat', 'floor'], ['ana', 'main'], ['sayfa', 'page'],
  ['yardım', 'help'], ['yardim', 'help'], ['soru', 'question'], ['sık', 'frequent'], ['sik', 'frequent'], ['kayıt', 'record'],
  ['kayit', 'record'], ['kalıcı', 'persistent'], ['kalici', 'persistent'], ['kaynak', 'source'], ['ölçüm', 'metric'], ['olcum', 'metric'],
  ['sağlık', 'health'], ['saglik', 'health'], ['sağlıklı', 'healthy'], ['saglikli', 'healthy'], ['öneri', 'recommendation'],
  ['oneri', 'recommendation'], ['tahmin', 'forecast'], ['doluluk', 'occupancy'], ['yoğunluk', 'density'], ['yogunluk', 'density'],
  ['harita', 'map'], ['kimlik', 'identity'], ['uyarı', 'alert'], ['uyari', 'alert'], ['akış', 'workflow'], ['akis', 'workflow'],
  ['sahibi', 'owner'], ['sahip', 'owner'], ['profil', 'profile'], ['puanlama', 'rating'], ['politika', 'policy'], ['kural', 'rule'],
  ['seçenek', 'option'], ['secenek', 'option'], ['seçili', 'selected'], ['secili', 'selected'], ['liste', 'list'], ['tablo', 'table'],
  ['başlık', 'title'], ['baslik', 'title'], ['açıklama', 'description'], ['aciklama', 'description'], ['telefon', 'phone'],
  ['e-posta', 'email'], ['eposta', 'email'], ['adres', 'address'], ['ülke', 'country'], ['ulke', 'country'], ['şehir', 'city'],
  ['sehir', 'city'], ['mevcut', 'current'], ['kalan', 'remaining'], ['bulunmuyor', 'not found'], ['bulunamadı', 'not found'],
  ['bulunamadi', 'not found'], ['henüz', 'not yet'], ['henuz', 'not yet'], ['hazır', 'ready'], ['hazir', 'ready'],
  ['başarılı', 'successful'], ['basarili', 'successful'], ['başarısız', 'failed'], ['basarisiz', 'failed'],
  ['işaret', 'mark'], ['isaret', 'mark'], ['ekran', 'screen'], ['panel', 'panel'], ['menü', 'menu'], ['menu', 'menu'],
  ['kapat', 'close'], ['cevap', 'reply'], ['yanıt', 'reply'], ['yanit', 'reply'],
  ['çalışan', 'agent'], ['calisan', 'agent'], ['müşteri', 'customer'], ['musteri', 'customer'], ['konuşma', 'conversation'],
  ['konusma', 'conversation'], ['sohbet', 'chat'], ['okundu', 'read'], ['gönderildi', 'sent'], ['gonderildi', 'sent'],
  ['iletildi', 'delivered'], ['yazıyor', 'typing'], ['yaziyor', 'typing'],
  ['büro', 'office'], ['buro', 'office'], ['bölüm', 'section'], ['bolum', 'section'], ['bölge', 'region'], ['bolge', 'region'],
  ['sezon', 'season'], ['paket', 'package'], ['ücretsiz', 'free'], ['ucretsiz', 'free'], ['indirim', 'discount'],
  ['kupon', 'coupon'], ['kart', 'card'], ['cihaz', 'device'], ['oturum', 'session'], ['ayar', 'setting'], ['hata', 'error'],
  ['bekleyen', 'pending'], ['yanıtlanan', 'answered'], ['yanitlanan', 'answered'], ['kapatılan', 'closed'], ['kapatilan', 'closed'],
  ['inceleniyor', 'under review'], ['Türkiye', 'Turkey'],
]

const englishUnitReplacements: Record<string, string> = {
  ' aktif': ' active',
  ' bağlantılı konuşma': ' linked conversation',
  ' gece': ' nights',
  ' görsel': ' image',
  ' kişi': ' guests',
  ' kayıt': ' records',
  ' oda': ' rooms',
  ' öncelik': ' priority',
  ' yıldızlı tesis': ' star property',
  ' yıldız': ' stars',
  ' için': ' for',
  ' ile': ' with',
  ' sn': ' sec',
  ' dk': ' min',
  ' ve ': ' and ',
  ' veya ': ' or ',
}

const englishContentPhraseLabels: Record<string, string> = {
  '24 saat oda servisi': '24-hour room service',
  'Acil Müdahale': 'Emergency Response',
  'Acil Notlar': 'Urgent Notes',
  'Akıllı aydınlatma': 'Smart lighting',
  'Akıllı iklimlendirme': 'Smart climate control',
  'Akıllı klima': 'Smart air conditioning',
  'Akıllı oda kontrolü': 'Smart room control',
  'Akıllı perde': 'Smart curtains',
  'Akıllı TV': 'Smart TV',
  'Aile banyosu ve ek lavabo': 'Family bathroom and extra sink',
  'Aile Loft Süiti': 'Family Loft Suite',
  'Aile Odası': 'Family Room',
  'Aile Süiti': 'Family Suite',
  'Aile paketlerinde sezon farkı altyapısı aktif': 'Seasonal surcharge infrastructure is active for family packages',
  'Aile yatağı': 'Family bed',
  'Aile': 'Family',
  'Aktif Arıza': 'Active Issue',
  'Aktif Arızalar': 'Active Issues',
  'Aktif Kampanyalar': 'Active Campaigns',
  'Aktif Personel': 'Active Staff',
  'Aile süitleri, hızlı check-in ve kişiselleştirilmiş misafir deneyimiyle modern tesis.': 'A modern property with family suites, fast check-in, and a personalized guest experience.',
  'Aramana göre öne çıkan seçenekler': 'Featured options based on your search',
  'Atrium Deluxe Oda': 'Atrium Deluxe Room',
  'Atrium manzaralı balkon': 'Atrium-view balcony',
  'Atrium manzarası': 'Atrium view',
  'Bağlantılı Aile Odası': 'Connected Family Room',
  'Bağlantılı alan': 'Connected area',
  'Bağlantılı oda': 'Connected room',
  'Bakım Notları': 'Maintenance Notes',
  'Bakım Takvimi': 'Maintenance Calendar',
  'Bahçe Superior Oda': 'Garden Superior Room',
  'Bahçe erişimi': 'Garden access',
  'Bahçe çıkışlı teras': 'Garden-access terrace',
  'Başkan Süiti': 'Presidential Suite',
  'Bebek yatağı': 'Baby cot',
  'Bekleyen Faturalar': 'Pending Invoices',
  'Bekleyen Ödemeler': 'Pending Payments',
  'Bekleyen Rezervasyon': 'Pending Reservation',
  'Bekleyen Rezervasyonlar': 'Pending Reservations',
  'Belirtmek istemiyorum': 'Prefer not to say',
  'Boş Oda': 'Vacant Room',
  'Boş Odalar': 'Vacant Rooms',
  'Bugünkü Vardiya': 'Today’s Shift',
  'Butik Şehir Odası': 'Boutique City Room',
  'Canlı destek ekibine iletilen kalıcı talepler': 'Persistent requests sent to the live support team',
  'Canlı destek anlık sohbet içindir; destek talepleri ise konu bazlı ticket süreci olarak çalışır.': 'Live support is for instant chat; support requests operate as subject-based tickets.',
  'Check-in 14:00 sonrası': 'Check-in after 14:00',
  'Check-out 12:00 öncesi': 'Check-out before 12:00',
  'Check-in ve check-out kayıtları yoksa sıfır gösterilir': 'Shows zero when there are no check-in or check-out records',
  'Concierge': 'Concierge',
  'Çalışma köşesi': 'Work corner',
  'Çalışma masası': 'Work desk',
  'Çift lavabolu aile banyosu': 'Family bathroom with double sinks',
  'Çocuk alanı': 'Children’s area',
  'Çocuk yatağı': 'Child bed',
  'Deluxe Deniz Manzaralı Oda': 'Deluxe Sea View Room',
  'Deniz manzaralı odalar': 'Sea-view rooms',
  'Deniz manzarası, spa alanı ve sessiz kat konseptiyle şehir içinde lüks konaklama deneyimi.': 'A luxury urban stay experience with sea views, a spa area, and a quiet-floor concept.',
  'Deniz manzarası': 'Sea view',
  'Detay sayfasından otele özel oda görsellerini ve müsaitlik durumunu inceleyebilirsin.': 'From the detail page, you can review hotel-specific room images and availability.',
  'Dinlenme koltuğu': 'Lounge chair',
  'Doluluk oranına göre fiyat önerisi hazır': 'Price recommendation based on occupancy rate is ready',
  'Dolu Odalar': 'Occupied Rooms',
  'E-Arşiv Kuyruğu': 'E-Archive Queue',
  'Elektrik Takibi': 'Electrical Tracking',
  'Erken giriş veya geç çıkış taleplerini otelle mesajlaşma üzerinden iletebilirsin.': 'You can send early check-in or late check-out requests through hotel messaging.',
  'Erken rezervasyon kampanyası uygulanabilir': 'Early-booking campaign can be applied',
  'Esnek tarih değişikliği, iade yok': 'Flexible date change, no refund',
  'Espresso istasyonu': 'Espresso station',
  'Evcil hayvan politikası odaya göre değişir': 'Pet policy varies by room',
  'Executive İş Odası': 'Executive Business Room',
  'Executive Kat': 'Executive Floor',
  'Executive kat': 'Executive floor',
  'Favoriler ve Kaydedilen Odalar': 'Favorites and Saved Rooms',
  'Favoriler sayfasında oteller ve kaydedilen odalar ayrı bölümlerde kalıcı olarak saklanır.': 'On the Favorites page, hotels and saved rooms are stored permanently in separate sections.',
  'Fiber Wi-Fi 300 Mbps': 'Fiber Wi-Fi 300 Mbps',
  'Fiber Wi-Fi 350 Mbps': 'Fiber Wi-Fi 350 Mbps',
  'Fiber Wi-Fi 400 Mbps': 'Fiber Wi-Fi 400 Mbps',
  'Fiber Wi-Fi 450 Mbps': 'Fiber Wi-Fi 450 Mbps',
  'Fiber Wi-Fi 500 Mbps': 'Fiber Wi-Fi 500 Mbps',
  'Fiber Wi-Fi 750 Mbps': 'Fiber Wi-Fi 750 Mbps',
  'Fiber Wi-Fi 900 Mbps': 'Fiber Wi-Fi 900 Mbps',
  'Finans Dashboard': 'Finance Dashboard',
  'Finansal Analiz': 'Financial Analysis',
  'Fiyat Eğilimi': 'Price Trend',
  'Fransız balkon': 'French balcony',
  'Fatura Hazırla': 'Prepare Invoice',
  'Fatura Listesi': 'Invoice List',
  'Faturalar': 'Invoices',
  'Galeri Düzenleme': 'Gallery Editing',
  'Geç çıkış': 'Late check-out',
  'Geç çıkış opsiyonu': 'Late check-out option',
  'Geç çıkış talebi için rezervasyon bağlantılı otel sohbetini kullanabilirsiniz.': 'For late check-out requests, use the reservation-linked hotel chat.',
  'Gider Kalemleri': 'Expense Items',
  'Girişten 24 saat öncesine kadar ücretsiz iptal': 'Free cancellation up to 24 hours before check-in',
  'Girişten 48 saat öncesine kadar ücretsiz iptal': 'Free cancellation up to 48 hours before check-in',
  'Girişten 72 saat öncesine kadar ücretsiz iptal': 'Free cancellation up to 72 hours before check-in',
  'Gizlilik': 'Privacy',
  'Görev Atamaları': 'Task Assignments',
  'Görev Geçmişi': 'Task History',
  'Görev Takibi': 'Task Tracking',
  'Görevlerim': 'My Tasks',
  'Günlük Görevler': 'Daily Tasks',
  'Günlük Giriş / Çıkış': 'Daily Check-in / Check-out',
  'Günlük Kasa': 'Daily Cash Desk',
  'Günlük Kasa Devri': 'Daily Cash Handover',
  'Günlük Özet': 'Daily Summary',
  'Güvenlik Olayı': 'Security Event',
  'Gerçek güvenlik kayıtlarından hesaplanır': 'Calculated from real security records',
  'Gerçek misafir yorumlarından hesaplanır': 'Calculated from real guest reviews',
  'Gerçek rezervasyon kayıtlarından hesaplanır': 'Calculated from real reservation records',
  'Geniş aile balkonu': 'Large family balcony',
  'Geniş balkon': 'Large balcony',
  'Geniş duş alanı': 'Large shower area',
  'Geniş duş ve premium set': 'Large shower and premium set',
  'Geniş duş ve premium bakım seti': 'Large shower and premium amenity set',
  'Hafta Sonu': 'Weekend',
  'Hafta içi iş seyahati fiyatı uygulanır': 'Weekday business travel rate applies',
  'Hafta sonu +%12 dinamik fiyat altyapısı hazır': 'Weekend +12% dynamic pricing infrastructure is ready',
  'Hafta sonu deniz manzaralı oda talebi yükseldi': 'Weekend demand for sea-view rooms increased',
  'Hafta sonu farkı isteğe bağlı uygulanır': 'Weekend surcharge can be applied optionally',
  'Havale / EFT': 'Bank Transfer',
  'Havuz': 'Pool',
  'Her oda kartında kapasite, yatak tipi, kahvaltı, iade politikası ve oda özellikleri ayrı gösterilir.': 'Each room card separately displays capacity, bed type, breakfast, refund policy, and room features.',
  'Her otel için ayrı fotoğraf grubu': 'Separate photo group for each hotel',
  'Hızlı Erişim': 'Quick Access',
  'Hızlı Wi-Fi': 'Fast Wi-Fi',
  'Hızlı Yanıtlar': 'Quick Replies',
  'Hızlı check-in': 'Fast check-in',
  'Hızlı giriş': 'Fast entry',
  'Hızlı giriş ve kişiselleştirilmiş': 'Fast entry and personalized',
  'Hızlı rezervasyon': 'Quick reservation',
  'İade İşlemleri': 'Refund Transactions',
  'İade tamamlandı': 'Refund completed',
  'İade koşulları otelin iptal politikasına göre hesaplanır.': 'Refund terms are calculated based on the hotel cancellation policy.',
  'İade talebi': 'Refund request',
  'İç Bildirimler': 'Internal Notifications',
  'İç avlu penceresi': 'Inner courtyard window',
  'İletişim Bilgileri': 'Contact Information',
  'İptal Talebi': 'Cancellation Request',
  'İptal ve İade Politikası': 'Cancellation and Refund Policy',
  'İptal koşulları otelin oda politikasına göre değişir.': 'Cancellation terms vary by the hotel room policy.',
  'İptal talebi oluşturduğunda ödeme durumu ve tahmini iade süresi kart üzerinde gösterilir.': 'When you create a cancellation request, payment status and estimated refund time are shown on the card.',
  'İş seyahati ve hafta sonu kaçamakları için teraslı odalar, toplantı alanları ve premium servis.': 'Terrace rooms, meeting spaces, and premium service for business trips and weekend getaways.',
  'Kampanya koşulları tarih, oda tipi ve müsaitliğe göre değişebilir.': 'Campaign terms may vary by date, room type, and availability.',
  'Kampanyalı odalarda özel koşullar uygulanabilir.': 'Special terms may apply to promotional rooms.',
  'Kampanyalı rezervasyonda iade yok': 'No refund for promotional reservations',
  'Kapak Görseli': 'Cover Image',
  'Kapalı havuz': 'Indoor pool',
  'Karartma perde': 'Blackout curtains',
  'Karşılama ikramı': 'Welcome amenity',
  'Kart doğrulama, provizyon veya ödeme hatalarında önce kayıtlı ödeme yöntemini kontrol et.': 'For card verification, authorization, or payment errors, first check your saved payment method.',
  'Kaydedilen odalarından biri son 3 müsaitlikte': 'One of your saved rooms is down to the last 3 available',
  'Kent merkezi, ulaşım aksı': 'City center, transit corridor',
  'Kişisel talepler': 'personal requests',
  'Klima Durumu': 'Air Conditioning Status',
  'Kompakt Lüks Oda': 'Compact Luxury Room',
  'Konferans dönemleri için dinamik fiyat kuralı hazır': 'Dynamic pricing rule is ready for conference periods',
  'Konuşma Filtreleri': 'Conversation Filters',
  'Körfez hattı': 'Bay line',
  'Köşe cam cephe': 'Corner glass facade',
  'Kredi kartı, sanal POS ve tesiste ödeme seçenekleri desteklenir.': 'Credit card, virtual POS, and pay-at-property options are supported.',
  'Kuru temizleme': 'Dry cleaning',
  'Kupon kodunu rezervasyon özetindeki indirim alanına girebilirsin.': 'You can enter the coupon code in the discount field of the reservation summary.',
  'Kuponlar': 'Coupons',
  'Lobi fotoğrafları': 'Lobby photos',
  'Malzeme Takibi': 'Inventory Tracking',
  'Merkezi konum': 'Central location',
  'Mermer duş ve bakım seti': 'Marble shower and amenity set',
  'Misafir Kartları': 'Guest Cards',
  'Misafir Listesi': 'Guest List',
  'Misafir deneyimi': 'Guest experience',
  'Misafir deneyimi; sessiz oda katları, kişisel talepler, hızlı iletişim ve net rezervasyon politikaları ile yönetilir.': 'Guest experience is managed through quiet room floors, personal requests, fast communication, and clear reservation policies.',
  'Misafir veya oda sayısını değiştirerek tekrar ara.': 'Change the guest or room count and search again.',
  'Mini bar': 'Mini bar',
  'Modern duş alanı': 'Modern shower area',
  'Müdahale Süreleri': 'Response Times',
  'Müşteri Memnuniyeti': 'Guest Satisfaction',
  'Müşteri Notları': 'Guest Notes',
  'Nakit Akışı': 'Cash Flow',
  'Oda Bazlı Gelir': 'Room-Based Revenue',
  'Oda Bilgileri': 'Room Information',
  'Oda Kontrolü': 'Room Inspection',
  'Oda Servisi': 'Room Service',
  'Oda değişikliği yapabilir miyim?': 'Can I change my room?',
  'Oda kartındaki kalp ikonunu kullanarak kayıt oluşturabilirsin.': 'You can save a record using the heart icon on the hotel or room card.',
  'Oda kartında ayrı olarak gösterilir.': 'It is shown separately on the room card.',
  'Oda seçenekleri': 'Room options',
  'Oda ve restoran hizmetleri': 'Room and restaurant services',
  'Oda içi eğlence': 'In-room entertainment',
  'Okul tatili sezon fiyatı kuralı hazır': 'School holiday seasonal pricing rule is ready',
  'Online / müsait / meşgul / offline durumları': 'Online / available / busy / offline statuses',
  'Operasyon Notları': 'Operation Notes',
  'Otel detayındaki politikalar bölümünden veya otel mesajlarından doğrulayabilirsiniz.': 'You can verify this from the policies section on the hotel detail page or through hotel messages.',
  'Otel detayından veya Mesajlar sayfasından her otel için ayrı konuşma başlatabilirsin.': 'From the hotel detail page or messages area, you can start a separate conversation for each hotel.',
  'Otel kartlarını inceledikten sonra tarih, kişi ve oda bilgisini netleştir.': 'After reviewing hotel cards, confirm date, guest, and room details.',
  'Otel sahibi mesajı açınca okundu bilgisi ve yanıtlar konuşmaya düşer.': 'When the hotel owner opens the message, read status and replies appear in the conversation.',
  'Oturma bölümü': 'Seating area',
  'Otel veya oda kartındaki kalp ikonunu kullanarak kayıt oluşturabilirsin.': 'Use the heart icon on hotel or room cards to save them.',
  'Otel bazlı yoğunluk': 'Hotel-based density',
  'Otel mesajlaşma': 'Hotel messaging',
  'Otel onayı gereken durumlarda bildirim merkezinden güncelleme alırsınız.': 'When hotel approval is required, you receive updates from the notification center.',
  'Otel sahibi paneli': 'Hotel owner panel',
  'Otel talebi': 'Hotel request',
  'Ödeme Al': 'Take Payment',
  'Ödeme ve müsaitlik kontrolü tamamlandığında rezervasyon kodu oluşturulur.': 'A reservation code is created when payment and availability checks are completed.',
  'Ödeme yöntemleri nelerdir?': 'What payment methods are available?',
  'Ön Büro': 'Front Office',
  'Ön Provizyon': 'Pre-Authorization',
  'Ön Büro akışı': 'Front office flow',
  'Özel teras': 'Private terrace',
  'Özel istek': 'Special request',
  'Özel istekler': 'Special requests',
  'Panoramik Köşe Süit': 'Panoramic Corner Suite',
  'Panoramik manzara': 'Panoramic view',
  'Pasaport Bilgileri': 'Passport Information',
  'Performans Durumu': 'Performance Status',
  'Performans Kayıtları': 'Performance Records',
  'Plan Önerileri': 'Plan Suggestions',
  'Planlı Bakımlar': 'Scheduled Maintenance',
  'POS Hareketleri': 'POS Movements',
  'Premium Deniz': 'Premium Sea',
  'Premium bakım seti': 'premium amenity set',
  'Premium rezervasyon deneyimleri': 'premium reservation experiences',
  'Premium servis': 'premium service',
  'Provizyon': 'Authorization',
  'Puan Dağılımı': 'Rating Distribution',
  'Resepsiyon Akışı': 'Reception Flow',
  'Restoran rezervasyonu': 'Restaurant reservation',
  'Rezervasyon Güncellemeleri': 'Reservation Updates',
  'Rezervasyon İşlemleri': 'Reservation Operations',
  'Rezervasyon Mesajları': 'Reservation Messages',
  'Rezervasyon Onayları': 'Reservation Approvals',
  'Rezervasyon iptali için Rezervasyonlarım sayfasından ilgili rezervasyonu seçebilirsiniz.': 'To cancel a reservation, select the relevant reservation from My Reservations.',
  'Rezervasyon nasıl iptal edilir?': 'How do I cancel my reservation?',
  'Rezervasyon sırasında kahvaltı tercihini değiştirebilirsiniz.': 'You can change your breakfast preference during reservation.',
  'Rezervasyon sırasında': 'During reservation',
  'Rezervasyon, ödeme, otel mesajları veya hesap güvenliği başlıklarından biriyle ilerleyebiliriz.': 'We can continue with reservation, payment, hotel messages, or account security.',
  'Rezervasyonlarım bölümünde ilgili karttaki iptal işlemi üzerinden talep oluşturabilirsiniz.': 'In My Reservations, you can create a request through the cancellation action on the related card.',
  'Rezervasyonlarım alanında görünür': 'appears in My Reservations',
  'Rezervasyonlarım sayfasından ilgili rezervasyonu seçebilirsiniz.': 'You can select the related reservation from My Reservations.',
  'Rezervasyon yoğunluğu tahmini': 'Reservation density forecast',
  'Rezervasyon yaptığın tesisler büyük otel görselleri, oda önizlemeleri, ödeme özeti ve hızlı iletişim aksiyonlarıyla gösterilir.': 'Booked properties are shown with large hotel visuals, room previews, payment summaries, and quick contact actions.',
  'Sahil hattı, merkezi konum': 'Coastal line, central location',
  'Sadakat Programı': 'Loyalty Program',
  'Seçili bölge için 12 günlük talep': '12-day demand for the selected area',
  'Seçili otel ve oda': 'Selected hotel and room',
  'Seçili tesislerin ortalaması': 'Average of selected properties',
  'Seçtiğin tarih, kişi ve oda bilgisine uygun tesis bulunamadı.': 'No property matches the selected date, guest, and room details.',
  'Seçtiğin tarihlere göre müsait tesisler': 'Available properties for your selected dates',
  'Senin için önerilen': 'Recommended for you',
  'Sessiz Kat Superior': 'Quiet Floor Superior',
  'Sessiz cephe': 'Quiet facade',
  'Sessiz çalışma': 'Quiet work setup',
  'Sessiz kat konsepti': 'quiet-floor concept',
  'Sessiz kat': 'Quiet floor',
  'Sessiz oda': 'Quiet room',
  'Sigara içilmeyen oda seçeneği varsayılandır': 'Non-smoking room is the default option',
  'Sık Sorulan Sorular': 'Frequently Asked Questions',
  'Sistem genel sağlık durumu': 'Overall system health status',
  'Sistem içi bildirim': 'In-app notification',
  'Sistem çalışma durumu': 'System operating status',
  'Sosyal Medya Bağlantıları': 'Social Media Links',
  'Spa Erişimli Wellness Oda': 'Spa Access Wellness Room',
  'Spa avlusu manzaralı': 'Spa courtyard view',
  'Spa erişimi': 'Spa access',
  'Spa paketine göre kampanya altyapısı hazır': 'Campaign infrastructure is ready based on spa package',
  'Standart check-in saati 14:00 sonrasıdır.': 'Standard check-in time is after 14:00.',
  'Standart çıkış saati çoğu tesiste 12:00 olarak uygulanır.': 'Standard check-out time is 12:00 at most properties.',
  'Şehir cephesi': 'City-facing facade',
  'Şehir erişimi ile lüks konaklama konforunu birleştiren premium bir otel profili olarak kurgulandı.': 'Designed as a premium hotel profile combining urban accessibility with luxury stay comfort.',
  'Şehir manzarası': 'City view',
  'Şikayet ve Talepler': 'Complaints and Requests',
  'Tahsilatlar': 'Collections',
  'Talep artış oranı': 'Demand growth rate',
  'Tamamlananlar': 'Completed',
  'Tarih değişikliği bir kez ücretsiz': 'One date change is free',
  'Tarih, kişi sayısı ve oda seçimlerini rezervasyon akışından düzenleyebilirsin.': 'You can edit dates, guest count, and room selections from the reservation flow.',
  'Teras Odası': 'Terrace Room',
  'Teraslı Premium Oda': 'Premium Terrace Room',
  'Teras talebine göre hafta sonu farkı hazırlanmış': 'Weekend surcharge is prepared based on terrace demand',
  'Tek büyük yatak': 'Single large bed',
  'Tek kişi konaklama fiyat modülü hazır': 'Single-guest pricing module is ready',
  'Tek misafir odaklı': 'Single-guest focused',
  'Temizlik Bekleyenler': 'Waiting for Housekeeping',
  'Toplantı alanları': 'meeting spaces',
  'Toplantı masası': 'Meeting desk',
  'Toplantı salonu': 'Meeting room',
  'Tüm tesisler, finans, güvenlik, yetki ve entegrasyon akışlarını tek merkezden izle.': 'Monitor all properties, finance, security, permissions, and integration flows from one center.',
  'Ulaşım aksı': 'transit corridor',
  'Uygun Tesis': 'Available Property',
  'Uygun tesis': 'Available property',
  'Vale': 'Valet',
  'Vardiya Bilgileri': 'Shift Information',
  'Vardiya Durumu': 'Shift Status',
  'Vergi Raporları': 'Tax Reports',
  'VIP karşılama': 'VIP welcome',
  'VIP kat': 'VIP floor',
  'Yapay zeka öneri kartları': 'AI recommendation cards',
  'Yağmur duşlu mermer banyo': 'Marble bathroom with rain shower',
  'Yağmur duş': 'Rain shower',
  'Yaklaşan konaklama planı': 'Upcoming stay plan',
  'Yanıt Bekleyen Yorumlar': 'Reviews Awaiting Reply',
  'Yatak tipi': 'Bed type',
  'Yaz Sezonu': 'Summer Season',
  'Yeni Teknik Talep': 'New Technical Request',
  'Yeni tesis sözleşmesi onaylandı': 'New property contract approved',
  'Yetkilendirme rolü güncellendi': 'Authorization role updated',
  'Yorum Analizi': 'Review Analysis',
  'Yüksek kat şehir manzarası': 'High-floor city view',
  'Ödeme hatalarında': 'payment errors',
  'Ödeme yöntemimi nasıl eklerim?': 'How do I add my payment method?',
  'Öncelikli İşler': 'Priority Tasks',
  'Özel koşullar': 'special terms',
  'Ücretsiz iptal': 'free cancellation',
  'İngilizce': 'English',
  'Almanca': 'German',
  'Fransızca': 'French',
  'Kadın': 'Female',
  'Erkek': 'Male',
  'Fark etmez': 'No preference',
  'Twin yatak': 'Twin bed',
  'King yatak': 'King bed',
  'Queen yatak': 'Queen bed',
  'Tek kişilik yatak': 'single bed',
  'Tek kişilik': 'single',
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


function preserveEnglishProperNames(value: string, transform: (protectedValue: string) => string) {
  const protectedPairs: Array<[string, string]> = []
  let protectedValue = value

  englishProtectedProperNames.forEach((name, index) => {
    if (!protectedValue.includes(name)) return
    const token = `__EN_PROPER_${index}__`
    protectedValue = protectedValue.split(name).join(token)
    protectedPairs.push([token, name])
  })

  let transformed = transform(protectedValue)
  protectedPairs.forEach(([token, name]) => {
    transformed = transformed.split(token).join(name)
  })

  return transformed
}

function matchCapitalization(source: string, replacement: string) {
  if (!source) return replacement
  if (source === source.toUpperCase()) return replacement.toUpperCase()
  if (source[0] === source[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function applyEnglishNoTurkishFallback(value: string) {
  return preserveEnglishProperNames(value, (protectedValue) => {
    let translated = protectedValue

    englishTurkishStemFallbacks.forEach(([stem, replacement]) => {
      const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(stem)}[\\p{L}\\p{N}]*(?![\\p{L}\\p{N}])`, 'giu')
      translated = translated.replace(pattern, (match) => matchCapitalization(match, replacement))
    })

    return translated
  })
}

const translatedTextNodes = new WeakMap<Text, { original: string; translated: string }>()
const translatedAttributes = new WeakMap<Element, Partial<Record<'aria-label' | 'placeholder' | 'title', { original: string; translated: string }>>>()

function translateUiTextToEnglish(value: string) {
  if (!value.trim()) {
    return value
  }

  const leading = value.match(/^\s*/)?.[0] ?? ''
  const trailing = value.match(/\s*$/)?.[0] ?? ''
  let text = value.trim()
  const exactLabels = {
    ...englishUiLabels,
    ...englishExactTextLabels,
    ...englishAdditionalExactTextLabels,
    ...englishPanelExactTextLabels,
    ...englishLastPassExactTextLabels,
    ...englishNoTurkishExactTextLabels,
  }

  if (exactLabels[text]) {
    return `${leading}${exactLabels[text]}${trailing}`
  }

  const protectedProperNames: Array<[string, string]> = []
  englishProtectedProperNames.forEach((name, index) => {
    if (!text.includes(name)) return
    const token = `__EN_TEXT_PROPER_${index}__`
    text = text.split(name).join(token)
    protectedProperNames.push([token, name])
  })

  const replacements = {
    ...englishUiLabels,
    ...englishContentPhraseLabels,
    ...englishFullCoveragePhraseReplacements,
    ...englishLastPassExactTextLabels,
    ...englishNoTurkishExactTextLabels,
    ...englishPhraseReplacements,
    ...englishAdditionalPhraseReplacements,
  }

  Object.entries(replacements)
    .filter(([source]) => !['ve', 'veya', 'ile', 'için', 'gece', 'yıldız', 'favori', 'evet', 'hayır', 'erişim', 'şüpheli', 'güven'].includes(source))
    .sort(([first], [second]) => second.length - first.length)
    .forEach(([source, target]) => {
      text = text.replace(new RegExp(escapeRegExp(source), 'g'), target)
    })

  Object.entries(englishUnitReplacements).forEach(([source, target]) => {
    text = text.replace(new RegExp(`${escapeRegExp(source)}(?![\\p{L}\\p{N}])`, 'gu'), target)
  })

  Object.entries(englishSystemWordFallbacks).forEach(([source, target]) => {
    text = text.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(source)}(?![\\p{L}\\p{N}])`, 'gu'), target)
  })

  text = text
    .replace(/(\d+)\s*giriş/g, '$1 arrivals')
    .replace(/(\d+)\s*çıkış/g, '$1 departures')
    .replace(/(\d+)\s*öneri/g, '$1 recommendations')
    .replace(/(\d+)\s*seçenek/g, '$1 options')
    .replace(/(\d+)\s*uygun tesis/g, '$1 available properties')
    .replace(/(\d+)\s*kayıt listeleniyor/g, '$1 records listed')
    .replace(/(\d+)\s*arama sonucu/g, '$1 search results')
    .replace(/(\d+)\s*oda tipi uygun/g, '$1 room types available')
    .replace(/(\d+)\s*oda tipi/g, '$1 room types')
    .replace(/(\d+)\s*tesis/g, '$1 properties')
    .replace(/(\d+)\s*gerçek personel kaydı/g, '$1 real staff records')
    .replace(/(\d+)\s*otel konuşması/g, '$1 hotel conversations')
    .replace(/(\d+)\s*kayıtlı destek talebi/g, '$1 saved support requests')
    .replace(/(\d+)\s*okunmamış canlı destek yanıtı/g, '$1 unread live support replies')
    .replace(/(\d+)\s*gece/g, '$1 nights')
    .replace(/(\d+)\s*kişi/g, '$1 guests')
    .replace(/(\d+)\s*oda/g, '$1 rooms')
    .replace(/(\d+)\s*yetişkin/g, '$1 adults')
    .replace(/(\d+)\s*çocuk/g, '$1 children')
    .replace(/(\d+)\s*saat/g, '$1 hours')
    .replace(/(\d+)\s*gün/g, '$1 days')
    .replace(/Your account (.+?) tarihine kadar devre dışı bırakıldı\./, 'Your account has been disabled until $1.')
    .replace(/Your administrator account (.+?) status\. Sign-in is not allowed\./, 'Your administrator account is $1. Sign-in is not allowed.')

  text = applyEnglishNoTurkishFallback(text)
  protectedProperNames.forEach(([token, name]) => {
    text = text.split(token).join(name)
  })

  return `${leading}${text}${trailing}`
}

function translateElementToEnglish(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement

      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT
      }

      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })
  const textNodes: Text[] = []
  let currentNode = walker.nextNode()

  while (currentNode) {
    textNodes.push(currentNode as Text)
    currentNode = walker.nextNode()
  }

  textNodes.forEach((node) => {
    if (node.parentElement?.tagName === 'OPTION' && !node.parentElement.hasAttribute('value')) {
      node.parentElement.setAttribute('value', node.nodeValue?.trim() ?? '')
    }

    const currentValue = node.nodeValue ?? ''
    const existing = translatedTextNodes.get(node)
    const original = existing && (currentValue === existing.translated || currentValue === existing.original)
      ? existing.original
      : currentValue
    const translated = translateUiTextToEnglish(original)
    translatedTextNodes.set(node, { original, translated })

    if (translated !== currentValue) {
      node.nodeValue = translated
    }
  })

  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))] : Array.from(root.querySelectorAll<HTMLElement>('*'))

  elements.forEach((element) => {
    ;(['placeholder', 'title', 'aria-label'] as const).forEach((attribute) => {
      const value = element.getAttribute(attribute)

      if (!value) {
        return
      }

      const records = translatedAttributes.get(element) ?? {}
      const existing = records[attribute]
      const original = existing && (value === existing.translated || value === existing.original)
        ? existing.original
        : value
      const translated = translateUiTextToEnglish(original)

      records[attribute] = { original, translated }
      translatedAttributes.set(element, records)

      if (translated !== value) {
        element.setAttribute(attribute, translated)
      }
    })
  })
}

function restoreElementLanguage(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  let currentNode = walker.nextNode()

  while (currentNode) {
    textNodes.push(currentNode as Text)
    currentNode = walker.nextNode()
  }

  textNodes.forEach((node) => {
    const record = translatedTextNodes.get(node)

    if (record && node.nodeValue === record.translated) {
      node.nodeValue = record.original
    }
  })

  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))] : Array.from(root.querySelectorAll<HTMLElement>('*'))

  elements.forEach((element) => {
    const records = translatedAttributes.get(element)

    if (!records) {
      return
    }

    ;(['placeholder', 'title', 'aria-label'] as const).forEach((attribute) => {
      const record = records[attribute]

      if (record && element.getAttribute(attribute) === record.translated) {
        element.setAttribute(attribute, record.original)
      }
    })
  })
}

function useEnglishInterface(language: LanguageCode) {
  useEffect(() => {
    if (language !== 'en') {
      restoreElementLanguage(document.body)
      return undefined
    }

    let animationFrame = 0
    const translate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => translateElementToEnglish(document.body))
    }
    const observer = new MutationObserver(translate)

    translate()
    observer.observe(document.body, {
      attributeFilter: ['placeholder', 'title', 'aria-label'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [language])
}

const DEFAULT_ADMIN_TC = '34718902564'
const DEFAULT_OWNER_USERNAME = 'hotelowner'
const DEFAULT_OWNER_PASSWORD = 'Hotel123*'

function createDemoTcKimlikNo(seed: string) {
  const base = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 317)
  const digits = Array.from({ length: 11 }, (_, index) => String((base + index * 7) % 10))

  if (digits[0] === '0') {
    digits[0] = '1'
  }

  return digits.join('')
}

const DEFAULT_OWNER_TC = createDemoTcKimlikNo(DEFAULT_OWNER_USERNAME)

function normalizeAdminAccounts(accounts: StoredAdminAccount[]) {
  const defaultAdmin: StoredAdminAccount = {
    createdAt: 'Sistem varsayılan hesabı',
    email: portals.find((portal) => portal.role === 'SuperAdmin')?.email ?? 'yonetici@otel.local',
    password: portals.find((portal) => portal.role === 'SuperAdmin')?.password ?? 'Admin123!',
    status: 'Aktif',
    tcKimlikNo: DEFAULT_ADMIN_TC,
    username: 'yonetici',
  }
  const merged = [
    defaultAdmin,
    ...accounts.filter((account) => normalizeSearch(account.username) !== 'yonetici'),
  ]
  const usedTc = new Set<string>()

  return merged.map((account, index) => {
    let nextTc = account.tcKimlikNo?.replace(/\D/g, '') || createDemoTcKimlikNo(`${account.username}-${index}`)

    while (usedTc.has(nextTc)) {
      nextTc = createDemoTcKimlikNo(`${account.username}-${index}-${usedTc.size}`)
    }

    usedTc.add(nextTc)

    return {
      ...account,
      email: account.email ?? `${account.username}@admin.local`,
      tcKimlikNo: nextTc,
    }
  })
}

function getStoredAdminAccountsWithTc() {
  const accounts = normalizeAdminAccounts(readStoredValue<StoredAdminAccount[]>(ADMIN_ACCOUNTS_STORAGE_KEY, []))

  writeStoredValue(ADMIN_ACCOUNTS_STORAGE_KEY, accounts)
  return accounts
}

function getSeedHotelSource(hotels: HotelRecord[] = []) {
  return hotels.slice(0, 3)
}

function createDefaultOwnerAccount(hotels: HotelRecord[] = []): StoredOwnerAccount {
  const seedHotels = getSeedHotelSource(hotels)
  const hotelIds = seedHotels.map((hotel) => hotel.id)

  return {
    createdAt: 'Sistem başlangıç verisi',
    email: 'hotelowner@otel.local',
    fullName: 'Varsayılan Otel Sahibi',
    hotelId: hotelIds[0] ?? '',
    hotelIds,
    id: 'owner-default-hotelowner',
    password: DEFAULT_OWNER_PASSWORD,
    phone: '+90 555 010 00 01',
    status: 'Aktif',
    tcKimlikNo: DEFAULT_OWNER_TC,
    username: DEFAULT_OWNER_USERNAME,
  }
}

function normalizeOwnerAccounts(accounts: StoredOwnerAccount[], hotels: HotelRecord[] = []) {
  const usedUsernames = new Set<string>()
  const usedTcNumbers = new Set<string>()
  const defaultOwner = createDefaultOwnerAccount(hotels)
  const sourceAccounts = accounts.some((account) => normalizeSearch(account.username ?? '') === DEFAULT_OWNER_USERNAME)
    ? accounts
    : [defaultOwner, ...accounts]

  return sourceAccounts.reduce<StoredOwnerAccount[]>((normalized, account, index) => {
      if (!account.username?.trim() || !account.tcKimlikNo?.trim()) {
        return normalized
      }

      const username = account.username.trim()
      const normalizedUsername = normalizeSearch(username)
      const isDefaultOwner = normalizedUsername === DEFAULT_OWNER_USERNAME

      if (usedUsernames.has(normalizedUsername)) {
        return normalized
      }

      let tcKimlikNo = account.tcKimlikNo.replace(/\D/g, '')

      if (tcKimlikNo.length !== 11) {
        tcKimlikNo = createDemoTcKimlikNo(`${username}-owner-${index}`)
      }

      while (usedTcNumbers.has(tcKimlikNo)) {
        tcKimlikNo = createDemoTcKimlikNo(`${username}-owner-${index}-${usedTcNumbers.size}`)
      }

      usedUsernames.add(normalizedUsername)
      usedTcNumbers.add(tcKimlikNo)

      const storedHotelIds = Array.isArray(account.hotelIds) ? account.hotelIds.filter(Boolean) : []
      const fallbackHotelIds = account.hotelId ? [account.hotelId] : []
      const hotelIds = isDefaultOwner
        ? Array.from(new Set([...defaultOwner.hotelIds ?? [], ...storedHotelIds, ...fallbackHotelIds]))
        : Array.from(new Set([...storedHotelIds, ...fallbackHotelIds]))

      normalized.push({
        ...account,
        createdAt: account.createdAt ?? formatDateTime(new Date()),
        id: account.id ?? `owner-${username}-${index}`,
        hotelId: account.hotelId ?? hotelIds[0] ?? '',
        hotelIds,
        password: isDefaultOwner ? (account.password || DEFAULT_OWNER_PASSWORD) : account.password,
        status: account.status ?? 'Aktif',
        tcKimlikNo,
        username,
      })

      return normalized
    }, [])
}

function getStoredOwnerAccounts(hotels: HotelRecord[] = []) {
  const accounts = normalizeOwnerAccounts(readStoredValue<StoredOwnerAccount[]>(OWNER_ACCOUNTS_STORAGE_KEY, []), hotels)

  writeStoredValue(OWNER_ACCOUNTS_STORAGE_KEY, accounts)
  return accounts
}

function idsMatch(left?: string | number | null, right?: string | number | null) {
  return left !== undefined && left !== null && right !== undefined && right !== null && String(left) === String(right)
}

function guestScopedStorageKey(baseKey: string, guestId: string) {
  return `${baseKey}.${guestId || 'anonymous'}`
}

function readGuestScopedIdList(baseKey: string, guestId: string) {
  const scopedKey = guestScopedStorageKey(baseKey, guestId)
  const scopedValue = localStorage.getItem(scopedKey)

  if (scopedValue !== null) {
    const scopedList = readStoredValue<string[]>(scopedKey, [])
    const legacyList = readStoredValue<string[]>(baseKey, [])

    if (scopedList.length > 0 || legacyList.length === 0) {
      return scopedList
    }

    writeStoredValue(scopedKey, legacyList)
    localStorage.removeItem(baseKey)
    return legacyList
  }

  const legacyValue = readStoredValue<string[]>(baseKey, [])

  if (legacyValue.length > 0) {
    writeStoredValue(scopedKey, legacyValue)
    localStorage.removeItem(baseKey)
  }

  return legacyValue
}

function getAllStoredFavoriteHotelIds() {
  const ids = new Set(readStoredValue<string[]>(FAVORITE_HOTELS_STORAGE_KEY, []))

  if (typeof window === 'undefined') {
    return Array.from(ids)
  }

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)

    if (key?.startsWith(`${FAVORITE_HOTELS_STORAGE_KEY}.`)) {
      readStoredValue<string[]>(key, []).forEach((hotelId) => ids.add(hotelId))
    }
  }

  return Array.from(ids)
}

function getOwnerIdForHotel(hotelId: string, hotels: HotelRecord[] = []) {
  const ownerAccount = getStoredOwnerAccounts(hotels).find((account) =>
    idsMatch(account.hotelId, hotelId) || account.hotelIds?.some((accountHotelId) => idsMatch(accountHotelId, hotelId)),
  )

  return ownerAccount?.id ?? `owner-${hotelId}`
}

function getOwnedHotelsForUser(user: AuthUser, hotels: HotelRecord[]) {
  if (user.role !== 'PropertyManager') {
    return []
  }

  const sourceHotels = hotels
  const ownerAccounts = getStoredOwnerAccounts(sourceHotels)
  const ownerAccount = ownerAccounts.find((account) =>
    normalizeSearch(account.username) === normalizeSearch(user.username ?? '') ||
    normalizeSearch(account.email ?? '') === normalizeSearch(user.email),
  )
  const statusRecords = getAdminHotelStatuses()
  const recoveredHotelIds = statusRecords
    .filter((record) => normalizeSearch(record.updatedBy ?? '') === normalizeSearch(user.email))
    .map((record) => record.hotelId)
  const ownerHotelIds = ownerAccount?.hotelIds?.length
    ? ownerAccount.hotelIds
    : ownerAccount?.hotelId
      ? [ownerAccount.hotelId]
      : []
  const mergedOwnerHotelIds = Array.from(new Set([...ownerHotelIds, ...recoveredHotelIds].filter(Boolean)))

  if (ownerAccount && recoveredHotelIds.some((hotelId) => !ownerHotelIds.some((ownerHotelId) => idsMatch(ownerHotelId, hotelId)))) {
    const nextAccounts = ownerAccounts.map((account) =>
      account.id === ownerAccount.id
        ? {
            ...account,
            hotelId: account.hotelId || mergedOwnerHotelIds[0] || '',
            hotelIds: mergedOwnerHotelIds,
          }
        : account,
    )

    writeStoredValue(OWNER_ACCOUNTS_STORAGE_KEY, nextAccounts)
  }

  const ownedHotels = sourceHotels.filter((hotel) => mergedOwnerHotelIds.some((hotelId) => idsMatch(hotelId, hotel.id)))

  return ownedHotels
}

const initialLoginForms = portals.reduce(
  (forms, portal) => ({
    ...forms,
    [portal.role]: {
      email: portal.role === 'SuperAdmin' ? 'yonetici' : portal.role === 'PropertyManager' ? DEFAULT_OWNER_USERNAME : portal.email,
      password: portal.role === 'PropertyManager' ? DEFAULT_OWNER_PASSWORD : portal.password,
      remember: true,
      tcKimlikNo: portal.role === 'SuperAdmin' ? DEFAULT_ADMIN_TC : portal.role === 'PropertyManager' ? DEFAULT_OWNER_TC : '',
    },
  }),
  {} as Record<UserRole, LoginForm>,
)

const initialGuestRegisterForm: GuestRegisterForm = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  kvkkAccepted: false,
  userAgreementAccepted: false,
}

const initialGuestProfileForm: GuestProfileForm = {
  firstName: '',
  lastName: '',
  tcKimlikNo: '',
  birthDate: '',
  gender: 'Belirtmek istemiyorum',
  phone: '',
  country: 'Türkiye',
  city: '',
  address: '',
  documentType: 'T.C. Kimlik',
  passportNumber: '',
  nationality: 'Türkiye',
  preferredLanguage: 'Türkçe',
  invoiceInfo: '',
  paymentPreference: 'Kredi Kartı',
  specialRequests: '',
  accessibilityNeeds: false,
  nonSmokingRoomPreference: true,
  bedTypePreference: 'King yatak',
  breakfastPreference: true,
  petInfo: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
}

const adminSections: SidebarSection[] = [
  {
    id: 'sistem',
    title: 'Genel Sistem Yönetimi',
    items: ['Genel Durum', 'Son İşlemler'],
  },
  {
    id: 'oteller',
    title: 'Tüm Oteller',
    items: ['Otel Listesi', 'Onay Bekleyen Oteller', 'Askıya Alınan Oteller', 'Sistemden Kaldırılan Oteller'],
  },
  {
    id: 'rezervasyon',
    title: 'Rezervasyon Yönetimi',
    items: ['Aktif Rezervasyonlar', 'Geçmiş Rezervasyonlar', 'İptal Edilen Rezervasyonlar'],
  },
  {
    id: 'personel',
    title: 'Personel Kontrolü',
    items: ['Yönetici Hesapları', 'Otel Sahipleri', 'Personel Kullanıcıları', 'Yetki Rolleri'],
  },
  {
    id: 'guvenlik',
    title: 'Güvenlik Merkezi',
    items: ['Güvenlik Logları', 'Aktif Cihazlar', 'Yetki İhlalleri'],
  },
  {
    id: 'finans',
    title: 'Finans Merkezi',
    items: ['Gelir Özeti', 'İadeler', 'Otel Bazlı Gelir', 'Aylık Raporlar'],
  },
  {
    id: 'ai',
    title: 'Yapay Zeka Analizleri',
    items: ['Talep Tahmini', 'Doluluk Tahmini', 'Risk Analizi', 'Kampanya Önerileri', 'Yoğunluk Analizi'],
  },
  {
    id: 'performans',
    title: 'Sistem Performansı',
    items: ['Sunucu Durumu', 'API Performansı', 'Veri Tabanı Durumu', 'Sistem Yükü'],
  },
]

const ownerSections: SidebarSection[] = [
  {
    id: 'genel',
    title: 'Otel Genel Durumu',
    items: ['Ana Sayfa', 'Genel Bakış', 'Oda Doluluk Durumu', 'Gelir Özeti'],
  },
  {
    id: 'oda',
    title: 'Oda Yönetimi',
    items: ['Oda Yönetimi'],
  },
  {
    id: 'finans',
    title: 'Fiyat Yönetimi',
    items: ['Fiyat Yönetimi'],
  },
  {
    id: 'rezervasyon',
    title: 'Rezervasyon Yönetimi',
    items: ['Aktif Rezervasyonlar', 'İptal Edilen Rezervasyonlar'],
  },
  {
    id: 'ayarlar',
    title: 'Otel Hakkında',
    items: ['Otel Hakkında', 'Otel Ekle'],
  },
  {
    id: 'musteri',
    title: 'Müşteri Memnuniyeti',
    items: ['Müşteri Memnuniyeti'],
  },
  {
    id: 'kampanya',
    title: 'Kampanya Yönetimi',
    items: ['Aktif Kampanyalar', 'Kuponlar', 'Kampanya Performansı'],
  },
  {
    id: 'personel',
    title: 'Personel Listesi',
    items: ['Personel Listesi'],
  },
  {
    id: 'gelir',
    title: 'Gelir Raporları',
    items: ['Günlük Gelir', 'Haftalık Gelir', 'Aylık Gelir', 'Oda Bazlı Gelir'],
  },
  {
    id: 'mesaj',
    title: 'Misafir Mesajları',
    items: ['Misafir Mesajları'],
  },
]

const guestSections: SidebarSection[] = [
  {
    id: 'ana-panel',
    title: 'Ana Sayfa',
    items: ['Otel Önerileri', 'Popüler Oteller', 'Kampanyalar'],
  },
  {
    id: 'rezervasyon',
    title: 'Rezervasyonlarım',
    items: ['Rezervasyon Yap', 'Aktif Rezervasyonlar', 'Geçmiş Rezervasyonlar', 'İptal Edilen Rezervasyonlar'],
  },
  {
    id: 'favori',
    title: 'Favoriler',
    items: ['Favori Oteller', 'Kaydedilen Odalar'],
  },
  {
    id: 'bildirim',
    title: 'Bildirimler',
    items: [],
  },
  {
    id: 'destek',
    title: 'Destek Merkezi',
    items: ['Otel Mesajları', 'Canlı Destek', 'Destek Talepleri', 'Yardım Merkezi', 'Sık Sorulan Sorular'],
  },
]

const receptionSections: SidebarSection[] = [
  {
    id: 'rezervasyon',
    title: 'Resepsiyon Akışı',
    items: ['Check-in', 'Check-out', 'Yeni Rezervasyon', 'Bekleyen Rezervasyonlar'],
  },
  {
    id: 'musteri',
    title: 'Misafir Kartları',
    items: ['Misafir Listesi', 'Kimlik İşlemleri', 'Pasaport Bilgileri', 'Acil Notlar'],
  },
  {
    id: 'oda',
    title: 'Oda Durumu',
    items: ['Boş Odalar', 'Dolu Odalar', 'Temizlik Bekleyenler', 'Blokajlı Odalar'],
  },
  {
    id: 'finans',
    title: 'Ödeme İşlemleri',
    items: ['Ödeme Al', 'Ön Provizyon', 'Fatura Hazırla', 'Günlük Kasa Devri'],
  },
]

const staffSections: SidebarSection[] = [
  {
    id: 'personel',
    title: 'Görevlerim',
    items: ['Günlük Görevler', 'Öncelikli İşler', 'Tamamlananlar', 'Görev Geçmişi'],
  },
  {
    id: 'ayarlar',
    title: 'Vardiya Bilgileri',
    items: ['Bugünkü Vardiya', 'Haftalık Plan', 'İzin Talepleri', 'Performans Durumu'],
  },
  {
    id: 'destek',
    title: 'İç Bildirimler',
    items: ['Ekip Mesajları', 'Operasyon Notları', 'Duyurular', 'Destek Talepleri'],
  },
]

const accountingSections: SidebarSection[] = [
  {
    id: 'finans',
    title: 'Gelir-Gider',
    items: ['Finans Dashboard', 'Aylık Gelir', 'Gider Kalemleri', 'Kasa Mutabakatı'],
  },
  {
    id: 'fatura',
    title: 'Faturalar',
    items: ['Fatura Listesi', 'Bekleyen Faturalar', 'Vergi Raporları', 'E-Arşiv Kuyruğu'],
  },
  {
    id: 'odeme',
    title: 'Ödeme Takibi',
    items: ['Tahsilatlar', 'Bekleyen Ödemeler', 'İade İşlemleri', 'POS Hareketleri'],
  },
  {
    id: 'raporlama',
    title: 'Finansal Analiz',
    items: ['Gelir Grafikleri', 'Nakit Akışı', 'Karlılık Analizi', 'Günlük Kasa'],
  },
]

const technicalSections: SidebarSection[] = [
  {
    id: 'teknik',
    title: 'Arıza Bildirimleri',
    items: ['Aktif Arızalar', 'Yeni Teknik Talep', 'Acil Müdahale', 'Kapanan Arızalar'],
  },
  {
    id: 'oda',
    title: 'Oda Teknik Durumu',
    items: ['Oda Kontrolü', 'Klima Durumu', 'Elektrik Takibi', 'Bakım Notları'],
  },
  {
    id: 'takvim',
    title: 'Bakım Takvimi',
    items: ['Planlı Bakımlar', 'Görev Atamaları', 'Malzeme Takibi', 'Müdahale Süreleri'],
  },
]

const adminMetrics: Metric[] = [
  {
    label: 'Aktif Rezervasyon',
    value: '0',
    detail: 'Gerçek rezervasyon kayıtlarından hesaplanır',
    accent: 'cyan',
  },
  {
    label: 'Günlük Giriş / Çıkış',
    value: '0 / 0',
    detail: 'Check-in ve check-out kayıtları yoksa sıfır gösterilir',
    accent: 'gold',
  },
  {
    label: 'Boş Oda',
    value: '0',
    detail: 'Oda müsaitlik kayıtlarından hesaplanır',
    accent: 'white',
  },
  {
    label: 'Güvenlik Olayı',
    value: '0',
    detail: 'Gerçek güvenlik kayıtlarından hesaplanır',
    accent: 'gold',
  },
]

const ownerMetrics: Metric[] = [
  {
    label: 'Oda Tipi',
    value: '0',
    detail: 'Otel sahibine ait oda kayıtlarından hesaplanır',
    accent: 'cyan',
  },
  {
    label: 'Aktif Rezervasyon',
    value: '0',
    detail: 'Kendi oteline ait aktif rezervasyonlardan hesaplanır',
    accent: 'gold',
  },
  {
    label: 'Gelir',
    value: '₺0',
    detail: 'Kendi oteline ait rezervasyon toplamından hesaplanır',
    accent: 'white',
  },
  {
    label: 'Misafir Puanı',
    value: '0',
    detail: 'Gerçek misafir yorumlarından hesaplanır',
    accent: 'cyan',
  },
]

const guestPreviewMetrics: Metric[] = [
  {
    label: 'Uygun Tesis',
    value: '0',
    detail: 'Gerçek arama sonucundan hesaplanır',
    accent: 'cyan',
  },
  {
    label: 'Aktif Rezervasyon',
    value: '0',
    detail: 'Kendi rezervasyonlarından hesaplanır',
    accent: 'gold',
  },
  {
    label: 'Favori Tesis',
    value: '0',
    detail: 'Kaydettiğin tesislerden hesaplanır',
    accent: 'white',
  },
  {
    label: 'Misafir Puanı',
    value: '0',
    detail: 'Gerçek yorum puanlarından hesaplanır',
    accent: 'cyan',
  },
]

const occupancyBars: number[] = []
const revenueBars: number[] = []
const ownerHeatmap: number[] = []

const vipCustomers: string[][] = []

const recentActions: string[] = []

const ownerReservations: string[][] = []

const guestPlanRows: string[][] = []

const hotelRoomTemplates: RoomOption[][] = [
  [
    {
      id: 'deluxe-sea',
      name: 'Deluxe Deniz Manzaralı Oda',
      type: 'Deluxe',
      capacity: 2,
      size: '34 m²',
      price: 6420,
      oldPrice: 7240,
      available: 5,
      bedType: 'King yatak',
      balcony: 'Fransız balkon',
      bathroom: 'Yağmur duşlu mermer banyo',
      wifi: 'Fiber Wi-Fi 500 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 48 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Hafta sonu +%12 dinamik fiyat altyapısı hazır',
      features: ['Deniz manzarası', 'Akıllı iklimlendirme', 'Sessiz kat', 'Karşılama ikramı'],
      imageClass: 'room-deluxe',
    },
    {
      id: 'panorama-corner',
      name: 'Panoramik Köşe Süit',
      type: 'Süit',
      capacity: 3,
      size: '49 m²',
      price: 8450,
      available: 3,
      bedType: 'King yatak + dinlenme koltuğu',
      balcony: 'Köşe cam cephe',
      bathroom: 'Küvetli premium banyo',
      wifi: 'Fiber Wi-Fi 750 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 72 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Yüksek sezonda oda bazlı fiyat artırımı aktif',
      features: ['Panoramik manzara', 'Mini bar', 'Akıllı perde', 'VIP kat'],
      imageClass: 'room-panorama',
    },
    {
      id: 'garden-superior',
      name: 'Bahçe Superior Oda',
      type: 'Superior',
      capacity: 2,
      size: '29 m²',
      price: 5380,
      available: 7,
      bedType: 'Queen yatak',
      balcony: 'Bahçe çıkışlı teras',
      bathroom: 'Geniş duş alanı',
      wifi: 'Fiber Wi-Fi 300 Mbps',
      breakfastIncluded: false,
      refundPolicy: 'Esnek tarih değişikliği, iade yok',
      seasonNote: 'Erken rezervasyon kampanyası uygulanabilir',
      features: ['Bahçe erişimi', 'Sessiz oda', 'Çalışma masası', 'Hızlı giriş'],
      imageClass: 'room-garden',
    },
  ],
  [
    {
      id: 'terrace-premium',
      name: 'Teraslı Premium Oda',
      type: 'Premium',
      capacity: 3,
      size: '42 m²',
      price: 7250,
      oldPrice: 8100,
      available: 3,
      bedType: 'King yatak + sofa',
      balcony: 'Özel teras',
      bathroom: 'Küvet ve ayrı duş alanı',
      wifi: 'Fiber Wi-Fi 750 Mbps',
      breakfastIncluded: false,
      refundPolicy: 'Esnek tarih değişikliği, iade yok',
      seasonNote: 'Teras talebine göre hafta sonu farkı hazırlanmış',
      features: ['Özel teras', 'Şehir manzarası', 'Mini bar', 'Hızlı giriş'],
      imageClass: 'room-terrace',
    },
    {
      id: 'family-loft',
      name: 'Aile Loft Süiti',
      type: 'Süit',
      capacity: 5,
      size: '64 m²',
      price: 10150,
      available: 2,
      bedType: '1 king + 3 tek kişilik yatak',
      balcony: 'Geniş balkon',
      bathroom: 'Çift lavabolu aile banyosu',
      wifi: 'Fiber Wi-Fi 500 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 72 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Okul tatili sezon fiyatı kuralı hazır',
      features: ['Bağlantılı alan', 'Çocuk yatağı', 'Oturma bölümü', 'Oda içi eğlence'],
      imageClass: 'room-family',
    },
    {
      id: 'spa-suite',
      name: 'Spa Erişimli Wellness Oda',
      type: 'Wellness',
      capacity: 2,
      size: '38 m²',
      price: 7820,
      available: 4,
      bedType: 'King yatak',
      balcony: 'Spa avlusu manzaralı',
      bathroom: 'Buhar duşlu banyo',
      wifi: 'Fiber Wi-Fi 400 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 24 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Spa paketine göre kampanya altyapısı hazır',
      features: ['Spa erişimi', 'Aromaterapi seti', 'Sessiz kat', 'Geç çıkış opsiyonu'],
      imageClass: 'room-spa',
    },
  ],
  [
    {
      id: 'city-boutique',
      name: 'Butik Şehir Odası',
      type: 'Boutique',
      capacity: 2,
      size: '27 m²',
      price: 4920,
      oldPrice: 5600,
      available: 8,
      bedType: 'Queen yatak',
      balcony: 'Şehir cephesi',
      bathroom: 'Modern duş alanı',
      wifi: 'Fiber Wi-Fi 300 Mbps',
      breakfastIncluded: false,
      refundPolicy: 'Kampanyalı rezervasyonda iade yok',
      seasonNote: 'Hafta içi iş seyahati fiyatı uygulanır',
      features: ['Merkezi konum', 'Hızlı Wi-Fi', 'Çalışma masası', 'Akıllı TV'],
      imageClass: 'room-boutique',
    },
    {
      id: 'executive-business',
      name: 'Executive İş Odası',
      type: 'Executive',
      capacity: 2,
      size: '36 m²',
      price: 6680,
      available: 4,
      bedType: 'King yatak',
      balcony: 'Yüksek kat şehir manzarası',
      bathroom: 'Mermer duş ve bakım seti',
      wifi: 'Fiber Wi-Fi 900 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 48 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Konferans dönemleri için dinamik fiyat kuralı hazır',
      features: ['Executive kat', 'Espresso istasyonu', 'Toplantı masası', 'Hızlı check-in'],
      imageClass: 'room-business',
    },
    {
      id: 'compact-lux',
      name: 'Kompakt Lüks Oda',
      type: 'Deluxe',
      capacity: 1,
      size: '22 m²',
      price: 3890,
      available: 6,
      bedType: 'Tek büyük yatak',
      balcony: 'İç avlu penceresi',
      bathroom: 'Yağmur duş',
      wifi: 'Fiber Wi-Fi 300 Mbps',
      breakfastIncluded: false,
      refundPolicy: 'Tarih değişikliği bir kez ücretsiz',
      seasonNote: 'Tek kişi konaklama fiyat modülü hazır',
      features: ['Tek misafir odaklı', 'Sessiz çalışma', 'Akıllı aydınlatma', 'Mini bar'],
      imageClass: 'room-compact',
    },
  ],
  [
    {
      id: 'atrium-deluxe',
      name: 'Atrium Deluxe Oda',
      type: 'Deluxe',
      capacity: 2,
      size: '33 m²',
      price: 5840,
      available: 5,
      bedType: 'King yatak',
      balcony: 'Atrium manzaralı balkon',
      bathroom: 'Geniş duş ve premium set',
      wifi: 'Fiber Wi-Fi 450 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 48 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Doluluk oranına göre fiyat önerisi hazır',
      features: ['Atrium manzarası', 'Karartma perde', 'Sessiz oda', 'Akıllı klima'],
      imageClass: 'room-atrium',
    },
    {
      id: 'connected-family',
      name: 'Bağlantılı Aile Odası',
      type: 'Aile',
      capacity: 4,
      size: '55 m²',
      price: 8740,
      oldPrice: 9600,
      available: 2,
      bedType: '1 king + 2 tek kişilik yatak',
      balcony: 'Geniş aile balkonu',
      bathroom: 'Aile banyosu ve ek lavabo',
      wifi: 'Fiber Wi-Fi 500 Mbps',
      breakfastIncluded: true,
      refundPolicy: 'Girişten 72 saat öncesine kadar ücretsiz iptal',
      seasonNote: 'Aile paketlerinde sezon farkı altyapısı aktif',
      features: ['Bağlantılı oda', 'Çocuk alanı', 'Bebek yatağı', 'Ek depolama'],
      imageClass: 'room-family',
    },
    {
      id: 'quiet-superior',
      name: 'Sessiz Kat Superior',
      type: 'Superior',
      capacity: 2,
      size: '31 m²',
      price: 5160,
      available: 6,
      bedType: 'Queen yatak',
      balcony: 'Sessiz cephe',
      bathroom: 'Geniş duş alanı',
      wifi: 'Fiber Wi-Fi 350 Mbps',
      breakfastIncluded: false,
      refundPolicy: 'Esnek tarih değişikliği, iade yok',
      seasonNote: 'Hafta sonu farkı isteğe bağlı uygulanır',
      features: ['Sessiz kat', 'Yoga matı', 'Çalışma köşesi', 'Geç çıkış opsiyonu'],
      imageClass: 'room-quiet',
    },
  ],
]

const guestReservations: GuestReservation[] = []

function getAllGuestReservations() {
  const storedReservations = readStoredValue<GuestReservation[]>(GUEST_RESERVATIONS_STORAGE_KEY, [])
  const legacySeedReservationIds = new Set(['res-10284', 'res-09821', 'res-09644', 'RZ-10284', 'RZ-09821', 'RZ-09644'])
  const realStoredReservations = storedReservations.filter((reservation) =>
    !legacySeedReservationIds.has(reservation.id)
    && !legacySeedReservationIds.has(reservation.reservationId ?? '')
    && !legacySeedReservationIds.has(reservation.code),
  )
  const reservationMap = new Map<string, GuestReservation>()
  const availableHotels = mergeCustomHotels([])

  ;[...guestReservations, ...realStoredReservations].forEach((reservation) => {
    const key = reservation.reservationId ?? reservation.id ?? reservation.code
    const matchedHotelRecord = findHotelForReservationRecord(reservation, availableHotels)
    const hotelIndex = matchedHotelRecord ? availableHotels.findIndex((hotel) => hotel.id === matchedHotelRecord.id) : -1
    const hotel = hotelIndex >= 0 ? availableHotels[hotelIndex] : undefined
    const rooms = hotel ? getHotelRooms(hotel, hotelIndex, readStoredValue<Record<string, HotelCustomization>>(HOTEL_CUSTOMIZATIONS_STORAGE_KEY, {})) : []
    const matchedRoom = rooms.find((room) => reservationMatchesRoom(reservation, room))
    const nightCount = reservation.nightCount ?? calculateNights(reservation.checkIn, reservation.checkOut)
    const roomCount = Math.max(Number(reservation.roomCount ?? 1), 1)
    const guestCount = Math.max(Number(reservation.guestCount ?? 1), 1)
    const selectedPaidExtras = (reservation.selectedPaidExtras ?? [])
      .map((extra, index) => normalizePaidExtra(extra, `${key}-extra-${index}`))
      .filter((extra): extra is PaidExtraOption => Boolean(extra))
    const paidExtraTotal = normalizeRevenueAmount(parseStoredMoney(
      reservation.paidExtraTotal ?? calculatePaidExtraTotal(selectedPaidExtras, Math.max(nightCount, 1), roomCount, guestCount),
    ))
    const basePrice = normalizeRevenueAmount(parseStoredMoney(reservation.baseRoomPrice ?? reservation.basePrice ?? matchedRoom?.price ?? 0))
    const storedTotalPrice = normalizeRevenueAmount(parseStoredMoney(reservation.totalPriceAfterDiscount ?? reservation.totalPrice ?? reservation.total ?? 0))
    const calculatedTotalPrice = basePrice > 0 ? basePrice * Math.max(nightCount, 1) * roomCount + paidExtraTotal : 0
    const totalPrice = Number.isFinite(storedTotalPrice) && storedTotalPrice > 0
      ? Math.max(storedTotalPrice, calculatedTotalPrice)
      : calculatedTotalPrice

    reservationMap.set(key, {
      ...reservation,
      baseRoomPrice: basePrice > 0 ? basePrice : reservation.baseRoomPrice,
      checkInDate: reservation.checkInDate ?? reservation.checkIn,
      checkOutDate: reservation.checkOutDate ?? reservation.checkOut,
      basePrice: basePrice > 0 ? basePrice : reservation.basePrice,
      createdAt: reservation.createdAt ?? formatDateTime(new Date()),
      guestCount,
      hotelId: reservation.hotelId ?? hotel?.id,
      includedServices: reservation.includedServices ?? [],
      nightCount,
      ownerId: reservation.ownerId ?? (hotel ? getOwnerIdForHotel(hotel.id, availableHotels) : undefined),
      paidExtraTotal,
      paymentStatus: reservation.paymentStatus ?? 'paid',
      reservationId: reservation.reservationId ?? reservation.id,
      reservationStatus: reservation.reservationStatus ?? reservation.status,
      roomId: reservation.roomId ?? matchedRoom?.id,
      roomName: reservation.roomName ?? matchedRoom?.name ?? 'Oda kaydı yok',
      roomCount,
      roomType: reservation.roomType ?? matchedRoom?.type,
      selectedPaidExtras,
      status: reservation.status ?? reservation.reservationStatus ?? 'Aktif',
      subtotalBeforeDiscount: reservation.subtotalBeforeDiscount ?? calculatedTotalPrice,
      total: totalPrice,
      totalPrice,
      totalPriceAfterDiscount: reservation.totalPriceAfterDiscount ?? totalPrice,
    })
  })

  const mergedReservations = Array.from(reservationMap.values())

  if (JSON.stringify(storedReservations) !== JSON.stringify(mergedReservations)) {
    writeStoredValue(GUEST_RESERVATIONS_STORAGE_KEY, mergedReservations)
  }

  return mergedReservations
}

const hotelAmenities = ['Spa', 'Kapalı havuz', 'Vale', 'Toplantı salonu', '24 saat oda servisi', 'Akıllı oda kontrolü']
const hotelServices = ['Havalimanı transferi', 'Concierge', 'Kuru temizleme', 'VIP karşılama', 'Restoran rezervasyonu', 'Geç çıkış']
const defaultHotelPolicies = ['Check-in 14:00 sonrası', 'Check-out 12:00 öncesi', 'Evcil hayvan politikası odaya göre değişir', 'Sigara içilmeyen oda seçeneği varsayılandır']
const roomImageOptions = ['room-deluxe', 'room-panorama', 'room-garden', 'room-terrace', 'room-family', 'room-spa', 'room-boutique', 'room-business', 'room-compact', 'room-atrium', 'room-quiet']
const hotelGalleryCategories = ['Lobi', 'Oda', 'Spa', 'Restoran', 'Havuz', 'Manzara'] as const
type HotelGalleryCategory = (typeof hotelGalleryCategories)[number]
type HotelGalleryGroup = {
  title: HotelGalleryCategory
  photos: string[]
}
const hotelGalleryImageBank: Record<HotelGalleryCategory, string[]> = {
  Havuz: [
    'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=86',
  ],
  Lobi: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1500&q=86',
  ],
  Manzara: [
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1500&q=86',
  ],
  Oda: [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1500&q=86',
  ],
  Restoran: [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1500&q=86',
  ],
  Spa: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1500&q=86',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1500&q=86',
  ],
}

const helpTopics = [
  ['Rezervasyon İşlemleri', 'Tarih, kişi sayısı ve oda seçimlerini rezervasyon akışından düzenleyebilirsin. Müsaitlik kontrolü seçtiğin otele ve odaya göre yeniden hesaplanır. Onay sonrası rezervasyon kodu Rezervasyonlarım alanında görünür.'],
  ['İptal ve İade Politikası', 'İptal koşulları otelin oda politikasına göre değişir. İptal talebi oluşturduğunda ödeme durumu ve tahmini iade süresi kart üzerinde gösterilir. Kampanyalı odalarda özel koşullar uygulanabilir.'],
  ['Ödeme Sorunları', 'Kart doğrulama, provizyon veya ödeme hatalarında önce kayıtlı ödeme yöntemini kontrol et. Sorun devam ederse canlı destekten talep açabilir ve ödeme ekranı detayını paylaşabilirsin.'],
  ['Oda Bilgileri', 'Her oda kartında kapasite, yatak tipi, kahvaltı, iade politikası ve oda özellikleri ayrı gösterilir. Detay sayfasından otele özel oda görsellerini ve müsaitlik durumunu inceleyebilirsin.'],
  ['Check-in / Check-out', 'Standart giriş ve çıkış saatleri otel politikalarında yer alır. Erken giriş veya geç çıkış taleplerini otelle mesajlaşma üzerinden iletebilirsin.'],
  ['Hesap Güvenliği', 'Şifre değiştirme, iki adımlı doğrulama, aktif cihazlar ve oturum geçmişi Profilim > Güvenlik Ayarları altında yönetilir. Şüpheli giriş bildirimi açık olduğunda yeni cihaz olayları bildirim üretir.'],
  ['Kampanya Kullanımı', 'Kupon kodunu rezervasyon özetindeki indirim alanına girebilirsin. Kampanya koşulları tarih, oda tipi ve müsaitliğe göre değişebilir.'],
  ['Favoriler ve Kaydedilen Odalar', 'Otel veya oda kartındaki kalp ikonunu kullanarak kayıt oluşturabilirsin. Favoriler sayfasında oteller ve kaydedilen odalar ayrı bölümlerde kalıcı olarak saklanır.'],
  ['Otelle Mesajlaşma', 'Otel detayından veya Mesajlar sayfasından her otel için ayrı konuşma başlatabilirsin. Otel sahibi mesajı açınca okundu bilgisi ve yanıtlar konuşmaya düşer.'],
]

const faqItems = [
  ['Rezervasyon nasıl iptal edilir?', 'Rezervasyonlarım bölümünde ilgili karttaki iptal işlemi üzerinden talep oluşturabilirsiniz. İade koşulları otelin iptal politikasına göre hesaplanır.'],
  ['Check-in saati nedir?', 'Standart check-in saati 14:00 sonrasıdır. Erken giriş talebi otel müsaitliğine göre mesajlaşma ekranından iletilebilir.'],
  ['Check-out saati kaçtır?', 'Standart çıkış saati çoğu tesiste 12:00 olarak uygulanır. Geç çıkış talebi için rezervasyon bağlantılı otel sohbetini kullanabilirsiniz.'],
  ['Kahvaltı dahil mi?', 'Kahvaltı bilgisi oda kartında ayrı olarak gösterilir. Rezervasyon sırasında kahvaltı tercihini değiştirebilirsiniz.'],
  ['Ödeme yöntemleri nelerdir?', 'Kredi kartı, sanal POS ve tesiste ödeme seçenekleri desteklenir. Kayıtlı kartlar maskeli ve güvenli şekilde görüntülenir.'],
  ['Oda değişikliği yapabilir miyim?', 'Müsaitlik varsa otel sahibi veya resepsiyon ekibi rezervasyon bağlantılı mesaj üzerinden oda değişikliği talebinizi değerlendirebilir.'],
  ['Evcil hayvan kabul ediliyor mu?', 'Bu bilgi tesis politikasına göre değişir. Otel detayındaki politikalar bölümünden veya otel mesajlarından doğrulayabilirsiniz.'],
  ['Otelle nasıl mesajlaşırım?', 'Otel detay sayfasındaki mesaj kısayolunu veya Misafir Paneli > Mesajlar bölümünü kullanarak ilgili otele özel konuşma başlatabilirsiniz.'],
  ['Ödeme yöntemimi nasıl eklerim?', 'Profilim > Ödeme Yöntemleri bölümünden yeni kart ekleyebilir ve tercih edilen ödeme yöntemini seçebilirsiniz. Kart numaraları arayüzde maskeli gösterilir.'],
  ['Favori otellerimi nerede görebilirim?', 'Favoriler bölümünde Favori Oteller alanı altında kaydettiğiniz tesisleri görebilir ve tek tıkla rezervasyon akışına geçebilirsiniz.'],
  ['Kaydettiğim odaları nereden görebilirim?', 'Favoriler > Kaydedilen Odalar alanında oda görselleri, kapasite ve hızlı rezervasyon butonlarıyla kayıtlı odalarınız listelenir.'],
  ['İndirim kodu nasıl kullanılır?', 'Rezervasyon özetindeki kupon alanına kodu yazdığınızda indirim tutarı toplam fiyat içinde ayrı satır olarak hesaplanır.'],
  ['Rezervasyon onayı ne zaman gelir?', 'Ödeme ve müsaitlik kontrolü tamamlandığında rezervasyon kodu oluşturulur. Otel onayı gereken durumlarda bildirim merkezinden güncelleme alırsınız.'],
  ['Destek talebi nasıl oluşturulur?', 'Destek Merkezi içindeki Destek Talebi Oluştur alanından konu, kategori, öncelik ve açıklama girerek canlı destek ekibine kayıt açabilirsiniz.'],
]

const ownerRestrictedItems = new Set([
  'Oda Yönetimi',
  'Oda Listesi',
  'Yeni Oda Ekle',
  'Oda Düzenleme',
  'Oda Görselleri',
  'Oda Özellikleri',
  'Fiyat Yönetimi',
  'Günlük Fiyatlar',
  'Sezonluk Fiyatlar',
  'Hafta Sonu Fiyatları',
  'İndirim Tanımları',
  'Dinamik Fiyatlandırma',
  'Rezervasyon Yönetimi',
  'Rezervasyon Onayları',
  'İptal Yönetimi',
  'Müşteri Notları',
  'VIP İşaretleme',
  'Check-in / Check-out',
  'Görsel Yönetimi',
  'Otel Görselleri',
  'Kapak Görseli',
  'Galeri Düzenleme',
  'Oda Görsel Sıralama',
  'Otel Ayarları',
  'Otel Açıklaması',
  'Otel Politikaları',
  'Yakındaki Yerler',
  'Hizmet Bilgileri',
  'İletişim Bilgileri',
  'Konum Yönetimi',
  'Sosyal Medya Bağlantıları',
  'Otel Hakkında',
  'Otel Ekle',
  'Aktif Rezervasyonlar',
  'İptal Edilen Rezervasyonlar',
])

const ownerMessageItems = new Set([
  'Misafir Mesajları',
  'Destek Gelen Kutusu',
  'Rezervasyon Mesajları',
  'Hızlı Yanıtlar',
  'Konuşma Filtreleri',
])

const ownerStaffItems = new Set(['Personel Takibi', 'Personel Listesi', 'Vardiya Durumu', 'Görev Takibi', 'Performans Kayıtları'])
const ownerCampaignItems = new Set(['Kampanya Yönetimi', 'Aktif Kampanyalar', 'Kuponlar', 'Kampanya Performansı'])
const ownerReviewItems = new Set(['Müşteri Memnuniyeti', 'Yorumlar'])

const adminSupportItems = new Set<string>()
const adminReservationItems = new Set([
  'Rezervasyon Yönetimi',
  'Aktif Rezervasyonlar',
  'Geçmiş Rezervasyonlar',
  'İptal Edilen Rezervasyonlar',
])

const dashboardPanels: Record<DashboardPanelId, DashboardPanelConfig> = {
  admin: {
    id: 'admin',
    label: 'Yönetici Paneli',
    sidebarTitle: 'Yönetici Konsolu',
    accessNote: 'Tam sistem yetkisi',
    heroTitle: 'Merkezi kurumsal operasyon kontrolü',
    heroSubtitle: 'Tüm tesisler, finans, güvenlik, yetki ve entegrasyon akışlarını tek merkezden izle.',
    heroMetricLabel: 'Sistem sağlık skoru',
    heroMetricValue: '99,2%',
    statusLabel: 'Sunucu',
    statusValue: 'Dengeli',
    sections: adminSections,
	    metrics: [
	      ...adminMetrics,
	      { label: 'Aktif Kullanıcı', value: '0', detail: 'Aktif oturum kayıtlarından hesaplanır', accent: 'cyan' },
	      { label: 'Sistem Yükü', value: '0%', detail: 'Canlı performans verisi yoksa sıfır gösterilir', accent: 'gold' },
	    ],
    chartTitle: 'Günlük Gelir Grafikleri',
    chartSubtitle: 'Tüm tesislerin birleşik gelir ivmesi',
    chartValues: revenueBars,
    heatmapTitle: 'Doluluk Heatmap',
    heatmapSubtitle: 'Bölge ve tesis yoğunluk dağılımı',
    heatmapValues: ownerHeatmap,
    listTitle: 'VIP ve Kritik Misafirler',
    listSubtitle: 'Öncelikli operasyon takibi',
    listRows: vipCustomers,
    feedTitle: 'Kritik Sistem Uyarıları',
    feedSubtitle: 'Güvenlik ve altyapı olayları',
    feedItems: recentActions,
    tableTitle: 'Personel Performans Tablosu',
    tableSubtitle: 'Departman bazlı canlı verimlilik ölçümü',
    tableHeaders: ['Departman', 'Aktif Personel', 'Performans', 'Durum'],
    tableRows: [
      ['Resepsiyon', '18', '94%', 'Yoğun vardiya'],
      ['Kat Hizmetleri', '34', '89%', 'Temizlik akışı normal'],
      ['Muhasebe', '7', '97%', 'Kasa mutabakatı tamam'],
      ['Teknik Servis', '11', '86%', '3 açık arıza'],
    ],
    progressTitle: 'Gerçek Zamanlı Sistem Yükü',
    progressSubtitle: 'Altyapı ve servis izleme',
    progressItems: [
	      { label: 'API Servisi', value: 0, detail: 'Canlı API ölçümü bekleniyor' },
      { label: 'Veritabanı', value: 58, detail: 'Bağlantı havuzu sağlıklı' },
      { label: 'Yedekleme', value: 76, detail: 'Son yedek 02:10' },
    ],
  },
  owner: {
    id: 'owner',
    label: 'Otel Sahibi Paneli',
    sidebarTitle: 'Tesis Konsolu',
    accessNote: 'Tesis yönetimi yetkisi',
    heroTitle: 'Tesis gelirini ve memnuniyeti canlı yönet',
    heroSubtitle: 'Rezervasyon, oda fiyatı, kampanya ve personel performansını iş odaklı görünümle takip et.',
    heroMetricLabel: 'Gerçek zamanlı performans',
    heroMetricValue: '92,4%',
    statusLabel: 'Doluluk',
    statusValue: '87%',
    sections: ownerSections,
    metrics: ownerMetrics,
    chartTitle: 'Haftalık Gelir Chart',
    chartSubtitle: 'Oda, restoran ve hizmet gelirleri',
    chartValues: revenueBars,
    heatmapTitle: 'Rezervasyon Yoğunluğu',
    heatmapSubtitle: 'Saat ve oda tipine göre talep dağılımı',
    heatmapValues: ownerHeatmap,
    listTitle: 'Aktif Rezervasyon Kartları',
    listSubtitle: 'Yaklaşan yoğun girişler',
    listRows: ownerReservations,
    feedTitle: 'Müşteri Yorum Analizi',
    feedSubtitle: 'Son memnuniyet sinyalleri',
    feedItems: ['Kahvaltı puanı yükseldi', 'Spa deneyimi olumlu yorum aldı', 'Geç çıkış talebi bekliyor', 'VIP karşılama notu eklendi'],
    tableTitle: 'En Popüler Oda Tipleri',
    tableSubtitle: 'Gelir ve doluluk bazlı oda performansı',
    tableHeaders: ['Oda Tipi', 'Doluluk', 'Ortalama Fiyat', 'Trend'],
    tableRows: [
      ['Deluxe Deniz', '91%', '₺6.420', 'Yükseliyor'],
      ['Aile Süiti', '84%', '₺8.900', 'Dengeli'],
      ['Teras Oda', '78%', '₺7.250', 'Kampanya önerildi'],
      ['Executive Kat', '88%', '₺9.700', 'Yüksek talep'],
    ],
    progressTitle: 'Kampanya ve Fiyat Yönetimi',
    progressSubtitle: 'Aktif satış aksiyonları',
    progressItems: [
      { label: 'Erken rezervasyon', value: 82, detail: '14 gün daha aktif' },
      { label: 'Hafta sonu fiyatı', value: 68, detail: 'Doluluk sınırı yaklaşıyor' },
      { label: 'Uzun konaklama', value: 54, detail: 'Yeni kupon önerildi' },
    ],
  },
  reception: {
    id: 'reception',
    label: 'Resepsiyon Paneli',
    sidebarTitle: 'Resepsiyon Konsolu',
    accessNote: 'Ön büro operasyon yetkisi',
    heroTitle: 'Giriş, çıkış ve misafir akışını hızlandır',
    heroSubtitle: 'Check-in, check-out, kimlik işlemleri, oda durumu ve ödeme adımlarını aynı akışta yönet.',
    heroMetricLabel: 'Bekleyen işlem',
    heroMetricValue: '18',
    statusLabel: 'Ön Büro',
    statusValue: 'Aktif',
    sections: receptionSections,
    metrics: [
      { label: 'Bugünkü Girişler', value: '64', detail: '21 misafir erken giriş istedi', accent: 'cyan' },
      { label: 'Bugünkü Çıkışlar', value: '51', detail: '12 geç çıkış bekliyor', accent: 'gold' },
      { label: 'Boş Odalar', value: '38', detail: '14 oda temizlik onayı bekliyor', accent: 'white' },
      { label: 'Bekleyen Rezervasyon', value: '27', detail: '6 ödeme doğrulaması var', accent: 'cyan' },
    ],
    chartTitle: 'Saatlik Resepsiyon Yoğunluğu',
    chartSubtitle: 'Giriş ve çıkış bankosu trafiği',
    chartValues: occupancyBars,
    heatmapTitle: 'Oda Durumu Haritası',
    heatmapSubtitle: 'Müsait, dolu ve hazırlıkta odalar',
    heatmapValues: [92, 76, 84, 64, 58, 89, 72, 95, 66, 81, 70, 88, 60, 78, 94],
    listTitle: 'Acil Müşteri Notları',
    listSubtitle: 'Resepsiyon öncelik sırası',
    listRows: [
      ['Oda 1204', 'Alerji notu', 'Kahvaltı ekibi bilgilendirildi'],
      ['Oda 804', 'Bebek yatağı', 'Kat hizmetleri görevlendirildi'],
      ['Oda 1510', 'VIP transfer', '18:30 araç hazır'],
    ],
    feedTitle: 'Canlı Ön Büro Akışı',
    feedSubtitle: 'Son resepsiyon işlemleri',
    feedItems: ['Check-in formu tamamlandı', 'Kimlik taraması doğrulandı', 'Oda kartı yenilendi', 'Ön ödeme alındı'],
    tableTitle: 'Günlük Konaklayanlar',
    tableSubtitle: 'Resepsiyon takip listesi',
    tableHeaders: ['Misafir', 'Oda', 'İşlem', 'Saat'],
    tableRows: [
      ['Selin A.', '1204', 'Check-in hazır', '14:20'],
      ['Mert K.', '903', 'Ödeme bekliyor', '15:10'],
      ['Ayça D.', '1510', 'VIP karşılama', '18:30'],
      ['Can E.', '611', 'Check-out', '11:45'],
    ],
    progressTitle: 'Günlük İşlem İlerlemesi',
    progressSubtitle: 'Ön büro operasyon kapanışı',
    progressItems: [
      { label: 'Check-in dosyaları', value: 72, detail: '46 / 64 tamamlandı' },
      { label: 'Check-out tahsilatı', value: 81, detail: '41 / 51 tamamlandı' },
      { label: 'Kimlik doğrulama', value: 64, detail: '18 kayıt bekliyor' },
    ],
  },
  staff: {
    id: 'staff',
    label: 'Personel Paneli',
    sidebarTitle: 'Personel Konsolu',
    accessNote: 'Görev ve vardiya yetkisi',
    heroTitle: 'Günlük görevleri ve ekip iletişimini takip et',
    heroSubtitle: 'Vardiya bilgileri, günlük işler, iç bildirimler ve izin talepleri tek çalışma alanında.',
    heroMetricLabel: 'Görev ilerleme',
    heroMetricValue: '76%',
    statusLabel: 'Vardiya',
    statusValue: 'Devam ediyor',
    sections: staffSections,
    metrics: [
      { label: 'Günlük Görev', value: '18', detail: '14 görev tamamlandı', accent: 'cyan' },
      { label: 'Vardiya Saati', value: '09:00-17:00', detail: 'Molaya 42 dakika kaldı', accent: 'gold' },
      { label: 'İç Mesaj', value: '7', detail: '2 mesaj öncelikli', accent: 'white' },
      { label: 'Performans', value: '91%', detail: 'Haftalık hedef üstünde', accent: 'cyan' },
    ],
    chartTitle: 'Görev Tamamlama Grafiği',
    chartSubtitle: 'Gün içi iş akışı performansı',
    chartValues: [18, 24, 39, 45, 57, 64, 76, 82, 88, 91, 94, 96],
    heatmapTitle: 'Kat Görev Yoğunluğu',
    heatmapSubtitle: 'Temizlik ve servis önceliği',
    heatmapValues: [66, 72, 88, 52, 94, 81, 76, 68, 90, 74, 83, 59, 71, 86, 92],
    listTitle: 'Günlük Görev Listesi',
    listSubtitle: 'Sıradaki operasyon işleri',
    listRows: [
      ['Kat 5', 'Oda 512 hazırlık', 'Öncelikli'],
      ['Kat 7', 'Mini bar kontrolü', 'Devam ediyor'],
      ['Lobi', 'VIP karşılama seti', '16:00 öncesi'],
    ],
    feedTitle: 'İç Mesajlaşma Paneli',
    feedSubtitle: 'Ekip ve yönetim bildirimleri',
    feedItems: ['Vardiya planı güncellendi', 'Kat 4 temizliği onaylandı', 'Yeni görev atandı', 'İzin talebi değerlendiriliyor'],
    tableTitle: 'Performans Durumu',
    tableSubtitle: 'Personel görev takibi',
    tableHeaders: ['Alan', 'Tamamlanan', 'Bekleyen', 'Durum'],
    tableRows: [
      ['Kat Hizmetleri', '42', '8', 'İyi'],
      ['Oda Servisi', '26', '5', 'Yoğun'],
      ['Lobi Operasyon', '18', '2', 'Dengeli'],
      ['Spa Destek', '11', '1', 'Tamamlanıyor'],
    ],
    progressTitle: 'Görev İlerleme Barı',
    progressSubtitle: 'Kişisel vardiya hedefleri',
    progressItems: [
      { label: 'Oda hazırlığı', value: 82, detail: '18 odadan 15 oda tamam' },
      { label: 'Servis çağrıları', value: 64, detail: '7 çağrıdan 4 çağrı kapandı' },
      { label: 'Ekip notları', value: 91, detail: 'Tüm kritik notlar okundu' },
    ],
  },
  accounting: {
    id: 'accounting',
    label: 'Muhasebe Paneli',
    sidebarTitle: 'Muhasebe Konsolu',
    accessNote: 'Finans ve kasa yetkisi',
    heroTitle: 'Finans akışını, fatura ve tahsilatları denetle',
    heroSubtitle: 'Gelir-gider, fatura, ödeme takibi, vergi raporları ve günlük kasa işlemleri için finans merkezi.',
    heroMetricLabel: 'Günlük kasa',
    heroMetricValue: '₺312.840',
    statusLabel: 'Mutabakat',
    statusValue: 'Açık',
    sections: accountingSections,
    metrics: [
      { label: 'Aylık Gelir', value: '₺4,8M', detail: 'Geçen aya göre %12 artış', accent: 'cyan' },
      { label: 'Bekleyen Tahsilat', value: '₺286K', detail: '18 ödeme takipte', accent: 'gold' },
      { label: 'Fatura', value: '124', detail: '9 fatura onay bekliyor', accent: 'white' },
      { label: 'Gider Oranı', value: '31%', detail: 'Hedef bandın içinde', accent: 'cyan' },
    ],
    chartTitle: 'Aylık Gelir Grafikleri',
    chartSubtitle: 'Konaklama, hizmet ve restoran kırılımı',
    chartValues: [38, 42, 56, 62, 71, 68, 77, 84, 88, 91, 96, 93],
    heatmapTitle: 'Tahsilat Yoğunluğu',
    heatmapSubtitle: 'Ödeme kanalı ve saat dağılımı',
    heatmapValues: [81, 69, 92, 76, 88, 73, 61, 95, 84, 79, 90, 68, 74, 86, 97],
    listTitle: 'Bekleyen Tahsilatlar',
    listSubtitle: 'Finans öncelik kuyruğu',
    listRows: [
      ['Kurumsal hesap', '₺86.400', 'Sözleşme ödeme günü'],
      ['Grup rezervasyon', '₺124.900', 'Ön ödeme bekliyor'],
      ['Etkinlik salonu', '₺74.700', 'Fatura kesilecek'],
    ],
    feedTitle: 'Ödeme Geçmişi',
    feedSubtitle: 'Son finans hareketleri',
    feedItems: ['POS tahsilatı eşleşti', 'E-fatura kuyruğa alındı', 'Kasa devri onaylandı', 'İade talebi inceleniyor'],
    tableTitle: 'Finans Dashboard',
    tableSubtitle: 'Gelir-gider operasyon özeti',
    tableHeaders: ['Kalem', 'Tutar', 'Değişim', 'Durum'],
    tableRows: [
      ['Konaklama geliri', '₺2.940.000', '+%14', 'Hedef üstü'],
      ['Restoran geliri', '₺684.000', '+%8', 'Dengeli'],
      ['Operasyon gideri', '₺1.180.000', '-%3', 'Kontrollü'],
      ['Vergi karşılığı', '₺412.000', 'Sabit', 'Raporlandı'],
    ],
    progressTitle: 'Günlük Kasa Kapanışı',
    progressSubtitle: 'Muhasebe kontrol adımları',
    progressItems: [
      { label: 'POS eşleştirme', value: 88, detail: '32 / 36 işlem tamam' },
      { label: 'Fatura onayı', value: 72, detail: '9 fatura bekliyor' },
      { label: 'Kasa devri', value: 61, detail: 'Akşam vardiyası bekleniyor' },
    ],
  },
  technical: {
    id: 'technical',
    label: 'Teknik Servis Paneli',
    sidebarTitle: 'Teknik Servis Konsolu',
    accessNote: 'Bakım ve arıza yetkisi',
    heroTitle: 'Arıza, bakım ve müdahale sürelerini yönet',
    heroSubtitle: 'Oda teknik durumu, bakım takvimi, görev atamaları ve teknik performans raporları tek panelde.',
    heroMetricLabel: 'Aktif arıza',
    heroMetricValue: '12',
    statusLabel: 'Teknik ekip',
    statusValue: 'Sahada',
    sections: technicalSections,
    metrics: [
      { label: 'Aktif Arıza', value: '12', detail: '3 arıza yüksek öncelikli', accent: 'gold' },
      { label: 'Bekleyen Bakım', value: '28', detail: 'Haftalık plan içinde', accent: 'cyan' },
      { label: 'Ortalama Müdahale', value: '18 dk', detail: 'Hedefin 7 dk altında', accent: 'white' },
      { label: 'Kapalı Talep', value: '43', detail: 'Bugün tamamlanan işler', accent: 'cyan' },
    ],
    chartTitle: 'Müdahale Süresi Grafiği',
    chartSubtitle: 'Saatlik teknik servis performansı',
    chartValues: [76, 68, 61, 54, 48, 42, 39, 44, 51, 46, 38, 35],
    heatmapTitle: 'Oda Teknik Durumu',
    heatmapSubtitle: 'Kat ve arıza yoğunluğu haritası',
    heatmapValues: [48, 55, 72, 86, 64, 91, 58, 74, 82, 67, 93, 45, 70, 88, 62],
    listTitle: 'Aktif Arızalar',
    listSubtitle: 'Müdahale öncelik listesi',
    listRows: [
      ['Oda 710', 'Klima arızası', 'Yüksek öncelik'],
      ['Oda 1202', 'Kartlı kilit', 'Teknisyen atandı'],
      ['Spa Alanı', 'Aydınlatma', 'Malzeme bekliyor'],
    ],
    feedTitle: 'Teknik Aktivite Logları',
    feedSubtitle: 'Son bakım ve görev hareketleri',
    feedItems: ['Planlı bakım başlatıldı', 'Oda 504 arızası kapandı', 'Yeni teknik talep açıldı', 'Malzeme talebi onaylandı'],
    tableTitle: 'Teknik Performans Raporu',
    tableSubtitle: 'Ekip ve görev bazlı ölçüm',
    tableHeaders: ['Ekip', 'Açık İş', 'Ortalama Süre', 'Durum'],
    tableRows: [
      ['Elektrik', '4', '16 dk', 'Sahada'],
      ['Mekanik', '5', '22 dk', 'Yoğun'],
      ['Bilişim', '2', '11 dk', 'Hazır'],
      ['Genel Bakım', '9', '27 dk', 'Planlı'],
    ],
    progressTitle: 'Bakım Takvimi',
    progressSubtitle: 'Planlı teknik işlerin ilerlemesi',
    progressItems: [
      { label: 'Oda kontrolleri', value: 69, detail: '42 / 61 oda incelendi' },
      { label: 'Acil müdahale', value: 83, detail: '5 / 6 talep kapandı' },
      { label: 'Malzeme tedariki', value: 57, detail: '3 parça bekleniyor' },
    ],
  },
}

async function request<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const detail = await tryReadError(response)
    throw new Error(detail ?? `API isteği başarısız oldu: ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function tryReadError(response: Response) {
  try {
    const body = (await response.json()) as { message?: string }
    return body.message
  } catch {
    return null
  }
}

function readStoredSession() {
  const value = localStorage.getItem(SESSION_STORAGE_KEY) ?? sessionStorage.getItem(SESSION_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    const session = JSON.parse(value) as AuthSession

    if (new Date(session.expiresAtUtc).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }

    return session
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

function persistAuthSession(session: AuthSession, remember: boolean) {
  const serializedSession = JSON.stringify(session)

  if (remember) {
    localStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

function clearStoredAuthSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

function App() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(
    readStoredSession,
  )
  const [language, setLanguageState] = useState<LanguageCode>(getStoredLanguage)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [pendingGuestSession, setPendingGuestSession] = useState<AuthSession | null>(null)
  const [activePortal, setActivePortal] = useState<UserRole>('Customer')
  const [loginForms, setLoginForms] = useState(initialLoginForms)
  const [guestRegisterForm, setGuestRegisterForm] = useState(initialGuestRegisterForm)
  const [guestProfileForm, setGuestProfileForm] = useState(initialGuestProfileForm)
  const [guestProfileStep, setGuestProfileStep] = useState(0)
  const [savedGuestProfile, setSavedGuestProfile] = useState<GuestProfileResponse | null>(null)
  const [hotels, setHotels] = useState<HotelRecord[]>([])
  const [registeredGuestAccounts, setRegisteredGuestAccounts] = usePersistentState<StoredGuestAccount[]>(
    GUEST_ACCOUNTS_STORAGE_KEY,
    [],
  )
  const [twoFactorSettings, setTwoFactorSettings] = usePersistentState<TwoFactorSettings>(
    TWO_FACTOR_STORAGE_KEY,
    { enabled: false, method: 'email' },
  )
  const [hotelConversations, setHotelConversations] = usePersistentState<GuestConversation[]>(
    HOTEL_MESSAGES_STORAGE_KEY,
    [],
  )
  const [supportRequests, setSupportRequests] = usePersistentState<SupportTicket[]>(
    SUPPORT_TICKETS_STORAGE_KEY,
    [],
  )
  const [systemNotifications, setSystemNotifications] = usePersistentState<GuestNotification[]>(
    NOTIFICATIONS_STORAGE_KEY,
    [],
  )
  const [hotelCustomizations, setHotelCustomizations] = usePersistentState<Record<string, HotelCustomization>>(
    HOTEL_CUSTOMIZATIONS_STORAGE_KEY,
    {},
  )
  const [hotelReviews, setHotelReviews] = usePersistentState<GuestReview[]>(
    HOTEL_REVIEWS_STORAGE_KEY,
    [],
  )
  const [adminHotelStatuses, setAdminHotelStatuses] = usePersistentState<AdminHotelStatus[]>(
    ADMIN_HOTEL_STATUS_STORAGE_KEY,
    [],
  )
  const [pendingTwoFactor, setPendingTwoFactor] = useState<PendingTwoFactor | null>(null)
  const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(
    null,
  )
  const [search, setSearch] = usePersistentState<string>(GLOBAL_SEARCH_STORAGE_KEY, '')
  const [isLoading, setIsLoading] = useState(true)
  const [loggingRole, setLoggingRole] = useState<UserRole | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setLanguage = (value: LanguageCode) => {
    storeLanguagePreference(value)
    setLanguageState(value)
  }
  useEnglishInterface(language)

  const activePortalConfig = portals.find((portal) => portal.role === activePortal)!
  const visibleHotels = useMemo(() => filterHotels(hotels, search), [hotels, search])
  const guestPublishedHotels = useMemo(
    () => filterGuestVisibleHotels(hotels, adminHotelStatuses),
    [adminHotelStatuses, hotels],
  )
  const visibleGuestHotels = useMemo(
    () => filterHotels(guestPublishedHotels, search),
    [guestPublishedHotels, search],
  )
  const loginGuestMetrics = useMemo<Metric[]>(() => {
    const allReservations = getAllGuestReservations()
    const activeReservationCount = allReservations.filter(isActiveReservationRecord).length
    const publishedHotelIds = new Set(guestPublishedHotels.map((hotel) => String(hotel.id)))
    const favoriteHotelCount = getAllStoredFavoriteHotelIds()
      .filter((hotelId) => publishedHotelIds.size === 0 || publishedHotelIds.has(String(hotelId))).length
    const averageScore = guestPublishedHotels.length > 0
      ? guestPublishedHotels.reduce((total, hotel) => total + hotel.starRating, 0) / guestPublishedHotels.length
      : 0

    return [
      {
        accent: 'cyan',
        detail: 'Yayındaki aktif tesislerden hesaplandı',
        label: 'Uygun Tesis',
        value: String(guestPublishedHotels.length),
      },
      {
        accent: 'gold',
        detail: 'Tüm gerçek aktif rezervasyon kayıtları',
        label: 'Aktif Rezervasyon',
        value: String(activeReservationCount),
      },
      {
        accent: 'white',
        detail: 'Sistemdeki kayıtlı favori tesisler',
        label: 'Favori Tesis',
        value: String(favoriteHotelCount),
      },
      {
        accent: 'cyan',
        detail: 'Yayındaki tesislerin ortalama puanı',
        label: 'Misafir Puanı',
        value: averageScore > 0 ? averageScore.toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '0,0',
      },
    ]
  }, [guestPublishedHotels])

  useEffect(() => {
    getStoredOwnerAccounts(hotels)
  }, [hotels])

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [hotelList, health] = await Promise.all([
        request<HotelRecord[]>('/api/hotels'),
        request<DatabaseHealth>('/api/health/database'),
      ])

      setHotels(mergeCustomHotels(hotelList))
      setDatabaseHealth(health)
    } catch (err) {
      setHotels(mergeCustomHotels([]))
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addNotification = useCallback((notification: GuestNotification) => {
    if (!isGuestVisibleNotification(notification)) {
      return
    }

    setSystemNotifications((current) => [notification, ...current].slice(0, 40))
  }, [setSystemNotifications])

  useEffect(() => {
    setSystemNotifications((current) =>
      current.some((notification) => !isGuestVisibleNotification(notification))
        ? current.filter(isGuestVisibleNotification)
        : current,
    )
  }, [setSystemNotifications])

  const completeLogin = useCallback(async (session: AuthSession, remember: boolean) => {
    persistAuthSession(session, remember)

    setAuthSession(session)
    await loadDashboard()
  }, [loadDashboard])

  const loadGuestProfile = useCallback(async (session: AuthSession) => {
    if (session.user.role !== 'Customer') {
      setSavedGuestProfile(null)
      return
    }

    try {
      const profile = await request<GuestProfileResponse>(
        '/api/auth/guest/profile',
        undefined,
        session.token,
      )

      setSavedGuestProfile(profile)
    } catch {
      setSavedGuestProfile(null)
    }
  }, [])

  useEffect(() => {
    // İlk veri senkronizasyonu, rota katmanı eklenene kadar burada tutuluyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (authSession?.user.role === 'Customer') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadGuestProfile(authSession)
    }
  }, [authSession, loadGuestProfile])

  const handleLogin = async (role: UserRole) => {
    setLoggingRole(role)
    setError(null)

	    try {
	      const loginForm = loginForms[role]

	      if (role === 'SuperAdmin') {
	        const storedAdminAccounts = getStoredAdminAccountsWithTc()
	        const normalizedIdentifier = normalizeSearch(loginForm.email)
	        const matchingAdmin = storedAdminAccounts.find((account) =>
	          normalizeSearch(account.username) === normalizedIdentifier ||
	          normalizeSearch(account.email ?? '') === normalizedIdentifier,
	        )

	        if (matchingAdmin) {
	          if (!loginForm.tcKimlikNo?.trim()) {
	            throw new Error('Yönetici girişi için T.C. Kimlik No zorunludur.')
	          }

	          if (matchingAdmin.tcKimlikNo !== loginForm.tcKimlikNo.replace(/\D/g, '')) {
	            throw new Error('Kullanıcı adı, şifre veya T.C. Kimlik No hatalı.')
	          }

	          if (matchingAdmin.status === 'Kalıcı Kapatıldı') {
	            throw new Error('Hesabınız sınırsız yasaklandı.')
	          }

	          if (matchingAdmin.status === 'Süreli Devre Dışı' && matchingAdmin.disabledUntil) {
	            throw new Error(`Hesabınız ${matchingAdmin.disabledUntil} tarihine kadar devre dışı bırakıldı.`)
	          }

	          if (matchingAdmin.status !== 'Aktif') {
	            throw new Error(`Yönetici hesabınız ${matchingAdmin.status} durumunda. Giriş yapılamaz.`)
	          }

	          if (matchingAdmin.password !== loginForm.password) {
	            throw new Error('Kullanıcı adı, şifre veya T.C. Kimlik No hatalı.')
	          }

	          await completeLogin({
	            expiresAtUtc: new Date(Date.now() + 3_600_000).toISOString(),
	            token: `local-admin-${Date.now()}`,
	            user: {
	              email: matchingAdmin.email ?? `${matchingAdmin.username}@admin.local`,
	              firstName: matchingAdmin.username,
	              id: `admin-${matchingAdmin.username}`,
	              lastName: 'Yönetici',
	              role: 'SuperAdmin',
	              username: matchingAdmin.username,
	            },
	          }, loginForm.remember)
	          return
	        }

	        throw new Error('Kullanıcı adı, şifre veya T.C. Kimlik No hatalı.')
	      }

	      if (role === 'PropertyManager') {
	        const username = loginForm.email.trim()
	        const password = loginForm.password.trim()
	        const tcKimlikNo = loginForm.tcKimlikNo?.replace(/\D/g, '') ?? ''

	        if (!username || !password || !tcKimlikNo) {
	          throw new Error('Eksik alan')
	        }

	        const storedOwnerAccounts = getStoredOwnerAccounts(hotels)
	        const normalizedIdentifier = normalizeSearch(username)
	        const matchingOwner = storedOwnerAccounts.find((account) =>
	          normalizeSearch(account.username) === normalizedIdentifier ||
	          normalizeSearch(account.email ?? '') === normalizedIdentifier,
	        )

	        if (!matchingOwner) {
	          throw new Error('Kullanıcı bulunamadı')
	        }

	        if (matchingOwner.password !== password) {
	          throw new Error('Şifre yanlış')
	        }

	        if (matchingOwner.tcKimlikNo !== tcKimlikNo) {
	          throw new Error('T.C. Kimlik No yanlış')
	        }

	        if (matchingOwner.status === 'Pasif') {
	          throw new Error('Hesabınız pasif duruma alınmıştır.')
	        }

	        if (matchingOwner.status === 'İptal' || matchingOwner.status === 'Silindi') {
	          throw new Error('Hesabınız devre dışı bırakılmıştır.')
	        }

	        const lastLoginAt = formatDateTime(new Date())
	        writeStoredValue(
	          OWNER_ACCOUNTS_STORAGE_KEY,
	          storedOwnerAccounts.map((account) =>
	            account.id === matchingOwner.id ? { ...account, lastLoginAt } : account,
	          ),
	        )

	        const [firstName = matchingOwner.username, ...lastNameParts] = (matchingOwner.fullName || matchingOwner.username).split(' ')
	        await completeLogin({
	          expiresAtUtc: new Date(Date.now() + 3_600_000).toISOString(),
	          token: `local-owner-${Date.now()}`,
	          user: {
	            email: matchingOwner.email || `${matchingOwner.username}@owner.local`,
	            firstName,
	            id: `owner-${matchingOwner.id}`,
	            lastName: lastNameParts.join(' ') || 'Otel Sahibi',
	            role: 'PropertyManager',
	            username: matchingOwner.username,
	          },
	        }, loginForm.remember)
	        return
	      }

	      const session = await request<AuthSession>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          portalRole: role,
        }),
      })

      if (role === 'Customer' && twoFactorSettings.enabled) {
        setPendingTwoFactor({
          code: DEMO_VERIFICATION_CODE,
          error: '',
          expiresAt: Date.now() + VERIFICATION_TIMEOUT_MS,
          method: twoFactorSettings.method,
          remember: loginForm.remember,
          session,
        })
        addNotification(createSystemNotification('Güvenlik', 'İki aşamalı doğrulama kodu gönderildi', `${twoFactorSettings.method === 'email' ? 'E-posta' : 'Telefon'} ile giriş doğrulama kodu oluşturuldu.`, 'Güvenlik Ayarları'))
        return
      }

      await completeLogin(session, loginForm.remember)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoggingRole(null)
    }
  }

  const completeTwoFactorLogin = async (code: string) => {
    if (!pendingTwoFactor) {
      return
    }

    if (Date.now() > pendingTwoFactor.expiresAt) {
      setPendingTwoFactor((current) => current ? { ...current, error: 'Kod süresi doldu. Yeni kod isteyin.' } : current)
      return
    }

    if (code.trim() !== pendingTwoFactor.code) {
      setPendingTwoFactor((current) => current ? { ...current, error: 'Doğrulama kodu hatalı.' } : current)
      return
    }

    const { remember, session } = pendingTwoFactor
    setPendingTwoFactor(null)
    await completeLogin(session, remember)
  }

  const resendTwoFactorCode = () => {
    setPendingTwoFactor((current) =>
      current
        ? {
            ...current,
            code: DEMO_VERIFICATION_CODE,
            error: '',
            expiresAt: Date.now() + VERIFICATION_TIMEOUT_MS,
          }
        : current,
    )
  }

  const handleGuestRegister = async () => {
    const validationError = validateGuestRegisterForm(guestRegisterForm)

    if (validationError) {
      setError(validationError)
      return
    }

    const normalizedUsername = guestRegisterForm.username.trim().toLocaleLowerCase('tr-TR')
    const normalizedEmail = guestRegisterForm.email.trim().toLocaleLowerCase('tr-TR')
    const normalizedPhone = guestRegisterForm.phone.replace(/\D/g, '')
    const duplicateAccount = registeredGuestAccounts.find((account) =>
      account.username.toLocaleLowerCase('tr-TR') === normalizedUsername ||
      account.email.toLocaleLowerCase('tr-TR') === normalizedEmail ||
      account.phone.replace(/\D/g, '') === normalizedPhone,
    )

    if (duplicateAccount) {
      setError('Bu kullanıcı adı, e-posta veya telefon numarası daha önce kullanılmış.')
      return
    }

    setLoggingRole('Customer')
    setError(null)

    try {
      const session = await request<AuthSession>('/api/auth/register/guest', {
        method: 'POST',
        body: JSON.stringify(guestRegisterForm),
      })

      setPendingGuestSession(session)
      setRegisteredGuestAccounts((current) => [
        ...current,
        {
          email: guestRegisterForm.email.trim(),
          phone: guestRegisterForm.phone.trim(),
          username: guestRegisterForm.username.trim(),
        },
      ])
      addNotification(createSystemNotification('Güvenlik', 'Misafir hesabı doğrulandı', 'E-posta ve telefon doğrulaması tamamlanarak misafir hesabı oluşturuldu.', 'Kişisel Bilgiler'))
      setAuthMode('profile')
      setGuestProfileStep(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoggingRole(null)
    }
  }

  const handleGuestProfileComplete = async () => {
    if (!pendingGuestSession) {
      setError('Kayıt oturumu bulunamadı. Lütfen yeniden kayıt olun.')
      setAuthMode('register')
      return
    }

    const validationError = validateGuestProfileForm(guestProfileForm)

    if (validationError) {
      setError(validationError)
      return
    }

    setLoggingRole('Customer')
    setError(null)

    try {
      const profile = await request<GuestProfileResponse>(
        '/api/auth/guest/profile',
        {
          method: 'POST',
          body: JSON.stringify(guestProfileForm),
        },
        pendingGuestSession.token,
      )

      const completedSession: AuthSession = {
        ...pendingGuestSession,
        user: {
          ...pendingGuestSession.user,
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(completedSession))
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      setSavedGuestProfile(profile)
      setAuthSession(completedSession)
      setPendingGuestSession(null)
      setGuestRegisterForm(initialGuestRegisterForm)
      setGuestProfileForm(initialGuestProfileForm)
      setAuthMode('login')
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoggingRole(null)
    }
  }

  const handleLogout = () => {
    clearStoredAuthSession()
    setAuthSession(null)
    setSavedGuestProfile(null)
    setError(null)
  }

  if (window.location.pathname === '/support-live-console') {
    return <SupportLiveConsole />
  }

  return (
    <main className={authSession ? 'automation-shell' : 'login-shell'}>
      {authSession?.user.role === 'Customer' ? (
        <GuestExperience
          addNotification={addNotification}
          guestProfile={savedGuestProfile}
          hotelCustomizations={hotelCustomizations}
          hotelConversations={hotelConversations}
          hotelReviews={hotelReviews}
          allGuestHotels={guestPublishedHotels}
          hotels={visibleGuestHotels}
          isLoading={isLoading}
          language={language}
          onLogout={handleLogout}
          onRefresh={loadDashboard}
          search={search}
          setSearch={setSearch}
          setHotelConversations={setHotelConversations}
          setHotelReviews={setHotelReviews}
          setLanguage={setLanguage}
          setSupportRequests={setSupportRequests}
          setSystemNotifications={setSystemNotifications}
          setTwoFactorSettings={setTwoFactorSettings}
          supportRequests={supportRequests}
          systemNotifications={systemNotifications}
          twoFactorSettings={twoFactorSettings}
          user={authSession.user}
        />
      ) : authSession ? (
	        <DashboardExperience
	          addNotification={addNotification}
	          adminHotelStatuses={adminHotelStatuses}
	          databaseHealth={databaseHealth}
          hotelCustomizations={hotelCustomizations}
          hotelConversations={hotelConversations}
          hotels={visibleHotels}
          isLoading={isLoading}
          language={language}
          onLogout={handleLogout}
          onRefresh={loadDashboard}
          role={authSession.user.role as ManagementRole}
          search={search}
	          setHotelConversations={setHotelConversations}
	          setHotelCustomizations={setHotelCustomizations}
	          setAdminHotelStatuses={setAdminHotelStatuses}
          setHotels={setHotels}
          setLanguage={setLanguage}
          setSearch={setSearch}
          setSupportRequests={setSupportRequests}
          supportRequests={supportRequests}
          systemNotifications={systemNotifications}
          user={authSession.user}
        />
      ) : (
        <>
          {authMode === 'register' ? (
            <GuestRegisterExperience
              form={guestRegisterForm}
              isSubmitting={loggingRole === 'Customer'}
              onBackToLogin={() => {
                setAuthMode('login')
                setError(null)
              }}
              onSubmit={handleGuestRegister}
              setForm={setGuestRegisterForm}
            />
          ) : authMode === 'profile' && pendingGuestSession ? (
            <GuestProfileCompletionExperience
              form={guestProfileForm}
              isSubmitting={loggingRole === 'Customer'}
              onBack={() => {
                setAuthMode('register')
                setError(null)
              }}
              onComplete={handleGuestProfileComplete}
              setForm={setGuestProfileForm}
              setStep={setGuestProfileStep}
              step={guestProfileStep}
            />
          ) : pendingTwoFactor ? (
            <TwoFactorChallenge
              pending={pendingTwoFactor}
              onBack={() => setPendingTwoFactor(null)}
              onResend={resendTwoFactorCode}
              onVerify={completeTwoFactorLogin}
            />
          ) : (
            <LoginExperience
              activePortal={activePortal}
              config={activePortalConfig}
              guestMetrics={loginGuestMetrics}
              language={language}
              loginForm={loginForms[activePortal]}
	              loggingRole={loggingRole}
	              onLogin={handleLogin}
	              onNotify={addNotification}
              onShowRegister={() => {
                setAuthMode('register')
                setError(null)
	              }}
	              setLanguage={setLanguage}
	              setActivePortal={setActivePortal}
              setLoginForms={setLoginForms}
            />
          )}

          {error ? (
            <div className="login-alert" role="alert">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>
          ) : null}
        </>
      )}
    </main>
  )
}

function SupportLiveConsole() {
  const [language, setLanguage] = useState<LanguageCode>(getStoredLanguage)
  useEnglishInterface(language)
  const [agents, setAgents] = usePersistentState<SupportAgentAccount[]>(SUPPORT_AGENTS_STORAGE_KEY, [])
  const [requests, setRequests] = usePersistentState<SupportTicket[]>(SUPPORT_TICKETS_STORAGE_KEY, [])
  const [activeAgent, setActiveAgent] = usePersistentState<SupportAgentAccount | null>(SUPPORT_CONSOLE_AGENT_STORAGE_KEY, null)
  const [loginDraft, setLoginDraft] = useState({ password: '', username: '' })
  const [setupDraft, setSetupDraft] = useState({ displayName: '', password: '', username: '' })
  const [newAgentDraft, setNewAgentDraft] = useState({ displayName: '', password: '', username: '' })
  const [activeTicketId, setActiveTicketId] = usePersistentState<string>(SUPPORT_CONSOLE_TICKET_STORAGE_KEY, '')
  const [consoleMode, setConsoleMode] = usePersistentState<'live' | 'tickets'>(SUPPORT_CONSOLE_MODE_STORAGE_KEY, 'live')
  const [replyDraft, setReplyDraft] = useState('')
  const [notice, setNotice] = useState('')
  const isLiveSupportRequest = (request: SupportTicket) => request.category === 'Canlı destek'
  const scopedRequests = requests.filter((request) => consoleMode === 'live' ? isLiveSupportRequest(request) : !isLiveSupportRequest(request))
  const visibleTickets = activeAgent
    ? scopedRequests.filter((request) => !request.assignedAgent || request.assignedAgent === activeAgent.username || request.status === 'Kapatıldı')
    : []
  const activeTicket = visibleTickets.find((request) => request.id === activeTicketId) ?? visibleTickets[0]
  const waitingTickets = scopedRequests.filter((request) => request.status === 'Açık' && !request.assignedAgent)
  const activeTickets = scopedRequests.filter((request) => request.status !== 'Kapatıldı' && request.assignedAgent)
  const closedTickets = scopedRequests.filter((request) => request.status === 'Kapatıldı')
  const ticketAlreadyAnswered = consoleMode === 'tickets' && Boolean(activeTicket?.messages?.some((message) => message.sender === 'Destek Temsilcisi'))

  const updateAgentStatus = (username: string, status: SupportAgentAccount['status']) => {
    setAgents((current) => current.map((agent) => agent.username === username ? { ...agent, status } : agent))
    setActiveAgent((current) => current && current.username === username ? { ...current, status } : current)
  }
  const createFirstAgent = () => {
    if (!setupDraft.username.trim() || !setupDraft.password.trim()) {
      setNotice('İlk destek kullanıcısı için kullanıcı adı ve şifre zorunludur.')
      return
    }

    const account: SupportAgentAccount = {
      createdAt: formatDateTime(new Date()),
      displayName: setupDraft.displayName.trim() || setupDraft.username.trim(),
      password: setupDraft.password,
      status: 'Müsait',
      username: setupDraft.username.trim(),
    }

    setAgents([account])
    setActiveAgent(account)
    setSetupDraft({ displayName: '', password: '', username: '' })
  }
  const loginAgent = () => {
    const account = agents.find((agent) => agent.username === loginDraft.username.trim() && agent.password === loginDraft.password)

    if (!account) {
      setNotice('Destek kullanıcısı bulunamadı veya şifre hatalı.')
      return
    }

    setActiveAgent({ ...account, status: 'Müsait' })
    updateAgentStatus(account.username, 'Müsait')
    setNotice('')
  }
  const logoutAgent = () => {
    if (activeAgent) {
      updateAgentStatus(activeAgent.username, 'Offline')
    }

    setActiveAgent(null)
    setActiveTicketId('')
  }
  const createAgent = () => {
    if (!newAgentDraft.username.trim() || !newAgentDraft.password.trim()) {
      setNotice('Yeni destek çalışanı için kullanıcı adı ve şifre zorunludur.')
      return
    }

    if (agents.some((agent) => normalizeSearch(agent.username) === normalizeSearch(newAgentDraft.username))) {
      setNotice('Bu destek kullanıcı adı zaten kullanılıyor.')
      return
    }

    setAgents((current) => [
      ...current,
      {
        createdAt: formatDateTime(new Date()),
        displayName: newAgentDraft.displayName.trim() || newAgentDraft.username.trim(),
        password: newAgentDraft.password,
        status: 'Offline',
        username: newAgentDraft.username.trim(),
      },
    ])
    setNewAgentDraft({ displayName: '', password: '', username: '' })
    setNotice('Destek çalışanı oluşturuldu.')
  }
  const openTicket = (ticketId: string) => {
    if (!activeAgent) {
      return
    }

    setActiveTicketId(ticketId)
    setRequests((current) =>
      current.map((request) =>
        request.id === ticketId
          ? {
              ...request,
              assignedAgent: request.assignedAgent ?? activeAgent.username,
              messages: request.messages?.map((message) =>
                message.sender === 'Misafir' ? { ...message, read: true, status: 'Okundu' } : message,
              ),
              status: request.status === 'Kapatıldı' ? request.status : 'İnceleniyor',
              unreadForAdmin: false,
            }
          : request,
      ),
    )
    updateAgentStatus(activeAgent.username, 'Meşgul')
  }
  const updateTicketStatus = (ticketId: string, status: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === ticketId
          ? {
              ...request,
              lastUpdate: formatDateTime(new Date()),
              status,
            }
          : request,
      ),
    )

    if (status === 'Kapatıldı' && activeAgent) {
      updateAgentStatus(activeAgent.username, 'Müsait')
    }
  }
  const sendReply = () => {
    if (!activeTicket || !activeAgent || !replyDraft.trim()) {
      return
    }

    if (ticketAlreadyAnswered && activeTicket.status === 'Yanıtlandı') {
      setNotice('Bu destek talebi zaten yanıtlandı. Ticket mantığında ek sürekli mesajlaşma yapılmaz.')
      return
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === activeTicket.id
          ? {
              ...request,
              assignedAgent: request.assignedAgent ?? activeAgent.username,
              lastUpdate: formatDateTime(new Date()),
              messages: [
                ...(request.messages ?? []),
                {
                  id: `support-agent-${Date.now()}`,
                  read: false,
                  sender: 'Destek Temsilcisi',
                  status: 'İletildi',
                  text: replyDraft.trim(),
                  time: formatDateTime(new Date()),
                },
              ],
              status: consoleMode === 'live' ? 'İnceleniyor' : 'Yanıtlandı',
              unreadForGuest: true,
            }
          : request,
      ),
    )
    writeStoredValue(NOTIFICATIONS_STORAGE_KEY, [
      createSystemNotification('Destek', consoleMode === 'live' ? 'Canlı destek mesajınız yanıtlandı' : 'Destek talebiniz yanıtlandı', `${activeTicket.id} kodlu kaydınıza destek ekibi yanıt verdi.`, consoleMode === 'live' ? 'Canlı Destek' : 'Destek Talepleri'),
      ...readStoredValue<GuestNotification[]>(NOTIFICATIONS_STORAGE_KEY, []),
    ].slice(0, 40))
    setReplyDraft('')
  }

  if (agents.length === 0) {
    return (
      <main className="support-console-shell">
        <section className="support-console-login glass-panel">
          <LanguageSelector language={language} setLanguage={(value) => { storeLanguagePreference(value); setLanguage(value) }} />
          <PanelHeader icon={<Headphones size={20} />} title="Canlı Destek Konsolu Kurulumu" subtitle="İlk destek çalışanı hesabını oluşturun." />
          <div className="management-form">
            <label><span>Kullanıcı adı</span><input value={setupDraft.username} onChange={(event) => setSetupDraft((current) => ({ ...current, username: event.target.value }))} /></label>
            <label><span>Şifre</span><input value={setupDraft.password} type="password" onChange={(event) => setSetupDraft((current) => ({ ...current, password: event.target.value }))} /></label>
            <label><span>Ad soyad</span><input value={setupDraft.displayName} onChange={(event) => setSetupDraft((current) => ({ ...current, displayName: event.target.value }))} /></label>
          </div>
          <button className="premium-login-button" type="button" onClick={createFirstAgent}>İlk Hesabı Oluştur</button>
          {notice ? <p className="security-inline-alert error">{notice}</p> : null}
        </section>
      </main>
    )
  }

  if (!activeAgent) {
    return (
      <main className="support-console-shell">
        <section className="support-console-login glass-panel">
          <LanguageSelector language={language} setLanguage={(value) => { storeLanguagePreference(value); setLanguage(value) }} />
          <PanelHeader icon={<Headphones size={20} />} title="Canlı Destek Girişi" subtitle="Yalnızca destek çalışanı hesabı ile erişilebilir." />
          <div className="management-form">
            <label><span>Kullanıcı adı</span><input value={loginDraft.username} onChange={(event) => setLoginDraft((current) => ({ ...current, username: event.target.value }))} /></label>
            <label><span>Şifre</span><input value={loginDraft.password} type="password" onChange={(event) => setLoginDraft((current) => ({ ...current, password: event.target.value }))} /></label>
          </div>
          <button className="premium-login-button" type="button" onClick={loginAgent}>Destek Paneline Gir</button>
          {notice ? <p className="security-inline-alert error">{notice}</p> : null}
        </section>
      </main>
    )
  }

  return (
    <main className="support-console-shell support-console-dashboard">
      <header className="dashboard-topbar support-console-topbar">
        <div>
          <span>Özel URL • /support-live-console</span>
          <h1>Canlı Destek Konsolu</h1>
        </div>
        <div className="workspace-actions">
          <LanguageSelector language={language} setLanguage={(value) => { storeLanguagePreference(value); setLanguage(value) }} />
          <span className="system-status-pill">{activeAgent.displayName} • {activeAgent.status}</span>
          <button type="button" onClick={() => updateAgentStatus(activeAgent.username, activeAgent.status === 'Müsait' ? 'Meşgul' : 'Müsait')}>
            {activeAgent.status === 'Müsait' ? 'Meşgul Yap' : 'Müsait Yap'}
          </button>
          <button className="logout-button" type="button" onClick={logoutAgent}>Çıkış Yap</button>
        </div>
      </header>

      <div className="support-console-tabs">
        <button className={consoleMode === 'live' ? 'active' : ''} type="button" onClick={() => { setConsoleMode('live'); setActiveTicketId('') }}>
          <Headphones size={18} />
          <span>Canlı Destek</span>
        </button>
        <button className={consoleMode === 'tickets' ? 'active' : ''} type="button" onClick={() => { setConsoleMode('tickets'); setActiveTicketId('') }}>
          <FileText size={18} />
          <span>Destek Talepleri</span>
        </button>
      </div>

      <section className="support-console-grid">
        <article className="glass-panel">
          <PanelHeader icon={<Users size={18} />} title="Destek Çalışanları" subtitle="Online / müsait / meşgul / offline durumları" />
          <div className="support-agent-list">
            {agents.map((agent) => (
              <div className={agent.username === activeAgent.username ? 'active' : ''} key={agent.username}>
                <strong>{agent.displayName}</strong>
                <span>{agent.username} • {agent.status}</span>
              </div>
            ))}
          </div>
          <div className="management-form">
            <label><span>Yeni kullanıcı adı</span><input value={newAgentDraft.username} onChange={(event) => setNewAgentDraft((current) => ({ ...current, username: event.target.value }))} /></label>
            <label><span>Şifre</span><input value={newAgentDraft.password} type="password" onChange={(event) => setNewAgentDraft((current) => ({ ...current, password: event.target.value }))} /></label>
            <label><span>Ad soyad</span><input value={newAgentDraft.displayName} onChange={(event) => setNewAgentDraft((current) => ({ ...current, displayName: event.target.value }))} /></label>
          </div>
          <button className="secondary-auth-button" type="button" onClick={createAgent}>Destek Çalışanı Ekle</button>
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<Bell size={18} />} title={consoleMode === 'live' ? 'Canlı Destek Kuyruğu' : 'Ticket Kuyruğu'} subtitle="Gerçek destek kayıtlarından hesaplandı" />
          <div className="reservation-status-grid">
            <div><span>Bekleyen</span><strong>{waitingTickets.length}</strong></div>
            <div className="active"><span>Aktif</span><strong>{activeTickets.length}</strong></div>
            <div><span>Kapatılan</span><strong>{closedTickets.length}</strong></div>
          </div>
        </article>

        <article className="glass-panel chat-sidebar-panel">
          <PanelHeader icon={<ClipboardList size={18} />} title={consoleMode === 'live' ? 'Aktif Konuşmalar' : 'Destek Talepleri'} subtitle={consoleMode === 'live' ? 'Gerçek zamanlı sohbet ekranı' : 'Tek cevap mantığıyla ilerleyen ticket listesi'} />
          <div className="conversation-list">
            {visibleTickets.map((ticket) => (
              <button className={activeTicket?.id === ticket.id ? 'active' : ''} key={ticket.id} type="button" onClick={() => openTicket(ticket.id)}>
                <strong>{ticket.id} • {ticket.category}</strong>
                <span>{ticket.subject}</span>
                <small>{ticket.priority} • {ticket.status} • {ticket.lastUpdate}</small>
                {ticket.unreadForAdmin ? <b>1</b> : null}
              </button>
            ))}
            {visibleTickets.length === 0 ? <EmptyState text="Henüz destek talebi bulunmuyor." compact /> : null}
          </div>
        </article>

        <article className="glass-panel chat-window-panel wide">
          {activeTicket ? (
            <>
              <div className="chat-window-header">
                <div>
                  <span>{activeTicket.priority} öncelik • {activeTicket.assignedAgent ?? 'Atama bekliyor'}</span>
                  <strong>{activeTicket.subject}</strong>
                  <p>{activeTicket.id} • Son mesaj: {activeTicket.lastUpdate}</p>
                </div>
                <span className="system-status-pill">{activeTicket.status}</span>
              </div>
              <div className="message-stack">
                {(activeTicket.messages ?? []).map((message, index) => (
                  <div className={`message-bubble ${message.sender === 'Destek Temsilcisi' ? 'mine' : ''}`} key={message.id ?? `${activeTicket.id}-${index}`}>
                    <span>{message.sender} • {message.time} • {message.status ?? 'İletildi'}</span>
                    <p>{message.text}</p>
                  </div>
                ))}
                <div className="typing-indicator"><span></span><span></span><span></span>{activeAgent.displayName} yazmaya hazır</div>
              </div>
              <div className="support-admin-actions">
                {(consoleMode === 'live' ? ['Açık', 'İnceleniyor', 'Kapatıldı'] : ['Açık', 'İnceleniyor', 'Yanıtlandı', 'Kapatıldı']).map((status) => (
                  <button className={activeTicket.status === status ? 'active' : ''} key={status} type="button" onClick={() => updateTicketStatus(activeTicket.id, status)}>
                    {status}
                  </button>
                ))}
              </div>
              <div className="chat-composer">
                <input value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} placeholder={consoleMode === 'live' ? 'Canlı sohbet yanıtı yaz' : 'Ticket yanıtı yaz'} />
                <button className="premium-login-button" type="button" onClick={sendReply} disabled={ticketAlreadyAnswered && consoleMode === 'tickets' && activeTicket.status === 'Yanıtlandı'}>Gönder</button>
              </div>
              {notice ? <p className="security-inline-alert error">{notice}</p> : null}
            </>
          ) : (
            <EmptyState text="Görüntülenecek destek görüşmesi yok." />
          )}
        </article>
      </section>
    </main>
  )
}

function LoginExperience({
  activePortal,
  config,
  guestMetrics,
  language,
  loginForm,
  loggingRole,
  onLogin,
  onNotify,
  onShowRegister,
  setActivePortal,
  setLanguage,
  setLoginForms,
}: {
  activePortal: UserRole
  config: PortalConfig
  guestMetrics: Metric[]
  language: LanguageCode
  loginForm: LoginForm
  loggingRole: UserRole | null
  onLogin: (role: UserRole) => Promise<void>
  onNotify: (notification: GuestNotification) => void
  onShowRegister: () => void
  setActivePortal: (role: UserRole) => void
  setLanguage: (language: LanguageCode) => void
  setLoginForms: Dispatch<SetStateAction<Record<UserRole, LoginForm>>>
}) {
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const isAdmin = activePortal === 'SuperAdmin'
  const isOwner = activePortal === 'PropertyManager'
  const previewMetrics = isAdmin
    ? adminMetrics.slice(0, 3)
    : isOwner
      ? []
      : (guestMetrics.length > 0 ? guestMetrics : guestPreviewMetrics).slice(0, 3)
  const stageClass = isAdmin ? 'admin-stage' : isOwner ? 'owner-stage' : 'guest-stage'
  const loginCopy = {
    brand: language === 'en' ? 'Hotel Automation System' : 'Otel Otomasyon Sistemi',
    chip: isAdmin || isOwner
      ? (language === 'en' ? 'Enterprise hotel management' : 'Kurumsal otel yönetimi')
      : (language === 'en' ? 'Premium stay experience' : 'Premium konaklama deneyimi'),
    email: language === 'en'
      ? (isAdmin || isOwner ? 'Username' : 'Email / username')
      : (isAdmin || isOwner ? 'Kullanıcı adı' : 'E-posta / kullanıcı adı'),
    forgot: language === 'en' ? 'Forgot password' : 'Şifremi unuttum',
    loading: language === 'en' ? 'Signing in' : 'Giriş yapılıyor',
    newGuest: language === 'en' ? 'Create New Guest Account' : 'Yeni Misafir Kaydı Oluştur',
    password: language === 'en' ? 'Password' : 'Şifre',
    remember: language === 'en' ? 'Remember me' : 'Beni hatırla',
    signIn: language === 'en' ? 'Sign In' : 'Giriş Yap',
    subtitle: language === 'en'
      ? isAdmin
        ? 'Monitor all property, finance, security, authorization and integration workflows from one command center.'
        : isOwner
          ? 'Access your property operations with a clean, business-focused owner console.'
          : 'Explore hotels, compare rooms and manage reservations from a premium guest account.'
      : config.subtitle,
    title: language === 'en'
      ? isAdmin
        ? 'Administrator Login'
        : isOwner
          ? 'Hotel Owner Login'
          : 'Guest Login'
      : config.title,
    eyebrow: language === 'en'
      ? isAdmin
        ? 'Management Console'
        : isOwner
          ? 'Property Access'
          : 'Guest Experience'
      : config.eyebrow,
    titleNote: language === 'en'
      ? isAdmin
        ? 'Security-focused administrator access'
        : 'Guest access for reservations and hotel discovery'
      : isAdmin
        ? 'Güvenlik odaklı yönetici erişimi'
        : 'Rezervasyon ve tesis keşfi için misafir erişimi',
  }
  const heroTitle = language === 'en'
    ? isAdmin
      ? 'Central operations command center'
      : isOwner
        ? 'Manage property performance live'
        : 'Plan your stay with clarity and style'
    : isAdmin
      ? 'Merkezi operasyon komuta paneli'
      : isOwner
        ? 'Tesis performansını canlı yönet'
        : 'Konaklamanı şık ve hızlı planla'

  return (
    <section className={`login-stage ${stageClass}`}>
      <div className="login-language-switcher"><LanguageSelector language={language} setLanguage={setLanguage} /></div>
      <div className={`login-visual ${config.imageClass}`}>
        <div className="brand-panel">
          <div className="brand-emblem">
            <Building2 size={28} />
          </div>
          <div>
            <span>{loginCopy.brand}</span>
            <strong>{loginCopy.eyebrow}</strong>
          </div>
        </div>

        <div className="visual-copy">
          <span className="luxury-chip">
            <Sparkles size={15} />
            {loginCopy.chip}
          </span>
          <h1>{heroTitle}</h1>
          <p>{loginCopy.subtitle}</p>
        </div>

        {!isOwner ? (
          <div className="floating-preview">
            <div className="preview-top">
              <span>
                {isAdmin ? 'Canlı Güvenlik Skoru' : tLabel('Uygun Tesis Eşleşmesi', language)}
              </span>
              <strong>{isAdmin ? '98,7' : previewMetrics[0]?.value ?? '0'}</strong>
            </div>
            <div className="mini-line" aria-hidden="true">
              {[34, 48, 42, 65, 58, 79, 72, 88].map((height) => (
                <span key={height} style={{ '--height': `${height}%` } as CSSProperties}></span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <section className="login-panel">
        <div className="portal-switch" aria-label="Giriş tipi">
          {portals.map((portal) => (
            <button
              className={activePortal === portal.role ? 'active' : ''}
              key={portal.role}
              type="button"
              onClick={() => setActivePortal(portal.role)}
            >
              {portal.role === 'SuperAdmin' ? (
                <ShieldCheck size={17} />
              ) : portal.role === 'PropertyManager' ? (
                <Hotel size={17} />
              ) : (
                <Users size={17} />
              )}
              <span>{language === 'en' ? englishRoleLabels[portal.role] : roleLabels[portal.role]}</span>
            </button>
          ))}
        </div>

        <div className="login-title">
          <span>{loginCopy.eyebrow}</span>
          <h2>{loginCopy.title}</h2>
          {!isOwner ? (
            <p>{loginCopy.titleNote}</p>
          ) : null}
        </div>

        {!isAdmin && !isOwner ? (
          <div className="owner-preview-grid">
            {previewMetrics.map((metric) => (
              <div className={`preview-card ${metric.accent}`} key={metric.label}>
                <span>{tLabel(metric.label, language)}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        ) : null}

        <form
          className="premium-form"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            void onLogin(activePortal)
          }}
        >
          <label>
            <span>{loginCopy.email}</span>
            <div className="field-shell">
              <Mail size={18} />
              <input
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForms((current) => ({
                    ...current,
                    [activePortal]: {
                      ...current[activePortal],
                      email: event.target.value,
                    },
                  }))
                }
                type={isAdmin || isOwner ? 'text' : 'email'}
                required
              />
            </div>
          </label>

          <label>
            <span>{loginCopy.password}</span>
            <div className="field-shell">
              <LockKeyhole size={18} />
              <input
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForms((current) => ({
                    ...current,
                    [activePortal]: {
                      ...current[activePortal],
                      password: event.target.value,
                    },
                  }))
                }
                type="password"
                required
              />
            </div>
          </label>

          {isAdmin || isOwner ? (
            <label>
              <span>{language === 'en' ? 'Turkish ID Number' : 'T.C. Kimlik No'}</span>
              <div className="field-shell">
                <ShieldCheck size={18} />
                <input
                  value={loginForm.tcKimlikNo ?? ''}
                  maxLength={11}
                  onChange={(event) =>
                    setLoginForms((current) => ({
                      ...current,
                      [activePortal]: {
                        ...current[activePortal],
                        tcKimlikNo: event.target.value.replace(/\D/g, ''),
                      },
                    }))
                  }
                  required
                />
              </div>
            </label>
          ) : null}

          <div className="form-options">
            <label className="remember-check">
              <input
                checked={loginForm.remember}
                onChange={(event) =>
                  setLoginForms((current) => ({
                    ...current,
                    [activePortal]: {
                      ...current[activePortal],
                      remember: event.target.checked,
                    },
                  }))
                }
                type="checkbox"
              />
              <span>{loginCopy.remember}</span>
            </label>
            <button type="button" onClick={() => setIsForgotOpen(true)}>{loginCopy.forgot}</button>
          </div>

          <button
            className="premium-login-button"
            disabled={loggingRole === activePortal}
            type="submit"
          >
            <DoorOpen size={18} />
            <span>{loggingRole === activePortal ? loginCopy.loading : loginCopy.signIn}</span>
          </button>

          {activePortal === 'Customer' ? (
            <button className="secondary-auth-button" type="button" onClick={onShowRegister}>
              <UserCog size={18} />
              {loginCopy.newGuest}
            </button>
          ) : null}
        </form>

        {isForgotOpen ? (
          <ForgotPasswordFlow
            defaultIdentifier={loginForm.email}
            onClose={() => setIsForgotOpen(false)}
            onNotify={onNotify}
          />
        ) : null}
      </section>
    </section>
  )
}

function ForgotPasswordFlow({
  defaultIdentifier,
  onClose,
  onNotify,
}: {
  defaultIdentifier: string
  onClose: () => void
  onNotify: (notification: GuestNotification) => void
}) {
  const [channel, setChannel] = useState<TwoFactorMethod>('email')
  const [identifier, setIdentifier] = useState(defaultIdentifier)
  const [code, setCode] = useState('')
  const [expiresAt, setExpiresAt] = useState(0)
  const [enteredCode, setEnteredCode] = useState('')
  const [step, setStep] = useState<'identity' | 'code' | 'password' | 'done'>('identity')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmittingReset, setIsSubmittingReset] = useState(false)
  const [message, setMessage] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const remainingSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000))

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const sendCode = () => {
    if (!identifier.trim()) {
      setMessage(channel === 'email' ? 'E-posta adresi giriniz.' : 'Telefon numarası giriniz.')
      return
    }

    setCode(DEMO_VERIFICATION_CODE)
    setExpiresAt(Date.now() + VERIFICATION_TIMEOUT_MS)
    setEnteredCode('')
    setMessage(`${channel === 'email' ? 'E-posta' : 'Telefon'} doğrulama kodu gönderildi. Demo kod: ${DEMO_VERIFICATION_CODE}`)
    setStep('code')
  }

  const verifyCode = () => {
    if (Date.now() > expiresAt) {
      setMessage('Kod süresi doldu. Kodu tekrar gönderin.')
      return
    }

    if (enteredCode.trim() !== code) {
      setMessage('Doğrulama kodu hatalı.')
      return
    }

    setMessage('')
    setStep('password')
  }

  const updatePassword = async () => {
    if (newPassword.length < 8) {
      setMessage('Yeni şifre minimum 8 karakter olmalıdır.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Yeni şifre ve tekrar alanı eşleşmiyor.')
      return
    }

    setIsSubmittingReset(true)

    try {
      await request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          channel,
          confirmPassword,
          identifier,
          newPassword,
        }),
      })
      setMessage('Şifreniz başarıyla güncellendi.')
      onNotify(createSystemNotification('Güvenlik', 'Şifreniz değiştirildi', 'Şifre sıfırlama akışı başarıyla tamamlandı.', 'Güvenlik Ayarları'))
      setStep('done')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Şifre güncellenemedi.')
    } finally {
      setIsSubmittingReset(false)
    }
  }

  return (
    <div className="auth-recovery-panel">
      <div className="auth-recovery-header">
        <div>
          <span>Güvenli hesap kurtarma</span>
          <strong>Şifremi Unuttum</strong>
        </div>
        <button type="button" onClick={onClose}>Kapat</button>
      </div>

      {step === 'identity' ? (
        <>
          <div className="chat-filter-row">
            <button className={channel === 'email' ? 'active' : ''} type="button" onClick={() => setChannel('email')}>E-posta ile</button>
            <button className={channel === 'phone' ? 'active' : ''} type="button" onClick={() => setChannel('phone')}>Telefon ile</button>
          </div>
          <label className="recovery-field">
            <span>{channel === 'email' ? 'E-posta adresi' : 'Telefon numarası'}</span>
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
          </label>
          <button className="premium-login-button" type="button" onClick={sendCode}>
            Doğrulama kodu gönder
          </button>
        </>
      ) : null}

      {step === 'code' ? (
        <>
          <label className="recovery-field">
            <span>Doğrulama kodu</span>
            <input value={enteredCode} onChange={(event) => setEnteredCode(event.target.value)} />
          </label>
          <p className="recovery-timer">Kod süresi: {remainingSeconds > 0 ? `${remainingSeconds} sn` : 'Süre doldu'}</p>
          <button className="premium-login-button" type="button" onClick={verifyCode}>
            Kodu doğrula
          </button>
          <button className="secondary-auth-button" disabled={remainingSeconds > 0} type="button" onClick={sendCode}>
            Kodu tekrar gönder
          </button>
        </>
      ) : null}

      {step === 'password' ? (
        <>
          <label className="recovery-field">
            <span>Yeni şifre</span>
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label className="recovery-field">
            <span>Yeni şifre tekrar</span>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          <button className="premium-login-button" disabled={isSubmittingReset} type="button" onClick={() => void updatePassword()}>
            {isSubmittingReset ? 'Güncelleniyor' : 'Şifreyi güncelle'}
          </button>
        </>
      ) : null}

      {message ? <p className={`security-inline-alert ${step === 'done' ? 'success' : 'error'}`}>{message}</p> : null}
    </div>
  )
}

function TwoFactorChallenge({
  onBack,
  onResend,
  onVerify,
  pending,
}: {
  onBack: () => void
  onResend: () => void
  onVerify: (code: string) => Promise<void>
  pending: PendingTwoFactor
}) {
  const [enteredCode, setEnteredCode] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const remainingSeconds = Math.max(0, Math.ceil((pending.expiresAt - now) / 1000))

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className="login-stage guest-stage">
      <div className="login-visual guest-visual">
        <div className="brand-panel">
          <div className="brand-emblem"><ShieldCheck size={28} /></div>
          <div>
            <span>İki aşamalı doğrulama</span>
            <strong>Güvenli giriş kontrolü</strong>
          </div>
        </div>
        <div className="visual-copy">
          <span className="luxury-chip"><LockKeyhole size={15} /> Ek güvenlik</span>
          <h1>Girişini doğrula</h1>
          <p>{pending.method === 'email' ? 'E-posta' : 'Telefon'} yöntemiyle gönderilen kodu girerek oturumu tamamla.</p>
        </div>
      </div>
      <section className="login-panel">
        <div className="login-title">
          <span>Doğrulama kodu gönderildi</span>
          <h2>Kod Ekranı</h2>
          <p>Demo kod: {pending.code} • Kalan süre: {remainingSeconds > 0 ? `${remainingSeconds} sn` : 'Süre doldu'}</p>
        </div>
        <div className="premium-form">
          <label>
            <span>Doğrulama kodu</span>
            <div className="field-shell">
              <ShieldCheck size={18} />
              <input value={enteredCode} onChange={(event) => setEnteredCode(event.target.value)} />
            </div>
          </label>
          {pending.error ? <p className="security-inline-alert error">{pending.error}</p> : null}
          <button className="premium-login-button" type="button" onClick={() => void onVerify(enteredCode)}>
            Girişi Tamamla
          </button>
          <button className="secondary-auth-button" disabled={remainingSeconds > 0} type="button" onClick={onResend}>
            Kodu tekrar gönder
          </button>
          <button className="secondary-auth-button" type="button" onClick={onBack}>
            Giriş ekranına dön
          </button>
        </div>
      </section>
    </section>
  )
}

function GuestRegisterExperience({
  form,
  isSubmitting,
  onBackToLogin,
  onSubmit,
  setForm,
}: {
  form: GuestRegisterForm
  isSubmitting: boolean
  onBackToLogin: () => void
  onSubmit: () => Promise<void>
  setForm: Dispatch<SetStateAction<GuestRegisterForm>>
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailCode, setEmailCode] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [enteredEmailCode, setEnteredEmailCode] = useState('')
  const [enteredPhoneCode, setEnteredPhoneCode] = useState('')
  const [emailExpiresAt, setEmailExpiresAt] = useState(0)
  const [phoneExpiresAt, setPhoneExpiresAt] = useState(0)
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const strength = getPasswordStrength(form.password)
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword
  const emailRemainingSeconds = Math.max(0, Math.ceil((emailExpiresAt - now) / 1000))
  const phoneRemainingSeconds = Math.max(0, Math.ceil((phoneExpiresAt - now) / 1000))
  const normalizedFormEmail = form.email.trim().toLocaleLowerCase('tr-TR')
  const normalizedFormPhone = form.phone.replace(/\D/g, '')
  const isEmailVerified = Boolean(normalizedFormEmail) && verifiedEmail === normalizedFormEmail
  const isPhoneVerified = Boolean(normalizedFormPhone) && verifiedPhone === normalizedFormPhone

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const sendRegisterCode = (channel: TwoFactorMethod) => {
    if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setVerificationMessage('Kod göndermek için geçerli bir e-posta giriniz.')
      return
    }

    if (channel === 'phone' && !/^\+?[0-9\s()-]{10,20}$/.test(form.phone.trim())) {
      setVerificationMessage('Kod göndermek için geçerli bir telefon numarası giriniz.')
      return
    }

    if (channel === 'email') {
      setEmailCode(DEMO_VERIFICATION_CODE)
      setEmailExpiresAt(Date.now() + VERIFICATION_TIMEOUT_MS)
      setVerificationMessage(`E-posta doğrulama kodu gönderildi. Demo kod: ${DEMO_VERIFICATION_CODE}`)
      return
    }

    setPhoneCode(DEMO_VERIFICATION_CODE)
    setPhoneExpiresAt(Date.now() + VERIFICATION_TIMEOUT_MS)
    setVerificationMessage(`Telefon doğrulama kodu gönderildi. Demo kod: ${DEMO_VERIFICATION_CODE}`)
  }

  const verifyRegisterCode = (channel: TwoFactorMethod) => {
    if (channel === 'email') {
      if (Date.now() > emailExpiresAt) {
        setVerificationMessage('E-posta kodunun süresi doldu. Yeni kod isteyin.')
        return
      }

      if (enteredEmailCode.trim() !== emailCode) {
        setVerificationMessage('E-posta doğrulama kodu hatalı.')
        return
      }

      setVerifiedEmail(normalizedFormEmail)
      setVerificationMessage('E-posta doğrulandı.')
      return
    }

    if (Date.now() > phoneExpiresAt) {
      setVerificationMessage('Telefon kodunun süresi doldu. Yeni kod isteyin.')
      return
    }

    if (enteredPhoneCode.trim() !== phoneCode) {
      setVerificationMessage('Telefon doğrulama kodu hatalı.')
      return
    }

    setVerifiedPhone(normalizedFormPhone)
    setVerificationMessage('Telefon doğrulandı.')
  }

  return (
    <section className="login-stage register-stage">
      <div className="login-visual guest-visual">
        <div className="brand-panel">
          <div className="brand-emblem">
            <Building2 size={28} />
          </div>
          <div>
            <span>Otel Otomasyon Sistemi</span>
            <strong>Güvenli misafir kaydı</strong>
          </div>
        </div>

        <div className="visual-copy">
          <span className="luxury-chip">
            <ShieldCheck size={15} />
            KVKK uyumlu hesap açılışı
          </span>
          <h1>Konaklama hesabını güvenle oluştur</h1>
          <p>
            Kullanıcı adın ve e-postan benzersiz olarak kontrol edilir; şifren güvenli şekilde
            hashlenerek saklanır.
          </p>
        </div>
      </div>

      <section className="login-panel register-panel">
        <div className="register-stepper">
          <span className="active">1</span>
          <strong>Hesap Bilgileri</strong>
          <span>2</span>
          <strong>Profil Tamamlama</strong>
        </div>

        <div className="login-title">
          <span>Misafir Kayıt Ekranı</span>
          <h2>Kayıt Ol</h2>
          <p>Kullanıcı adı, e-posta ve güçlü şifre ile güvenli misafir hesabı oluştur.</p>
        </div>

        <form
          className="premium-form"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            void onSubmit()
          }}
        >
          <label>
            <span>Kullanıcı adı</span>
            <div className="field-shell">
              <User size={18} />
              <input
                value={form.username}
                onChange={(event) =>
                  setForm((current) => ({ ...current, username: event.target.value }))
                }
                required
                minLength={3}
              />
            </div>
          </label>

          <label>
            <span>E-posta</span>
            <div className="field-shell">
              <Mail size={18} />
              <input
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
                type="email"
              />
            </div>
          </label>

          <label>
            <span>Telefon numarası</span>
            <div className="field-shell">
              <Users size={18} />
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                required
                type="tel"
              />
            </div>
          </label>

          <div className="verification-grid">
            <div className={`verification-card ${isEmailVerified ? 'verified' : ''}`}>
              <strong>E-posta doğrulama</strong>
              <span>{isEmailVerified ? 'Doğrulandı' : emailRemainingSeconds > 0 ? `${emailRemainingSeconds} sn kaldı` : 'Kod bekleniyor'}</span>
              <div>
                <input value={enteredEmailCode} onChange={(event) => setEnteredEmailCode(event.target.value)} placeholder="E-posta kodu" />
                <button type="button" onClick={() => verifyRegisterCode('email')}>Doğrula</button>
              </div>
              <button disabled={emailRemainingSeconds > 0 && !isEmailVerified} type="button" onClick={() => sendRegisterCode('email')}>
                Kodu gönder
              </button>
            </div>
            <div className={`verification-card ${isPhoneVerified ? 'verified' : ''}`}>
              <strong>Telefon doğrulama</strong>
              <span>{isPhoneVerified ? 'Doğrulandı' : phoneRemainingSeconds > 0 ? `${phoneRemainingSeconds} sn kaldı` : 'Kod bekleniyor'}</span>
              <div>
                <input value={enteredPhoneCode} onChange={(event) => setEnteredPhoneCode(event.target.value)} placeholder="Telefon kodu" />
                <button type="button" onClick={() => verifyRegisterCode('phone')}>Doğrula</button>
              </div>
              <button disabled={phoneRemainingSeconds > 0 && !isPhoneVerified} type="button" onClick={() => sendRegisterCode('phone')}>
                Kodu gönder
              </button>
            </div>
          </div>

          {verificationMessage ? <p className="security-inline-alert success">{verificationMessage}</p> : null}

          <label>
            <span>Şifre</span>
            <div className="field-shell password-field">
              <LockKeyhole size={18} />
              <input
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                required
                type={showPassword ? 'text' : 'password'}
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <div className={`password-strength ${strength.className}`}>
            <span></span>
            <div>
              <strong>Şifre güvenliği: {strength.label}</strong>
              <p>Minimum 8 karakter, büyük harf, küçük harf ve rakam içermelidir.</p>
            </div>
          </div>

          <label>
            <span>Şifre tekrar</span>
            <div className="field-shell password-field">
              <LockKeyhole size={18} />
              <input
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                required
                type={showConfirmPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {passwordsMismatch ? (
              <small className="inline-error">Şifre ve şifre tekrar aynı olmalıdır.</small>
            ) : null}
          </label>

          <label className="remember-check consent-check">
            <input
              checked={form.kvkkAccepted}
              onChange={(event) =>
                setForm((current) => ({ ...current, kvkkAccepted: event.target.checked }))
              }
              required
              type="checkbox"
            />
            <span>KVKK aydınlatma metnini okudum ve onaylıyorum.</span>
          </label>

          <label className="remember-check consent-check">
            <input
              checked={form.userAgreementAccepted}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  userAgreementAccepted: event.target.checked,
                }))
              }
              required
              type="checkbox"
            />
            <span>Kullanıcı sözleşmesini kabul ediyorum.</span>
          </label>

          <button className="premium-login-button" disabled={isSubmitting || !isEmailVerified || !isPhoneVerified} type="submit">
            <ShieldCheck size={18} />
            {isSubmitting ? 'Kayıt oluşturuluyor' : 'Kayıt Ol'}
          </button>
          <button className="secondary-auth-button" type="button" onClick={onBackToLogin}>
            Giriş ekranına dön
          </button>
        </form>
      </section>
    </section>
  )
}

function GuestProfileCompletionExperience({
  form,
  isSubmitting,
  onBack,
  onComplete,
  setForm,
  setStep,
  step,
}: {
  form: GuestProfileForm
  isSubmitting: boolean
  onBack: () => void
  onComplete: () => Promise<void>
  setForm: Dispatch<SetStateAction<GuestProfileForm>>
  setStep: (step: number) => void
  step: number
}) {
  const steps = ['Kişisel Bilgiler', 'Rezervasyon Bilgileri', 'Otel Tercihleri']
  const [stepError, setStepError] = useState<string | null>(null)

  const nextStep = () => {
    const validationError = validateGuestProfileStep(form, step)

    if (validationError) {
      setStepError(validationError)
      return validationError
    }

    setStepError(null)
    setStep(Math.min(step + 1, steps.length - 1))
    return null
  }

  return (
    <section className="profile-completion-shell">
      <div className="profile-completion-header">
        <div>
          <span>Profil Bilgilerini Tamamla</span>
          <h1>Rezervasyon için gerekli misafir profilini oluştur</h1>
          <p>Form adım adım ilerler; hassas bilgiler yalnızca yetkili sistem akışlarında kullanılır.</p>
        </div>
        <button className="secondary-auth-button" type="button" onClick={onBack}>
          Kayıt ekranına dön
        </button>
      </div>

      <div className="profile-stepper">
        {steps.map((item, index) => (
          <button
            className={index === step ? 'active' : index < step ? 'completed' : ''}
            key={item}
            type="button"
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {item}
          </button>
        ))}
      </div>

      <form
        className="glass-panel profile-form-panel"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          void onComplete()
        }}
      >
        {step === 0 ? <PersonalProfileFields form={form} setForm={setForm} /> : null}
        {step === 1 ? <ReservationProfileFields form={form} setForm={setForm} /> : null}
        {step === 2 ? <HotelPreferenceFields form={form} setForm={setForm} /> : null}
        {stepError ? <div className="inline-form-alert">{stepError}</div> : null}

        <div className="profile-form-actions">
          <button
            className="secondary-auth-button"
            disabled={step === 0}
            type="button"
            onClick={() => setStep(Math.max(step - 1, 0))}
          >
            Geri
          </button>
          {step < steps.length - 1 ? (
            <button
              className="premium-login-button"
              type="button"
              onClick={() => void nextStep()}
            >
              Devam Et
            </button>
          ) : (
            <button className="premium-login-button" disabled={isSubmitting} type="submit">
              <ShieldCheck size={18} />
              {isSubmitting ? 'Profil kaydediliyor' : 'Profili Tamamla'}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function PersonalProfileFields({
  form,
  setForm,
}: {
  form: GuestProfileForm
  setForm: Dispatch<SetStateAction<GuestProfileForm>>
}) {
  return (
    <div className="profile-field-grid">
      <ProfileInput label="Ad" value={form.firstName} onChange={(value) => setForm((current) => ({ ...current, firstName: value }))} required />
      <ProfileInput label="Soyad" value={form.lastName} onChange={(value) => setForm((current) => ({ ...current, lastName: value }))} required />
      <ProfileInput label="T.C. Kimlik Numarası" value={form.tcKimlikNo} onChange={(value) => setForm((current) => ({ ...current, tcKimlikNo: value.replace(/\D/g, '').slice(0, 11) }))} required />
      <ProfileInput label="Doğum tarihi" type="date" value={form.birthDate} onChange={(value) => setForm((current) => ({ ...current, birthDate: value }))} required />
      <ProfileSelect label="Cinsiyet" value={form.gender} options={['Kadın', 'Erkek', 'Belirtmek istemiyorum']} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} />
      <ProfileInput label="Telefon numarası" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} required />
      <ProfileInput label="Ülke" value={form.country} onChange={(value) => setForm((current) => ({ ...current, country: value }))} required />
      <ProfileInput label="Şehir" value={form.city} onChange={(value) => setForm((current) => ({ ...current, city: value }))} required />
      <ProfileInput className="wide" label="Adres" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} required />
    </div>
  )
}

function ReservationProfileFields({
  form,
  setForm,
}: {
  form: GuestProfileForm
  setForm: Dispatch<SetStateAction<GuestProfileForm>>
}) {
  return (
    <div className="profile-field-grid">
      <ProfileSelect label="Kimlik / pasaport tipi" value={form.documentType} options={['T.C. Kimlik', 'Pasaport', 'Yabancı Kimlik']} onChange={(value) => setForm((current) => ({ ...current, documentType: value }))} />
      <ProfileInput label="Pasaport numarası" value={form.passportNumber} onChange={(value) => setForm((current) => ({ ...current, passportNumber: value }))} />
      <ProfileInput label="Uyruk" value={form.nationality} onChange={(value) => setForm((current) => ({ ...current, nationality: value }))} required />
      <ProfileSelect label="Tercih edilen dil" value={form.preferredLanguage} options={['Türkçe', 'İngilizce', 'Almanca', 'Fransızca']} onChange={(value) => setForm((current) => ({ ...current, preferredLanguage: value }))} />
      <ProfileInput className="wide" label="Fatura bilgileri" value={form.invoiceInfo} onChange={(value) => setForm((current) => ({ ...current, invoiceInfo: value }))} required />
      <ProfileSelect label="Ödeme yöntemi tercihi" value={form.paymentPreference} options={['Kredi Kartı', 'Sanal POS', 'Tesiste Ödeme', 'Havale / EFT']} onChange={(value) => setForm((current) => ({ ...current, paymentPreference: value }))} />
    </div>
  )
}

function HotelPreferenceFields({
  form,
  setForm,
}: {
  form: GuestProfileForm
  setForm: Dispatch<SetStateAction<GuestProfileForm>>
}) {
  return (
    <div className="profile-field-grid">
      <ProfileInput className="wide" label="Özel istekler" value={form.specialRequests} onChange={(value) => setForm((current) => ({ ...current, specialRequests: value }))} />
      <ProfileSelect label="Yatak tipi tercihi" value={form.bedTypePreference} options={['King yatak', 'Twin yatak', 'Aile yatağı', 'Fark etmez']} onChange={(value) => setForm((current) => ({ ...current, bedTypePreference: value }))} />
      <ProfileInput label="Evcil hayvan bilgisi" value={form.petInfo} onChange={(value) => setForm((current) => ({ ...current, petInfo: value }))} />
      <ProfileInput label="Acil durum iletişim kişisi" value={form.emergencyContactName} onChange={(value) => setForm((current) => ({ ...current, emergencyContactName: value }))} required />
      <ProfileInput label="Acil durum telefon numarası" value={form.emergencyContactPhone} onChange={(value) => setForm((current) => ({ ...current, emergencyContactPhone: value }))} required />

      <div className="profile-toggle-grid wide">
        <label className="remember-check">
          <input checked={form.accessibilityNeeds} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, accessibilityNeeds: event.target.checked }))} />
          <span>Engelli erişimi ihtiyacım var</span>
        </label>
        <label className="remember-check">
          <input checked={form.nonSmokingRoomPreference} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, nonSmokingRoomPreference: event.target.checked }))} />
          <span>Sigara içilmeyen oda tercih ediyorum</span>
        </label>
        <label className="remember-check">
          <input checked={form.breakfastPreference} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, breakfastPreference: event.target.checked }))} />
          <span>Kahvaltı tercihim var</span>
        </label>
      </div>
    </div>
  )
}

function ProfileInput({
  className,
  label,
  onChange,
  required,
  type = 'text',
  value,
}: {
  className?: string
  label: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
  value: string
}) {
  return (
    <label className={className}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} required={required} type={type} />
    </label>
  )
}

function ProfileSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function LanguageSelector({
  language,
  setLanguage,
}: {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
}) {
  return (
    <div className="language-switcher flag-language-switcher" aria-label="Dil seçimi">
      <button className={language === 'tr' ? 'active' : ''} type="button" onClick={() => setLanguage('tr')}>
        <span className="flag-circle">🇹🇷</span>
        <em>Türkçe</em>
      </button>
      <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => setLanguage('en')}>
        <span className="flag-circle">🇬🇧</span>
        <em>English</em>
      </button>
    </div>
  )
}

function DashboardExperience({
  addNotification,
  adminHotelStatuses,
  databaseHealth,
  hotelCustomizations,
  hotelConversations,
  hotels,
  isLoading,
  language,
  onLogout,
  onRefresh,
  role,
  search,
  setHotelCustomizations,
  setAdminHotelStatuses,
  setHotelConversations,
  setHotels,
  setLanguage,
  setSearch,
  setSupportRequests,
  supportRequests,
  systemNotifications,
  user,
}: {
  addNotification: (notification: GuestNotification) => void
  adminHotelStatuses: AdminHotelStatus[]
  databaseHealth: DatabaseHealth | null
  hotelCustomizations: Record<string, HotelCustomization>
  hotelConversations: GuestConversation[]
  hotels: HotelRecord[]
  isLoading: boolean
  language: LanguageCode
  onLogout: () => void
  onRefresh: () => Promise<void> | void
  role: ManagementRole
  search: string
  setHotelCustomizations: Dispatch<SetStateAction<Record<string, HotelCustomization>>>
  setAdminHotelStatuses: Dispatch<SetStateAction<AdminHotelStatus[]>>
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setHotels: Dispatch<SetStateAction<HotelRecord[]>>
  setLanguage: (language: LanguageCode) => void
  setSearch: (value: string) => void
  setSupportRequests: Dispatch<SetStateAction<SupportTicket[]>>
  supportRequests: SupportTicket[]
  systemNotifications: GuestNotification[]
  user: AuthUser
}) {
  const initialPanel: DashboardPanelId = role === 'SuperAdmin' ? 'admin' : 'owner'
  const permittedPanels = getPermittedPanels(role)
  const [storedActivePanel, setActivePanel] = usePersistentState<DashboardPanelId>(
    DASHBOARD_ACTIVE_PANEL_STORAGE_KEY,
    initialPanel,
  )
  const activePanel = permittedPanels.includes(storedActivePanel) ? storedActivePanel : initialPanel
  const panel = dashboardPanels[activePanel]
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentState<boolean>(DASHBOARD_SIDEBAR_STORAGE_KEY, false)
  const [activeItem, setActiveItem] = usePersistentState<string>(
    DASHBOARD_ACTIVE_ITEM_STORAGE_KEY,
    panel.sections[0].items[0],
  )
  const [openSections, setOpenSections] = usePersistentState<Record<string, boolean>>(DASHBOARD_OPEN_SECTIONS_STORAGE_KEY, {
    [panel.sections[0].id]: true,
    [panel.sections[1]?.id ?? panel.sections[0].id]: true,
  })
  const [isProfileOpen, setIsProfileOpen] = usePersistentState<boolean>(DASHBOARD_PROFILE_MENU_STORAGE_KEY, false)
  const [activeProfilePanel, setActiveProfilePanel] = usePersistentState<'profile' | 'notifications' | 'security' | null>(
    DASHBOARD_PROFILE_PANEL_STORAGE_KEY,
    null,
  )
  const [isRefreshingPanel, setIsRefreshingPanel] = useState(false)
  const [adminProfile, setAdminProfile] = usePersistentState<AdminProfileSettings>(
    ADMIN_PROFILE_STORAGE_KEY,
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      phone: '',
      photoLabel: 'Yönetici avatarı',
      username: user.username ?? user.email.split('@')[0] ?? 'yonetici',
    },
  )
  const [adminNotificationPrefs, setAdminNotificationPrefs] = usePersistentState<AdminNotificationPreferences>(
    ADMIN_NOTIFICATION_PREFS_STORAGE_KEY,
    {
      emailEnabled: true,
      financeReports: true,
      hotelApprovals: true,
      inAppEnabled: true,
      reservations: true,
      security: true,
      support: true,
    },
  )
  const [adminSecurity, setAdminSecurity] = usePersistentState<AdminSecuritySettings>(
    ADMIN_SECURITY_STORAGE_KEY,
    {
      sessionNote: 'Mevcut tarayıcı oturumu aktif',
      twoFactorEnabled: false,
    },
  )
  const unreadOwnerMessages = hotelConversations.filter((conversation) =>
    conversation.messages.some((message) => message.sender === 'Misafir' && message.status !== 'Okundu'),
  ).length
  const unreadAdminSupport = supportRequests.filter((request) => request.unreadForAdmin).length
  const storedAdminReservations = getAllGuestReservations()
  const storedOwnerReviews = readStoredValue<GuestReview[]>(HOTEL_REVIEWS_STORAGE_KEY, [])
  const adminActiveReservations = storedAdminReservations.filter(isActiveReservationRecord)
  const activeHotelCount = hotels.filter((hotel) => getAdminHotelStatus(hotel, adminHotelStatuses) === 'Aktif').length
  const totalAdminRooms = hotels.reduce((total, hotel, index) => total + getHotelRooms(hotel, index, hotelCustomizations).length, 0)
  const unreadSystemNotifications = systemNotifications.filter((notification) => notification.unread).length
  const adminNotificationCount = unreadSystemNotifications
  const managementHotels = hotels
  const ownerHotels = activePanel === 'owner' ? getOwnedHotelsForUser(user, managementHotels) : []
  const ownerHotelIds = new Set(ownerHotels.map((hotel) => hotel.id))
  const ownerRooms = ownerHotels.flatMap((hotel) => {
    const hotelIndex = Math.max(managementHotels.findIndex((item) => item.id === hotel.id), 0)

    return getHotelRooms(hotel, hotelIndex, hotelCustomizations)
  })
  const ownerReservations = ownerHotels.length > 0
    ? storedAdminReservations.filter((reservation) =>
        ownerHotels.some((hotel) => idsMatch(reservation.hotelId, hotel.id)),
      )
    : []
  const ownerActiveReservations = ownerReservations.filter(isActiveReservationRecord)
  const ownerRevenue = ownerReservations
    .filter((reservation) => isRevenueEligibleReservation(reservation, ownerRooms))
    .reduce((total, reservation) => total + getReservationTotal(reservation, ownerRooms), 0)
  const ownerReviews = ownerHotels.length > 0 ? storedOwnerReviews.filter((review) => ownerHotelIds.has(review.hotelId)) : []
  const ownerAverageRating = ownerReviews.length > 0
    ? ownerReviews.reduce((total, review) => total + review.rating, 0) / ownerReviews.length
    : 0
  const ownerOccupancy = percentageOf(ownerActiveReservations.length, Math.max(ownerRooms.reduce((total, room) => total + room.available, 0) + ownerActiveReservations.length, 1))
  const ownerPanelMetrics: Metric[] = [
    { label: 'Oda Tipi', value: String(ownerRooms.length), detail: ownerHotels.length > 0 ? `${ownerHotels.length} bağlı otelin oda kayıtlarından hesaplandı` : 'Henüz kayıt bulunmuyor', accent: 'cyan' },
    { label: 'Aktif Rezervasyon', value: String(ownerActiveReservations.length), detail: 'Bağlı otellere ait aktif rezervasyonlar', accent: 'gold' },
    { label: 'Gelir', value: formatCurrency(ownerRevenue), detail: 'Bağlı otellere ait rezervasyon toplamı', accent: 'white' },
    { label: 'Misafir Puanı', value: ownerReviews.length > 0 ? ownerAverageRating.toFixed(1) : '0', detail: `${ownerReviews.length} gerçek yorumdan hesaplandı`, accent: 'cyan' },
  ]
  const visiblePanelMetrics: Metric[] = activePanel === 'admin'
    ? [
        { label: 'Aktif Rezervasyon', value: String(adminActiveReservations.length), detail: 'Kalıcı rezervasyon kayıtlarından hesaplandı', accent: 'cyan' },
        { label: 'Toplam Otel', value: String(hotels.length), detail: `${activeHotelCount} aktif tesis yayında`, accent: 'gold' },
        { label: 'Oda Tipi', value: String(totalAdminRooms), detail: 'Otel oda listelerinden hesaplandı', accent: 'white' },
        { label: 'Güvenlik', value: String(adminNotificationCount), detail: 'Okunmamış sistem bildirimi', accent: 'gold' },
      ]
    : activePanel === 'owner'
      ? ownerPanelMetrics
    : panel.metrics
  const visibleHeroMetricValue = activePanel === 'admin'
    ? (databaseHealth?.status === 'Healthy' ? '100%' : '0%')
    : activePanel === 'owner'
      ? `${ownerOccupancy}%`
    : panel.heroMetricValue
  const visibleHeroMetricLabel = activePanel === 'admin' ? 'Sistem sağlık skoru' : activePanel === 'owner' ? 'Gerçek doluluk oranı' : panel.heroMetricLabel
  const shouldShowAdminOverviewChrome = activePanel === 'admin'
    ? activeItem === 'Genel Durum'
    : activePanel === 'owner'
      ? activeItem === 'Ana Sayfa'
      : true

  useEffect(() => {
    if (storedActivePanel !== activePanel) {
      setActivePanel(activePanel)
    }
  }, [activePanel, setActivePanel, storedActivePanel])

  useEffect(() => {
    const isActiveItemValid = panel.sections.some((section) => (
      section.title === activeItem || section.items.includes(activeItem)
    ))

    if (!isActiveItemValid) {
      setActiveItem(panel.sections[0].items[0])
      setOpenSections(activePanel === 'owner'
        ? { [panel.sections[0].id]: true }
        : {
            [panel.sections[0].id]: true,
            [panel.sections[1]?.id ?? panel.sections[0].id]: true,
          })
    }
  }, [activeItem, activePanel, panel.sections, setActiveItem, setOpenSections])
  const getDashboardBadge = (item: string) => {
    if (ownerMessageItems.has(item)) {
      return unreadOwnerMessages
    }

    if (adminSupportItems.has(item)) {
      if (item === 'Açık Talepler') {
        return supportRequests.filter((request) => request.unreadForAdmin && request.status === 'Açık').length
      }

      if (item === 'Bekleyen Talepler') {
        return supportRequests.filter((request) => request.unreadForAdmin && request.status === 'Beklemede').length
      }

      if (item === 'Yanıtlanan Talepler') {
        return supportRequests.filter((request) => request.unreadForAdmin && request.status === 'Yanıtlandı').length
      }

      if (item === 'Kapatılan Talepler') {
        return supportRequests.filter((request) => request.unreadForAdmin && request.status === 'Kapatıldı').length
      }

      return unreadAdminSupport
    }

    return 0
  }
  const getDashboardSectionBadge = (section: SidebarSection) => {
    if (section.id === 'destek') {
      return unreadAdminSupport
    }

    if (section.id === 'mesaj') {
      return unreadOwnerMessages
    }

    return section.items.reduce((total, item) => total + getDashboardBadge(item), 0)
  }

  const changePanel = (panelId: DashboardPanelId) => {
    const nextPanel = dashboardPanels[panelId]
    setActivePanel(panelId)
    setActiveItem(nextPanel.sections[0].items[0])
    setOpenSections(panelId === 'owner'
      ? { [nextPanel.sections[0].id]: true }
      : {
          [nextPanel.sections[0].id]: true,
          [nextPanel.sections[1]?.id ?? nextPanel.sections[0].id]: true,
        })
    setIsProfileOpen(false)
  }

  const toggleSection = (sectionId: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false)
    }

    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }

  const selectDashboardSection = (section: SidebarSection) => {
    const isOwnerSinglePageSection = activePanel === 'owner' && section.items.length === 1 && section.items[0] === section.title

    if (isOwnerSinglePageSection) {
      setActiveItem(section.title)
      setSearch('')
      setIsProfileOpen(false)
      setActiveProfilePanel(null)
      return
    }

    toggleSection(section.id)
    setActiveItem(section.title)
    setSearch('')
    setIsProfileOpen(false)
    setActiveProfilePanel(null)
  }

  const selectMenuItem = (item: string) => {
    setActiveItem(item)
    setSearch('')
    setIsProfileOpen(false)
    setActiveProfilePanel(null)
  }

  const refreshCurrentPage = async () => {
    setIsRefreshingPanel(true)

    try {
      await onRefresh()
    } finally {
      window.setTimeout(() => setIsRefreshingPanel(false), 360)
    }
  }

  return (
    <section className={`dashboard-layout panel-${activePanel} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
	      <aside className="sidebar">
	        <div className="sidebar-brand">
	          <button className="brand-profile-trigger" type="button" onClick={() => setIsProfileOpen((current) => !current)} title="Profil paneli">
	            <div className="brand-emblem small">
	              <Building2 size={22} />
	            </div>
	          </button>
	          <div className="sidebar-brand-copy">
	            <span>{user.firstName} {user.lastName}</span>
	            <strong>{panel.sidebarTitle}</strong>
	          </div>
          <button
            className="sidebar-collapse"
            type="button"
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            title={isSidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
            aria-label={isSidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
          >
	            {isSidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
	          </button>
	          {isProfileOpen ? (
	            <div className="profile-menu sidebar-profile-menu">
	              <strong>{user.firstName} {user.lastName}</strong>
	              <span>{language === 'en' ? englishRoleLabels[role] : roleLabels[role]} • {tLabel(panel.label, language)}</span>
	              <button type="button" onClick={() => { setActiveProfilePanel('profile'); setIsProfileOpen(false) }}>
	                <UserCog size={16} />
	                {tLabel('Profil Ayarları', language)}
	              </button>
	              <button type="button" onClick={() => { setActiveProfilePanel('notifications'); setIsProfileOpen(false) }}>
	                <Bell size={16} />
	                {tLabel('Bildirim Tercihleri', language)}
	              </button>
	              <button type="button" onClick={() => { setActiveProfilePanel('security'); setIsProfileOpen(false) }}>
	                <ShieldCheck size={16} />
	                {tLabel('Güvenlik Ayarları', language)}
	              </button>
	              <button className="logout-button" type="button" onClick={onLogout}>
	                <LogOut size={16} />
	                {tLabel('Çıkış Yap', language)}
	              </button>
	            </div>
	          ) : null}
	        </div>

        <nav className="sidebar-nav" aria-label="Ana menü">
          {panel.sections.map((section) => {
            const isOwnerSinglePageSection = activePanel === 'owner' && section.items.length === 1 && section.items[0] === section.title

            return (
              <div className="sidebar-section" key={section.id}>
                <button
                  className={`section-trigger ${section.title === activeItem || section.items.includes(activeItem) ? 'active' : ''}`}
                  type="button"
                  onClick={() => selectDashboardSection(section)}
                  title={section.title}
                >
                  {sectionIcon(section.id)}
                  <span>{tLabel(section.title, language)}</span>
                  {getDashboardSectionBadge(section) > 0 ? (
                    <b className="menu-badge">{getDashboardSectionBadge(section)}</b>
                  ) : null}
                  {!isOwnerSinglePageSection ? (
                    <ChevronDown
                      className={`section-chevron ${openSections[section.id] ? 'open' : ''}`}
                      size={16}
                    />
                  ) : null}
                </button>

                {!isOwnerSinglePageSection ? (
                  <div className={`submenu ${openSections[section.id] && !isSidebarCollapsed ? 'open' : ''}`}>
                    {section.items.map((item) => (
                      <button
                        className={activeItem === item ? 'active' : ''}
                        key={item}
                        type="button"
                        onClick={() => selectMenuItem(item)}
                      >
                        <ChevronRight size={14} />
                        <span>{tLabel(item, language)}</span>
                        {getDashboardBadge(item) > 0 ? <b className="menu-badge">{getDashboardBadge(item)}</b> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-status">
          <Database size={18} />
          <div className="sidebar-status-copy">
            <span>{panel.statusLabel}</span>
            <strong>
              {databaseHealth?.status === 'Healthy' ? panel.statusValue : 'Kontrol ediliyor'}
            </strong>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="dashboard-topbar">
          <div>
            <span>{tLabel(panel.label, language)} • {panel.accessNote}</span>
            <h1>{tLabel(activeItem, language)}</h1>
          </div>

          <div className="workspace-actions">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <span className="system-status-pill">
              <Activity size={15} />
              Canlı sistem
            </span>
	            <label className="dashboard-search">
	              <Search size={17} />
	              <input
	                value={search}
	                onChange={(event) => setSearch(event.target.value)}
	                placeholder="Panel içinde ara"
	              />
	            </label>
		            <button className={isRefreshingPanel ? 'loading-action' : ''} type="button" onClick={() => void refreshCurrentPage()}>
		              <Activity size={18} />
		              {isRefreshingPanel ? (language === 'en' ? 'Refreshing' : 'Yenileniyor') : (language === 'en' ? 'Refresh' : 'Yenile')}
		            </button>
		            <button className="logout-button topbar-logout" type="button" onClick={onLogout}>
		              <LogOut size={18} />
		              {tLabel('Çıkış Yap', language)}
		            </button>
	          </div>
	        </header>

        {permittedPanels.length > 1 ? (
          <div className="panel-switcher" aria-label="Çalışma alanı seçimi">
            {permittedPanels.map((panelId) => (
              <button
                className={activePanel === panelId ? 'active' : ''}
                key={panelId}
                type="button"
                onClick={() => changePanel(panelId)}
              >
                {panelIcon(panelId)}
                <span>{dashboardPanels[panelId].label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {shouldShowAdminOverviewChrome ? (
          <>
            <section className={`hero-dashboard role-hero role-hero-${activePanel}`}>
              <div>
                <span>{panel.label}</span>
                <h2>{panel.heroTitle}</h2>
                <p>{panel.heroSubtitle}</p>
              </div>
              <div className="hero-glass-card">
                <span>{visibleHeroMetricLabel}</span>
                <strong>{visibleHeroMetricValue}</strong>
              </div>
            </section>

            <section className="metric-grid role-metric-grid">
              {visiblePanelMetrics.map((metric) => (
                <article className={`metric-card ${metric.accent}`} key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </section>
          </>
        ) : null}

	        <PanelWorkspaceContent
	          activeItem={activeItem}
	          addNotification={addNotification}
	          adminHotelStatuses={adminHotelStatuses}
	          databaseHealth={databaseHealth}
	          hotelCustomizations={hotelCustomizations}
	          hotelConversations={hotelConversations}
	          hotels={hotels}
	          isLoading={isLoading}
	          panel={panel}
	          role={role}
	          search={search}
	          setAdminHotelStatuses={setAdminHotelStatuses}
	          setHotelCustomizations={setHotelCustomizations}
	          setHotels={setHotels}
	          setHotelConversations={setHotelConversations}
	          setSupportRequests={setSupportRequests}
	          supportRequests={supportRequests}
	          user={user}
	        />
      </section>
      {activeProfilePanel ? (
        <AdminProfileOverlay
          activePanel={activeProfilePanel}
          notificationPrefs={adminNotificationPrefs}
          onClose={() => setActiveProfilePanel(null)}
          onLogout={onLogout}
          profile={adminProfile}
          security={adminSecurity}
          setNotificationPrefs={setAdminNotificationPrefs}
          setProfile={setAdminProfile}
          setSecurity={setAdminSecurity}
          user={user}
        />
      ) : null}
    </section>
  )
}

function AdminProfileOverlay({
  activePanel,
  notificationPrefs,
  onClose,
  onLogout,
  profile,
  security,
  setNotificationPrefs,
  setProfile,
  setSecurity,
  user,
}: {
  activePanel: 'profile' | 'notifications' | 'security'
  notificationPrefs: AdminNotificationPreferences
  onClose: () => void
  onLogout: () => void
  profile: AdminProfileSettings
  security: AdminSecuritySettings
  setNotificationPrefs: Dispatch<SetStateAction<AdminNotificationPreferences>>
  setProfile: Dispatch<SetStateAction<AdminProfileSettings>>
  setSecurity: Dispatch<SetStateAction<AdminSecuritySettings>>
  user: AuthUser
}) {
  const [passwordDraft, setPasswordDraft] = useState({ current: '', next: '', repeat: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const togglePreference = (key: keyof AdminNotificationPreferences) => {
    setNotificationPrefs((current) => ({ ...current, [key]: !current[key] }))
  }
  const changePassword = () => {
    if (!passwordDraft.next || passwordDraft.next !== passwordDraft.repeat) {
      setPasswordMessage('Yeni şifreler eşleşmiyor.')
      return
    }

    setProfile((current) => ({ ...current, password: passwordDraft.next }))
    setPasswordDraft({ current: '', next: '', repeat: '' })
    setPasswordMessage('Şifre başarıyla güncellendi.')
  }
  const preferenceRows: Array<[keyof AdminNotificationPreferences, string, string]> = [
    ['reservations', 'Rezervasyon bildirimleri', 'Yeni rezervasyon, iptal ve yaklaşan konaklama olayları'],
    ['support', 'Destek talebi bildirimleri', 'Misafir destek mesajları ve talep güncellemeleri'],
    ['security', 'Güvenlik bildirimleri', 'Şüpheli işlem, oturum ve yetki uyarıları'],
    ['hotelApprovals', 'Otel onay bildirimleri', 'Onay, askıya alma ve kaldırma süreçleri'],
    ['financeReports', 'Finans raporu bildirimleri', 'Gelir özeti ve dönemsel rapor hatırlatmaları'],
    ['emailEnabled', 'E-posta bildirimi', 'Kritik olayları e-posta kanalına gönder'],
    ['inAppEnabled', 'Sistem içi bildirim', 'Panel içinde okunmamış bildirim üret'],
  ]

  return (
    <div className="admin-profile-overlay" role="dialog" aria-modal="true">
      <article className="glass-panel admin-profile-panel">
        <div className="admin-profile-head">
          <PanelHeader
            icon={<UserCog size={18} />}
            title={activePanel === 'profile' ? 'Profil Ayarları' : activePanel === 'notifications' ? 'Bildirim Tercihleri' : 'Güvenlik Ayarları'}
            subtitle={`${user.firstName} ${user.lastName} yönetici hesabı`}
          />
          <button type="button" onClick={onClose}>Kapat</button>
        </div>

        {activePanel === 'profile' ? (
          <div className="management-form two-column admin-profile-form">
            <label><span>Ad</span><input value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} /></label>
            <label><span>Soyad</span><input value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value }))} /></label>
            <label><span>Kullanıcı adı</span><input value={profile.username} onChange={(event) => setProfile((current) => ({ ...current, username: event.target.value }))} /></label>
            <label><span>E-posta</span><input value={profile.email} type="email" onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} /></label>
            <label><span>Telefon</span><input value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} /></label>
            <label><span>Profil fotoğrafı</span><input value={profile.photoLabel} onChange={(event) => setProfile((current) => ({ ...current, photoLabel: event.target.value }))} /></label>
            <label><span>Eski şifre</span><input value={passwordDraft.current} type="password" onChange={(event) => setPasswordDraft((current) => ({ ...current, current: event.target.value }))} /></label>
            <label><span>Yeni şifre</span><input value={passwordDraft.next} type="password" onChange={(event) => setPasswordDraft((current) => ({ ...current, next: event.target.value }))} /></label>
            <label><span>Yeni şifre tekrar</span><input value={passwordDraft.repeat} type="password" onChange={(event) => setPasswordDraft((current) => ({ ...current, repeat: event.target.value }))} /></label>
            <div className="admin-profile-actions">
              <button type="button" onClick={changePassword}>Şifreyi Güncelle</button>
              {passwordMessage ? <span>{passwordMessage}</span> : null}
            </div>
          </div>
        ) : null}

        {activePanel === 'notifications' ? (
          <div className="admin-preference-list">
            {preferenceRows.map(([key, title, detail]) => (
              <button className={notificationPrefs[key] ? 'active' : ''} key={key} type="button" onClick={() => togglePreference(key)}>
                <div>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
                <em>{notificationPrefs[key] ? 'Açık' : 'Kapalı'}</em>
              </button>
            ))}
          </div>
        ) : null}

        {activePanel === 'security' ? (
          <div className="admin-security-grid">
            <article>
              <strong>İki aşamalı doğrulama</strong>
              <span>{security.twoFactorEnabled ? 'Yönetici girişinde ek doğrulama aktif.' : 'Ek doğrulama kapalı.'}</span>
              <button type="button" onClick={() => setSecurity((current) => ({ ...current, twoFactorEnabled: !current.twoFactorEnabled }))}>
                {security.twoFactorEnabled ? 'Kapat' : 'Aç'}
              </button>
            </article>
            <article>
              <strong>Aktif oturumlar</strong>
              <span>{security.sessionNote}</span>
              <button type="button" onClick={() => setSecurity((current) => ({ ...current, sessionNote: 'Mevcut oturum güvenli olarak yenilendi' }))}>Oturumu Yenile</button>
            </article>
            <article>
              <strong>Son giriş bilgisi</strong>
              <span>{formatDateTime(new Date())} • 127.0.0.1 • Mevcut tarayıcı</span>
            </article>
            <article>
              <strong>Hesap güvenlik seviyesi</strong>
              <span>{security.twoFactorEnabled ? 'Güçlü' : 'Orta'} • Şifre ve oturum kayıtları izleniyor</span>
            </article>
            <article>
              <strong>Güvenli çıkış</strong>
              <span>Bu işlem aktif oturumu kapatır ve giriş ekranına döndürür.</span>
              <button type="button" onClick={onLogout}>Güvenli Çıkış Yap</button>
            </article>
          </div>
        ) : null}
      </article>
    </div>
  )
}

function PanelWorkspaceContent({
  activeItem,
  addNotification,
  adminHotelStatuses,
  databaseHealth,
  hotelCustomizations,
  hotelConversations,
  hotels,
  isLoading,
  panel,
  role,
  search,
  setAdminHotelStatuses,
  setHotelCustomizations,
  setHotelConversations,
  setHotels,
  setSupportRequests,
  supportRequests,
  user,
}: {
  activeItem: string
  addNotification: (notification: GuestNotification) => void
  adminHotelStatuses: AdminHotelStatus[]
  databaseHealth: DatabaseHealth | null
  hotelCustomizations: Record<string, HotelCustomization>
  hotelConversations: GuestConversation[]
  hotels: HotelRecord[]
  isLoading: boolean
  panel: DashboardPanelConfig
  role: ManagementRole
  search: string
  setAdminHotelStatuses: Dispatch<SetStateAction<AdminHotelStatus[]>>
  setHotelCustomizations: Dispatch<SetStateAction<Record<string, HotelCustomization>>>
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setHotels: Dispatch<SetStateAction<HotelRecord[]>>
  setSupportRequests: Dispatch<SetStateAction<SupportTicket[]>>
  supportRequests: SupportTicket[]
  user: AuthUser
}) {
  const panelTableSubtitle = isLoading
    ? 'Veriler yükleniyor'
    : `${panel.tableSubtitle} • ${hotels.length} tesis verisi senkron`

  if (role === 'SuperAdmin' && panel.id === 'owner' && ownerRestrictedItems.has(activeItem)) {
    return <AccessDeniedPanel activeItem={activeItem} />
  }

  if (role === 'PropertyManager' && panel.id === 'owner') {
    return (
      <OwnerPanelPage
        activeItem={activeItem}
        hotelConversations={hotelConversations}
        hotelCustomizations={hotelCustomizations}
        hotels={hotels}
        onNotify={addNotification}
        setHotelConversations={setHotelConversations}
        setHotelCustomizations={setHotelCustomizations}
        setHotels={setHotels}
        setAdminHotelStatuses={setAdminHotelStatuses}
        user={user}
      />
    )
  }

  if (role === 'SuperAdmin' && panel.id === 'admin') {
    return (
      <AdminPanelPage
	          activeItem={activeItem}
	          addNotification={addNotification}
	          adminHotelStatuses={adminHotelStatuses}
	          databaseHealth={databaseHealth}
        hotelConversations={hotelConversations}
	        hotelCustomizations={hotelCustomizations}
	        hotels={hotels}
	          pageQuery={search}
            setHotelConversations={setHotelConversations}
	          setAdminHotelStatuses={setAdminHotelStatuses}
            setHotels={setHotels}
	          setSupportRequests={setSupportRequests}
        supportRequests={supportRequests}
      />
    )
  }

  if (role === 'SuperAdmin' && adminSupportItems.has(activeItem)) {
    return (
      <AdminSupportMessagesPage
        activeItem={activeItem}
        requests={supportRequests}
        setRequests={setSupportRequests}
        onNotify={addNotification}
      />
    )
  }

  return (
    <section className="dashboard-grid enterprise-grid">
      <article className="glass-panel wide">
        <PanelHeader
          icon={<BarChart3 size={18} />}
          title={panel.chartTitle}
          subtitle={panel.chartSubtitle}
        />
        {panel.id === 'accounting' ? (
          <LineGraph values={panel.chartValues} />
        ) : (
          <BarGraph values={panel.chartValues} />
        )}
      </article>

      <article className="glass-panel">
        <PanelHeader
          icon={<BedDouble size={18} />}
          title={panel.heatmapTitle}
          subtitle={panel.heatmapSubtitle}
        />
        <Heatmap values={panel.heatmapValues} />
      </article>

      <article className="glass-panel">
        <PanelHeader
          icon={<CalendarCheck size={18} />}
          title={panel.listTitle}
          subtitle={panel.listSubtitle}
        />
        <DataList rows={panel.listRows} />
      </article>

      <article className="glass-panel">
        <PanelHeader
          icon={<Bell size={18} />}
          title={panel.feedTitle}
          subtitle={panel.feedSubtitle}
        />
        <ActionFeed items={panel.feedItems} />
      </article>

      <article className="glass-panel wide">
        <PanelHeader
          icon={<ClipboardList size={18} />}
          title={panel.tableTitle}
          subtitle={panelTableSubtitle}
        />
        <EnterpriseTable headers={panel.tableHeaders} rows={panel.tableRows} />
      </article>

      <article className="glass-panel">
        <PanelHeader
          icon={<TrendingUp size={18} />}
          title={panel.progressTitle}
          subtitle={panel.progressSubtitle}
        />
        <ProgressStack items={panel.progressItems} />
      </article>

      <article className="glass-panel wide active-workflow-panel">
        <PanelHeader
          icon={<Sparkles size={18} />}
          title={`Aktif Modül: ${activeItem}`}
          subtitle="Seçili menüye göre gerçekçi operasyon içeriği"
        />
        <div className="workflow-grid">
          <div>
            <span>Yetki Kapsamı</span>
            <strong>{panel.accessNote}</strong>
          </div>
          <div>
            <span>İşlem Kuyruğu</span>
            <strong>{panel.metrics[0].value}</strong>
          </div>
          <div>
            <span>Önerilen Aksiyon</span>
            <strong>{activeItem} kontrolünü tamamla</strong>
          </div>
        </div>
        <ActionFeed
          items={[
            `${activeItem} için canlı veri güncellendi`,
            `${panel.label} izinleri doğrulandı`,
            `${activeItem} raporu dışa aktarmaya hazır`,
          ]}
        />
      </article>
    </section>
  )
}

type AdminUserRow = {
  email: string
  hotelName?: string
  lastLogin: string
  name: string
  phone: string
  reason?: string
  role: string
  status: string
  tcKimlikNo?: string
  username: string
}

type AdminPageModel = {
  cards: Metric[]
  chartValues: number[]
  emptyText: string
  feedItems: string[]
  headers: string[]
  progressItems: ProgressItem[]
  rows: string[][]
  statusColumn?: number
  subtitle: string
  title: string
}

type AdminTableModel = {
  headers: string[]
  rows: string[][]
  statusColumn: number
}

type AvailableHotelResult = {
  availableRoomCount: number
  campaignRate: number
  debugReasons: string[]
  hotel: HotelRecord
  hotelIndex: number
  maxPrice: number
  minPrice: number
  oldPrice?: number
  popularityScore: number
  rooms: RoomOption[]
  suitableRooms: RoomOption[]
}

function AdminPanelPage({
  activeItem,
  addNotification,
  adminHotelStatuses,
  databaseHealth,
  hotelConversations,
  hotelCustomizations,
  hotels,
  pageQuery,
  setHotelConversations,
  setAdminHotelStatuses,
  setHotels,
  setSupportRequests,
  supportRequests,
}: {
  activeItem: string
  addNotification: (notification: GuestNotification) => void
  adminHotelStatuses: AdminHotelStatus[]
  databaseHealth: DatabaseHealth | null
  hotelConversations: GuestConversation[]
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  pageQuery: string
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setAdminHotelStatuses: Dispatch<SetStateAction<AdminHotelStatus[]>>
  setHotels: Dispatch<SetStateAction<HotelRecord[]>>
  setSupportRequests: Dispatch<SetStateAction<SupportTicket[]>>
  supportRequests: SupportTicket[]
}) {
  const didMountRef = useRef(false)
  const [filter, setFilter] = usePersistentState<string>(ADMIN_FILTER_STORAGE_KEY, 'Tümü')
  const [selectedHotelId, setSelectedHotelId] = usePersistentState<string | null>(ADMIN_SELECTED_HOTEL_STORAGE_KEY, null)
  const [selectedReservationId, setSelectedReservationId] = usePersistentState<string | null>(ADMIN_SELECTED_RESERVATION_STORAGE_KEY, null)
  const [reservationFilters, setReservationFilters] = usePersistentState<typeof defaultAdminReservationFilters>(
    ADMIN_RESERVATION_FILTER_STORAGE_KEY,
    defaultAdminReservationFilters,
  )
  const [pendingHotelAction, setPendingHotelAction] = usePersistentState<{ action: string; hotelId: string } | null>(
    ADMIN_PENDING_ACTION_STORAGE_KEY,
    null,
  )
  const [hotelActionReason, setHotelActionReason] = usePersistentState<string>(ADMIN_PENDING_REASON_STORAGE_KEY, '')
  const [adminAccounts, setAdminAccounts] = usePersistentState<StoredAdminAccount[]>(ADMIN_ACCOUNTS_STORAGE_KEY, getStoredAdminAccountsWithTc())
  const [staffAccounts, setStaffAccounts] = usePersistentState<StoredStaffAccount[]>(ADMIN_STAFF_STORAGE_KEY, [])
  const [ownerAccounts, setOwnerAccounts] = usePersistentState<StoredOwnerAccount[]>(OWNER_ACCOUNTS_STORAGE_KEY, getStoredOwnerAccounts(hotels))
  const [violations, setViolations] = usePersistentState<AdminViolation[]>(ADMIN_VIOLATIONS_STORAGE_KEY, [])
  const [newAdminDraft, setNewAdminDraft] = useState({ password: '', tcKimlikNo: '', username: '' })
  const [adminFormNotice, setAdminFormNotice] = useState('')
  const [staffFormNotice, setStaffFormNotice] = useState('')
  const emptyOwnerDraft = {
    email: '',
    fullName: '',
    hotelId: hotels[0]?.id ?? '',
    password: '',
    phone: '',
    tcKimlikNo: '',
    username: '',
  }
  const [ownerDraft, setOwnerDraft] = useState(emptyOwnerDraft)
  const [ownerFormNotice, setOwnerFormNotice] = useState('')
  const [ownerFormState, setOwnerFormState] = useState<{ mode: 'create' | 'edit'; ownerId: string | null; open: boolean }>({
    mode: 'create',
    ownerId: null,
    open: false,
  })
  const [ownerReasonState, setOwnerReasonState] = useState<{ action: 'Pasif Yap' | 'İptal Et'; reason: string; ownerId: string } | null>(null)
  const [newStaffDraft, setNewStaffDraft] = useState({
    firstName: '',
    hotelId: hotels[0]?.id ?? '',
    lastName: '',
    phone: '',
    role: 'Personel',
    tcKimlikNo: '',
  })
  const [violationDraft, setViolationDraft] = useState({
    actionType: 'Yetki dışı işlem',
    disabledUntil: '',
    mode: 'İhlal kaydı',
    note: '',
    risk: 'Orta',
    target: '',
    username: '',
  })
  const storedGuests = readStoredValue<StoredGuestAccount[]>(GUEST_ACCOUNTS_STORAGE_KEY, [])
  const reservations = getAllGuestReservations()
  const notifications = readStoredValue<GuestNotification[]>(NOTIFICATIONS_STORAGE_KEY, [])
  const favoriteHotelIds = readStoredValue<string[]>(FAVORITE_HOTELS_STORAGE_KEY, [])
  const authSession = readStoredSession()
  const users = buildAdminUsers(storedGuests, authSession, adminAccounts, staffAccounts, ownerAccounts, hotels)
  const currentAdmin = authSession?.user.email ?? 'aktif-yönetici'

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    setSelectedHotelId(null)
    setSelectedReservationId(null)
    setPendingHotelAction(null)
    setHotelActionReason('')
    setFilter('Tümü')
  }, [activeItem, setFilter, setHotelActionReason, setPendingHotelAction, setSelectedHotelId, setSelectedReservationId])

  useEffect(() => {
    setAdminAccounts((current) => normalizeAdminAccounts(current))
  }, [setAdminAccounts])

  useEffect(() => {
    setOwnerAccounts((current) => normalizeOwnerAccounts(current, hotels))
  }, [hotels, setOwnerAccounts])

  if (adminSupportItems.has(activeItem)) {
    return (
      <AdminSupportMessagesPage
        activeItem={activeItem}
        key={activeItem}
        onNotify={addNotification}
        requests={supportRequests}
        setRequests={setSupportRequests}
      />
    )
  }

  const page = getAdminPageModel(activeItem, {
    databaseHealth,
    favoriteHotelIds,
	    hotelConversations,
	    hotelCustomizations,
	    hotelStatuses: adminHotelStatuses,
	    hotels,
	    notifications,
	    reservations,
	    staffAccounts,
	    supportRequests,
	    users,
	    violations,
	  })
  const statusIndex = page.statusColumn ?? page.headers.findIndex((header) => ['Durum', 'Risk Seviyesi', 'Öncelik', 'Sonuç'].includes(header))
  const filters = statusIndex >= 0 ? ['Tümü', ...Array.from(new Set(page.rows.map((row) => row[statusIndex]).filter(Boolean)))] : ['Tümü']
  const activeFilter = filters.includes(filter) ? filter : 'Tümü'
  const normalizedQuery = normalizeSearch(pageQuery)
  const visibleRows = page.rows.filter((row) => {
    const matchesSearch = normalizedQuery.length === 0 || normalizeSearch(row.join(' ')).includes(normalizedQuery)
    const matchesFilter = activeFilter === 'Tümü' || (statusIndex >= 0 && row[statusIndex] === activeFilter)

    return matchesSearch && matchesFilter
  })
  const isAdminReservationPage = adminReservationItems.has(activeItem)
  const reservationPaymentFilters = isAdminReservationPage
    ? ['Tümü', ...Array.from(new Set(page.rows.map((row) => row[7]).filter(Boolean)))]
    : ['Tümü']
  const displayedRows = isAdminReservationPage
    ? visibleRows
        .filter((row) => {
          const matchesHotel = !reservationFilters.hotel.trim() || normalizeSearch(row[2]).includes(normalizeSearch(reservationFilters.hotel))
          const matchesGuest = !reservationFilters.guest.trim() || normalizeSearch(row[1]).includes(normalizeSearch(reservationFilters.guest))
          const matchesPayment = reservationFilters.payment === 'Tümü' || row[7] === reservationFilters.payment
          const matchesStart = !reservationFilters.startDate || compareDateInputValues(row[4], reservationFilters.startDate) >= 0
          const matchesEnd = !reservationFilters.endDate || compareDateInputValues(row[5], reservationFilters.endDate) <= 0

          return matchesHotel && matchesGuest && matchesPayment && matchesStart && matchesEnd
        })
        .sort((firstRow, secondRow) => {
          if (reservationFilters.sort === 'amount-asc' || reservationFilters.sort === 'amount-desc') {
            const firstAmount = parseStoredMoney(firstRow[6])
            const secondAmount = parseStoredMoney(secondRow[6])

            return reservationFilters.sort === 'amount-asc' ? firstAmount - secondAmount : secondAmount - firstAmount
          }

          const firstDate = Date.parse(firstRow[9]) || Date.parse(firstRow[4]) || 0
          const secondDate = Date.parse(secondRow[9]) || Date.parse(secondRow[4]) || 0

          return reservationFilters.sort === 'oldest' ? firstDate - secondDate : secondDate - firstDate
        })
    : visibleRows
  const visibleCards = page.cards.filter((metric) =>
    normalizedQuery.length === 0 || normalizeSearch(`${metric.label} ${metric.value} ${metric.detail}`).includes(normalizedQuery),
  )
  const visibleFeedItems = page.feedItems.filter((item) =>
    normalizedQuery.length === 0 || normalizeSearch(item).includes(normalizedQuery),
  )
  const visibleProgressItems = page.progressItems.filter((item) =>
    normalizedQuery.length === 0 || normalizeSearch(`${item.label} ${item.detail}`).includes(normalizedQuery),
  )
  const selectedHotel = selectedHotelId ? hotels.find((hotel) => hotel.id === selectedHotelId) : null
  const selectedReservation = selectedReservationId
    ? reservations.find((reservation) =>
        reservation.id === selectedReservationId
        || reservation.reservationId === selectedReservationId
        || reservation.code === selectedReservationId,
      ) ?? null
    : null
  const ownerFormNoticeClass = ownerFormNotice.includes('zorunludur') || ownerFormNotice.includes('zaten var') ? 'error' : 'success'

  const upsertHotelStatus = (hotelId: string, status: AdminHotelStatus['status'], reason?: string) => {
    setAdminHotelStatuses((current) => {
      const nextRecord: AdminHotelStatus = {
        hotelId,
        reason,
        status,
        updatedAt: formatDateTime(new Date()),
        updatedBy: currentAdmin,
      }
      const nextRecords = [
        nextRecord,
        ...current.filter((record) => record.hotelId !== hotelId),
      ]

      writeStoredValue(ADMIN_HOTEL_STATUS_STORAGE_KEY, nextRecords)
      return nextRecords
    })
  }
  const syncHotelActiveFlag = (hotelId: string, isActive: boolean) => {
    setHotels((current) => current.map((hotel) => hotel.id === hotelId ? { ...hotel, isActive } : hotel))
    const storedCustomHotels = readStoredValue<HotelRecord[]>(CUSTOM_HOTELS_STORAGE_KEY, [])

    if (storedCustomHotels.some((hotel) => hotel.id === hotelId)) {
      writeStoredValue(
        CUSTOM_HOTELS_STORAGE_KEY,
        storedCustomHotels.map((hotel) => hotel.id === hotelId ? { ...hotel, isActive } : hotel),
      )
    }
  }

  const startHotelAction = (action: string, row: string[]) => {
    const hotel = hotels.find((item) => item.name === row[0])

    if (!hotel) {
      return
    }

    if (action === 'Oteli Görüntüle') {
      setSelectedHotelId(hotel.id)
      return
    }

    const lock = acquireAdminLock(`hotel-${hotel.id}`, currentAdmin)

    if (lock) {
      setPendingHotelAction(null)
      window.alert('Bu kayıt şu anda başka bir yönetici tarafından işleniyor.')
      return
    }

    if (action === 'Geri Aktifleştir' || action === 'Geri Getir' || action === 'Onayla') {
      upsertHotelStatus(hotel.id, 'Aktif', `${action} işlemi uygulandı`)
      syncHotelActiveFlag(hotel.id, true)
      releaseAdminLock(`hotel-${hotel.id}`, currentAdmin)
      addNotification(createSystemNotification('Güvenlik', `Otel durumu güncellendi`, `${hotel.name} için ${action} işlemi tamamlandı.`, 'Otel Listesi'))
      return
    }

    setPendingHotelAction({ action, hotelId: hotel.id })
    setHotelActionReason('')
  }

  const completeHotelAction = () => {
    if (!pendingHotelAction || !hotelActionReason.trim()) {
      return
    }

    const nextStatus: AdminHotelStatus['status'] =
      pendingHotelAction.action === 'Askıya Al'
        ? 'Askıda'
        : pendingHotelAction.action === 'Reddet'
          ? 'Reddedildi'
          : 'Kaldırıldı'
    const hotel = hotels.find((item) => item.id === pendingHotelAction.hotelId)

    upsertHotelStatus(pendingHotelAction.hotelId, nextStatus, hotelActionReason.trim())
    syncHotelActiveFlag(pendingHotelAction.hotelId, false)
    if (hotel && nextStatus === 'Reddedildi') {
      const conversationId = `admin-hotel-approval-${hotel.id}`
      const approvalMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        read: false,
        sender: 'Yönetici',
        status: 'İletildi',
        text: `${hotel.name} tesis başvurusu reddedildi. Neden: ${hotelActionReason.trim()}`,
        time: formatDateTime(new Date()),
      }

      setHotelConversations((current) => {
        const existingConversation = current.find((conversation) => conversation.id === conversationId)

        if (existingConversation) {
          return current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: [...conversation.messages, approvalMessage],
                  status: 'Yönetici yanıtı',
                  unreadCount: conversation.unreadCount + 1,
                  updatedAt: formatDateTime(new Date()),
                }
              : conversation,
          )
        }

        return [
          {
            category: 'Otel Onay Süreci',
            hotelId: hotel.id,
            hotelName: hotel.name,
            id: conversationId,
            messages: [approvalMessage],
            reservationCode: 'Tesis başvurusu',
            status: 'Yönetici yanıtı',
            unreadCount: 1,
            updatedAt: formatDateTime(new Date()),
          },
          ...current,
        ]
      })
    }
    releaseAdminLock(`hotel-${pendingHotelAction.hotelId}`, currentAdmin)
    addNotification(createSystemNotification('Güvenlik', `Otel ${nextStatus}`, `${hotel?.name ?? 'Seçili otel'} için neden kaydedildi: ${hotelActionReason.trim()}`, 'Otel Listesi'))
    setPendingHotelAction(null)
    setHotelActionReason('')
  }

  const cancelHotelAction = () => {
    if (pendingHotelAction) {
      releaseAdminLock(`hotel-${pendingHotelAction.hotelId}`, currentAdmin)
    }

    setPendingHotelAction(null)
    setHotelActionReason('')
  }
  const createAdminAccount = () => {
    const username = newAdminDraft.username.trim()
    const password = newAdminDraft.password.trim()
    const tcKimlikNo = newAdminDraft.tcKimlikNo.replace(/\D/g, '')

    if (!username || !password || tcKimlikNo.length !== 11) {
      setAdminFormNotice('Kullanıcı adı, şifre ve 11 haneli T.C. Kimlik No zorunludur.')
      return
    }

    if (adminAccounts.some((account) => normalizeSearch(account.username) === normalizeSearch(username))) {
      setAdminFormNotice('Bu kullanıcı adı daha önce kullanılmış.')
      return
    }

    if (adminAccounts.some((account) => account.tcKimlikNo === tcKimlikNo)) {
      setAdminFormNotice('Bu T.C. Kimlik No ile yönetici hesabı zaten var.')
      return
    }

    setAdminAccounts((current) => [
      ...current,
      {
        createdAt: formatDateTime(new Date()),
        email: `${username}@admin.local`,
        password,
        status: 'Aktif',
        tcKimlikNo,
        username,
      },
    ])
    setNewAdminDraft({ password: '', tcKimlikNo: '', username: '' })
    setAdminFormNotice('Yönetici hesabı başarıyla oluşturuldu.')
  }
  const createStaffAccount = () => {
    if (!newStaffDraft.firstName.trim() || !newStaffDraft.lastName.trim() || !newStaffDraft.tcKimlikNo.trim()) {
      setStaffFormNotice('Ad, soyad ve T.C. Kimlik No zorunludur.')
      return
    }

    if (staffAccounts.some((staff) => staff.tcKimlikNo === newStaffDraft.tcKimlikNo.replace(/\D/g, ''))) {
      setStaffFormNotice('Bu T.C. Kimlik No ile personel kaydı zaten var.')
      return
    }

    setStaffAccounts((current) => [
      ...current,
      {
        createdAt: formatDateTime(new Date()),
        firstName: newStaffDraft.firstName.trim(),
        hotelId: newStaffDraft.hotelId || hotels[0]?.id || '',
        id: `staff-${Date.now()}`,
        lastName: newStaffDraft.lastName.trim(),
        phone: newStaffDraft.phone.trim(),
        reason: '',
        role: newStaffDraft.role,
        status: 'Aktif',
        tcKimlikNo: newStaffDraft.tcKimlikNo.replace(/\D/g, ''),
      },
    ])
    setNewStaffDraft({
      firstName: '',
      hotelId: hotels[0]?.id ?? '',
      lastName: '',
      phone: '',
      role: 'Personel',
      tcKimlikNo: '',
    })
    setStaffFormNotice('Personel kaydedildi ve Aktif Personel tablosuna eklendi.')
  }
  const resetOwnerDraft = () => {
    setOwnerDraft({
      email: '',
      fullName: '',
      hotelId: hotels[0]?.id ?? '',
      password: '',
      phone: '',
      tcKimlikNo: '',
      username: '',
    })
  }
  const openOwnerForm = (owner?: StoredOwnerAccount) => {
    if (owner) {
      setOwnerDraft({
        email: owner.email ?? '',
        fullName: owner.fullName ?? '',
        hotelId: owner.hotelId ?? hotels[0]?.id ?? '',
        password: owner.password,
        phone: owner.phone ?? '',
        tcKimlikNo: owner.tcKimlikNo,
        username: owner.username,
      })
      setOwnerFormState({ mode: 'edit', ownerId: owner.id, open: true })
    } else {
      resetOwnerDraft()
      setOwnerFormState({ mode: 'create', ownerId: null, open: true })
    }

    setOwnerFormNotice('')
  }
  const closeOwnerForm = () => {
    setOwnerFormState({ mode: 'create', ownerId: null, open: false })
    resetOwnerDraft()
    setOwnerFormNotice('')
  }
  const saveOwnerAccount = () => {
    const username = ownerDraft.username.trim()
    const password = ownerDraft.password.trim()
    const tcKimlikNo = ownerDraft.tcKimlikNo.replace(/\D/g, '')
    const currentOwnerId = ownerFormState.ownerId

    if (!username || !password || tcKimlikNo.length !== 11) {
      setOwnerFormNotice('Kullanıcı adı, şifre ve 11 haneli T.C. Kimlik No zorunludur.')
      return
    }

    if (ownerAccounts.some((account) => account.id !== currentOwnerId && normalizeSearch(account.username) === normalizeSearch(username))) {
      setOwnerFormNotice('Bu kullanıcı adı ile otel sahibi hesabı zaten var.')
      return
    }

    if (ownerAccounts.some((account) => account.id !== currentOwnerId && account.tcKimlikNo === tcKimlikNo)) {
      setOwnerFormNotice('Bu T.C. Kimlik No ile otel sahibi hesabı zaten var.')
      return
    }

    if (ownerFormState.mode === 'edit' && currentOwnerId) {
      setOwnerAccounts((current) =>
        current.map((account) =>
          account.id === currentOwnerId
            ? {
                ...account,
                email: ownerDraft.email.trim(),
                fullName: ownerDraft.fullName.trim(),
                hotelId: ownerDraft.hotelId,
                hotelIds: account.username === DEFAULT_OWNER_USERNAME && account.hotelIds?.length
                  ? account.hotelIds
                  : ownerDraft.hotelId
                    ? [ownerDraft.hotelId]
                    : [],
                password,
                phone: ownerDraft.phone.trim(),
                tcKimlikNo,
                username,
              }
            : account,
        ),
      )
      setOwnerFormNotice('Otel sahibi hesabı güncellendi.')
      return
    }

    setOwnerAccounts((current) => [
      ...current,
      {
        createdAt: formatDateTime(new Date()),
        email: ownerDraft.email.trim(),
        fullName: ownerDraft.fullName.trim(),
        hotelId: ownerDraft.hotelId,
        hotelIds: ownerDraft.hotelId ? [ownerDraft.hotelId] : [],
        id: `owner-${Date.now()}`,
        password,
        phone: ownerDraft.phone.trim(),
        status: 'Aktif',
        tcKimlikNo,
        username,
      },
    ])
    resetOwnerDraft()
    setOwnerFormState({ mode: 'create', ownerId: null, open: false })
    setOwnerFormNotice('Otel sahibi hesabı kaydedildi.')
  }
  const updateOwnerStatus = (ownerId: string, status: StoredOwnerAccount['status'], reason = '') => {
    setOwnerAccounts((current) =>
      current.map((account) =>
        account.id === ownerId
          ? {
              ...account,
              reason: status === 'Aktif' ? '' : reason || account.reason,
              status,
            }
          : account,
      ),
    )
  }
  const deleteOwnerAccount = (ownerId: string) => {
    setOwnerAccounts((current) => current.map((account) => account.id === ownerId ? { ...account, status: 'Silindi' } : account))
  }
  const completeOwnerReasonAction = () => {
    if (!ownerReasonState?.reason.trim()) {
      return
    }

    updateOwnerStatus(
      ownerReasonState.ownerId,
      ownerReasonState.action === 'Pasif Yap' ? 'Pasif' : 'İptal',
      ownerReasonState.reason.trim(),
    )
    setOwnerReasonState(null)
  }
  const updateAdminAccountStatus = (username: string, status: StoredAdminAccount['status'], reason = '') => {
    setAdminAccounts((current) =>
      current.map((account) =>
        account.username === username
          ? {
              ...account,
              disabledUntil: status === 'Süreli Devre Dışı' ? violationDraft.disabledUntil : account.disabledUntil,
              reason: reason || account.reason,
              status,
            }
          : account,
      ),
    )
  }
  const updateStaffStatus = (tcKimlikNo: string, status: StoredStaffAccount['status'], removePermanently = false) => {
    setStaffAccounts((current) => {
      if (removePermanently) {
        return current.filter((staff) => staff.tcKimlikNo !== tcKimlikNo)
      }

      return current.map((staff) =>
        staff.tcKimlikNo === tcKimlikNo
          ? { ...staff, reason: status === 'Aktif' ? '' : 'Yönetici panelinden durum güncellendi', status }
          : staff,
      )
    })
  }
  const handleAdminTableAction = (action: string, row: string[]) => {
    if (isAdminReservationPage && action === 'Detay Görüntüle') {
      setSelectedReservationId(row[0])
      return
    }

    if (['Tüm Oteller', 'Otel Listesi', 'Onay Bekleyen Oteller', 'Askıya Alınan Oteller', 'Sistemden Kaldırılan Oteller'].includes(activeItem)) {
      startHotelAction(action, row)
      return
    }

    if (activeItem === 'Yönetici Hesapları') {
      const username = row[0]

      if (username === 'yonetici' && action !== 'Görüntüle') {
        window.alert('Ana sistem yöneticisi hesabı bu ekrandan pasife alınamaz veya silinemez.')
        return
      }

      if (action === 'Pasif Yap') {
        updateAdminAccountStatus(username, 'Pasif', 'Yönetici panelinden pasife alındı')
      } else if (action === 'Sil') {
        updateAdminAccountStatus(username, 'Silindi', 'Yönetici panelinden silindi')
      } else if (action === 'Aktif Yap') {
        updateAdminAccountStatus(username, 'Aktif', 'Yönetici panelinden aktifleştirildi')
      }
      return
    }

    if (activeItem === 'Otel Sahipleri') {
      const username = row[0]
      const owner = ownerAccounts.find((account) => account.username === username)

      if (!owner) {
        return
      }

      if (action === 'Düzenle') {
        openOwnerForm(owner)
      } else if (action === 'Pasif Yap' || action === 'İptal Et') {
        setOwnerReasonState({ action, ownerId: owner.id, reason: '' })
      } else if (action === 'Aktif Yap') {
        updateOwnerStatus(owner.id, 'Aktif')
      } else if (action === 'Sil') {
        deleteOwnerAccount(owner.id)
      }
      return
    }

    if (activeItem === 'Personel Kullanıcıları') {
      const tcKimlikNo = row[0]

      if (action === 'Pasif Yap') {
        updateStaffStatus(tcKimlikNo, 'Pasif')
      } else if (action === 'Sil') {
        updateStaffStatus(tcKimlikNo, 'Silindi')
      } else if (action === 'Aktif Yap' || action === 'Geri Döndür') {
        updateStaffStatus(tcKimlikNo, 'Aktif')
      } else if (action === 'Tamamen Sil') {
        updateStaffStatus(tcKimlikNo, 'Silindi', true)
      }
      return
    }

    if (activeItem === 'Yetki İhlalleri' && action === 'Hesabı Kapat') {
      updateAdminAccountStatus(row[0], 'Kalıcı Kapatıldı', 'Yetki ihlali sonucunda kapatıldı')
    }
  }
  const addAdminViolation = () => {
    if (!violationDraft.username.trim() || !violationDraft.note.trim()) {
      return
    }

    setViolations((current) => [
      {
        actionType: violationDraft.actionType,
        createdAt: formatDateTime(new Date()),
        id: `violation-${Date.now()}`,
        note: violationDraft.note.trim(),
        risk: violationDraft.risk,
        target: violationDraft.target.trim() || 'Yönetici hesabı',
        username: violationDraft.username.trim(),
      },
      ...current,
    ])

    if (violationDraft.mode === 'Hesabı kapat') {
      updateAdminAccountStatus(violationDraft.username.trim(), 'Kalıcı Kapatıldı', violationDraft.note.trim())
    }

    if (violationDraft.mode === 'Süreli devre dışı bırak') {
      updateAdminAccountStatus(violationDraft.username.trim(), 'Süreli Devre Dışı', violationDraft.note.trim())
    }

    setViolationDraft({
      actionType: 'Yetki dışı işlem',
      disabledUntil: '',
      mode: 'İhlal kaydı',
      note: '',
      risk: 'Orta',
      target: '',
      username: '',
    })
  }

  return (
    <section className="admin-dynamic-page">
      <article className="glass-panel wide admin-page-hero">
        <PanelHeader icon={<ShieldCheck size={18} />} title={page.title} subtitle={page.subtitle} />
        {pageQuery.trim() ? <span className="system-status-pill">{displayedRows.length} arama sonucu</span> : null}
      </article>

      <section className="metric-grid admin-live-metrics">
        {visibleCards.map((metric) => (
          <article className={`metric-card ${metric.accent}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
        {visibleCards.length === 0 ? <EmptyState text="Aramanızla eşleşen kart bulunmuyor." compact /> : null}
      </section>

	      <section className="admin-filter-row" aria-label="Admin filtreleri">
	        {filters.map((item) => (
	          <button className={activeFilter === item ? 'active' : ''} key={item} type="button" onClick={() => setFilter(item)}>
	            {item}
	          </button>
	        ))}
	      </section>

      {isAdminReservationPage ? (
        <article className="glass-panel wide admin-inline-form">
          <PanelHeader icon={<CalendarCheck size={18} />} title="Rezervasyon Filtreleri" subtitle="Açık rezervasyon sayfasındaki gerçek kayıtlar içinde arama yapar." />
          <div className="management-form admin-reservation-filter-grid">
            <label>
              <span>Otel adı</span>
              <input value={reservationFilters.hotel} onChange={(event) => setReservationFilters((current) => ({ ...current, hotel: event.target.value }))} />
            </label>
            <label>
              <span>Misafir adı</span>
              <input value={reservationFilters.guest} onChange={(event) => setReservationFilters((current) => ({ ...current, guest: event.target.value }))} />
            </label>
            <label>
              <span>Başlangıç tarihi</span>
              <input type="date" value={reservationFilters.startDate} onChange={(event) => setReservationFilters((current) => ({ ...current, startDate: event.target.value }))} />
            </label>
            <label>
              <span>Bitiş tarihi</span>
              <input type="date" value={reservationFilters.endDate} onChange={(event) => setReservationFilters((current) => ({ ...current, endDate: event.target.value }))} />
            </label>
            <label>
              <span>Ödeme durumu</span>
              <select value={reservationFilters.payment} onChange={(event) => setReservationFilters((current) => ({ ...current, payment: event.target.value }))}>
                {reservationPaymentFilters.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Sıralama</span>
              <select value={reservationFilters.sort} onChange={(event) => setReservationFilters((current) => ({ ...current, sort: event.target.value }))}>
                <option value="newest">En yeni</option>
                <option value="oldest">En eski</option>
                <option value="amount-desc">Tutar yüksekten düşüğe</option>
                <option value="amount-asc">Tutar düşükten yükseğe</option>
              </select>
            </label>
          </div>
          <div className="table-action-row">
            <button type="button" onClick={() => setReservationFilters(defaultAdminReservationFilters)}>
              Filtreleri Temizle
            </button>
          </div>
        </article>
      ) : null}

	      {activeItem === 'Yönetici Hesapları' ? (
	        <article className="glass-panel wide admin-inline-form">
	          <PanelHeader icon={<UserCog size={18} />} title="Yeni Yönetici Oluştur" subtitle="Kullanıcı adı ve T.C. Kimlik No benzersiz olmalıdır; hesaplar kalıcı saklanır." />
	          <div className="management-form two-column">
	            <label>
	              <span>Kullanıcı adı</span>
	              <input value={newAdminDraft.username} onChange={(event) => setNewAdminDraft((current) => ({ ...current, username: event.target.value }))} />
	            </label>
	            <label>
	              <span>Şifre</span>
	              <input value={newAdminDraft.password} type="password" onChange={(event) => setNewAdminDraft((current) => ({ ...current, password: event.target.value }))} />
	            </label>
	            <label>
	              <span>T.C. Kimlik No</span>
	              <input value={newAdminDraft.tcKimlikNo} maxLength={11} onChange={(event) => setNewAdminDraft((current) => ({ ...current, tcKimlikNo: event.target.value.replace(/\D/g, '') }))} />
	            </label>
	          </div>
	          {adminFormNotice ? <p className="security-inline-alert success">{adminFormNotice}</p> : null}
	          <div className="table-action-row">
	            <button type="button" onClick={createAdminAccount} disabled={!newAdminDraft.username.trim() || !newAdminDraft.password.trim() || newAdminDraft.tcKimlikNo.length !== 11}>
	              Yönetici Oluştur
	            </button>
	          </div>
	        </article>
	      ) : null}

	      {activeItem === 'Otel Sahipleri' ? (
	        <article className="glass-panel wide admin-inline-form">
	          <PanelHeader icon={<Hotel size={18} />} title="Otel Sahibi Yönetimi" subtitle="Kaydedilen otel sahibi hesapları giriş ekranında kullanıcı adı, şifre ve T.C. Kimlik No ile doğrulanır." />
	          {ownerFormNotice ? <p className={`security-inline-alert ${ownerFormNoticeClass}`}>{ownerFormNotice}</p> : null}
	          <div className="table-action-row">
	            <button type="button" onClick={() => openOwnerForm()}>
	              Otel Sahibi Ekle
	            </button>
	          </div>
	        </article>
	      ) : null}

	      {activeItem === 'Personel Kullanıcıları' ? (
	        <article className="glass-panel wide admin-inline-form">
	          <PanelHeader icon={<Users size={18} />} title="Personel Ekle" subtitle="Personel kayıtları aktif/pasif/silinen listelerinde gerçek kayıt olarak görünür." />
	          <div className="management-form two-column">
	            <label><span>Ad</span><input value={newStaffDraft.firstName} onChange={(event) => setNewStaffDraft((current) => ({ ...current, firstName: event.target.value }))} /></label>
	            <label><span>Soyad</span><input value={newStaffDraft.lastName} onChange={(event) => setNewStaffDraft((current) => ({ ...current, lastName: event.target.value }))} /></label>
	            <label><span>T.C. Kimlik No</span><input value={newStaffDraft.tcKimlikNo} maxLength={11} onChange={(event) => setNewStaffDraft((current) => ({ ...current, tcKimlikNo: event.target.value.replace(/\D/g, '') }))} /></label>
	            <label><span>Telefon</span><input value={newStaffDraft.phone} onChange={(event) => setNewStaffDraft((current) => ({ ...current, phone: event.target.value }))} /></label>
	            <label><span>Görev / Rol</span><input value={newStaffDraft.role} onChange={(event) => setNewStaffDraft((current) => ({ ...current, role: event.target.value }))} /></label>
	            <label>
	              <span>Bağlı otel</span>
	              <select value={newStaffDraft.hotelId} onChange={(event) => setNewStaffDraft((current) => ({ ...current, hotelId: event.target.value }))}>
	                {hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
	              </select>
	            </label>
	          </div>
	          {staffFormNotice ? <p className="security-inline-alert success">{staffFormNotice}</p> : null}
	          <div className="table-action-row">
	            <button type="button" onClick={createStaffAccount} disabled={!newStaffDraft.firstName.trim() || !newStaffDraft.lastName.trim() || !newStaffDraft.tcKimlikNo.trim()}>
	              Personel Ekle
	            </button>
	          </div>
	        </article>
	      ) : null}

	      {activeItem === 'Personel Kullanıcıları' ? (
	        <StaffStatusTables
	          hotels={hotels}
	          staffAccounts={staffAccounts}
	          onStatusChange={updateStaffStatus}
	        />
	      ) : null}

	      {activeItem === 'Yetki İhlalleri' ? (
	        <article className="glass-panel wide admin-inline-form">
	          <PanelHeader icon={<ShieldCheck size={18} />} title="İhlale Ekle" subtitle="Açıklama zorunludur; işlem yönetici hesabı üzerinde kalıcı saklanır." />
	          <div className="management-form two-column">
	            <label>
	              <span>Yönetici hesabı</span>
	              <select value={violationDraft.username} onChange={(event) => setViolationDraft((current) => ({ ...current, username: event.target.value }))}>
	                <option value="">Yönetici seç</option>
	                {users.filter((item) => item.role === 'Yönetici').map((item) => <option key={item.username} value={item.username}>{item.username}</option>)}
	              </select>
	            </label>
	            <label><span>İşlem tipi</span><input value={violationDraft.actionType} onChange={(event) => setViolationDraft((current) => ({ ...current, actionType: event.target.value }))} /></label>
	            <label><span>İşlem yapılan kayıt</span><input value={violationDraft.target} onChange={(event) => setViolationDraft((current) => ({ ...current, target: event.target.value }))} /></label>
	            <label><span>Risk seviyesi</span><select value={violationDraft.risk} onChange={(event) => setViolationDraft((current) => ({ ...current, risk: event.target.value }))}><option>Düşük</option><option>Orta</option><option>Yüksek</option></select></label>
	            <label><span>Sonuç</span><select value={violationDraft.mode} onChange={(event) => setViolationDraft((current) => ({ ...current, mode: event.target.value }))}><option>İhlal kaydı</option><option>Hesabı kapat</option><option>Süreli devre dışı bırak</option></select></label>
	            <label><span>Devre dışı bitiş tarihi</span><input value={violationDraft.disabledUntil} type="date" onChange={(event) => setViolationDraft((current) => ({ ...current, disabledUntil: event.target.value }))} /></label>
	            <label className="span-two"><span>Açıklama</span><textarea value={violationDraft.note} onChange={(event) => setViolationDraft((current) => ({ ...current, note: event.target.value }))} /></label>
	          </div>
	          <div className="table-action-row">
	            <button type="button" onClick={addAdminViolation} disabled={!violationDraft.username.trim() || !violationDraft.note.trim()}>
	              İhlali Kaydet
	            </button>
	          </div>
	        </article>
	      ) : null}

	      <section className="dashboard-grid enterprise-grid">
	        {selectedHotel ? (
	          <AdminHotelDetailCard
	            hotel={selectedHotel}
              hotels={hotels}
	            hotelCustomizations={hotelCustomizations}
	            hotelStatuses={adminHotelStatuses}
	            reservations={reservations}
	            supportRequests={supportRequests}
	            onAction={(action, hotel) => startHotelAction(action, [hotel.name])}
	          />
	        ) : null}
        {selectedReservation && isAdminReservationPage ? (
          <AdminReservationDetailCard
            hotelCustomizations={hotelCustomizations}
            hotels={hotels}
            reservation={selectedReservation}
            onClose={() => setSelectedReservationId(null)}
          />
        ) : null}
	        <article className="glass-panel wide">
	          <PanelHeader icon={<ClipboardList size={18} />} title={`${page.title} Tablosu`} subtitle={`${displayedRows.length} kayıt listeleniyor`} />
	          <AdminRecordTable emptyText={page.emptyText} headers={page.headers} rows={displayedRows} statusColumn={statusIndex} onAction={handleAdminTableAction} />
	        </article>

        <article className="glass-panel">
          <PanelHeader icon={<BarChart3 size={18} />} title="Gerçek Veri Grafiği" subtitle="Kayıt sayılarından hesaplandı" />
          {page.chartValues.some((value) => value > 0) ? <BarGraph values={page.chartValues} /> : <EmptyState text="Henüz grafik oluşturacak kayıt bulunmuyor." />}
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<Bell size={18} />} title="Son Kayıtlar" subtitle="Mevcut sistem olaylarından üretildi" />
          {visibleFeedItems.length > 0 ? <ActionFeed items={visibleFeedItems} /> : <EmptyState text={pageQuery.trim() ? 'Aramanızla eşleşen olay bulunmuyor.' : 'Henüz kayıt bulunmuyor.'} compact />}
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<TrendingUp size={18} />} title="Operasyon Göstergeleri" subtitle="Canlı sistem verisi" />
          {visibleProgressItems.length > 0 ? <ProgressStack items={visibleProgressItems} /> : <EmptyState text={pageQuery.trim() ? 'Aramanızla eşleşen gösterge bulunmuyor.' : 'Henüz kayıt bulunmuyor.'} compact />}
        </article>
	      </section>
	      {ownerFormState.open ? (
	        <div className="admin-action-modal" role="dialog" aria-modal="true">
	          <article className="glass-panel">
	            <PanelHeader
	              icon={<Hotel size={18} />}
	              title={ownerFormState.mode === 'edit' ? 'Otel Sahibi Düzenle' : 'Otel Sahibi Ekle'}
	              subtitle="Kullanıcı adı, şifre ve T.C. Kimlik No zorunludur."
	            />
	            <div className="management-form two-column">
	              <label><span>Kullanıcı Adı</span><input value={ownerDraft.username} onChange={(event) => setOwnerDraft((current) => ({ ...current, username: event.target.value }))} /></label>
	              <label><span>Şifre</span><input value={ownerDraft.password} type="password" onChange={(event) => setOwnerDraft((current) => ({ ...current, password: event.target.value }))} /></label>
	              <label><span>T.C. Kimlik No</span><input value={ownerDraft.tcKimlikNo} maxLength={11} onChange={(event) => setOwnerDraft((current) => ({ ...current, tcKimlikNo: event.target.value.replace(/\D/g, '') }))} /></label>
	              <label><span>Ad Soyad</span><input value={ownerDraft.fullName} onChange={(event) => setOwnerDraft((current) => ({ ...current, fullName: event.target.value }))} /></label>
	              <label><span>Telefon</span><input value={ownerDraft.phone} onChange={(event) => setOwnerDraft((current) => ({ ...current, phone: event.target.value }))} /></label>
	              <label><span>E-posta</span><input value={ownerDraft.email} type="email" onChange={(event) => setOwnerDraft((current) => ({ ...current, email: event.target.value }))} /></label>
	              <label className="span-two">
	                <span>Bağlı Otel</span>
	                <select value={ownerDraft.hotelId} onChange={(event) => setOwnerDraft((current) => ({ ...current, hotelId: event.target.value }))}>
	                  <option value="">Bağlı otel yok</option>
	                  {hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
	                </select>
	              </label>
	            </div>
	            {ownerFormNotice ? <p className={`security-inline-alert ${ownerFormNoticeClass}`}>{ownerFormNotice}</p> : null}
	            <div className="table-action-row">
	              <button type="button" onClick={saveOwnerAccount} disabled={!ownerDraft.username.trim() || !ownerDraft.password.trim() || ownerDraft.tcKimlikNo.replace(/\D/g, '').length !== 11}>
	                {ownerFormState.mode === 'edit' ? 'Değişiklikleri Kaydet' : 'Otel Sahibi Kaydet'}
	              </button>
	              <button type="button" onClick={closeOwnerForm}>
	                İptal Et
	              </button>
	            </div>
	          </article>
	        </div>
	      ) : null}
	      {ownerReasonState ? (
	        <div className="admin-action-modal" role="dialog" aria-modal="true">
	          <article className="glass-panel">
	            <PanelHeader icon={<ShieldCheck size={18} />} title={ownerReasonState.action} subtitle="Pasif veya iptal işlemi için açıklama zorunludur." />
	            <label className="admin-reason-field">
	              <span>{ownerReasonState.action === 'Pasif Yap' ? 'Pasif nedeni' : 'İptal nedeni'}</span>
	              <textarea value={ownerReasonState.reason} onChange={(event) => setOwnerReasonState((current) => current ? { ...current, reason: event.target.value } : current)} placeholder="Açıklamayı yazın..." />
	            </label>
	            <div className="table-action-row">
	              <button type="button" onClick={completeOwnerReasonAction} disabled={!ownerReasonState.reason.trim()}>
	                İşlemi Onayla
	              </button>
	              <button type="button" onClick={() => setOwnerReasonState(null)}>
	                İptal Et
	              </button>
	            </div>
	          </article>
	        </div>
	      ) : null}
	      {pendingHotelAction ? (
	        <div className="admin-action-modal" role="dialog" aria-modal="true">
	          <article className="glass-panel">
	            <PanelHeader icon={<ShieldCheck size={18} />} title={pendingHotelAction.action} subtitle="Bu işlem için açıklama/neden zorunludur." />
	            <label className="admin-reason-field">
	              <span>İşlem nedeni</span>
	              <textarea value={hotelActionReason} onChange={(event) => setHotelActionReason(event.target.value)} placeholder="Örn. politika ihlali, eksik belge, kullanıcı şikayeti..." />
	            </label>
	            <div className="table-action-row">
	              <button type="button" onClick={completeHotelAction} disabled={!hotelActionReason.trim()}>
	                İşlemi Onayla
	              </button>
	              <button type="button" onClick={cancelHotelAction}>
	                İptal Et
	              </button>
	            </div>
	          </article>
	        </div>
	      ) : null}
	    </section>
  )
}

function StaffStatusTables({
  hotels,
  onStatusChange,
  staffAccounts,
}: {
  hotels: HotelRecord[]
  onStatusChange: (tcKimlikNo: string, status: StoredStaffAccount['status'], removePermanently?: boolean) => void
  staffAccounts: StoredStaffAccount[]
}) {
  const renderStaffTable = (
    title: string,
    status: StoredStaffAccount['status'],
    actions: Array<{ label: string; remove?: boolean; status: StoredStaffAccount['status'] }>,
  ) => {
    const rows = staffAccounts.filter((staff) => staff.status === status)

    return (
      <article className="glass-panel wide staff-status-table">
        <PanelHeader icon={<Users size={18} />} title={title} subtitle={`${rows.length} gerçek personel kaydı`} />
        {rows.length > 0 ? (
          <div className="premium-table admin-record-table">
            <table>
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>T.C. Kimlik No</th>
                  <th>Telefon</th>
                  <th>Görev</th>
                  <th>Bağlı Otel</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((staff) => (
                  <tr key={`${title}-${staff.id}`}>
                    <td><strong>{staff.firstName} {staff.lastName}</strong></td>
                    <td>{staff.tcKimlikNo}</td>
                    <td>{staff.phone || '-'}</td>
                    <td>{staff.role}</td>
                    <td>{hotels.find((hotel) => hotel.id === staff.hotelId)?.name ?? 'Otel kaydı yok'}</td>
                    <td><span className="live-badge">{staff.status}</span></td>
                    <td>
                      <div className="table-action-row">
                        {actions.map((action) => (
                          <button key={`${staff.id}-${action.label}`} type="button" onClick={() => onStatusChange(staff.tcKimlikNo, action.status, action.remove)}>
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="Henüz kayıt bulunmuyor." compact />
        )}
      </article>
    )
  }

  return (
    <section className="staff-status-grid">
      {renderStaffTable('Aktif Personel', 'Aktif', [{ label: 'Pasife Düşür', status: 'Pasif' }, { label: 'Sil', status: 'Silindi' }])}
      {renderStaffTable('Pasif Personel', 'Pasif', [{ label: 'Aktif Yap', status: 'Aktif' }, { label: 'Sil', status: 'Silindi' }])}
      {renderStaffTable('Silinen Personel', 'Silindi', [{ label: 'Geri Döndür', status: 'Aktif' }, { label: 'Tamamen Sil', remove: true, status: 'Silindi' }])}
    </section>
  )
}

function AdminHotelDetailCard({
  hotel,
  hotelCustomizations,
  hotels,
  hotelStatuses,
  onAction,
  reservations,
  supportRequests,
}: {
  hotel: HotelRecord
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  hotelStatuses: AdminHotelStatus[]
  onAction: (action: string, hotel: HotelRecord) => void
  reservations: GuestReservation[]
  supportRequests: SupportTicket[]
}) {
  const hotelIndex = Math.max(hotels.indexOf(hotel), 0)
  const rooms = getHotelRooms(hotel, hotelIndex, hotelCustomizations)
  const contact = getHotelContact(hotel, hotelCustomizations)
  const hotelReservations = reservations.filter((reservation) => reservationMatchesHotel(reservation, hotel))
  const activeReservationCount = hotelReservations.filter(isActiveReservationRecord).length
  const revenue = hotelReservations
    .filter((reservation) => isRevenueEligibleReservation(reservation, rooms))
    .reduce((total, reservation) => total + getReservationTotal(reservation, rooms), 0)
  const statusRecord = getAdminHotelStatusRecord(hotel, hotelStatuses)
  const status = getAdminHotelStatus(hotel, hotelStatuses)
  const supportHistory = supportRequests.filter((request) => normalizeSearch(request.subject + request.category).includes(normalizeSearch(hotel.name)))

  return (
    <article className="glass-panel wide admin-hotel-detail-card">
      <PanelHeader icon={<Hotel size={18} />} title={`${hotel.name} yönetici detay ekranı`} subtitle="Admin görüntüler; fiyat, oda ve kampanya düzenleyemez." />
      <div className="admin-detail-grid">
        <div>
          <span>Otel sahibi</span>
          <strong>Tesis Yöneticisi</strong>
        </div>
        <div>
          <span>Adres</span>
          <strong>{contact.address}</strong>
        </div>
        <div>
          <span>Telefon</span>
          <strong>{contact.phone}</strong>
        </div>
        <div>
          <span>E-posta</span>
          <strong>{contact.email}</strong>
        </div>
        <div>
          <span>Oda sayısı</span>
          <strong>{rooms.length}</strong>
        </div>
        <div>
          <span>Ortalama puan</span>
          <strong>{hotel.starRating.toFixed(1)}</strong>
        </div>
        <div>
          <span>Aktif rezervasyon</span>
          <strong>{activeReservationCount}</strong>
        </div>
        <div>
          <span>Gelir özeti</span>
          <strong>{formatCurrency(revenue)}</strong>
        </div>
        <div>
          <span>Durum geçmişi</span>
          <strong>{statusRecord ? `${statusRecord.updatedAt} • ${statusRecord.updatedBy}` : 'Henüz işlem yok'}</strong>
        </div>
        <div>
          <span>Askıya/kaldırma nedeni</span>
          <strong>{statusRecord?.reason ?? 'Kayıt yok'}</strong>
        </div>
        <div>
          <span>Destek geçmişi</span>
          <strong>{supportHistory.length} kayıt</strong>
        </div>
        <div>
          <span>Durum</span>
          <strong>{status}</strong>
        </div>
      </div>
      <div className="table-action-row">
        <button type="button" onClick={() => onAction('Oteli Görüntüle', hotel)}>İncele</button>
        <button type="button" onClick={() => onAction('Askıya Al', hotel)}>Askıya Al</button>
        <button type="button" onClick={() => onAction('Sistemden Kaldır', hotel)}>Sistemden Kaldır</button>
      </div>
    </article>
  )
}

function AdminReservationDetailCard({
  hotelCustomizations,
  hotels,
  onClose,
  reservation,
}: {
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  onClose: () => void
  reservation: GuestReservation
}) {
  const rooms = getRoomsForReservation(reservation, hotels, hotelCustomizations)
  const total = getReservationTotal(reservation, rooms)
  const hotel = hotels.find((item) => reservationMatchesHotel(reservation, item))
  const room = rooms.find((item) => reservationMatchesRoom(reservation, item))
  const details = [
    ['Rezervasyon kodu', reservation.code],
    ['Misafir', getReservationGuestName(reservation)],
    ['Otel', reservation.hotelName],
    ['Otel ID', reservation.hotelId ?? hotel?.id ?? 'Kayıt yok'],
    ['Otel sahibi ID', reservation.ownerId ?? (hotel ? getOwnerIdForHotel(hotel.id, hotels) : undefined) ?? 'Kayıt yok'],
    ['Oda', reservation.roomName],
    ['Oda tipi', reservation.roomType ?? room?.type ?? 'Kayıt yok'],
    ['Oda ID', reservation.roomId ?? room?.id ?? 'Kayıt yok'],
    ['Giriş tarihi', reservation.checkInDate ?? reservation.checkIn],
    ['Çıkış tarihi', reservation.checkOutDate ?? reservation.checkOut],
    ['Gece sayısı', String(reservation.nightCount ?? calculateNights(reservation.checkIn, reservation.checkOut))],
    ['Kişi sayısı', String(reservation.guestCount ?? 1)],
    ['Oda sayısı', String(reservation.roomCount ?? 1)],
    ['Temel fiyat', formatCurrency(normalizeRevenueAmount(parseStoredMoney(reservation.basePrice ?? room?.price ?? 0)))],
    ['Toplam tutar', formatCurrency(total)],
    ['Ödeme durumu', reservation.paymentStatus || 'Kayıt yok'],
    ['Rezervasyon durumu', getReservationStatus(reservation)],
    ['Oluşturulma tarihi', reservation.createdAt ?? 'Kayıt yok'],
    ['İptal eden', reservation.cancelledBy ?? 'Kayıt yok'],
    ['İptal nedeni', reservation.cancellationReason ?? 'Kayıt yok'],
  ]

  return (
    <article className="glass-panel wide admin-reservation-detail-card">
      <PanelHeader icon={<ReceiptText size={18} />} title={`${reservation.code} detay ekranı`} subtitle="Bu ekran yalnızca rezervasyon kaydında bulunan gerçek alanları gösterir." />
      <div className="admin-detail-grid">
        {details.map(([label, value]) => (
          <div key={`${reservation.id}-${label}`}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {reservation.notes ? (
        <p className="security-inline-alert success">{reservation.notes}</p>
      ) : null}
      <div className="table-action-row">
        <button type="button" onClick={onClose}>Listeye Dön</button>
      </div>
    </article>
  )
}

function AdminRecordTable({
  emptyText,
  headers,
  onAction,
  rows,
  statusColumn,
}: {
  emptyText: string
  headers: string[]
  onAction?: (action: string, row: string[]) => void
  rows: string[][]
  statusColumn: number
}) {
  if (rows.length === 0) {
    return <EmptyState text={emptyText} />
  }

  return (
    <div className="premium-table admin-record-table">
      <table>
        <thead>
          <tr>
            {headers.map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => {
                const header = headers[index]

                if (header === 'İşlemler') {
                  return (
                    <td key={`${cell}-${index}`}>
                      <div className="table-action-row">
	                        {cell.split('|').map((action) => <button key={action} type="button" onClick={() => onAction?.(action, row)}>{action}</button>)}
                      </div>
                    </td>
                  )
                }

                if (index === statusColumn || ['Risk Seviyesi', 'Öncelik', 'Sonuç', 'Durum Etiketi'].includes(header)) {
                  return <td key={`${cell}-${index}`}><span className="live-badge">{cell}</span></td>
                }

                return (
                  <td key={`${cell}-${index}`}>
                    {index === 0 ? <strong>{cell}</strong> : cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ compact = false, text }: { compact?: boolean; text: string }) {
  return <p className={`empty-state ${compact ? 'compact' : ''}`}>{text}</p>
}

function buildAdminUsers(
  storedGuests: StoredGuestAccount[],
  authSession: AuthSession | null,
  storedAdminAccounts: StoredAdminAccount[] = [],
  storedStaffAccounts: StoredStaffAccount[] = [],
  storedOwnerAccounts: StoredOwnerAccount[] = [],
  hotels: HotelRecord[] = [],
): AdminUserRow[] {
  const guestUsers = storedGuests.map((guest) => ({
    email: guest.email,
    lastLogin: authSession?.user.email === guest.email ? 'Aktif oturum' : 'Kayıt yok',
    name: guest.username,
    phone: guest.phone,
    role: 'Misafir',
    status: 'Aktif',
    username: guest.username,
  }))
  const extraAdmins = storedAdminAccounts.map((account) => ({
    email: account.email ?? `${account.username}@admin.local`,
    lastLogin: authSession?.user.username === account.username ? 'Aktif oturum' : 'Kayıt yok',
    name: account.username,
    phone: '-',
    role: 'Yönetici',
    status: account.status,
    tcKimlikNo: account.tcKimlikNo,
    username: account.username,
  }))
  const staffUsers = storedStaffAccounts.map((staff) => ({
    email: '-',
    hotelName: hotels.find((hotel) => hotel.id === staff.hotelId)?.name ?? 'Otel kaydı yok',
    lastLogin: 'Kayıt yok',
    name: `${staff.firstName} ${staff.lastName}`,
    phone: staff.phone,
    role: staff.role || 'Personel',
    status: staff.status,
    tcKimlikNo: staff.tcKimlikNo,
    username: staff.tcKimlikNo,
  }))
  const ownerUsers = storedOwnerAccounts.map((owner) => ({
    email: owner.email || '-',
    hotelName: (owner.hotelIds?.length ? owner.hotelIds : owner.hotelId ? [owner.hotelId] : [])
      .map((hotelId) => hotels.find((hotel) => hotel.id === hotelId)?.name)
      .filter(Boolean)
      .join(', ') || 'Bağlı otel yok',
    lastLogin: owner.lastLoginAt || (authSession?.user.username === owner.username ? 'Aktif oturum' : 'Kayıt yok'),
    name: owner.fullName || owner.username,
    phone: owner.phone || '-',
    role: 'Otel Sahibi',
    reason: owner.reason,
    status: owner.status,
    tcKimlikNo: owner.tcKimlikNo,
    username: owner.username,
  }))

  return [...extraAdmins, ...ownerUsers, ...staffUsers, ...guestUsers]
}

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
}

function percentageOf(value: number, total: number) {
  if (total <= 0) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round((value / total) * 100)))
}

function buildChartValues(values: number[]) {
  if (values.length === 0) {
    return [0, 0, 0, 0]
  }

  const maxValue = Math.max(...values, 1)

  return values.map((value) => (value > 0 ? Math.max(8, Math.round((value / maxValue) * 100)) : 0))
}

function databaseHealthDetail(databaseHealth: DatabaseHealth | null) {
  if (!databaseHealth) {
    return 'Veri tabanı bağlantısı henüz ölçülmedi'
  }

  return databaseHealth.status === 'Healthy'
    ? `${databaseHealth.database} bağlantısı sağlıklı`
    : `${databaseHealth.database} bağlantısı kontrol istiyor`
}

function getRecentAdminFeed(
  notifications: GuestNotification[],
  reservations: GuestReservation[],
  supportRequests: SupportTicket[],
) {
  return [
    ...notifications.map((notification) => `${notification.time} • ${notification.category} • ${notification.title}`),
    ...reservations.map((reservation) => `${reservation.code} • ${reservation.hotelName} • ${reservation.status}`),
    ...supportRequests.map((request) => `${request.id} • ${request.subject} • ${request.status}`),
  ].slice(0, 6)
}

function getAdminSystemRows(
  activeItem: string,
  hotels: HotelRecord[],
  users: AdminUserRow[],
  reservations: GuestReservation[],
  notifications: GuestNotification[],
  databaseHealth: DatabaseHealth | null,
): AdminTableModel {
  if (activeItem === 'Son İşlemler') {
    const reservationRows = reservations.slice(0, 6).map((reservation) => [
      'Rezervasyon',
      `${reservation.hotelName} / ${reservation.roomType ?? reservation.roomName}`,
      reservation.checkIn,
      reservation.status,
    ])
    const notificationRows = notifications.slice(0, 6).map((notification) => [
      'Bildirim',
      `${notification.category} / ${notification.title}`,
      notification.time,
      notification.unread ? 'Okunmadı' : 'Okundu',
    ])

    return {
      headers: ['İşlem', 'Kaynak', 'Tarih/Saat', 'Durum'],
      rows: [...reservationRows, ...notificationRows],
      statusColumn: 3,
    }
  }

  if (activeItem === 'Platform Bildirimleri') {
    return {
      headers: ['Başlık', 'Kategori', 'Tarih/Saat', 'Durum'],
      rows: notifications.map((notification) => [
        notification.title,
        notification.category,
        notification.time,
        notification.unread ? 'Okunmadı' : 'Okundu',
      ]),
      statusColumn: 3,
    }
  }

  const activeHotels = hotels.filter((hotel) => hotel.isActive)

  return {
    headers: ['Kayıt', 'Değer', 'Detay', 'Durum'],
    rows: [
      ['Toplam otel sayısı', String(hotels.length), 'Sistemde kayıtlı tesisler', hotels.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Aktif otel sayısı', String(activeHotels.length), 'Yayında olan tesisler', activeHotels.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Toplam kullanıcı sayısı', String(users.length), 'Yönetici, otel sahibi ve misafir hesapları', users.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Toplam rezervasyon sayısı', String(reservations.length), 'Kalıcı rezervasyon kayıtları', reservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Sistem sağlık durumu', databaseHealth?.status ?? 'Ölçülmedi', databaseHealthDetail(databaseHealth), databaseHealth?.status === 'Healthy' ? 'Sağlıklı' : 'Kontrol'],
    ],
    statusColumn: 3,
  }
}

function getAdminHotelRows(
  activeItem: string,
  hotels: HotelRecord[],
  hotelCustomizations: Record<string, HotelCustomization>,
  hotelStatuses: AdminHotelStatus[],
  reservations: GuestReservation[],
): AdminTableModel {
  const filteredHotels = hotels.filter((hotel) => {
    const status = getAdminHotelStatus(hotel, hotelStatuses)

    if (activeItem === 'Askıya Alınan Oteller') {
      return status === 'Askıda'
    }

    if (activeItem === 'Sistemden Kaldırılan Oteller') {
      return status === 'Kaldırıldı'
    }

    if (activeItem === 'Onay Bekleyen Oteller') {
      return status === 'Onay Bekliyor'
    }

    return status !== 'Kaldırıldı'
  })

  return {
    headers: ['Otel Adı', 'Otel Sahibi', 'Konum', 'Oda Sayısı', 'Ortalama Puan', 'Aktif Rezervasyon', 'Durum Etiketi', 'İşlemler'],
	    rows: filteredHotels.map((hotel, index) => {
	      const statusRecord = getAdminHotelStatusRecord(hotel, hotelStatuses)
	      const status = getAdminHotelStatus(hotel, hotelStatuses)
	      const activeReservationCount = reservations.filter((reservation) =>
        isActiveReservationRecord(reservation) && reservationMatchesHotel(reservation, hotel),
      ).length

      return [
        hotel.name,
        'Tesis Yöneticisi',
        `${hotel.city} / ${hotel.district}`,
        String(getHotelRooms(hotel, index, hotelCustomizations).length),
        hotel.starRating.toFixed(1),
	        String(activeReservationCount),
	        statusRecord?.reason ? `${status} • ${statusRecord.reason}` : status,
	        status === 'Askıda'
	          ? 'Oteli Görüntüle|Geri Aktifleştir|Sistemden Kaldır'
	          : status === 'Kaldırıldı'
	            ? 'Oteli Görüntüle|Geri Getir|Kalıcı Sil'
	            : status === 'Onay Bekliyor'
	              ? 'Oteli Görüntüle|Onayla|Reddet'
	              : 'Oteli Görüntüle|Askıya Al|Sistemden Kaldır',
	      ]
	    }),
    statusColumn: 6,
  }
}

function getAdminUserRows(activeItem: string, users: AdminUserRow[]): AdminTableModel {
  if (activeItem === 'Yetki Rolleri') {
    const roles = ['Yönetici', 'Otel Sahibi', 'Resepsiyon', 'Personel', 'Misafir']

    return {
      headers: ['Rol', 'Kullanıcı Sayısı', 'Yetki Kapsamı', 'Durum', 'İşlemler'],
      rows: roles.map((role) => {
        const roleCount = users.filter((user) => user.role === role).length

        return [
          role,
          String(roleCount),
          getRoleScope(role),
          roleCount > 0 ? 'Aktif' : 'Kayıt Yok',
          'Görüntüle',
        ]
      }),
      statusColumn: 3,
    }
  }

	  const roleMap: Record<string, string | null> = {
	    'Yönetici Hesapları': 'Yönetici',
	    'Otel Sahipleri': 'Otel Sahibi',
	  }
  const roleFilter = roleMap[activeItem] ?? null
  const filteredUsers = activeItem === 'Personel Kullanıcıları'
    ? users.filter((user) => ['Personel', 'Resepsiyon'].includes(user.role))
    : roleFilter
      ? users.filter((user) => user.role === roleFilter)
      : users
  const getUserActions = (user: AdminUserRow) => {
    if (activeItem === 'Yönetici Hesapları') {
      return user.status === 'Aktif' ? 'Pasif Yap|Sil' : 'Aktif Yap|Sil'
    }

    if (activeItem === 'Personel Kullanıcıları') {
      if (user.status === 'Silindi') {
        return 'Geri Döndür|Tamamen Sil'
      }

      return user.status === 'Aktif' ? 'Pasif Yap|Sil' : 'Aktif Yap|Sil'
    }

    if (activeItem === 'Otel Sahipleri') {
      if (user.status === 'Aktif') {
        return 'Düzenle|Pasif Yap|İptal Et|Sil'
      }

      return 'Düzenle|Aktif Yap|Sil'
    }

    return 'Görüntüle'
  }

  return {
    headers: ['Kullanıcı Adı', 'Ad Soyad', 'E-posta', 'T.C. Kimlik No', 'Telefon', 'Bağlı Otel', 'Rol', 'Son Giriş', 'Durum', 'İşlemler'],
    rows: filteredUsers.map((user) => [
      user.username,
      user.name,
      user.email,
      user.tcKimlikNo ?? '-',
      user.phone || '-',
      user.hotelName ?? '-',
      user.role,
      user.lastLogin,
      user.reason ? `${user.status} • ${user.reason}` : user.status,
      getUserActions(user),
    ]),
    statusColumn: 8,
  }
}

function getRoleScope(role: string) {
  const scopes: Record<string, string> = {
    Misafir: 'Rezervasyon, favori, mesaj ve profil işlemleri',
    'Otel Sahibi': 'Oda, fiyat, kampanya ve tesis operasyonları',
    Personel: 'Görev, vardiya ve iç bildirim akışları',
    Resepsiyon: 'Check-in, check-out ve misafir kartları',
    Yönetici: 'Platform onayı, güvenlik, destek ve rapor izleme',
  }

  return scopes[role] ?? 'Tanımlı yetki bulunmuyor'
}

function getAdminSecurityRows(
  activeItem: string,
  notifications: GuestNotification[],
  hotelConversations: GuestConversation[],
  users: AdminUserRow[],
  violations: AdminViolation[],
): AdminTableModel {
  if (activeItem === 'Yetki İhlalleri') {
    const violationRows = violations.map((violation) => [
      violation.username,
      violation.actionType,
      violation.createdAt,
      violation.target,
      violation.note,
      violation.risk,
      'İhlal Kaydı',
      'Hesabı Kapat',
    ])
    const adminRows = users
      .filter((user) => user.role === 'Yönetici')
      .map((user) => [
        user.username,
        'Yönetici hesap izleme',
        user.lastLogin,
        'Kayıt yok',
        user.status,
        user.status === 'Aktif' ? 'Düşük' : 'Yüksek',
        user.status,
        user.status === 'Aktif' ? 'Hesabı Kapat' : 'Görüntüle',
      ])

    return {
      headers: ['Kullanıcı', 'İşlem Tipi', 'Tarih/Saat', 'Kayıt', 'Açıklama', 'Risk Seviyesi', 'Sonuç', 'İşlemler'],
      rows: [...violationRows, ...adminRows],
      statusColumn: 5,
    }
  }

  const notificationRows = notifications.map((notification) => [
    'Sistem',
    notification.title,
    notification.time,
    'Kayıt yok',
    'Tarayıcı oturumu',
    getSecurityRisk(notification.title),
    notification.unread ? 'Başarılı' : 'İzlendi',
  ])
  const conversationRows = hotelConversations
    .filter((conversation) => !isGuestScopedConversation(conversation))
    .map((conversation) => [
      conversation.hotelName,
      `Otel mesajı / ${conversation.category}`,
      conversation.updatedAt ?? conversation.messages.at(-1)?.time ?? 'Kayıt yok',
      'Kayıt yok',
      'Mesaj merkezi',
      conversation.messages.some((message) => message.status !== 'Okundu') ? 'Orta' : 'Düşük',
      conversation.status,
    ])
  const activeDeviceRows = users
    .filter((user) => user.lastLogin === 'Aktif oturum')
    .map((user) => [
      user.username,
      'Aktif cihaz',
      user.lastLogin,
      'Kayıt yok',
      'Mevcut tarayıcı',
      'Düşük',
      'Başarılı',
    ])
  const allRows = [...notificationRows, ...conversationRows, ...activeDeviceRows]
  const filteredRows = allRows.filter((row) => {
    const operation = row[1].toLocaleLowerCase('tr-TR')

    if (activeItem === 'Giriş Denemeleri') {
      return operation.includes('giriş') || operation.includes('oturum')
    }

    if (activeItem === 'Şifre Değişiklikleri') {
      return operation.includes('şifre')
    }

    if (activeItem === 'Aktif Cihazlar') {
      return operation.includes('cihaz')
    }

    if (activeItem === 'Yetki İhlalleri') {
      return operation.includes('yetki') || operation.includes('erişim') || row[5] === 'Yüksek'
    }

    return true
  })

  return {
    headers: ['Kullanıcı', 'İşlem Tipi', 'Tarih/Saat', 'IP', 'Cihaz Bilgisi', 'Risk Seviyesi', 'Sonuç'],
    rows: filteredRows,
    statusColumn: 5,
  }
}

function getSecurityRisk(value: string) {
  const normalizedValue = normalizeSearch(value)

  if (normalizedValue.includes('şüpheli') || normalizedValue.includes('hata') || normalizedValue.includes('ihlal')) {
    return 'Yüksek'
  }

  if (normalizedValue.includes('şifre') || normalizedValue.includes('cihaz') || normalizedValue.includes('destek')) {
    return 'Orta'
  }

  return 'Düşük'
}

function getAdminFinanceRows(
  activeItem: string,
  hotels: HotelRecord[],
  reservations: GuestReservation[],
  hotelCustomizations: Record<string, HotelCustomization>,
): AdminTableModel {
  if (activeItem === 'Otel Bazlı Gelir') {
    return {
      headers: ['Otel', 'Rezervasyon', 'Toplam Gelir', 'Aktif Rezervasyon', 'Durum'],
      rows: hotels.map((hotel) => {
        const hotelIndex = Math.max(hotels.findIndex((item) => item.id === hotel.id), 0)
        const rooms = getHotelRooms(hotel, hotelIndex, hotelCustomizations)
        const hotelReservations = reservations.filter((reservation) => reservationMatchesHotel(reservation, hotel))
        const activeCount = hotelReservations.filter(isActiveReservationRecord).length
        const revenue = hotelReservations
          .filter((reservation) => isRevenueEligibleReservation(reservation, rooms))
          .reduce((total, reservation) => total + getReservationTotal(reservation, rooms), 0)

        return [
          hotel.name,
          String(hotelReservations.length),
          formatCurrency(revenue),
          String(activeCount),
          revenue > 0 ? 'Gelir Var' : 'Kayıt Yok',
        ]
      }).filter((row) => row[1] !== '0' || activeItem === 'Otel Bazlı Gelir'),
      statusColumn: 4,
    }
  }

  if (activeItem === 'Aylık Raporlar') {
    const monthMap = reservations
      .filter((reservation) => isRevenueEligibleReservation(reservation, getRoomsForReservation(reservation, hotels, hotelCustomizations)))
      .reduce<Record<string, { count: number; total: number }>>((acc, reservation) => {
      const key = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(reservation.checkIn))
      const current = acc[key] ?? { count: 0, total: 0 }
      acc[key] = { count: current.count + 1, total: current.total + getReservationTotal(reservation, getRoomsForReservation(reservation, hotels, hotelCustomizations)) }

      return acc
    }, {})

    return {
      headers: ['Dönem', 'Rezervasyon', 'Toplam Gelir', 'Rapor Tipi', 'Durum'],
      rows: Object.entries(monthMap).map(([month, value]) => [
        month,
        String(value.count),
        formatCurrency(value.total),
        'Aylık gelir raporu',
        value.total > 0 ? 'Hazır' : 'Kayıt Yok',
      ]),
      statusColumn: 4,
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const isRefund = reservation.status === 'İptal Edildi' || normalizeSearch(reservation.paymentStatus).includes('iade')
    const isPending = normalizeSearch(reservation.paymentStatus).includes('tesiste') || normalizeSearch(reservation.paymentStatus).includes('bekleyen')

    if (activeItem === 'İadeler') {
      return isRefund
    }

    if (activeItem === 'Ödemeler') {
      return !isRefund
    }

    return activeItem === 'Gelir Özeti' || isPending
  })

  return {
    headers: ['Rezervasyon Kodu', 'Otel', 'Oda', 'Tutar', 'Ödeme Durumu', 'Rezervasyon Durumu'],
    rows: filteredReservations.map((reservation) => [
      reservation.code,
      reservation.hotelName,
      reservation.roomType ?? reservation.roomName,
      formatCurrency(getReservationTotal(reservation, getRoomsForReservation(reservation, hotels, hotelCustomizations))),
      reservation.paymentStatus,
      reservation.status,
    ]),
    statusColumn: 4,
  }
}

function isCancelledReservationRecord(reservation: GuestReservation) {
  const status = normalizeSearch(getReservationStatus(reservation))
  const paymentStatus = normalizeSearch(reservation.paymentStatus ?? '')

  return status.includes('iptal') || status.includes('cancelled') || status.includes('iade') || paymentStatus.includes('iade') || paymentStatus.includes('refunded')
}

function isPastReservationRecord(reservation: GuestReservation) {
  if (isCancelledReservationRecord(reservation)) {
    return false
  }

  const status = normalizeSearch(getReservationStatus(reservation))

  if (status.includes('gecmis') || status.includes('geçmiş') || status.includes('past') || status.includes('completed') || status.includes('tamamlandi') || status.includes('tamamlandı')) {
    return true
  }

  const checkOut = reservation.checkOutDate ?? reservation.checkOut

  return Boolean(checkOut) && compareDateInputValues(checkOut, getTodayDateInputValue()) < 0
}

function isActiveReservationRecord(reservation: GuestReservation) {
  if (isCancelledReservationRecord(reservation) || isPastReservationRecord(reservation)) {
    return false
  }

  const status = normalizeSearch(getReservationStatus(reservation))

  return status.includes('aktif') || status.includes('active')
}

function getReservationGuestName(reservation: GuestReservation) {
  if (reservation.guestName?.trim()) {
    return reservation.guestName
  }

  if (reservation.guestId?.trim()) {
    return reservation.guestId
  }

  return 'Misafir kaydı yok'
}

function getAdminReservationRows(
  activeItem: string,
  hotels: HotelRecord[],
  reservations: GuestReservation[],
  hotelCustomizations: Record<string, HotelCustomization>,
): AdminTableModel {
  const filteredReservations = reservations.filter((reservation) => {
    if (activeItem === 'Geçmiş Rezervasyonlar') {
      return isPastReservationRecord(reservation)
    }

    if (activeItem === 'İptal Edilen Rezervasyonlar') {
      return isCancelledReservationRecord(reservation)
    }

    return isActiveReservationRecord(reservation)
  })

  return {
    headers: ['Rezervasyon Kodu', 'Misafir', 'Otel', 'Oda', 'Giriş Tarihi', 'Çıkış Tarihi', 'Toplam Tutar', 'Ödeme Durumu', 'Rezervasyon Durumu', 'Oluşturulma Tarihi', 'İşlemler'],
    rows: filteredReservations.map((reservation) => {
      const rooms = getRoomsForReservation(reservation, hotels, hotelCustomizations)
      const total = getReservationTotal(reservation, rooms)

      return [
        reservation.code,
        getReservationGuestName(reservation),
        reservation.hotelName,
        reservation.roomType ?? reservation.roomName,
        reservation.checkInDate ?? reservation.checkIn,
        reservation.checkOutDate ?? reservation.checkOut,
        formatCurrency(total),
        reservation.paymentStatus || 'Kayıt Yok',
        getReservationStatus(reservation),
        reservation.createdAt ?? '-',
        'Detay Görüntüle',
      ]
    }),
    statusColumn: 8,
  }
}

function getAdminAiRows(
  activeItem: string,
  hotels: HotelRecord[],
  reservations: GuestReservation[],
  supportRequests: SupportTicket[],
  favoriteHotelIds: string[],
): AdminTableModel {
  const rows = hotels.map((hotel) => {
    const hotelReservations = reservations.filter((reservation) => reservationMatchesHotel(reservation, hotel))
    const activeReservations = hotelReservations.filter(isActiveReservationRecord)
    const favoriteSignal = favoriteHotelIds.includes(hotel.id) ? 1 : 0
    const openSupport = supportRequests.filter((request) => request.status !== 'Kapatıldı').length

    if (activeItem === 'Risk Analizi') {
      return [
        hotel.name,
        'Destek ve operasyon riski',
        `${openSupport} açık destek talebi`,
        openSupport > 0 ? 'Dikkat' : 'Düşük Risk',
        openSupport > 0 ? 'Destek kuyruğunu önceliklendir' : 'Mevcut akışı izle',
      ]
    }

    if (activeItem === 'Kampanya Önerileri') {
      return [
        hotel.name,
        'Favori ve rezervasyon sinyali',
        `${favoriteSignal + hotelReservations.length} talep sinyali`,
        favoriteSignal > 0 || hotelReservations.length > 0 ? 'Öneri Var' : 'Sinyal Yok',
        favoriteSignal > 0 ? 'Favori kullanıcılar için kampanya bildirimi önerilir' : 'Yeni kampanya için daha fazla veri bekleniyor',
      ]
    }

    if (activeItem === 'Doluluk Tahmini') {
      return [
        hotel.name,
        'Aktif rezervasyon oranı',
        `${activeReservations.length} aktif rezervasyon`,
        activeReservations.length > 0 ? 'Doluluk Sinyali' : 'Sakin',
        'Otel sahibine oda müsaitlik kontrolü önerilir',
      ]
    }

    if (activeItem === 'Yoğunluk Analizi') {
      return [
        hotel.name,
        'Rezervasyon yoğunluğu',
        `${hotelReservations.length} toplam rezervasyon`,
        hotelReservations.length > 0 ? 'Yoğunluk Var' : 'Veri Yok',
        'Tarih bazlı kapasite takibi önerilir',
      ]
    }

    return [
      hotel.name,
      'Talep tahmini',
      `${hotelReservations.length + favoriteSignal} talep sinyali`,
      hotelReservations.length > 0 || favoriteSignal > 0 ? 'Aktif Sinyal' : 'Sinyal Yok',
      'Rezervasyon ve favori verisi arttıkça tahmin güçlenir',
    ]
  })

  return {
    headers: ['Analiz Başlığı', 'Kaynak', 'Değer', 'Durum', 'Öneri'],
    rows,
    statusColumn: 3,
  }
}

function getAdminPerformanceRows(
  activeItem: string,
  databaseHealth: DatabaseHealth | null,
  hotels: HotelRecord[],
  supportRequests: SupportTicket[],
  notifications: GuestNotification[],
  users: AdminUserRow[],
): AdminTableModel {
  const openSupportCount = supportRequests.filter((request) => request.status !== 'Kapatıldı').length
  const unreadNotificationCount = notifications.filter((notification) => notification.unread).length
  const activeUserCount = users.filter((user) => user.lastLogin === 'Aktif oturum').length
  const errorRows = notifications
    .filter((notification) => normalizeSearch(notification.category + notification.title).includes('hata'))
    .map((notification) => [
      notification.title,
      notification.detail,
      notification.category,
      notification.time,
      notification.unread ? 'Açık' : 'İzlendi',
    ])

  if (activeItem === 'Hata Kayıtları') {
    return {
      headers: ['Bileşen', 'Ölçüm', 'Kaynak', 'Tarih/Saat', 'Durum'],
      rows: errorRows,
      statusColumn: 4,
    }
  }

  const rows: string[][] = [
    ['Veri Tabanı', databaseHealth?.status ?? 'Ölçülmedi', databaseHealth?.database ?? 'Bağlantı bekleniyor', formatDateTime(new Date()), databaseHealth?.status === 'Healthy' ? 'Sağlıklı' : 'Kontrol'],
    ['Otel API', `${hotels.length} tesis senkron`, '/api/hotels', formatDateTime(new Date()), hotels.length > 0 ? 'Başarılı' : 'Kayıt Yok'],
    ['Destek Kuyruğu', `${openSupportCount} açık talep`, 'Destek talepleri', formatDateTime(new Date()), openSupportCount > 0 ? 'Yük Var' : 'Dengeli'],
    ['Bildirim Servisi', `${unreadNotificationCount} okunmamış bildirim`, 'Bildirim merkezi', formatDateTime(new Date()), unreadNotificationCount > 0 ? 'Aktif' : 'Dengeli'],
    ['Aktif Kullanıcı', `${activeUserCount} aktif oturum`, 'Oturum kaydı', formatDateTime(new Date()), activeUserCount > 0 ? 'Aktif' : 'Kayıt Yok'],
  ]

  const filteredRows = rows.filter((row) => {
    if (activeItem === 'Sunucu Durumu') {
      return ['Destek Kuyruğu', 'Bildirim Servisi', 'Aktif Kullanıcı'].includes(row[0])
    }

    if (activeItem === 'API Performansı') {
      return row[0] === 'Otel API'
    }

    if (activeItem === 'Veri Tabanı Durumu') {
      return row[0] === 'Veri Tabanı'
    }

    if (activeItem === 'Sistem Yükü') {
      return ['Destek Kuyruğu', 'Bildirim Servisi', 'Aktif Kullanıcı'].includes(row[0])
    }

    return true
  })

  return {
    headers: ['Bileşen', 'Ölçüm', 'Kaynak', 'Tarih/Saat', 'Durum'],
    rows: filteredRows,
    statusColumn: 4,
  }
}

function getAdminPageModel(
  activeItem: string,
  data: {
    databaseHealth: DatabaseHealth | null
	    favoriteHotelIds: string[]
	    hotelConversations: GuestConversation[]
	    hotelCustomizations: Record<string, HotelCustomization>
	    hotelStatuses: AdminHotelStatus[]
	    hotels: HotelRecord[]
    notifications: GuestNotification[]
	    reservations: GuestReservation[]
	    staffAccounts: StoredStaffAccount[]
	    supportRequests: SupportTicket[]
	    users: AdminUserRow[]
	    violations: AdminViolation[]
	  },
): AdminPageModel {
  const totalRooms = data.hotels.reduce((total, hotel, index) => total + getHotelRooms(hotel, index, data.hotelCustomizations).length, 0)
  const activeHotels = data.hotels.filter((hotel) => getAdminHotelStatus(hotel, data.hotelStatuses) === 'Aktif')
  const suspendedHotels = data.hotels.filter((hotel) => getAdminHotelStatus(hotel, data.hotelStatuses) === 'Askıda')
  const removedHotels = data.hotels.filter((hotel) => getAdminHotelStatus(hotel, data.hotelStatuses) === 'Kaldırıldı')
  const activeReservations = data.reservations.filter(isActiveReservationRecord)
  const pastReservations = data.reservations.filter(isPastReservationRecord)
  const cancelledReservations = data.reservations.filter(isCancelledReservationRecord)
  const occupiedRooms = Math.min(activeReservations.reduce((total, reservation) => total + (reservation.roomCount ?? 1), 0), totalRooms)
  const emptyRooms = Math.max(totalRooms - occupiedRooms, 0)
  const openSupportRequests = data.supportRequests.filter((request) => request.status !== 'Kapatıldı')
  const unreadMessageCount = data.hotelConversations.reduce((total, conversation) =>
    total + conversation.messages.filter((message) => !message.read || message.status !== 'Okundu').length,
  0)
  const getAdminReservationRooms = (reservation: GuestReservation) => getRoomsForReservation(reservation, data.hotels, data.hotelCustomizations)
  const billableReservations = data.reservations.filter((reservation) => isRevenueEligibleReservation(reservation, getAdminReservationRooms(reservation)))
  const totalRevenue = billableReservations.reduce((total, reservation) => total + getReservationTotal(reservation, getAdminReservationRooms(reservation)), 0)
  const refundedRevenue = data.reservations
    .filter((reservation) => isCancelledReservationRecord(reservation) || reservation.paymentStatus.toLocaleLowerCase('tr-TR').includes('iade'))
    .reduce((total, reservation) => total + getReservationTotal(reservation, getAdminReservationRooms(reservation)), 0)
  const pendingRevenue = data.reservations
    .filter((reservation) => reservation.paymentStatus.toLocaleLowerCase('tr-TR').includes('tesiste'))
    .reduce((total, reservation) => total + getReservationTotal(reservation, getAdminReservationRooms(reservation)), 0)
	  const hotelRows = getAdminHotelRows(activeItem, data.hotels, data.hotelCustomizations, data.hotelStatuses, data.reservations)
  const reservationRows = getAdminReservationRows(activeItem, data.hotels, data.reservations, data.hotelCustomizations)
  const userRows = getAdminUserRows(activeItem, data.users)
  const securityRows = getAdminSecurityRows(activeItem, data.notifications, data.hotelConversations, data.users, data.violations)
  const financeRows = getAdminFinanceRows(activeItem, data.hotels, data.reservations, data.hotelCustomizations)
  const aiRows = getAdminAiRows(activeItem, data.hotels, data.reservations, data.supportRequests, data.favoriteHotelIds)
  const performanceRows = getAdminPerformanceRows(activeItem, data.databaseHealth, data.hotels, data.supportRequests, data.notifications, data.users)
  const systemRows = getAdminSystemRows(activeItem, data.hotels, data.users, data.reservations, data.notifications, data.databaseHealth)
  const normalizedActiveItem = activeItem.toLocaleLowerCase('tr-TR')

  if (['Genel Sistem Yönetimi', 'Genel Durum', 'Son İşlemler'].includes(activeItem)) {
    const overviewRows = [
      ['Toplam otel sayısı', String(data.hotels.length), 'Sistemde kayıtlı tesisler', data.hotels.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Aktif otel sayısı', String(activeHotels.length), 'Yayında olan tesisler', activeHotels.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Askıya alınan otel sayısı', String(suspendedHotels.length), 'Moderasyon kayıtları', suspendedHotels.length > 0 ? 'İşlem var' : 'Kayıt Yok'],
      ['Sistemden kaldırılan otel sayısı', String(removedHotels.length), 'Kaldırma kayıtları', removedHotels.length > 0 ? 'İşlem var' : 'Kayıt Yok'],
      ['Toplam oda sayısı', String(totalRooms), 'Otel oda listeleri', totalRooms > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Dolu oda sayısı', String(occupiedRooms), 'Aktif rezervasyon oda toplamı', occupiedRooms > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Boş oda sayısı', String(emptyRooms), 'Toplam oda eksi dolu oda', emptyRooms > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Toplam rezervasyon sayısı', String(data.reservations.length), 'Kalıcı rezervasyon kayıtları', data.reservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Aktif rezervasyon sayısı', String(activeReservations.length), 'Aktif rezervasyon kayıtları', activeReservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Geçmiş rezervasyon sayısı', String(pastReservations.length), 'Geçmiş konaklama kayıtları', pastReservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['İptal rezervasyon sayısı', String(cancelledReservations.length), 'İptal edilen rezervasyonlar', cancelledReservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Toplam kullanıcı sayısı', String(data.users.length), 'Yönetici, otel sahibi ve misafir hesapları', data.users.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ['Açık destek talebi sayısı', String(openSupportRequests.length), 'Kapatılmamış destek talepleri', openSupportRequests.length > 0 ? 'İşlem var' : 'Kayıt Yok'],
      ['Okunmamış mesaj sayısı', String(unreadMessageCount), 'Misafir/otel mesajları', unreadMessageCount > 0 ? 'İşlem var' : 'Kayıt Yok'],
    ]

    return {
      cards: [
        { accent: 'cyan', detail: 'Sistemde kayıtlı gerçek otel sayısı', label: 'Toplam Otel', value: String(data.hotels.length) },
        { accent: 'gold', detail: `${suspendedHotels.length} askıda, ${removedHotels.length} kaldırıldı`, label: 'Aktif Otel', value: String(activeHotels.length) },
        { accent: 'white', detail: `${occupiedRooms} dolu, ${emptyRooms} boş oda`, label: 'Toplam Oda', value: String(totalRooms) },
        { accent: 'cyan', detail: `${openSupportRequests.length} açık destek, ${unreadMessageCount} okunmamış mesaj`, label: 'Operasyon Kuyruğu', value: String(openSupportRequests.length + unreadMessageCount) },
      ],
      chartValues: buildChartValues([data.hotels.length, activeHotels.length, suspendedHotels.length, removedHotels.length, totalRooms, occupiedRooms, emptyRooms, data.reservations.length, activeReservations.length, pastReservations.length, cancelledReservations.length, data.users.length, openSupportRequests.length, unreadMessageCount]),
      emptyText: 'Henüz sistem kaydı bulunmuyor.',
      feedItems: getRecentAdminFeed(data.notifications, data.reservations, data.supportRequests),
      headers: activeItem === 'Son İşlemler' ? systemRows.headers : ['Kayıt', 'Değer', 'Kaynak', 'Durum'],
      progressItems: [
        { detail: data.databaseHealth?.database ?? 'Veri tabanı bağlantısı bekleniyor', label: 'Sistem Sağlığı', value: data.databaseHealth?.status === 'Healthy' ? 100 : 0 },
        { detail: `${openSupportRequests.length} açık destek talebi`, label: 'Destek Kuyruğu', value: percentageOf(data.supportRequests.length - openSupportRequests.length, data.supportRequests.length) },
        { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Rezervasyon Akışı', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
      ],
      rows: activeItem === 'Son İşlemler' ? systemRows.rows : overviewRows,
      statusColumn: systemRows.statusColumn,
      subtitle: 'Otel, kullanıcı, rezervasyon ve platform olaylarının gerçek zamanlı özeti',
      title: activeItem,
    }
  }

  if (adminReservationItems.has(activeItem)) {
    const selectedReservationSet = activeItem === 'Geçmiş Rezervasyonlar'
      ? pastReservations
      : activeItem === 'İptal Edilen Rezervasyonlar'
        ? cancelledReservations
        : activeReservations
    const selectedRevenue = selectedReservationSet.reduce((total, reservation) =>
      total + getReservationTotal(reservation, getAdminReservationRooms(reservation)),
    0)

    return {
      cards: [
        { accent: 'cyan', detail: 'Seçili rezervasyon durumundaki gerçek kayıt sayısı', label: 'Rezervasyon', value: String(selectedReservationSet.length) },
        { accent: 'gold', detail: 'Bu listedeki rezervasyon toplam tutarı', label: 'Toplam Tutar', value: formatCurrency(selectedRevenue) },
        { accent: 'white', detail: `${activeReservations.length} aktif, ${pastReservations.length} geçmiş`, label: 'Aktif / Geçmiş', value: `${activeReservations.length}/${pastReservations.length}` },
        { accent: 'cyan', detail: 'İptal/iade olarak işaretlenen kayıtlar', label: 'İptal', value: String(cancelledReservations.length) },
      ],
      chartValues: buildChartValues([activeReservations.length, pastReservations.length, cancelledReservations.length, selectedRevenue]),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: selectedReservationSet.slice(0, 6).map((reservation) =>
        `${reservation.code} • ${reservation.hotelName} • ${formatCurrency(getReservationTotal(reservation, getAdminReservationRooms(reservation)))}`,
      ),
      headers: reservationRows.headers,
      progressItems: [
        { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Aktif Akış', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
        { detail: `${pastReservations.length} tamamlanmış konaklama`, label: 'Geçmiş Akış', value: percentageOf(pastReservations.length, Math.max(data.reservations.length, 1)) },
        { detail: `${cancelledReservations.length} iptal kaydı`, label: 'İptal Oranı', value: percentageOf(cancelledReservations.length, Math.max(data.reservations.length, 1)) },
      ],
      rows: reservationRows.rows,
      statusColumn: reservationRows.statusColumn,
      subtitle: 'Rezervasyonlar yalnızca gerçek kayıtlar üzerinden listelenir; detaylar kayıt alanlarından okunur',
      title: activeItem,
    }
  }

  if (['Tüm Oteller', 'Otel Listesi', 'Onay Bekleyen Oteller', 'Askıya Alınan Oteller', 'Sistemden Kaldırılan Oteller'].includes(activeItem)) {
    return {
      cards: [
        { accent: 'cyan', detail: 'Filtreye giren tesis kaydı', label: 'Listelenen Otel', value: String(hotelRows.rows.length) },
        { accent: 'gold', detail: 'Tesislere bağlı oda tipi sayısı', label: 'Oda Tipi', value: String(totalRooms) },
        { accent: 'white', detail: 'Admin yalnızca izleme ve hesap durum işlemi yapar', label: 'Yetki', value: 'Sınırlı' },
        { accent: 'cyan', detail: 'Aktif rezervasyonların tesis kırılımı', label: 'Aktif Rezervasyon', value: String(activeReservations.length) },
      ],
      chartValues: buildChartValues(data.hotels.map((hotel, index) => getHotelRooms(hotel, index, data.hotelCustomizations).length)),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: hotelRows.rows.map((row) => `${row[0]} • ${row[2]} • ${row[6]}`).slice(0, 6),
      headers: hotelRows.headers,
      progressItems: [
        { detail: `${activeHotels.length} / ${data.hotels.length} aktif`, label: 'Aktif Tesis Oranı', value: percentageOf(activeHotels.length, data.hotels.length) },
        { detail: 'Fiyat, oda ve kampanya düzenleme otel sahibindedir', label: 'Yetki Kısıtı', value: 100 },
        { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Rezervasyon Yoğunluğu', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
      ],
      rows: hotelRows.rows,
      statusColumn: 6,
      subtitle: 'Admin fiyat, oda ve kampanya içeriğini düzenleyemez; yalnızca sistem durumunu yönetir',
      title: activeItem,
    }
  }

  if (['Personel Kontrolü', 'Yönetici Hesapları', 'Otel Sahipleri', 'Personel Kullanıcıları', 'Yetki Rolleri'].includes(activeItem)) {
    return {
      cards: [
	        { accent: 'cyan', detail: 'Mevcut hesap kayıtları', label: 'Kullanıcı', value: String(userRows.rows.length) },
	        { accent: 'gold', detail: 'Aktif hesap sayısı', label: 'Aktif', value: String(userRows.rows.filter((row) => row[userRows.statusColumn] === 'Aktif').length) },
	        { accent: 'white', detail: 'Personel localStorage kayıtları', label: 'Personel Kaydı', value: String(data.staffAccounts.length) },
	        { accent: 'cyan', detail: 'Pasif yapılabilir kullanıcılar', label: 'Durum Kontrolü', value: String(userRows.rows.length) },
      ],
      chartValues: buildChartValues(['Yönetici', 'Otel Sahibi', 'Misafir', 'Resepsiyon', 'Personel'].map((role) => data.users.filter((user) => user.role === role).length)),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: data.users.slice(-6).reverse().map((user) => `${user.username} • ${user.role} • ${user.status}`),
      headers: userRows.headers,
      progressItems: [
        { detail: `${data.users.filter((user) => user.role === 'Misafir').length} misafir hesabı`, label: 'Misafir Kullanıcılar', value: percentageOf(data.users.filter((user) => user.role === 'Misafir').length, data.users.length) },
        { detail: `${data.users.filter((user) => user.role === 'Otel Sahibi').length} otel sahibi`, label: 'Otel Sahipleri', value: percentageOf(data.users.filter((user) => user.role === 'Otel Sahibi').length, data.users.length) },
	        { detail: `${data.violations.length} yönetici ihlali kaydı`, label: 'Yetki Güvenliği', value: data.violations.length > 0 ? 45 : 100 },
      ],
      rows: userRows.rows,
      statusColumn: userRows.statusColumn,
      subtitle: 'Kullanıcı rolleri, son giriş bilgileri ve hesap durumları',
      title: activeItem,
    }
  }

  if (['Güvenlik Merkezi', 'Güvenlik Logları', 'Aktif Cihazlar', 'Yetki İhlalleri'].includes(activeItem)) {
    return {
      cards: [
        { accent: 'cyan', detail: 'Sistem olaylarından üretilen kayıtlar', label: 'Güvenlik Kaydı', value: String(securityRows.rows.length) },
        { accent: 'gold', detail: 'Başarısız veya riskli olaylar', label: 'Riskli Olay', value: String(securityRows.rows.filter((row) => ['Yüksek', 'Orta'].includes(row[5])).length) },
        { accent: 'white', detail: 'Aktif yönetici oturumu ve bildirim kayıtları', label: 'Oturum İzleme', value: String(data.users.filter((user) => user.lastLogin === 'Aktif oturum').length) },
        { accent: 'cyan', detail: 'Yetki ihlali olarak işaretlenen olaylar', label: 'İhlal', value: String(securityRows.rows.filter((row) => row[1].includes('Yetki')).length) },
      ],
      chartValues: buildChartValues([securityRows.rows.length, data.notifications.length, data.supportRequests.length, data.hotelConversations.length]),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: securityRows.rows.slice(0, 6).map((row) => `${row[0]} • ${row[1]} • ${row[6]}`),
      headers: securityRows.headers,
      progressItems: [
        { detail: databaseHealthDetail(data.databaseHealth), label: 'Güvenlik Sağlığı', value: data.databaseHealth?.status === 'Healthy' ? 100 : 0 },
        { detail: `${securityRows.rows.filter((row) => row[6] === 'Başarısız').length} başarısız olay`, label: 'Başarısız İşlem', value: percentageOf(securityRows.rows.filter((row) => row[6] !== 'Başarısız').length, securityRows.rows.length) },
        { detail: `${data.notifications.filter((notification) => notification.unread).length} okunmamış bildirim`, label: 'Bildirim İzleme', value: percentageOf(data.notifications.filter((notification) => !notification.unread).length, data.notifications.length) },
      ],
      rows: securityRows.rows,
      statusColumn: 5,
      subtitle: 'Giriş, şifre, cihaz ve yetki olayları',
      title: activeItem,
    }
  }

  if (['Finans Merkezi', 'Gelir Özeti', 'İadeler', 'Otel Bazlı Gelir', 'Aylık Raporlar'].includes(activeItem)) {
    return {
      cards: [
        { accent: 'cyan', detail: 'Rezervasyonlardan hesaplanan toplam ödeme', label: 'Toplam Ödeme', value: formatCurrency(totalRevenue) },
        { accent: 'gold', detail: 'Tesiste ödeme veya bekleyen kayıtlar', label: 'Bekleyen Ödeme', value: formatCurrency(pendingRevenue) },
        { accent: 'white', detail: 'İptal/iade durumundaki ödeme', label: 'İade Edilen', value: formatCurrency(refundedRevenue) },
        { accent: 'cyan', detail: 'Gelir üreten rezervasyon kaydı', label: 'Ödeme Kaydı', value: String(data.reservations.length) },
      ],
      chartValues: buildChartValues(billableReservations.map((reservation) => getReservationTotal(reservation, getAdminReservationRooms(reservation)))),
      emptyText: 'Henüz ödeme kaydı bulunmuyor.',
      feedItems: data.reservations.slice(0, 6).map((reservation) => `${reservation.hotelName} • ${formatCurrency(getReservationTotal(reservation, getAdminReservationRooms(reservation)))} • ${reservation.paymentStatus}`),
      headers: financeRows.headers,
      progressItems: [
        { detail: `${data.reservations.length} ödeme kaydı`, label: 'Rapor Hazırlığı', value: data.reservations.length > 0 ? 100 : 0 },
        { detail: `${formatCurrency(pendingRevenue)} bekleyen ödeme`, label: 'Bekleyen Tahsilat', value: percentageOf(totalRevenue - pendingRevenue, totalRevenue) },
        { detail: 'Admin fiyat değiştiremez, yalnızca rapor görüntüler', label: 'Yetki Kısıtı', value: 100 },
      ],
      rows: financeRows.rows,
      statusColumn: financeRows.statusColumn,
      subtitle: 'Admin yalnızca finans raporu görüntüler; oda fiyatı ve kampanya yönetimi otel sahibindedir',
      title: activeItem,
    }
  }

  if (['Yapay Zeka Analizleri', 'Talep Tahmini', 'Doluluk Tahmini', 'Risk Analizi', 'Kampanya Önerileri', 'Yoğunluk Analizi'].includes(activeItem)) {
    const aiCards: Metric[] = activeItem === 'Talep Tahmini'
      ? [
          { accent: 'cyan', detail: 'Geçmiş rezervasyon kayıtları', label: 'Geçmiş Veri', value: String(data.reservations.length) },
          { accent: 'gold', detail: 'Aktif rezervasyonların toplam rezervasyona oranı', label: 'Tahmini Artış', value: `${percentageOf(activeReservations.length, Math.max(data.reservations.length, 1))}%` },
          { accent: 'white', detail: 'Rezervasyon tarihi bulunan yoğunluk sinyalleri', label: 'Yoğun Gün Sinyali', value: String(activeReservations.length) },
          { accent: 'cyan', detail: 'Tahmin için kullanılan otel sayısı', label: 'Analiz Kapsamı', value: String(data.hotels.length) },
        ]
      : activeItem === 'Doluluk Tahmini'
        ? [
            { accent: 'cyan', detail: 'Aktif rezervasyon oda toplamı', label: 'Dolu Oda', value: String(occupiedRooms) },
            { accent: 'gold', detail: 'Toplam odadan kalan kapasite', label: 'Boş Oda', value: String(emptyRooms) },
            { accent: 'white', detail: 'Aktif rezervasyon / oda oranı', label: 'Doluluk Oranı', value: `${percentageOf(occupiedRooms, Math.max(totalRooms, 1))}%` },
            { accent: 'cyan', detail: 'Otel oda envanteri', label: 'Toplam Oda', value: String(totalRooms) },
          ]
        : activeItem === 'Risk Analizi'
          ? [
              { accent: 'cyan', detail: 'Kapatılmamış destek talepleri', label: 'Açık Destek', value: String(openSupportRequests.length) },
              { accent: 'gold', detail: 'İptal edilen rezervasyonlar', label: 'İptal Riski', value: String(cancelledReservations.length) },
              { accent: 'white', detail: 'Askıdaki oteller', label: 'Moderasyon Riski', value: String(suspendedHotels.length) },
              { accent: 'cyan', detail: 'Yüksek riskli güvenlik kayıtları', label: 'Güvenlik Riski', value: String(aiRows.rows.filter((row) => row[3] === 'Dikkat').length) },
            ]
          : activeItem === 'Kampanya Önerileri'
            ? [
                { accent: 'cyan', detail: 'Favoriye alınan tesis sinyali', label: 'Favori Sinyali', value: String(data.favoriteHotelIds.length) },
                { accent: 'gold', detail: 'Rezervasyon üretmeyen oteller', label: 'Düşük Rezervasyon', value: String(data.hotels.filter((hotel) => !data.reservations.some((reservation) => reservationMatchesHotel(reservation, hotel))).length) },
                { accent: 'white', detail: 'Düşük doluluk için önerilebilir oda sayısı', label: 'Kampanya Adayı', value: String(Math.max(emptyRooms, 0)) },
                { accent: 'cyan', detail: 'Üretilecek öneri satırı', label: 'Öneri', value: String(aiRows.rows.length) },
              ]
            : [
                { accent: 'cyan', detail: 'Tarih aralığına göre rezervasyon kaydı', label: 'Rezervasyon Yoğunluğu', value: String(data.reservations.length) },
                { accent: 'gold', detail: 'Otel bazlı yoğunluk kapsamı', label: 'Otel Kapsamı', value: String(data.hotels.length) },
                { accent: 'white', detail: 'Destek talebi yoğunluğu', label: 'Destek Yoğunluğu', value: String(data.supportRequests.length) },
                { accent: 'cyan', detail: 'Okunmamış mesaj yoğunluğu', label: 'Mesaj Yoğunluğu', value: String(unreadMessageCount) },
              ]

    return {
      cards: aiCards,
      chartValues: buildChartValues([data.reservations.length, activeReservations.length, data.favoriteHotelIds.length, data.supportRequests.length, totalRooms]),
      emptyText: 'Henüz tahmin oluşturacak kayıt bulunmuyor.',
      feedItems: aiRows.rows.map((row) => `${row[0]} • ${row[1]} • ${row[3]}`).slice(0, 6),
      headers: aiRows.headers,
      progressItems: [
        { detail: `${activeReservations.length} aktif rezervasyon sinyali`, label: 'Rezervasyon Yoğunluğu', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
        { detail: `${data.supportRequests.filter((request) => request.status !== 'Kapatıldı').length} açık destek riski`, label: 'Destek Riski', value: percentageOf(data.supportRequests.filter((request) => request.status !== 'Kapatıldı').length, Math.max(data.supportRequests.length, 1)) },
        { detail: `${data.favoriteHotelIds.length} favori tesis sinyali`, label: 'Kampanya Potansiyeli', value: percentageOf(data.favoriteHotelIds.length, Math.max(data.hotels.length, 1)) },
      ],
      rows: aiRows.rows,
      statusColumn: 3,
      subtitle: 'Yapay zeka görünümü mevcut rezervasyon, favori ve destek verilerinden tahmin üretir',
      title: activeItem,
    }
  }

  if (['Sistem Performansı', 'Sunucu Durumu', 'API Performansı', 'Veri Tabanı Durumu', 'Sistem Yükü'].includes(activeItem) || normalizedActiveItem.includes('performans')) {
    const performanceCards: Metric[] = activeItem === 'Sunucu Durumu' || activeItem === 'Sistem Performansı'
      ? [
          { accent: 'cyan', detail: 'Backend health endpoint sonucu', label: 'Çalışma Durumu', value: data.databaseHealth?.status === 'Healthy' ? 'Aktif' : 'Kontrol' },
          { accent: 'gold', detail: formatDateTime(new Date()), label: 'Son Yenileme', value: 'Şimdi' },
          { accent: 'white', detail: databaseHealthDetail(data.databaseHealth), label: 'Veritabanı', value: data.databaseHealth?.status ?? 'Ölçülmedi' },
          { accent: 'cyan', detail: 'Otel API bağlantısı', label: 'Bağlantı', value: data.hotels.length > 0 ? 'Senkron' : 'Kayıt Yok' },
        ]
      : activeItem === 'API Performansı'
        ? [
            { accent: 'cyan', detail: 'Bu oturumda çağrılan ana API kayıtları', label: 'API Çağrısı', value: String(data.hotels.length > 0 ? 1 : 0) },
            { accent: 'gold', detail: 'Canlı ölçüm kaydı yoksa durumla gösterilir', label: 'Yanıt Durumu', value: data.databaseHealth?.status === 'Healthy' ? 'Başarılı' : 'Yok' },
            { accent: 'white', detail: 'Başarılı istek oranı', label: 'Başarı Oranı', value: data.databaseHealth?.status === 'Healthy' ? '100%' : '0%' },
            { accent: 'cyan', detail: 'Hata cevabı kayıtları', label: 'Başarısız İstek', value: String(data.notifications.filter((notification) => normalizeSearch(notification.title).includes('hata')).length) },
          ]
        : activeItem === 'Veri Tabanı Durumu'
          ? [
              { accent: 'cyan', detail: 'Kayıtlı kullanıcı toplamı', label: 'Kullanıcı', value: String(data.users.length) },
              { accent: 'gold', detail: 'Kayıtlı otel toplamı', label: 'Otel', value: String(data.hotels.length) },
              { accent: 'white', detail: 'Kalıcı rezervasyon toplamı', label: 'Rezervasyon', value: String(data.reservations.length) },
              { accent: 'cyan', detail: `${data.hotelConversations.length} mesaj, ${data.supportRequests.length} destek`, label: 'İletişim Kaydı', value: String(data.hotelConversations.length + data.supportRequests.length) },
            ]
          : [
              { accent: 'cyan', detail: 'Kapatılmamış destek talepleri', label: 'Açık Destek', value: String(openSupportRequests.length) },
              { accent: 'gold', detail: 'Okunmamış mesajlar', label: 'Mesaj Yükü', value: String(unreadMessageCount) },
              { accent: 'white', detail: 'Aktif rezervasyonlar', label: 'Rezervasyon Yükü', value: String(activeReservations.length) },
              { accent: 'cyan', detail: 'Okunmamış bildirimler', label: 'Bildirim Yoğunluğu', value: String(data.notifications.filter((notification) => notification.unread).length) },
            ]

    return {
      cards: performanceCards,
      chartValues: buildChartValues([data.hotels.length, data.users.length, data.supportRequests.length, data.notifications.length, data.hotelConversations.length]),
      emptyText: 'Henüz performans kaydı bulunmuyor.',
      feedItems: performanceRows.rows.map((row) => `${row[0]} • ${row[1]} • ${row[4]}`).slice(0, 6),
      headers: performanceRows.headers,
      progressItems: [
        { detail: databaseHealthDetail(data.databaseHealth), label: 'Veri Tabanı Durumu', value: data.databaseHealth?.status === 'Healthy' ? 100 : 0 },
        { detail: `${data.users.filter((user) => user.lastLogin === 'Aktif oturum').length} aktif kullanıcı`, label: 'Aktif Kullanıcı', value: percentageOf(data.users.filter((user) => user.lastLogin === 'Aktif oturum').length, data.users.length) },
        { detail: `${data.notifications.filter((notification) => notification.category.toLocaleLowerCase('tr-TR').includes('hata')).length} hata kaydı`, label: 'Hata Kontrolü', value: percentageOf(data.notifications.filter((notification) => !notification.category.toLocaleLowerCase('tr-TR').includes('hata')).length, data.notifications.length) },
      ],
      rows: performanceRows.rows,
      statusColumn: performanceRows.statusColumn,
      subtitle: 'Sunucu, API, veri tabanı ve hata kayıtları',
      title: activeItem,
    }
  }

  return {
    cards: [
      { accent: 'cyan', detail: 'Kayıtlı veri bulunamadı', label: 'Kayıt', value: '0' },
      { accent: 'gold', detail: 'Boş durum', label: 'Durum', value: 'Boş' },
      { accent: 'white', detail: 'Bu sayfa için veri bekleniyor', label: 'Kaynak', value: 'Yok' },
      { accent: 'cyan', detail: 'Sistem izlemeye devam ediyor', label: 'İzleme', value: 'Aktif' },
    ],
    chartValues: [0, 0, 0, 0],
    emptyText: 'Henüz kayıt bulunmuyor.',
    feedItems: [],
    headers: ['Kayıt', 'Açıklama', 'Durum'],
    progressItems: [
      { detail: 'Veri kaynağı bekleniyor', label: 'Kayıt Durumu', value: 0 },
      { detail: 'İşlem yapılmadı', label: 'İşlem', value: 0 },
      { detail: 'Rapor üretilemedi', label: 'Rapor', value: 0 },
    ],
    rows: [],
    statusColumn: 2,
    subtitle: 'Seçili sayfa için kayıt bulunmuyor',
    title: activeItem,
  }
}

function AccessDeniedPanel({ activeItem }: { activeItem: string }) {
  return (
    <section className="access-denied-shell">
      <article className="glass-panel access-denied-card">
        <div className="lock-orb">
          <LockKeyhole size={38} />
        </div>
        <span>Yetkiniz Bulunmamaktadır</span>
        <h2>{activeItem} işlemine erişim kısıtlandı</h2>
        <p>
          Yönetici rolü platform güvenliği, tesis onayı, hesap askıya alma, rapor izleme ve
          sistem ayarları için yetkilidir. Otel odası, fiyat, kampanya, görsel ve rezervasyon
          operasyonları yalnızca otel sahibi tarafından yönetilir.
        </p>
        <div className="permission-grid">
          <div>
            <ShieldCheck size={18} />
            <strong>İzin verilen</strong>
            <span>Tesis onayı, güvenlik izleme, platform raporları</span>
          </div>
          <div>
            <LockKeyhole size={18} />
            <strong>Kısıtlanan</strong>
            <span>Fiyat, oda, kampanya ve rezervasyon operasyonları</span>
          </div>
        </div>
      </article>
    </section>
  )
}

function OwnerPanelPage({
  activeItem,
  hotelConversations,
  hotelCustomizations,
  hotels,
  onNotify,
  setAdminHotelStatuses,
  setHotelConversations,
  setHotelCustomizations,
  setHotels,
  user,
}: {
  activeItem: string
  hotelConversations: GuestConversation[]
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  onNotify: (notification: GuestNotification) => void
  setAdminHotelStatuses: Dispatch<SetStateAction<AdminHotelStatus[]>>
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setHotelCustomizations: Dispatch<SetStateAction<Record<string, HotelCustomization>>>
  setHotels: Dispatch<SetStateAction<HotelRecord[]>>
  user: AuthUser
}) {
  const availableHotels = hotels
  const ownerHotels = getOwnedHotelsForUser(user, availableHotels)
  const [selectedOwnerHotelId, setSelectedOwnerHotelId] = usePersistentState<string>(OWNER_SELECTED_HOTEL_STORAGE_KEY, '')
  const ownerHotel = ownerHotels.find((hotel) => hotel.id === selectedOwnerHotelId) ?? ownerHotels[0]

  useEffect(() => {
    if (ownerHotel && selectedOwnerHotelId !== ownerHotel.id) {
      setSelectedOwnerHotelId(ownerHotel.id)
    }
  }, [ownerHotel, selectedOwnerHotelId, setSelectedOwnerHotelId])

  if (!ownerHotel) {
    return (
      <section className="owner-management-page">
        <article className="owner-page-hero glass-panel wide">
          <div>
            <span>Otel sahibi operasyon ekranı</span>
            <h2>{activeItem}</h2>
            <p>Bu hesaba bağlı otel kaydı bulunmadığı için yönetim verisi gösterilemiyor.</p>
          </div>
        </article>
        <EmptyState text="Henüz kayıt bulunmuyor." />
      </section>
    )
  }

  const ownerHotelIndex = Math.max(availableHotels.findIndex((hotel) => hotel.id === ownerHotel.id), 0)
  const ownerRooms = getHotelRooms(ownerHotel, ownerHotelIndex, hotelCustomizations)
  const ownerReservations = getAllGuestReservations().filter((reservation) => idsMatch(reservation.hotelId, ownerHotel.id))
  const ownerReviews = readStoredValue<GuestReview[]>(HOTEL_REVIEWS_STORAGE_KEY, []).filter((review) => review.hotelId === ownerHotel.id)
  const ownerConversations = hotelConversations.filter((conversation) =>
    conversation.hotelId === ownerHotel.id || conversation.hotelName === ownerHotel.name,
  )
  const ownerHotelSelector = ownerHotels.length > 1 ? (
    <article className="glass-panel wide owner-hotel-selector">
      <PanelHeader icon={<Hotel size={18} />} title="Yönetilen Oteller" subtitle="Bu hesapla bağlı oteller arasında geçiş yaparak operasyonları yönetebilirsin." />
      <div className="admin-filter-row" aria-label="Yönetilen oteller">
        {ownerHotels.map((hotel) => (
          <button
            className={hotel.id === ownerHotel.id ? 'active' : ''}
            key={hotel.id}
            type="button"
            onClick={() => setSelectedOwnerHotelId(hotel.id)}
          >
            {hotel.name}
          </button>
        ))}
      </div>
    </article>
  ) : null
  const renderOwnerPage = (content: ReactNode) => (
    <>
      {ownerHotelSelector}
      {content}
    </>
  )

  if (ownerMessageItems.has(activeItem)) {
    return renderOwnerPage(
      <OwnerSupportInbox
        activeItem={activeItem}
        conversations={ownerConversations}
        onNotify={onNotify}
        setConversations={setHotelConversations}
      />,
    )
  }

  if (ownerCampaignItems.has(activeItem)) {
    return renderOwnerPage(<OwnerCampaignManagementPage activeItem={activeItem} hotel={ownerHotel} reservations={ownerReservations} rooms={ownerRooms} />)
  }

  if (ownerStaffItems.has(activeItem)) {
    return renderOwnerPage(<OwnerStaffManagementPage activeItem={activeItem} hotel={ownerHotel} />)
  }

  if (ownerReviewItems.has(activeItem)) {
    return renderOwnerPage(<OwnerReviewsPage hotel={ownerHotel} reservations={ownerReservations} reviews={ownerReviews} />)
  }

  if (ownerRestrictedItems.has(activeItem)) {
    return renderOwnerPage(
      <OwnerManagementPage
        activeItem={activeItem}
        hotel={ownerHotel}
        hotelCustomizations={hotelCustomizations}
        hotels={availableHotels}
        setAdminHotelStatuses={setAdminHotelStatuses}
        setHotelCustomizations={setHotelCustomizations}
        setHotels={setHotels}
        user={user}
      />,
    )
  }

  return renderOwnerPage(
    <OwnerInsightPage
      activeItem={activeItem}
      conversations={ownerConversations}
      hotel={ownerHotel}
      reservations={ownerReservations}
      reviews={ownerReviews}
      rooms={ownerRooms}
    />,
  )
}

function OwnerInsightPage({
  activeItem,
  conversations,
  hotel,
  reservations,
  reviews,
  rooms,
}: {
  activeItem: string
  conversations: GuestConversation[]
  hotel: HotelRecord
  reservations: GuestReservation[]
  reviews: GuestReview[]
  rooms: RoomOption[]
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Tümü')
  const page = getOwnerPageModel(activeItem, { conversations, hotel, reservations, reviews, rooms })
  const statusIndex = page.statusColumn ?? page.headers.findIndex((header) => ['Durum', 'Statü', 'Öncelik'].includes(header))
  const filters = statusIndex >= 0 ? ['Tümü', ...Array.from(new Set(page.rows.map((row) => row[statusIndex]).filter(Boolean)))] : ['Tümü']
  const activeFilter = filters.includes(filter) ? filter : 'Tümü'
  const normalizedQuery = normalizeSearch(query)
  const visibleRows = page.rows.filter((row) => {
    const matchesSearch = normalizedQuery.length === 0 || normalizeSearch(row.join(' ')).includes(normalizedQuery)
    const matchesFilter = activeFilter === 'Tümü' || (statusIndex >= 0 && row[statusIndex] === activeFilter)

    return matchesSearch && matchesFilter
  })
  const isOverviewPage = ['Otel Genel Durumu', 'Ana Sayfa', 'Genel Bakış'].includes(activeItem)

  if (isOverviewPage) {
    const lowerCards = [
      ...page.progressItems.map((item) => ({
        detail: item.detail,
        label: item.label,
        value: `${item.value}%`,
      })),
      {
        detail: page.feedItems.length > 0 ? `${page.feedItems.length} hareket kaydı` : 'Henüz hareket kaydı yok',
        label: 'Son Kayıtlar',
        value: String(page.feedItems.length),
      },
    ]

    return (
      <section className="admin-dynamic-page owner-insight-page owner-overview-page">
        <article className="glass-panel wide admin-page-hero owner-overview-hero">
          <PanelHeader icon={<Hotel size={18} />} title={page.title} subtitle={page.subtitle} />
          <label className="dashboard-search compact-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bu sayfada ara" />
          </label>
        </article>

        <section className="metric-grid admin-live-metrics owner-overview-metrics">
          {page.cards.map((metric) => (
            <article className={`metric-card ${metric.accent}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="owner-overview-info-grid owner-overview-lower-grid">
          {lowerCards.map((card) => (
            <article className="owner-overview-info-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.detail}</small>
              <em className={card.value !== '0' && card.value !== '0%' ? 'active' : ''}>{card.value !== '0' && card.value !== '0%' ? 'Aktif veri' : 'Kayıt Yok'}</em>
            </article>
          ))}
        </section>

        <section className="dashboard-grid enterprise-grid">
          <article className="glass-panel">
            <PanelHeader icon={<BarChart3 size={18} />} title="Rezervasyon Doluluğu" subtitle="Seçili otelin canlı kayıtlarından" />
            {page.chartValues.some((value) => value > 0) ? <BarGraph values={page.chartValues} /> : <EmptyState text="Henüz grafik oluşturacak kayıt bulunmuyor." compact />}
          </article>
          <article className="glass-panel">
            <PanelHeader icon={<Bell size={18} />} title="Son Kayıtlar" subtitle="Kompakt activity feed" />
            {page.feedItems.length > 0 ? (
              <div className="owner-activity-list">
                {page.feedItems.slice(0, 6).map((item) => (
                  <div key={item}><span></span><p>{item}</p></div>
                ))}
              </div>
            ) : <EmptyState text="Henüz kayıt bulunmuyor." compact />}
          </article>
        </section>
      </section>
    )
  }

  return (
    <section className="admin-dynamic-page owner-insight-page">
      <article className="glass-panel wide admin-page-hero">
        <PanelHeader icon={<Hotel size={18} />} title={page.title} subtitle={page.subtitle} />
        <label className="dashboard-search compact-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bu sayfada ara" />
        </label>
      </article>

      <section className="metric-grid admin-live-metrics">
        {page.cards.map((metric) => (
          <article className={`metric-card ${metric.accent}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="admin-filter-row" aria-label="Otel sahibi filtreleri">
        {filters.map((item) => (
          <button className={activeFilter === item ? 'active' : ''} key={item} type="button" onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </section>

      <section className="dashboard-grid enterprise-grid">
        <article className="glass-panel wide">
          <PanelHeader icon={<ClipboardList size={18} />} title={`${page.title} Tablosu`} subtitle={`${visibleRows.length} kayıt listeleniyor`} />
          <AdminRecordTable emptyText={page.emptyText} headers={page.headers} rows={visibleRows} statusColumn={statusIndex} />
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<BarChart3 size={18} />} title="Gerçek Veri Grafiği" subtitle="Kendi otel verilerinden hesaplandı" />
          {page.chartValues.some((value) => value > 0) ? <BarGraph values={page.chartValues} /> : <EmptyState text="Henüz grafik oluşturacak kayıt bulunmuyor." compact />}
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<Bell size={18} />} title="Son Kayıtlar" subtitle="Bu otele ait hareketler" />
          {page.feedItems.length > 0 ? <ActionFeed items={page.feedItems} /> : <EmptyState text="Henüz kayıt bulunmuyor." compact />}
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<TrendingUp size={18} />} title="Operasyon Göstergeleri" subtitle="Sayfaya ait canlı oranlar" />
          <ProgressStack items={page.progressItems} />
        </article>
      </section>
    </section>
  )
}

function OwnerStaffManagementPage({ activeItem, hotel }: { activeItem: string; hotel: HotelRecord }) {
  const [staffAccounts, setStaffAccounts] = usePersistentState<StoredStaffAccount[]>(ADMIN_STAFF_STORAGE_KEY, [])
  const [draft, setDraft] = useState({ firstName: '', lastName: '', phone: '', role: 'Personel', tcKimlikNo: '' })
  const hotelStaff = staffAccounts.filter((staff) => staff.hotelId === hotel.id)
  const addStaff = () => {
    const tcKimlikNo = draft.tcKimlikNo.replace(/\D/g, '')

    if (!draft.firstName.trim() || !draft.lastName.trim() || tcKimlikNo.length !== 11 || staffAccounts.some((staff) => staff.tcKimlikNo === tcKimlikNo)) {
      return
    }

    setStaffAccounts((current) => [
      ...current,
      {
        createdAt: formatDateTime(new Date()),
        firstName: draft.firstName.trim(),
        hotelId: hotel.id,
        id: `owner-staff-${Date.now()}`,
        lastName: draft.lastName.trim(),
        phone: draft.phone.trim(),
        role: draft.role,
        status: 'Aktif',
        tcKimlikNo,
      },
    ])
    setDraft({ firstName: '', lastName: '', phone: '', role: 'Personel', tcKimlikNo: '' })
  }
  const updateStaffStatus = (tcKimlikNo: string, status: StoredStaffAccount['status']) => {
    setStaffAccounts((current) => current.map((staff) => staff.tcKimlikNo === tcKimlikNo ? { ...staff, status } : staff))
  }
  const rows = hotelStaff.map((staff) => [
    `${staff.firstName} ${staff.lastName}`,
    staff.tcKimlikNo,
    staff.phone || '-',
    staff.role,
    staff.status,
    staff.status === 'Aktif' ? 'Pasif Yap|Sil' : 'Aktif Yap',
  ])

  return (
    <section className="admin-dynamic-page owner-insight-page">
      <article className="glass-panel wide admin-page-hero">
        <PanelHeader icon={<Users size={18} />} title="Personel Listesi" subtitle={`${activeItem} • ${hotel.name} personel kayıtları yönetici paneliyle senkronize saklanır.`} />
      </article>
      <section className="dashboard-grid enterprise-grid">
        <article className="glass-panel wide admin-inline-form">
          <PanelHeader icon={<UserCog size={18} />} title="Personel Ekle" subtitle="Eklenen personel yönetici panelindeki Personel Kullanıcıları listesine de düşer." />
          <div className="management-form two-column">
            <label><span>Ad</span><input value={draft.firstName} onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))} /></label>
            <label><span>Soyad</span><input value={draft.lastName} onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))} /></label>
            <label><span>T.C. Kimlik No</span><input maxLength={11} value={draft.tcKimlikNo} onChange={(event) => setDraft((current) => ({ ...current, tcKimlikNo: event.target.value.replace(/\D/g, '') }))} /></label>
            <label><span>Telefon</span><input value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /></label>
            <label><span>Görev / Rol</span><input value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))} /></label>
          </div>
          <div className="table-action-row"><button type="button" onClick={addStaff}>Personel Ekle</button></div>
        </article>
        <article className="glass-panel wide">
          <PanelHeader icon={<ClipboardList size={18} />} title="Personel Listesi" subtitle={`${hotelStaff.length} kayıt`} />
          <AdminRecordTable
            emptyText="Henüz kayıt bulunmuyor."
            headers={['Ad Soyad', 'T.C. Kimlik No', 'Telefon', 'Rol', 'Durum', 'İşlemler']}
            rows={rows}
            statusColumn={4}
            onAction={(action, row) => updateStaffStatus(row[1], action === 'Aktif Yap' ? 'Aktif' : action === 'Sil' ? 'Silindi' : 'Pasif')}
          />
        </article>
      </section>
    </section>
  )
}

function OwnerCampaignManagementPage({ activeItem, hotel, reservations, rooms }: { activeItem: string; hotel: HotelRecord; reservations: GuestReservation[]; rooms: RoomOption[] }) {
  const [coupons, setCoupons] = usePersistentState<OwnerCoupon[]>(OWNER_COUPONS_STORAGE_KEY, [])
  const [campaigns, setCampaigns] = usePersistentState<OwnerCampaign[]>(OWNER_CAMPAIGNS_STORAGE_KEY, [])
  const [couponDraft, setCouponDraft] = useState({ code: '', discountType: 'Yüzde' as OwnerCoupon['discountType'], endDate: '', minimumSpend: '', startDate: '', usageLimit: '50', value: '10' })
  const [couponNotice, setCouponNotice] = useState('')
  const [campaignDraft, setCampaignDraft] = useState({
    campaignPrice: '',
    condition: 'Minimum 2 gece konaklama',
    endDate: '',
    roomId: rooms[0]?.id ?? '',
    startDate: '',
    targetPrice: '',
    title: '',
  })
  const hotelCoupons = coupons.filter((coupon) => coupon.hotelId === hotel.id)
  const hotelCampaigns = campaigns.filter((campaign) => campaign.hotelId === hotel.id)
  const selectedCampaignRoom = rooms.find((room) => room.id === campaignDraft.roomId) ?? rooms[0]
  const currentCampaignPrice = selectedCampaignRoom?.price ?? 0
  const effectiveCampaignPrice = Number(campaignDraft.campaignPrice || campaignDraft.targetPrice || 0)
  const campaignDiscountAmount = Math.max(currentCampaignPrice - effectiveCampaignPrice, 0)
  const campaignDiscountRate = percentageOf(campaignDiscountAmount, Math.max(currentCampaignPrice, 1))
  const createCoupon = () => {
    if (!couponDraft.code.trim()) {
      setCouponNotice('Kupon kodu zorunludur.')
      return
    }

    const parsedMinimumSpend = couponDraft.minimumSpend.trim() === '' ? 0 : Number(couponDraft.minimumSpend)

    if (!Number.isFinite(parsedMinimumSpend) || parsedMinimumSpend < 0) {
      setCouponNotice('Minimum harcama geçerli bir tutar olmalıdır.')
      return
    }

    const nextCouponId = `coupon-${Date.now()}`

    setCoupons((current) => [
      ...current,
      {
        code: couponDraft.code.trim().toLocaleUpperCase('tr-TR'),
        couponId: nextCouponId,
        discountType: couponDraft.discountType,
        discountValue: Math.max(Number(couponDraft.value || 0), 0),
        endDate: couponDraft.endDate,
        hotelId: hotel.id,
        id: nextCouponId,
        isActive: true,
        minSpend: parsedMinimumSpend,
        minimumSpend: parsedMinimumSpend,
        ownerId: getOwnerIdForHotel(hotel.id, mergeCustomHotels([])),
        startDate: couponDraft.startDate,
        usedCount: 0,
        usageLimit: Math.max(Number(couponDraft.usageLimit || 0), 0),
        value: Math.max(Number(couponDraft.value || 0), 0),
      },
    ])
    setCouponDraft({ code: '', discountType: 'Yüzde', endDate: '', minimumSpend: '', startDate: '', usageLimit: '50', value: '10' })
    setCouponNotice('Kupon başarıyla oluşturuldu.')
  }
  const createCampaign = () => {
    if (!campaignDraft.title.trim() || !selectedCampaignRoom || effectiveCampaignPrice <= 0) {
      return
    }

    setCampaigns((current) => [
      ...current,
      {
        campaignPrice: effectiveCampaignPrice,
        condition: campaignDraft.condition,
        createdAt: formatDateTime(new Date()),
        currentPrice: currentCampaignPrice,
        discountRate: campaignDiscountRate,
        endDate: campaignDraft.endDate,
        hotelId: hotel.id,
        id: `campaign-${Date.now()}`,
        isActive: true,
        roomId: campaignDraft.roomId,
        startDate: campaignDraft.startDate,
        targetPrice: Number(campaignDraft.targetPrice || effectiveCampaignPrice),
        title: campaignDraft.title.trim(),
      },
    ])
    setCampaignDraft({ campaignPrice: '', condition: 'Minimum 2 gece konaklama', endDate: '', roomId: rooms[0]?.id ?? '', startDate: '', targetPrice: '', title: '' })
  }
  const campaignReservationCount = reservations.filter((reservation) => reservation.notes?.toLocaleLowerCase('tr-TR').includes('kampanya')).length
  const increaseRate = percentageOf(campaignReservationCount, Math.max(reservations.length - campaignReservationCount, 1))

  return (
    <section className="admin-dynamic-page owner-insight-page">
      <article className="glass-panel wide admin-page-hero">
        <PanelHeader icon={<ReceiptText size={18} />} title={activeItem} subtitle={`${hotel.name} için kupon, aktif kampanya ve performans yönetimi`} />
      </article>
      <section className="dashboard-grid enterprise-grid">
        {activeItem === 'Kuponlar' || activeItem === 'Kampanya Yönetimi' ? (
          <article className="glass-panel wide admin-inline-form">
            <PanelHeader icon={<ReceiptText size={18} />} title="Kupon Oluştur" subtitle="Kupon kayıtları kalıcı olarak saklanır." />
            <div className="management-form two-column">
              <label><span>Kupon kodu</span><input value={couponDraft.code} onChange={(event) => setCouponDraft((current) => ({ ...current, code: event.target.value }))} /></label>
              <label><span>İndirim tipi</span><select value={couponDraft.discountType} onChange={(event) => setCouponDraft((current) => ({ ...current, discountType: event.target.value as OwnerCoupon['discountType'] }))}><option>Yüzde</option><option>Tutar</option></select></label>
              <label><span>Yüzde / tutar</span><input inputMode="decimal" value={couponDraft.value} onChange={(event) => setCouponDraft((current) => ({ ...current, value: event.target.value }))} /></label>
              <label><span>Minimum harcama</span><input inputMode="decimal" value={couponDraft.minimumSpend} placeholder="0" onChange={(event) => setCouponDraft((current) => ({ ...current, minimumSpend: event.target.value }))} /></label>
              <label><span>Başlangıç tarihi</span><input type="date" value={couponDraft.startDate} onChange={(event) => setCouponDraft((current) => ({ ...current, startDate: event.target.value }))} /></label>
              <label><span>Bitiş tarihi</span><input type="date" value={couponDraft.endDate} onChange={(event) => setCouponDraft((current) => ({ ...current, endDate: event.target.value }))} /></label>
              <label><span>Kullanım limiti</span><input inputMode="numeric" value={couponDraft.usageLimit} onChange={(event) => setCouponDraft((current) => ({ ...current, usageLimit: event.target.value }))} /></label>
            </div>
            {couponNotice ? <p className={`security-inline-alert ${couponNotice.includes('başarı') ? 'success' : 'error'}`}>{couponNotice}</p> : null}
            <div className="table-action-row"><button type="button" onClick={createCoupon}>Kupon Oluştur</button></div>
          </article>
        ) : null}
        {activeItem === 'Aktif Kampanyalar' || activeItem === 'Kampanya Yönetimi' ? (
          <article className="glass-panel wide admin-inline-form">
            <PanelHeader icon={<Sparkles size={18} />} title="Kampanya Ekle" subtitle="Şart ekleme sistemi ve oda bağlantısı" />
            <div className="management-form two-column">
              <label><span>Kampanya adı</span><input value={campaignDraft.title} onChange={(event) => setCampaignDraft((current) => ({ ...current, title: event.target.value }))} /></label>
              <label><span>Bağlı oda</span><select value={campaignDraft.roomId} onChange={(event) => setCampaignDraft((current) => ({ ...current, roomId: event.target.value }))}>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
              <label><span>Mevcut fiyat</span><input readOnly value={formatCurrency(currentCampaignPrice)} /></label>
              <label><span>Kampanyalı fiyat</span><input inputMode="decimal" value={campaignDraft.campaignPrice} onChange={(event) => setCampaignDraft((current) => ({ ...current, campaignPrice: event.target.value }))} /></label>
              <label><span>Fiyatı kaça düşüreyim</span><input inputMode="decimal" value={campaignDraft.targetPrice} onChange={(event) => setCampaignDraft((current) => ({ ...current, targetPrice: event.target.value }))} /></label>
              <label><span>Kampanya başlangıç tarihi</span><input type="date" value={campaignDraft.startDate} onChange={(event) => setCampaignDraft((current) => ({ ...current, startDate: event.target.value }))} /></label>
              <label><span>Kampanya bitiş tarihi</span><input type="date" value={campaignDraft.endDate} onChange={(event) => setCampaignDraft((current) => ({ ...current, endDate: event.target.value }))} /></label>
              <label className="span-two"><span>Şart</span><textarea value={campaignDraft.condition} onChange={(event) => setCampaignDraft((current) => ({ ...current, condition: event.target.value }))} /></label>
            </div>
            <div className="price-derived-card">
              <span>Otomatik indirim hesabı</span>
              <strong>{formatCurrency(campaignDiscountAmount)} • %{campaignDiscountRate}</strong>
              <p>Kampanyalı fiyat girildiğinde mevcut fiyatla arasındaki fark otomatik hesaplanır.</p>
            </div>
            <div className="table-action-row"><button type="button" onClick={createCampaign}>Kampanya Ekle</button></div>
          </article>
        ) : null}
        <article className="glass-panel wide">
          <PanelHeader icon={<ClipboardList size={18} />} title={activeItem === 'Kuponlar' ? 'Kuponlar' : 'Aktif Kampanyalar'} subtitle="Gerçek kayıt listesi" />
          {activeItem === 'Kuponlar' ? (
            <EnterpriseTable headers={['Kod', 'Tip', 'Değer', 'Minimum', 'Kullanım', 'Tarih', 'Durum']} rows={hotelCoupons.map((coupon) => [coupon.code, coupon.discountType, String(couponDiscountValue(coupon)), formatCurrency(couponMinimumSpend(coupon)), `${couponUsedCount(coupon)} / ${couponUsageLimit(coupon) || '∞'}`, `${coupon.startDate || '-'} / ${coupon.endDate || '-'}`, coupon.isActive ? 'Aktif' : 'Pasif'])} />
          ) : (
            <EnterpriseTable headers={['Kampanya', 'Oda', 'Fiyat', 'İndirim', 'Tarih', 'Durum']} rows={hotelCampaigns.map((campaign) => [campaign.title, rooms.find((room) => room.id === campaign.roomId)?.name ?? '-', `${formatCurrency(campaign.currentPrice ?? rooms.find((room) => room.id === campaign.roomId)?.price ?? 0)} → ${formatCurrency(campaign.campaignPrice ?? campaign.targetPrice ?? 0)}`, `%${campaign.discountRate ?? 0}`, `${campaign.startDate || '-'} / ${campaign.endDate || '-'}`, campaign.isActive ? 'Aktif' : 'Pasif'])} />
          )}
        </article>
        {activeItem === 'Kampanya Performansı' ? (
          <article className="glass-panel">
            <PanelHeader icon={<TrendingUp size={18} />} title="Kampanya Performansı" subtitle="Kampanyalı satış artış oranı" />
            <ProgressStack items={[{ label: 'Rezervasyon artış oranı', value: increaseRate, detail: `${campaignReservationCount} kampanya sinyalli rezervasyon` }]} />
          </article>
        ) : null}
      </section>
    </section>
  )
}

function OwnerReviewsPage({ hotel, reservations, reviews }: { hotel: HotelRecord; reservations: GuestReservation[]; reviews: GuestReview[] }) {
  const [allReviews, setAllReviews] = usePersistentState<GuestReview[]>(HOTEL_REVIEWS_STORAGE_KEY, [])
  const [replyDraft, setReplyDraft] = useState<{ reviewId: string; text: string } | null>(null)
  const hotelReviews = allReviews.filter((review) => review.hotelId === hotel.id)
  const sourceReviews = hotelReviews.length > 0 ? hotelReviews : reviews
  const rows = sourceReviews.map((review) => {
    const reservation = reservations.find((item) => item.hotelId === review.hotelId && (item.guestName === review.userName || item.status !== 'İptal Edildi'))

    return [
      review.userName,
      reservation?.roomName ?? 'Oda kaydı yok',
      reservation?.checkIn ?? '-',
      reservation ? String(calculateNights(reservation.checkIn, reservation.checkOut)) : '-',
      `${review.rating}/5`,
      review.comment,
      review.ownerReply ? `Cevaplandı • ${review.ownerReply}` : 'Yanıt bekliyor',
      'Yanıtla',
    ]
  })
  const saveReply = () => {
    if (!replyDraft?.text.trim()) {
      return
    }

    setAllReviews((current) =>
      current.map((review) =>
        review.id === replyDraft.reviewId
          ? { ...review, ownerReply: replyDraft.text.trim(), ownerReplyAt: formatDateTime(new Date()) }
          : review,
      ),
    )
    setReplyDraft(null)
  }

  return (
    <section className="admin-dynamic-page owner-insight-page">
      <article className="glass-panel wide admin-page-hero">
        <PanelHeader icon={<Star size={18} />} title="Yorumlar" subtitle={`${hotel.name} için gerçek kullanıcı yorumları ve otel sahibi cevapları`} />
      </article>
      <article className="glass-panel wide">
        <PanelHeader icon={<ClipboardList size={18} />} title="Yorum Detayı" subtitle="Oda, tarih, gece sayısı, puan ve rezervasyon bağlantısı" />
        <AdminRecordTable
          emptyText="Henüz kayıt bulunmuyor."
          headers={['Misafir', 'Oda', 'Giriş Tarihi', 'Gece', 'Puan', 'Yorum', 'Cevap', 'İşlemler']}
          rows={rows}
          statusColumn={4}
          onAction={(_, row) => {
            const review = sourceReviews.find((item) => item.userName === row[0] && item.comment === row[5])
            if (review) {
              setReplyDraft({ reviewId: review.id, text: review.ownerReply ?? '' })
            }
          }}
        />
      </article>
      {replyDraft ? (
        <div className="admin-action-modal" role="dialog" aria-modal="true">
          <article className="glass-panel">
            <PanelHeader icon={<MessageSquareText size={18} />} title="Yoruma Cevap Ver" subtitle="Cevap misafir yorumunun altında görünür." />
            <label className="admin-reason-field">
              <span>Cevap</span>
              <textarea value={replyDraft.text} onChange={(event) => setReplyDraft((current) => current ? { ...current, text: event.target.value } : current)} />
            </label>
            <div className="table-action-row">
              <button type="button" onClick={saveReply} disabled={!replyDraft.text.trim()}>Cevabı Kaydet</button>
              <button type="button" onClick={() => setReplyDraft(null)}>İptal Et</button>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

function getOwnerPageModel(
  activeItem: string,
  data: {
    conversations: GuestConversation[]
    hotel: HotelRecord
    reservations: GuestReservation[]
    reviews: GuestReview[]
    rooms: RoomOption[]
  },
): AdminPageModel {
  const activeReservations = data.reservations.filter((reservation) => normalizeSearch(getReservationStatus(reservation)).includes('aktif') || normalizeSearch(getReservationStatus(reservation)).includes('active'))
  const cancelledReservations = data.reservations.filter((reservation) => {
    const status = normalizeSearch(getReservationStatus(reservation))

    return status.includes('iptal') || status.includes('cancelled')
  })
  const todayKey = getDateKey()
  const todayCheckIns = activeReservations.filter((reservation) => reservation.checkIn === todayKey)
  const todayCheckOuts = activeReservations.filter((reservation) => reservation.checkOut === todayKey)
  const billableReservations = data.reservations.filter((reservation) => isRevenueEligibleReservation(reservation, data.rooms))
  const totalRevenue = billableReservations.reduce((total, reservation) => total + getReservationTotal(reservation, data.rooms), 0)
  const dailyRevenue = billableReservations
    .filter((reservation) => isReservationRevenueOnDate(reservation, todayKey))
    .reduce((total, reservation) => total + getReservationTotal(reservation, data.rooms), 0)
  const weeklyRevenue = billableReservations
    .filter((reservation) => isReservationRevenueWithinLastDays(reservation, 7))
    .reduce((total, reservation) => total + getReservationTotal(reservation, data.rooms), 0)
  const monthlyRevenue = billableReservations
    .filter((reservation) => isReservationRevenueWithinLastDays(reservation, 30))
    .reduce((total, reservation) => total + getReservationTotal(reservation, data.rooms), 0)
  const averageRating = data.reviews.length > 0
    ? data.reviews.reduce((total, review) => total + review.rating, 0) / data.reviews.length
    : 0
  const totalRoomStock = data.rooms.reduce((total, room) => total + room.available, 0)
  const occupiedRooms = Math.min(
    data.rooms.reduce((total, room) => total + getReservedRoomCount(room, data.reservations), 0),
    totalRoomStock,
  )
  const availableRooms = Math.max(totalRoomStock - occupiedRooms, 0)
  const occupancyRate = percentageOf(occupiedRooms, totalRoomStock)
  const campaignRooms = data.rooms.filter((room) => room.oldPrice && room.oldPrice > room.price)
  const baseCards: Metric[] = [
    { accent: 'cyan', detail: `${data.hotel.name} oda kayıtları`, label: 'Oda Tipi', value: String(data.rooms.length) },
    { accent: 'gold', detail: 'Aktif rezervasyon kayıtları', label: 'Aktif Rezervasyon', value: String(activeReservations.length) },
    { accent: 'white', detail: 'Rezervasyonlardan hesaplandı', label: 'Toplam Gelir', value: formatCurrency(totalRevenue) },
    { accent: 'cyan', detail: `${data.reviews.length} yorumdan hesaplandı`, label: 'Ortalama Puan', value: data.reviews.length > 0 ? averageRating.toFixed(1) : '0' },
  ]

  if (['Otel Genel Durumu', 'Ana Sayfa', 'Genel Bakış', 'Oda Doluluk Durumu', 'Gelir Özeti'].includes(activeItem)) {
    return {
      cards: [
        { accent: 'cyan', detail: 'Gerçek aktif rezervasyon kayıtları', label: 'Aktif Rezervasyon', value: String(activeReservations.length) },
        { accent: 'gold', detail: `${occupiedRooms} dolu, ${availableRooms} boş oda`, label: 'Doluluk Oranı', value: `${occupancyRate}%` },
        { accent: 'white', detail: 'Bugünkü giriş/çıkış akışı', label: 'Bugün', value: `${todayCheckIns.length} giriş / ${todayCheckOuts.length} çıkış` },
        { accent: 'cyan', detail: 'Tüm başarılı rezervasyonlardan hesaplandı', label: 'Gelir', value: formatCurrency(totalRevenue) },
      ],
      chartValues: buildChartValues([activeReservations.length, todayCheckIns.length, todayCheckOuts.length, occupancyRate, totalRoomStock, occupiedRooms, availableRooms, dailyRevenue, weeklyRevenue, monthlyRevenue, data.reviews.length, cancelledReservations.length]),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: [
        ...data.reservations.slice(0, 4).map((reservation) => `${reservation.code} • ${reservation.roomType ?? reservation.roomName} • ${reservation.status}`),
        ...data.reviews.slice(0, 3).map((review) => `${review.userName} • ${review.rating}/5 • ${review.updatedAt}`),
      ],
      headers: ['Kayıt', 'Değer', 'Kaynak', 'Durum'],
      progressItems: [
        { detail: `${availableRooms} boş oda`, label: 'Oda Müsaitliği', value: percentageOf(availableRooms, Math.max(totalRoomStock, 1)) },
        { detail: `${occupiedRooms} dolu oda`, label: 'Rezervasyon Doluluğu', value: occupancyRate },
        { detail: `${data.reviews.length} gerçek yorum`, label: 'Yorum Verisi', value: data.reviews.length > 0 ? 100 : 0 },
      ],
      rows: [
        ['Otel adı', data.hotel.name, `${data.hotel.city} / ${data.hotel.district}`, data.hotel.isActive ? 'Aktif' : 'Askıda'],
        ['Toplam aktif rezervasyon', String(activeReservations.length), 'Rezervasyon kayıtları', activeReservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Bugünkü girişler', String(todayCheckIns.length), 'Check-in tarihi bugüne eşit aktif kayıtlar', todayCheckIns.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Bugünkü çıkışlar', String(todayCheckOuts.length), 'Check-out tarihi bugüne eşit aktif kayıtlar', todayCheckOuts.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Doluluk oranı', `${occupancyRate}%`, `${occupiedRooms} / ${totalRoomStock} oda`, totalRoomStock > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Toplam oda sayısı', String(totalRoomStock), 'Oda tipi stok adetlerinden hesaplandı', totalRoomStock > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Dolu oda sayısı', String(occupiedRooms), 'Aktif rezervasyonlardaki oda adedi', occupiedRooms > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Boş oda sayısı', String(availableRooms), 'Toplam stok eksi dolu oda', availableRooms > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Günlük gelir', formatCurrency(dailyRevenue), 'Bugün oluşturulan başarılı rezervasyonlardan hesaplandı', dailyRevenue > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Haftalık gelir', formatCurrency(weeklyRevenue), 'Son 7 güne ait rezervasyonlardan hesaplandı', weeklyRevenue > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Aylık gelir', formatCurrency(monthlyRevenue), 'Son 30 güne ait rezervasyonlardan hesaplandı', monthlyRevenue > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Ortalama müşteri puanı', data.reviews.length > 0 ? averageRating.toFixed(1) : '0', 'Gerçek kullanıcı yorumlarından hesaplandı', data.reviews.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
        ['Bekleyen rezervasyonlar', '0', 'Bekleyen durum kaydı bulunmuyor', 'Kayıt Yok'],
        ['İptal edilen rezervasyonlar', String(cancelledReservations.length), 'İptal durumundaki rezervasyonlar', cancelledReservations.length > 0 ? 'Aktif veri' : 'Kayıt Yok'],
      ],
      statusColumn: 3,
      subtitle: 'Otel sahibinin yalnızca kendi oteline ait gerçek kayıtları',
      title: activeItem,
    }
  }

  if (['Kampanya Yönetimi', 'Aktif Kampanyalar', 'Kuponlar', 'İndirim Kuralları', 'Kampanya Performansı'].includes(activeItem)) {
    const rows = campaignRooms.map((room) => [
      room.name,
      `${formatCurrency(room.oldPrice ?? room.price)} → ${formatCurrency(room.price)}`,
      `%${Math.round((((room.oldPrice ?? room.price) - room.price) / Math.max(room.oldPrice ?? room.price, 1)) * 100)}`,
      room.available > 0 ? 'Aktif' : 'Pasif',
      'Düzenle|Durdur',
    ])

    return {
      cards: [
        { accent: 'cyan', detail: 'İndirimli oda kayıtları', label: 'Aktif Kampanya', value: String(campaignRooms.length) },
        { accent: 'gold', detail: 'Kampanya uygulanabilir oda tipi', label: 'Oda Tipi', value: String(data.rooms.length) },
        { accent: 'white', detail: 'Kampanyalı rezervasyon verisinden hesaplanır', label: 'Rezervasyon', value: String(activeReservations.length) },
        { accent: 'cyan', detail: 'Kampanya için bekleyen kayıt', label: 'Kupon', value: '0' },
      ],
      chartValues: buildChartValues(campaignRooms.map((room) => Math.max((room.oldPrice ?? room.price) - room.price, 0))),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: rows.map((row) => `${row[0]} • ${row[1]} • ${row[3]}`),
      headers: ['Oda', 'Fiyat', 'İndirim', 'Durum', 'İşlemler'],
      progressItems: [
        { detail: `${campaignRooms.length} kampanyalı oda`, label: 'Kampanya Kapsamı', value: percentageOf(campaignRooms.length, data.rooms.length) },
        { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Satış Sinyali', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
        { detail: 'Kupon kaydı bulunursa burada yükselir', label: 'Kupon Kullanımı', value: 0 },
      ],
      rows,
      statusColumn: 3,
      subtitle: 'Kampanyalar oda fiyat kayıtlarından ve indirimli odalardan hesaplanır',
      title: activeItem,
    }
  }

  if (['Personel Takibi', 'Personel Listesi', 'Vardiya Durumu', 'Görev Takibi', 'Performans Kayıtları'].includes(activeItem)) {
    return {
      cards: [
        { accent: 'cyan', detail: 'Otel sahibine bağlı personel kaydı', label: 'Personel', value: '0' },
        { accent: 'gold', detail: 'Kayıtlı vardiya bulunmuyor', label: 'Vardiya', value: '0' },
        { accent: 'white', detail: 'Görev kaydı bulunmuyor', label: 'Görev', value: '0' },
        { accent: 'cyan', detail: 'Performans verisi yok', label: 'Performans', value: '0' },
      ],
      chartValues: [0, 0, 0, 0],
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: [],
      headers: ['Personel', 'Rol', 'Son İşlem', 'Durum', 'İşlemler'],
      progressItems: [
        { detail: 'Personel kaydı yok', label: 'Personel Kapsamı', value: 0 },
        { detail: 'Vardiya kaydı yok', label: 'Vardiya Takibi', value: 0 },
        { detail: 'Görev kaydı yok', label: 'Görev Durumu', value: 0 },
      ],
      rows: [],
      statusColumn: 3,
      subtitle: 'Personel kayıtları eklendiğinde bu sayfa otomatik dolacaktır',
      title: activeItem,
    }
  }

  if (['Gelir Raporları', 'Günlük Gelir', 'Haftalık Gelir', 'Aylık Gelir', 'Oda Bazlı Gelir'].includes(activeItem)) {
    if (activeItem === 'Oda Bazlı Gelir') {
      const rows = data.rooms.map((room) => {
        const roomReservations = billableReservations.filter((reservation) => reservationMatchesRoom(reservation, room))
        const roomRevenue = roomReservations.reduce((total, reservation) => total + getReservationTotal(reservation, [room]), 0)
        const reservedRoomUnits = roomReservations.reduce((total, reservation) => total + (reservation.roomCount ?? 1), 0)
        const totalNights = roomReservations.reduce(
          (total, reservation) => total + calculateNights(reservation.checkIn, reservation.checkOut) * (reservation.roomCount ?? 1),
          0,
        )
        const averageNightlyPrice = totalNights > 0 ? Math.round(roomRevenue / totalNights) : room.price
        const occupancy = percentageOf(reservedRoomUnits, Math.max(room.available + reservedRoomUnits, 1))

        return [
          room.name,
          formatCurrency(roomRevenue),
          String(roomReservations.length),
          `${occupancy}%`,
          formatCurrency(averageNightlyPrice),
        ]
      })

      return {
        cards: baseCards,
        chartValues: buildChartValues(rows.map((row) => Number(row[1].replace(/\D/g, '')))),
        emptyText: 'Henüz kayıt bulunmuyor.',
        feedItems: rows.map((row) => `${row[0]} • ${row[1]} • ${row[2]} rezervasyon`).slice(0, 6),
        headers: ['Oda adı', 'Toplam gelir', 'Rezervasyon sayısı', 'Doluluk oranı', 'Ortalama gecelik fiyat'],
        progressItems: [
          { detail: `${data.rooms.length} oda tipi listeleniyor`, label: 'Oda Kapsamı', value: data.rooms.length > 0 ? 100 : 0 },
          { detail: `${formatCurrency(totalRevenue)} toplam gelir`, label: 'Gelir Toplamı', value: data.reservations.length > 0 ? 100 : 0 },
          { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Aktif Gelir Akışı', value: percentageOf(activeReservations.length, Math.max(data.reservations.length, 1)) },
        ],
        rows,
        statusColumn: 2,
        subtitle: 'Seçili otelin odaları ve oda bazlı gelir kayıtları',
        title: activeItem,
      }
    }

    const rows = billableReservations.map((reservation) => [
      reservation.code,
      reservation.roomType ?? reservation.roomName,
      `${reservation.checkIn} / ${reservation.checkOut}`,
      formatCurrency(getReservationTotal(reservation, data.rooms)),
      reservation.paymentStatus,
    ])

    return {
      cards: baseCards,
      chartValues: buildChartValues(billableReservations.map((reservation) => getReservationTotal(reservation, data.rooms))),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: rows.map((row) => `${row[0]} • ${row[1]} • ${row[3]}`).slice(0, 6),
      headers: ['Rezervasyon', 'Oda', 'Tarih', 'Tutar', 'Durum'],
      progressItems: [
        { detail: `${formatCurrency(totalRevenue)} toplam gelir`, label: 'Gelir Toplamı', value: billableReservations.length > 0 ? 100 : 0 },
        { detail: `${activeReservations.length} aktif rezervasyon`, label: 'Aktif Gelir Akışı', value: percentageOf(activeReservations.length, Math.max(billableReservations.length, 1)) },
        { detail: `${data.rooms.length} oda tipi`, label: 'Oda Bazlı Kapsam', value: data.rooms.length > 0 ? 100 : 0 },
      ],
      rows,
      statusColumn: 4,
      subtitle: 'Gelir raporları sadece kendi oteline ait rezervasyonlardan hesaplanır',
      title: activeItem,
    }
  }

  if (['Müşteri Memnuniyeti', 'Yorumlar', 'Yorumlar ve Puanlar', 'Yorum Analizi', 'VIP Misafirler', 'Şikayet ve Talepler', 'Sadakat Programı', 'Misafir Yorumları', 'Puan Dağılımı', 'Yanıt Bekleyen Yorumlar', 'Memnuniyet Analizi'].includes(activeItem)) {
    const rows = data.reviews.map((review) => [
      review.userName,
      data.reservations.find((reservation) => reservation.hotelId === review.hotelId)?.roomName ?? 'Oda kaydı yok',
      data.reservations.find((reservation) => reservation.hotelId === review.hotelId)?.checkIn ?? '-',
      String(calculateNights(
        data.reservations.find((reservation) => reservation.hotelId === review.hotelId)?.checkIn ?? new Date().toISOString(),
        data.reservations.find((reservation) => reservation.hotelId === review.hotelId)?.checkOut ?? new Date().toISOString(),
      )),
      `${review.rating}/5`,
      review.comment,
      review.updatedAt,
      'Yanıtla',
    ])

    return {
      cards: [
        { accent: 'cyan', detail: 'Gerçek misafir yorumları', label: 'Yorum', value: String(data.reviews.length) },
        { accent: 'gold', detail: 'Yorumlardan hesaplandı', label: 'Ortalama Puan', value: data.reviews.length > 0 ? averageRating.toFixed(1) : '0' },
        { accent: 'white', detail: 'VIP işaretli rezervasyon kaydı', label: 'VIP Misafir', value: String(data.reservations.filter((reservation) => reservation.notes?.toLocaleLowerCase('tr-TR').includes('vip')).length) },
        { accent: 'cyan', detail: 'Cevap bekleyen yorum sistemi', label: 'Yanıt Bekleyen', value: String(data.reviews.length) },
      ],
      chartValues: buildChartValues([1, 2, 3, 4, 5].map((rating) => data.reviews.filter((review) => review.rating === rating).length)),
      emptyText: 'Henüz kayıt bulunmuyor.',
      feedItems: rows.map((row) => `${row[0]} • ${row[1]} • ${row[3]}`).slice(0, 6),
      headers: ['Misafir', 'Oda', 'Giriş Tarihi', 'Gece', 'Puan', 'Yorum', 'Tarih', 'İşlemler'],
      progressItems: [
        { detail: `${data.reviews.length} yorum`, label: 'Yorum Kapsamı', value: data.reviews.length > 0 ? 100 : 0 },
        { detail: `${data.reviews.filter((review) => review.rating >= 4).length} olumlu yorum`, label: 'Memnuniyet', value: percentageOf(data.reviews.filter((review) => review.rating >= 4).length, data.reviews.length) },
        { detail: `${data.conversations.length} misafir konuşması`, label: 'İletişim Sinyali', value: data.conversations.length > 0 ? 100 : 0 },
      ],
      rows,
      statusColumn: 1,
      subtitle: 'Yorum ve memnuniyet verileri yalnızca gerçek misafir kayıtlarından gelir',
      title: activeItem,
    }
  }

  return {
    cards: baseCards,
    chartValues: [0, 0, 0, 0],
    emptyText: 'Henüz kayıt bulunmuyor.',
    feedItems: [],
    headers: ['Kayıt', 'Açıklama', 'Durum'],
    progressItems: [
      { detail: 'Veri kaydı bekleniyor', label: 'Kayıt Durumu', value: 0 },
      { detail: 'İşlem yapılmadı', label: 'İşlem', value: 0 },
      { detail: 'Rapor üretilemedi', label: 'Rapor', value: 0 },
    ],
    rows: [],
    statusColumn: 2,
    subtitle: 'Seçili sayfa için kayıt bulunmuyor',
    title: activeItem,
  }
}

function OwnerManagementPage({
  activeItem,
  hotel,
  hotelCustomizations,
  hotels,
  setAdminHotelStatuses,
  setHotelCustomizations,
  setHotels,
  user,
}: {
  activeItem: string
  hotel: HotelRecord
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  setAdminHotelStatuses: Dispatch<SetStateAction<AdminHotelStatus[]>>
  setHotelCustomizations: Dispatch<SetStateAction<Record<string, HotelCustomization>>>
  setHotels: Dispatch<SetStateAction<HotelRecord[]>>
  user: AuthUser
}) {
  const pageType = getOwnerPageType(activeItem)
  const ownerHotel = hotel ?? hotels[0]
  const ownerHotelIndex = Math.max(hotels.findIndex((hotel) => hotel.id === ownerHotel.id), 0)
  const [allReservations, setAllReservations] = usePersistentState<GuestReservation[]>(
    GUEST_RESERVATIONS_STORAGE_KEY,
    getAllGuestReservations(),
  )
  const ownerRooms = getHotelRooms(ownerHotel, ownerHotelIndex, hotelCustomizations)
  const ownerReservations = allReservations.filter((reservation) => idsMatch(reservation.hotelId, ownerHotel.id))
  const ownerPolicies = getHotelPolicies(ownerHotel, hotelCustomizations)
  const ownerNearbyPlaces = getHotelNearbyPlaces(ownerHotel, ownerHotelIndex, hotelCustomizations)
  const ownerContact = getHotelContact(ownerHotel, hotelCustomizations)
  const addPendingHotel = (hotelRecord: HotelRecord, customization: HotelCustomization) => {
    setHotels((current) => {
      const nextHotels = current.some((hotel) => hotel.id === hotelRecord.id)
        ? current.map((hotel) => hotel.id === hotelRecord.id ? hotelRecord : hotel)
        : [...current, hotelRecord]
      const storedCustomHotels = readStoredValue<HotelRecord[]>(CUSTOM_HOTELS_STORAGE_KEY, [])
      const nextStoredCustomHotels = storedCustomHotels.some((hotel) => hotel.id === hotelRecord.id)
        ? storedCustomHotels.map((hotel) => hotel.id === hotelRecord.id ? hotelRecord : hotel)
        : [...storedCustomHotels, hotelRecord]

      writeStoredValue(CUSTOM_HOTELS_STORAGE_KEY, nextStoredCustomHotels)
      return nextHotels
    })
    setHotelCustomizations((current) => ({
      ...current,
      [hotelRecord.id]: customization,
    }))
    setAdminHotelStatuses((current) => [
      {
        hotelId: hotelRecord.id,
        reason: 'Otel sahibi yeni tesis başvurusu oluşturdu.',
        status: 'Onay Bekliyor',
        updatedAt: formatDateTime(new Date()),
        updatedBy: user.email,
      },
      ...current.filter((record) => record.hotelId !== hotelRecord.id),
    ])

    const ownerAccounts = getStoredOwnerAccounts(hotels).map((account) => {
      const isCurrentOwner = normalizeSearch(account.username) === normalizeSearch(user.username ?? '')
        || normalizeSearch(account.email ?? '') === normalizeSearch(user.email)

      if (!isCurrentOwner) {
        return account
      }

      return {
        ...account,
        hotelId: account.hotelId || hotelRecord.id,
        hotelIds: Array.from(new Set([...(account.hotelIds ?? []), hotelRecord.id])),
      }
    })

    writeStoredValue(OWNER_ACCOUNTS_STORAGE_KEY, ownerAccounts)
  }
  const updateOwnerHotel = (patch: HotelCustomization) => {
    setHotelCustomizations((current) => {
      const existing = current[ownerHotel.id] ?? {}
      const baseContent: HotelCustomization = {
        contact: existing.contact ?? getHotelContact(ownerHotel, current),
        description: existing.description ?? ownerHotel.description,
        galleryImages: existing.galleryImages ?? [],
        nearbyPlaces: existing.nearbyPlaces ?? getHotelNearbyPlaces(ownerHotel, ownerHotelIndex, current),
        policies: existing.policies ?? getHotelPolicies(ownerHotel, current),
        rooms: existing.rooms ?? getHotelRooms(ownerHotel, ownerHotelIndex, current),
        services: existing.services ?? ['Spa', 'Oda servisi', 'Hızlı check-in'],
        socialMedia: existing.socialMedia ?? {},
      }

      return {
        ...current,
        [ownerHotel.id]: {
          ...baseContent,
          ...patch,
        },
      }
    })
  }

  return (
    <section className="owner-management-page">
      <article className="owner-page-hero glass-panel wide">
        <div>
          <span>Otel sahibi operasyon ekranı</span>
          <h2>{activeItem}</h2>
          <p>{ownerPageDescription(pageType)}</p>
        </div>
      </article>

      {pageType === 'room' ? <RoomManagementWorkflow rooms={ownerRooms} onRoomsChange={(rooms) => updateOwnerHotel({ rooms })} /> : null}
      {pageType === 'price' ? <PriceManagementWorkflow rooms={ownerRooms} onRoomsChange={(rooms) => updateOwnerHotel({ rooms })} /> : null}
      {pageType === 'reservation' ? <ReservationManagementWorkflow activeItem={activeItem} hotel={ownerHotel} reservations={ownerReservations} setReservations={setAllReservations} /> : null}
      {pageType === 'gallery' ? <GalleryManagementWorkflow activeItem={activeItem} rooms={ownerRooms} onRoomsChange={(rooms) => updateOwnerHotel({ rooms })} /> : null}
      {pageType === 'addHotel' ? <OwnerHotelCreateWorkflow onCreateHotel={addPendingHotel} /> : null}
      {pageType === 'settings' ? (
        <HotelSettingsWorkflow
          activeItem={activeItem}
          contact={ownerContact}
          description={hotelCustomizations[ownerHotel.id]?.description ?? ownerHotel.description}
          galleryImages={hotelCustomizations[ownerHotel.id]?.galleryImages ?? []}
          nearbyPlaces={ownerNearbyPlaces}
          policies={ownerPolicies}
          services={hotelCustomizations[ownerHotel.id]?.services ?? ['Spa', 'Oda servisi', 'Hızlı check-in']}
          socialMedia={hotelCustomizations[ownerHotel.id]?.socialMedia ?? {}}
          onUpdate={updateOwnerHotel}
        />
      ) : null}
    </section>
  )
}

function OwnerHotelCreateWorkflow({
  onCreateHotel,
}: {
  onCreateHotel: (hotel: HotelRecord, customization: HotelCustomization) => void
}) {
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const [notice, setNotice] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [draft, setDraft] = useState({
    address: '',
    airportTransfer: 'Var',
    breakfastIncluded: 'Evet',
    cancellationPolicy: 'Girişten 48 saat öncesine kadar ücretsiz iptal.',
    campaignSupport: 'Evet',
    checkIn: '14:00',
    checkOut: '12:00',
    city: '',
    description: '',
    district: '',
    email: '',
    hotelType: 'Butik Otel',
    mapLocation: '',
    name: '',
    nearbyPlaces: 'Metro - 650 m - Ulaşım noktası\nSahil - 900 m - Yürüyüş alanı',
    parkingInfo: 'Vale ve kapalı otopark mevcut.',
    petPolicy: 'Evcil hayvan politikası tesise göre değerlendirilir.',
    phone: '',
    policies: 'Check-in 14:00 sonrası\nCheck-out 12:00 öncesi\nKimlik ibrazı zorunludur',
    premium: 'Evet',
    roomStocks: 'Deluxe Deniz Manzaralı Oda | Deluxe | 2 | King yatak | 5 | 6870\nPanoramik Köşe Süit | Süit | 3 | King + kanepe | 3 | 9250',
    services: 'Spa\nOda servisi\nHızlı check-in\nRestoran\nHavalimanı transferi',
    smokingPolicy: 'Kapalı alanlarda sigara içilmez.',
    socialFacebook: '',
    socialInstagram: '',
    socialTiktok: '',
    socialWebsite: '',
    socialX: '',
    starRating: 5,
    startPrice: 5200,
    taxInfo: '',
    website: '',
  })
  const updateDraft = (field: keyof typeof draft, value: string | number) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setNotice('')
  }
  const uploadCover = async (files: FileList | null) => {
    const file = files?.[0]

    if (!file) {
      return
    }

    setCoverImage(await fileToDataUrl(file))
  }
  const uploadGallery = async (files: FileList | null) => {
    if (!files?.length) {
      return
    }

    const images = await Promise.all(Array.from(files).map(fileToDataUrl))
    setGalleryImages((current) => [...current, ...images])
  }
  const createRooms = (hotelId: string) => {
    const lines = draft.roomStocks.split('\n').map((line) => line.trim()).filter(Boolean)

    return lines.map((line, index) => {
      const [name, type, capacity, bedType, stock, price] = line.split('|').map((item) => item.trim())
      const room = createEmptyOwnerRoom(index)

      return {
        ...room,
        available: Math.max(Number(stock || room.available), 0),
        bedType: bedType || room.bedType,
        capacity: Math.max(Number(capacity || room.capacity), 1),
        features: ['Hızlı Wi-Fi', 'Premium banyo', draft.breakfastIncluded === 'Evet' ? 'Kahvaltı dahil' : 'Kahvaltı opsiyonel'],
        id: `${hotelId}-room-${index + 1}`,
        imageClass: roomImageOptions[index % roomImageOptions.length],
        name: name || `Oda ${index + 1}`,
        price: Math.max(normalizeRevenueAmount(parseStoredMoney(price || draft.startPrice)), 0),
        type: type || room.type,
      }
    })
  }
  const createNearbyPlaces = () =>
    draft.nearbyPlaces.split('\n').map((line, index) => {
      const [name, distance, note] = line.split('-').map((item) => item.trim())

      return {
        distance: distance || '1,0 km',
        id: `nearby-new-${Date.now()}-${index}`,
        name: name || `Yakın nokta ${index + 1}`,
        note: note || 'Yakın çevre',
        type: normalizeSearch(note || name || '').includes('metro') ? 'metro' : normalizeSearch(note || name || '').includes('sahil') ? 'sahil' : 'restoran',
        x: `${32 + index * 12}%`,
        y: `${36 + index * 8}%`,
      }
    })
  const submitHotel = () => {
    if (!draft.name.trim() || !draft.description.trim() || !draft.city.trim() || !draft.address.trim() || !draft.phone.trim() || !draft.email.trim()) {
      setNotice('Otel adı, açıklama, şehir, açık adres, telefon ve e-posta zorunludur.')
      return
    }

    const hotelId = `hotel-owner-${Date.now()}`
    const nextHotel: HotelRecord = {
      address: draft.address.trim(),
      city: draft.city.trim(),
      country: 'Türkiye',
      description: draft.description.trim(),
      district: draft.district.trim(),
      id: hotelId,
      isActive: false,
      name: draft.name.trim(),
      starRating: Number(draft.starRating) || 5,
    }
    const customization: HotelCustomization = {
      contact: {
        address: draft.address.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        responseTime: 'ortalama 6 dakika',
      },
      description: [
        draft.description.trim(),
        `Otel tipi: ${draft.hotelType}`,
        `Vergi bilgisi: ${draft.taxInfo || 'Kayıt bekliyor'}`,
        `Harita konumu: ${draft.mapLocation || 'Konum yönetimi bekliyor'}`,
      ].join('\n'),
      galleryImages: [coverImage, ...galleryImages].filter(Boolean),
      nearbyPlaces: createNearbyPlaces(),
      policies: [
        `Check-in: ${draft.checkIn}`,
        `Check-out: ${draft.checkOut}`,
        ...draft.policies.split('\n').map((item) => item.trim()).filter(Boolean),
        `İptal politikası: ${draft.cancellationPolicy}`,
        `Evcil hayvan: ${draft.petPolicy}`,
        `Sigara: ${draft.smokingPolicy}`,
        `Otopark: ${draft.parkingInfo}`,
        `Havalimanı transferi: ${draft.airportTransfer}`,
        `Kahvaltı dahil mi: ${draft.breakfastIncluded}`,
        `Premium tesis: ${draft.premium}`,
        `Kampanya desteği: ${draft.campaignSupport}`,
      ],
      rooms: createRooms(hotelId),
      services: draft.services.split('\n').map((item) => item.trim()).filter(Boolean),
      socialMedia: {
        facebook: draft.socialFacebook,
        instagram: draft.socialInstagram,
        tiktok: draft.socialTiktok,
        website: draft.socialWebsite || draft.website,
        x: draft.socialX,
      },
    }

    onCreateHotel(nextHotel, customization)
    setNotice('Otel başvurusu Onay Bekleyen Oteller statüsüne gönderildi.')
    setDraft((current) => ({
      ...current,
      address: '',
      city: '',
      description: '',
      district: '',
      email: '',
      name: '',
      phone: '',
      website: '',
    }))
    setCoverImage('')
    setGalleryImages([])
  }

  return (
    <div className="owner-management-grid owner-hotel-create-grid">
      <article className="glass-panel wide admin-inline-form">
        <PanelHeader icon={<Hotel size={18} />} title="Otel Ekle" subtitle="Yeni tesis başvurusu yönetici onayından sonra aktifleşir." />
        <div className="management-form two-column">
          <label><span>Otel adı</span><input value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
          <label><span>Otel tipi</span><select value={draft.hotelType} onChange={(event) => updateDraft('hotelType', event.target.value)}><option>Butik Otel</option><option>Resort</option><option>Şehir Oteli</option><option>Apart Otel</option><option>Termal Otel</option></select></label>
          <label><span>Şehir</span><input value={draft.city} onChange={(event) => updateDraft('city', event.target.value)} /></label>
          <label><span>İlçe</span><input value={draft.district} onChange={(event) => updateDraft('district', event.target.value)} /></label>
          <label className="span-two"><span>Açık adres</span><input value={draft.address} onChange={(event) => updateDraft('address', event.target.value)} /></label>
          <label><span>Telefon</span><input value={draft.phone} onChange={(event) => updateDraft('phone', event.target.value)} /></label>
          <label><span>E-posta</span><input value={draft.email} type="email" onChange={(event) => updateDraft('email', event.target.value)} /></label>
          <label><span>Website</span><input value={draft.website} onChange={(event) => updateDraft('website', event.target.value)} /></label>
          <label><span>Yıldız sayısı</span><input inputMode="numeric" maxLength={1} value={editableNumberValue(draft.starRating)} onChange={(event) => updateDraft('starRating', event.target.value === '' ? 0 : Number(event.target.value))} /></label>
          <label><span>Check-in saati</span><input type="time" value={draft.checkIn} onChange={(event) => updateDraft('checkIn', event.target.value)} /></label>
          <label><span>Check-out saati</span><input type="time" value={draft.checkOut} onChange={(event) => updateDraft('checkOut', event.target.value)} /></label>
          <label><span>Başlangıç fiyatı</span><input inputMode="decimal" value={editableNumberValue(draft.startPrice)} onChange={(event) => updateDraft('startPrice', event.target.value === '' ? 0 : Number(event.target.value))} /></label>
          <label><span>Vergi bilgileri</span><input value={draft.taxInfo} onChange={(event) => updateDraft('taxInfo', event.target.value)} /></label>
          <label><span>Harita konumu</span><input value={draft.mapLocation} onChange={(event) => updateDraft('mapLocation', event.target.value)} /></label>
          <label><span>Premium tesis mi</span><select value={draft.premium} onChange={(event) => updateDraft('premium', event.target.value)}><option>Evet</option><option>Hayır</option></select></label>
          <label><span>Kampanya desteği</span><select value={draft.campaignSupport} onChange={(event) => updateDraft('campaignSupport', event.target.value)}><option>Evet</option><option>Hayır</option></select></label>
          <label><span>Havalimanı transferi</span><select value={draft.airportTransfer} onChange={(event) => updateDraft('airportTransfer', event.target.value)}><option>Var</option><option>Yok</option></select></label>
          <label><span>Kahvaltı dahil mi</span><select value={draft.breakfastIncluded} onChange={(event) => updateDraft('breakfastIncluded', event.target.value)}><option>Evet</option><option>Hayır</option></select></label>
          <label className="span-two"><span>Açıklama</span><textarea value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} /></label>
          <label><span>Hizmetler</span><textarea value={draft.services} onChange={(event) => updateDraft('services', event.target.value)} /></label>
          <label><span>Politikalar</span><textarea value={draft.policies} onChange={(event) => updateDraft('policies', event.target.value)} /></label>
          <label><span>Yakındaki yerler</span><textarea value={draft.nearbyPlaces} onChange={(event) => updateDraft('nearbyPlaces', event.target.value)} /></label>
          <label><span>Oda tipleri / stokları</span><textarea value={draft.roomStocks} onChange={(event) => updateDraft('roomStocks', event.target.value)} /></label>
          <label><span>İptal politikası</span><textarea value={draft.cancellationPolicy} onChange={(event) => updateDraft('cancellationPolicy', event.target.value)} /></label>
          <label><span>Evcil hayvan politikası</span><textarea value={draft.petPolicy} onChange={(event) => updateDraft('petPolicy', event.target.value)} /></label>
          <label><span>Sigara politikası</span><textarea value={draft.smokingPolicy} onChange={(event) => updateDraft('smokingPolicy', event.target.value)} /></label>
          <label><span>Otopark bilgisi</span><textarea value={draft.parkingInfo} onChange={(event) => updateDraft('parkingInfo', event.target.value)} /></label>
          <label><span>Instagram</span><input value={draft.socialInstagram} onChange={(event) => updateDraft('socialInstagram', event.target.value)} /></label>
          <label><span>X/Twitter</span><input value={draft.socialX} onChange={(event) => updateDraft('socialX', event.target.value)} /></label>
          <label><span>Facebook</span><input value={draft.socialFacebook} onChange={(event) => updateDraft('socialFacebook', event.target.value)} /></label>
          <label><span>TikTok</span><input value={draft.socialTiktok} onChange={(event) => updateDraft('socialTiktok', event.target.value)} /></label>
        </div>
        {notice ? <p className={`security-inline-alert ${notice.includes('gönderildi') ? 'success' : 'error'}`}>{notice}</p> : null}
        <div className="table-action-row">
          <button type="button" onClick={submitHotel}>Onaya Gönder</button>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Camera size={18} />} title="Kapak ve Galeri" subtitle="Bilgisayardan kapak ve çoklu galeri görseli yükle" />
        <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={(event) => { void uploadCover(event.target.files); event.target.value = '' }} />
        <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => { void uploadGallery(event.target.files); event.target.value = '' }} />
        <div className="owner-upload-preview">
          {coverImage ? <div className="gallery-tile uploaded-gallery-tile" style={{ '--uploaded-image': `url(${coverImage})` } as CSSProperties}><strong>Kapak görseli</strong></div> : <EmptyState text="Kapak görseli seçilmedi." compact />}
          <div className="table-action-row">
            <button type="button" onClick={() => coverInputRef.current?.click()}>Kapak Görseli Seç</button>
            <button type="button" onClick={() => galleryInputRef.current?.click()}>Galeri Görselleri Seç</button>
          </div>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div className="gallery-tile uploaded-gallery-tile" key={`${image}-${index}`} style={{ '--uploaded-image': `url(${image})` } as CSSProperties}>
              <span>{index + 1}</span>
              <strong>Galeri</strong>
              <button type="button" onClick={() => setGalleryImages((current) => current.filter((item) => item !== image))}>Sil</button>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function RoomManagementWorkflow({
  onRoomsChange,
  rooms,
}: {
  onRoomsChange: (rooms: RoomOption[]) => void
  rooms: RoomOption[]
}) {
  const firstRoom = rooms[0] ?? createEmptyOwnerRoom(0)
  const [selectedRoomId, setSelectedRoomId] = useState(firstRoom.id)
  const [draftRoom, setDraftRoom] = useState<RoomOption>(firstRoom)
  const roomImageInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const selectedStillExists = rooms.some((room) => room.id === selectedRoomId)

    if (!selectedStillExists) {
      const nextRoom = rooms[0] ?? createEmptyOwnerRoom(0)
      setSelectedRoomId(nextRoom.id)
      setDraftRoom(nextRoom)
    }
  }, [rooms, selectedRoomId])

  const selectRoom = (room: RoomOption) => {
    setSelectedRoomId(room.id)
    setDraftRoom(room)
  }
  const updateDraft = <K extends keyof RoomOption>(field: K, value: RoomOption[K]) => {
    setDraftRoom((current) => ({ ...current, [field]: value }))
  }
  const saveRoom = () => {
    const normalizedRoom = {
      ...draftRoom,
      features: draftRoom.features.length > 0 ? draftRoom.features : ['Premium oda', 'Hızlı Wi-Fi'],
      id: draftRoom.id || `owner-room-${rooms.length + 1}`,
    }
    const exists = rooms.some((room) => room.id === normalizedRoom.id)
    const nextRooms = exists
      ? rooms.map((room) => room.id === normalizedRoom.id ? normalizedRoom : room)
      : [...rooms, normalizedRoom]

    onRoomsChange(nextRooms)
    setSelectedRoomId(normalizedRoom.id)
    setDraftRoom(normalizedRoom)
  }
  const addRoom = () => {
    const nextRoom = createEmptyOwnerRoom(rooms.length + 1)

    setSelectedRoomId(nextRoom.id)
    setDraftRoom(nextRoom)
  }
  const deleteRoom = () => {
    const nextRooms = rooms.filter((room) => room.id !== selectedRoomId)
    const nextSelectedRoom = nextRooms[0] ?? createEmptyOwnerRoom(0)

    onRoomsChange(nextRooms)
    setSelectedRoomId(nextSelectedRoom.id)
    setDraftRoom(nextSelectedRoom)
  }
  const uploadRoomImages = async (files: FileList | null) => {
    if (!files?.length) {
      return
    }

    const images = await Promise.all(Array.from(files).map(fileToDataUrl))
    const updatedRoom = {
      ...draftRoom,
      uploadedImages: [...(draftRoom.uploadedImages ?? []), ...images],
    }

    setDraftRoom(updatedRoom)
    onRoomsChange(rooms.some((room) => room.id === updatedRoom.id)
      ? rooms.map((room) => room.id === updatedRoom.id ? updatedRoom : room)
      : [...rooms, updatedRoom])
  }
  const removeUploadedRoomImage = (image: string) => {
    const updatedRoom = {
      ...draftRoom,
      uploadedImages: (draftRoom.uploadedImages ?? []).filter((item) => item !== image),
    }

    setDraftRoom(updatedRoom)
    onRoomsChange(rooms.map((room) => room.id === updatedRoom.id ? updatedRoom : room))
  }

  return (
    <div className="owner-management-grid">
      <article className="glass-panel wide">
        <PanelHeader icon={<BedDouble size={18} />} title="Oda Envanteri" subtitle="Ekleme, düzenleme, silme ve kapasite yönetimi" />
        <div className="owner-room-list">
          {rooms.map((room) => (
            <button className={room.id === selectedRoomId ? 'active' : ''} key={room.id} type="button" onClick={() => selectRoom(room)}>
              <span className={room.imageClass}></span>
              <strong>{room.name}</strong>
              <small>{room.type} • {room.capacity} kişi • {room.available} stok</small>
              <em>İncele</em>
            </button>
          ))}
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<ClipboardList size={18} />} title="Oda Detayı" subtitle="Görsel, açıklama, kapasite ve özellik seçimi" />
        <div className="management-form">
          <label><span>Oda adı</span><input value={draftRoom.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
          <label><span>Oda tipi</span><select value={draftRoom.type} onChange={(event) => updateDraft('type', event.target.value)}><option>Deluxe</option><option>Süit</option><option>Premium</option><option>Aile</option><option>Executive</option><option>Superior</option></select></label>
          <label><span>Kapasite</span><input value={editableNumberValue(draftRoom.capacity)} inputMode="numeric" onChange={(event) => updateDraft('capacity', event.target.value === '' ? 0 : Number(event.target.value))} /></label>
          <label><span>Yatak tipi</span><input value={draftRoom.bedType} onChange={(event) => updateDraft('bedType', event.target.value)} /></label>
          <label><span>Stok adedi</span><input value={editableNumberValue(draftRoom.available)} inputMode="numeric" onChange={(event) => updateDraft('available', event.target.value === '' ? 0 : Number(event.target.value))} /></label>
          <label><span>Oda görseli</span><select value={draftRoom.imageClass} onChange={(event) => updateDraft('imageClass', event.target.value)}>{roomImageOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label><span>Oda özellikleri</span><textarea value={draftRoom.features.join(', ')} onChange={(event) => updateDraft('features', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></label>
          <div className="owner-form-actions">
            <button type="button" onClick={addRoom}>Yeni Oda</button>
            <button type="button" onClick={saveRoom}>Odayı Kaydet</button>
            <button type="button" onClick={deleteRoom}>Odayı Sil</button>
          </div>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Camera size={18} />} title="Oda Fotoğrafları" subtitle="Görseller bu detay ekranından yönetilir; fiyat Fiyat Yönetimi sayfasındadır." />
        <div className="gallery-grid">
          {(draftRoom.uploadedImages ?? []).map((image, index) => (
            <div
              className="gallery-tile uploaded-gallery-tile"
              key={`${image}-${index}`}
              style={{ '--uploaded-image': `url(${image})` } as CSSProperties}
            >
              <span>{index + 1}</span>
              <strong>{draftRoom.name}</strong>
              <button type="button" onClick={() => removeUploadedRoomImage(image)}>Görsel Sil</button>
            </div>
          ))}
          <div className="gallery-tile">
            <span>{(draftRoom.uploadedImages ?? []).length + 1}</span>
            <strong>{draftRoom.name}</strong>
            <small>{draftRoom.imageClass}</small>
          </div>
        </div>
        <input
          ref={roomImageInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            void uploadRoomImages(event.target.files)
            event.target.value = ''
          }}
        />
        <div className="owner-form-actions">
          <button type="button" onClick={() => roomImageInputRef.current?.click()}>Görsel Ekle</button>
          <button type="button" onClick={saveRoom}>Görselleri Kaydet</button>
          <button type="button" onClick={() => updateDraft('imageClass', roomImageOptions[(roomImageOptions.indexOf(draftRoom.imageClass) + 1) % roomImageOptions.length])}>Hazır Görsel Değiştir</button>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Sparkles size={18} />} title="Oda Özellikleri" subtitle="Seçilebilir tesis özellikleri" />
        <div className="feature-chip-grid">
          {['Deniz manzarası', 'King yatak', 'Balkon', 'Mini bar', 'Akıllı kilit', 'Jakuzi', 'Sessiz kat', 'Çalışma masası'].map((feature) => (
            <button
              className={draftRoom.features.includes(feature) ? 'active' : ''}
              key={feature}
              type="button"
              onClick={() => updateDraft('features', draftRoom.features.includes(feature)
                ? draftRoom.features.filter((item) => item !== feature)
                : [...draftRoom.features, feature])}
            >
              {feature}
            </button>
          ))}
        </div>
      </article>
    </div>
  )
}

function PriceManagementWorkflow({
  onRoomsChange,
  rooms,
}: {
  onRoomsChange: (rooms: RoomOption[]) => void
  rooms: RoomOption[]
}) {
  const [draftRooms, setDraftRooms] = useState<RoomOption[]>(rooms)
  const [dirtyRoomIds, setDirtyRoomIds] = useState<string[]>([])
  const [savedRoomId, setSavedRoomId] = useState<string | null>(null)

  useEffect(() => {
    setDraftRooms((currentDrafts) =>
      rooms.map((room) =>
        dirtyRoomIds.includes(room.id)
          ? currentDrafts.find((draft) => draft.id === room.id) ?? room
          : room,
      ),
    )
  }, [dirtyRoomIds, rooms])

  useEffect(() => {
    if (!savedRoomId) {
      return undefined
    }

    const timer = window.setTimeout(() => setSavedRoomId(null), 2200)

    return () => window.clearTimeout(timer)
  }, [savedRoomId])

  const updateRoomPricing = <K extends keyof RoomOption>(roomId: string, field: K, value: RoomOption[K]) => {
    setDraftRooms((currentRooms) => currentRooms.map((room) => {
      if (room.id !== roomId) {
        return room
      }

      const updatedRoom = { ...room, [field]: value }

      if (field === 'price' || field === 'seasonMultiplier') {
        const basePrice = field === 'price' ? Number(value) : updatedRoom.price
        const multiplier = field === 'seasonMultiplier' ? Number(value) : (updatedRoom.seasonMultiplier ?? 1.25)

        return {
          ...updatedRoom,
          seasonPrice: Math.round(basePrice * multiplier),
        }
      }

      return updatedRoom
    }))

    setDirtyRoomIds((current) => current.includes(roomId) ? current : [...current, roomId])
    setSavedRoomId(null)
  }
  const saveRoomPricing = (roomId: string) => {
    const draftRoom = draftRooms.find((room) => room.id === roomId)

    if (!draftRoom) {
      return
    }

    const normalizedRoom = {
      ...draftRoom,
      minimumNights: Math.max(Number(draftRoom.minimumNights || 1), 1),
      price: Math.max(Number(draftRoom.price || 0), 0),
      seasonMultiplier: Math.max(Number(draftRoom.seasonMultiplier || 1), 0),
      seasonPrice: Math.round(Math.max(Number(draftRoom.price || 0), 0) * Math.max(Number(draftRoom.seasonMultiplier || 1), 0)),
      specialDayPrice: Math.max(Number(draftRoom.specialDayPrice || draftRoom.price || 0), 0),
      weekendMultiplier: Math.max(Number(draftRoom.weekendMultiplier || 1), 0),
    }

    onRoomsChange(rooms.map((room) => room.id === roomId ? normalizedRoom : room))
    setDraftRooms((current) => current.map((room) => room.id === roomId ? normalizedRoom : room))
    setDirtyRoomIds((current) => current.filter((id) => id !== roomId))
    setSavedRoomId(roomId)
  }

  return (
    <div className="owner-management-grid owner-price-management-grid">
      <article className="glass-panel wide">
        <PanelHeader icon={<TrendingUp size={18} />} title="Fiyat Yönetimi" subtitle="Temel fiyat, sezon çarpanı ve hafta sonu çarpanı oda bazında yönetilir." />
        {rooms.length > 0 ? (
          <div className="owner-price-graph-grid">
            {rooms.map((room) => {
              const seasonMultiplier = room.seasonMultiplier ?? 1.25
              const weekendMultiplier = room.weekendMultiplier ?? 1.18
              const computedSeasonPrice = Math.round(room.price * seasonMultiplier)

              return (
                <div className="price-analytics-card" key={`price-graph-${room.id}`}>
                  <div className="price-analytics-title">
                    <strong>{room.name}</strong>
                  </div>
                  <div className="price-analytics-value">
                    <strong>{formatCurrency(room.price)}</strong>
                    <span>temel fiyat</span>
                  </div>
                  <div className="price-mini-bars" aria-hidden="true">
                    <span style={{ '--value': `${Math.min(100, (room.price / Math.max(computedSeasonPrice, 1)) * 100)}%` } as CSSProperties}></span>
                    <span style={{ '--value': `${Math.min(100, seasonMultiplier * 48)}%` } as CSSProperties}></span>
                    <span style={{ '--value': `${Math.min(100, weekendMultiplier * 52)}%` } as CSSProperties}></span>
                  </div>
                  <div className="price-analytics-meta">
                    <span>Sezon: {formatCurrency(computedSeasonPrice)}</span>
                    <span>Hafta sonu x{weekendMultiplier}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : <EmptyState text="Henüz grafik oluşturacak oda fiyatı bulunmuyor." compact />}
      </article>
      {draftRooms.map((room) => {
        const isDirty = dirtyRoomIds.includes(room.id)
        const computedSeasonPrice = Math.round(room.price * (room.seasonMultiplier ?? 1.25))

        return (
        <article className="glass-panel wide owner-price-card" key={`price-detail-${room.id}`}>
          <PanelHeader icon={<WalletCards size={18} />} title={`${room.name} • Fiyatı Düzenle`} subtitle="Bu oda satırındaki değişiklikler yalnızca kendi Kaydet düğmesiyle uygulanır." />
          <div className="price-derived-card">
            <span>Otomatik sezon fiyatı</span>
            <strong>{formatCurrency(computedSeasonPrice)}</strong>
            <p>Temel fiyat × sezon çarpanı ile hesaplanır; elle girilmez.</p>
          </div>
          <div className="management-form two-column owner-price-list">
            <label><span>Temel fiyat</span><input value={editableNumberValue(room.price)} inputMode="decimal" onChange={(event) => updateRoomPricing(room.id, 'price', (event.target.value === '' ? 0 : Number(event.target.value)) as RoomOption['price'])} /></label>
            <label><span>Sezon başlangıcı (AA-GG)</span><input value={room.seasonStart ?? ''} inputMode="numeric" placeholder="06-01" onChange={(event) => updateRoomPricing(room.id, 'seasonStart', event.target.value)} /></label>
            <label><span>Sezon bitişi (AA-GG)</span><input value={room.seasonEnd ?? ''} inputMode="numeric" placeholder="09-15" onChange={(event) => updateRoomPricing(room.id, 'seasonEnd', event.target.value)} /></label>
            <label><span>Hafta sonu çarpanı</span><input value={editableNumberValue(room.weekendMultiplier ?? 1.18)} inputMode="decimal" onChange={(event) => updateRoomPricing(room.id, 'weekendMultiplier', (event.target.value === '' ? 0 : Number(event.target.value)) as RoomOption['weekendMultiplier'])} /></label>
            <label><span>Sezon çarpanı</span><input value={editableNumberValue(room.seasonMultiplier ?? 1.25)} inputMode="decimal" onChange={(event) => updateRoomPricing(room.id, 'seasonMultiplier', (event.target.value === '' ? 0 : Number(event.target.value)) as RoomOption['seasonMultiplier'])} /></label>
            <label><span>Özel gün fiyatı</span><input value={editableNumberValue(room.specialDayPrice ?? room.price)} inputMode="decimal" onChange={(event) => updateRoomPricing(room.id, 'specialDayPrice', (event.target.value === '' ? 0 : Number(event.target.value)) as RoomOption['specialDayPrice'])} /></label>
            <label><span>Minimum gece şartı</span><input value={editableNumberValue(room.minimumNights ?? 1)} inputMode="numeric" onChange={(event) => updateRoomPricing(room.id, 'minimumNights', (event.target.value === '' ? 0 : Number(event.target.value)) as RoomOption['minimumNights'])} /></label>
          </div>
          <div className="owner-price-row-actions">
            {savedRoomId === room.id ? <span className="security-inline-alert success">Fiyat bilgileri kaydedildi.</span> : null}
            <button type="button" onClick={() => saveRoomPricing(room.id)} disabled={!isDirty}>
              {isDirty ? 'Kaydet' : 'Kaydedildi'}
            </button>
          </div>
        </article>
        )
      })}
    </div>
  )
}

function ReservationManagementWorkflow({
  activeItem,
  hotel,
  reservations,
  setReservations,
}: {
  activeItem: string
  hotel: HotelRecord
  reservations: GuestReservation[]
  setReservations: Dispatch<SetStateAction<GuestReservation[]>>
}) {
  const [cancelDraft, setCancelDraft] = useState<{ reason: string; reservationId: string } | null>(null)
  const activeReservations = reservations.filter(isActiveReservationRecord)
  const cancelledByGuest = reservations.filter((reservation) => isCancelledReservationRecord(reservation) && reservation.cancelledBy !== 'Otel Sahibi')
  const cancelledByOwner = reservations.filter((reservation) => isCancelledReservationRecord(reservation) && reservation.cancelledBy === 'Otel Sahibi')
  const cancelReservation = () => {
    if (!cancelDraft?.reason.trim()) {
      return
    }

    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === cancelDraft.reservationId
          ? {
              ...reservation,
              cancellationReason: cancelDraft.reason.trim(),
              cancelledAt: formatDateTime(new Date()),
              cancelledBy: 'Otel Sahibi',
              reservationStatus: 'İptal Edildi',
              status: 'İptal Edildi',
            }
          : reservation,
      ),
    )
    setCancelDraft(null)
  }
  const activeRows = activeReservations.map((reservation) => [
    reservation.code,
    reservation.guestName ?? 'Misafir',
    reservation.roomType ?? reservation.roomName,
    `${reservation.checkIn} / ${reservation.checkOut}`,
    formatCurrency(normalizeRevenueAmount(reservation.baseRoomPrice ?? reservation.basePrice ?? 0)),
    `${reservation.nightCount ?? calculateNights(reservation.checkIn, reservation.checkOut)} gece`,
    `${reservation.roomCount ?? 1} oda`,
    reservation.selectedPaidExtras?.length
      ? reservation.selectedPaidExtras.map((extra) => extra.extraName).join(', ')
      : 'Yok',
    formatCurrency(reservation.paidExtraTotal ?? 0),
    formatCurrency(getReservationTotal(reservation)),
    reservation.paymentStatus,
    getReservationStatus(reservation),
    'Rezervasyonu İptal Et',
  ])
  const cancellationRows = (source: GuestReservation[]) => source.map((reservation) => [
    reservation.code,
    reservation.guestName ?? 'Misafir',
    reservation.roomType ?? reservation.roomName,
    hotel.name,
    reservation.cancellationReason ?? 'Neden kaydı yok',
    reservation.cancelledAt ?? '-',
  ])

  return (
    <div className="owner-management-grid">
      {activeItem === 'Aktif Rezervasyonlar' || activeItem === 'Rezervasyon Yönetimi' ? (
        <article className="glass-panel wide">
          <PanelHeader icon={<CalendarCheck size={18} />} title="Aktif Rezervasyonlar" subtitle="Misafir panelinden gelen aktif rezervasyonlar bu tabloya düşer." />
          {activeRows.length > 0 ? (
            <AdminRecordTable
              emptyText="Henüz kayıt bulunmuyor."
              headers={['Rezervasyon', 'Müşteri', 'Oda', 'Tarih', 'Oda fiyatı', 'Gece', 'Oda sayısı', 'Ekstralar', 'Ekstra toplam', 'Genel toplam', 'Ödeme', 'Durum', 'İşlemler']}
              rows={activeRows}
              statusColumn={11}
              onAction={(_, row) => {
                const reservation = activeReservations.find((item) => item.code === row[0])
                if (reservation) {
                  setCancelDraft({ reason: '', reservationId: reservation.id })
                }
              }}
            />
          ) : <EmptyState text="Henüz kayıt bulunmuyor." />}
        </article>
      ) : null}
      {activeItem === 'İptal Edilen Rezervasyonlar' || activeItem === 'Rezervasyon Yönetimi' ? (
        <>
          <article className="glass-panel wide">
            <PanelHeader icon={<CircleAlert size={18} />} title="Misafir tarafından iptal edilenler" subtitle="Misafir aksiyonları ve kayıtlı nedenler" />
            {cancelledByGuest.length > 0 ? <EnterpriseTable headers={['Rezervasyon', 'Müşteri', 'Oda', 'Otel', 'Neden', 'Tarih']} rows={cancellationRows(cancelledByGuest)} /> : <EmptyState text="Henüz kayıt bulunmuyor." />}
          </article>
          <article className="glass-panel wide">
            <PanelHeader icon={<ShieldCheck size={18} />} title="Otel sahibi tarafından iptal edilenler" subtitle="Zorunlu açıklama ile iptal edilen rezervasyonlar" />
            {cancelledByOwner.length > 0 ? <EnterpriseTable headers={['Rezervasyon', 'Müşteri', 'Oda', 'Otel', 'Neden', 'Tarih']} rows={cancellationRows(cancelledByOwner)} /> : <EmptyState text="Henüz kayıt bulunmuyor." />}
          </article>
        </>
      ) : null}
      {cancelDraft ? (
        <div className="admin-action-modal" role="dialog" aria-modal="true">
          <article className="glass-panel">
            <PanelHeader icon={<CircleAlert size={18} />} title="Rezervasyonu İptal Et" subtitle="İptal nedeni zorunludur ve kayıt altında tutulur." />
            <label className="admin-reason-field">
              <span>İptal nedeni</span>
              <textarea value={cancelDraft.reason} onChange={(event) => setCancelDraft((current) => current ? { ...current, reason: event.target.value } : current)} />
            </label>
            <div className="table-action-row">
              <button type="button" onClick={cancelReservation} disabled={!cancelDraft.reason.trim()}>İptali Onayla</button>
              <button type="button" onClick={() => setCancelDraft(null)}>Vazgeç</button>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  )
}

function GalleryManagementWorkflow({
  activeItem,
  onRoomsChange,
  rooms,
}: {
  activeItem: string
  onRoomsChange: (rooms: RoomOption[]) => void
  rooms: RoomOption[]
}) {
  const updateRoomImage = (roomId: string, imageClass: string) => {
    onRoomsChange(rooms.map((room) => room.id === roomId ? { ...room, imageClass } : room))
  }

  return (
    <div className="owner-management-grid">
      <article className="glass-panel wide">
        <PanelHeader icon={<Camera size={18} />} title="Görsel Galeri" subtitle={`${activeItem} için kapak ve oda görsel sıralaması`} />
        <div className="gallery-grid">
          {rooms.map((room, index) => (
            <div className="gallery-tile" key={room.id}>
              <span>{index + 1}</span>
              <strong>{room.name}</strong>
              <small>{room.imageClass}</small>
            </div>
          ))}
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<DoorOpen size={18} />} title="Yükleme Alanı" subtitle="Otel ve oda görselleri" />
        <div className="management-form">
          {rooms.map((room) => (
            <label key={`image-${room.id}`}>
              <span>{room.name}</span>
              <select value={room.imageClass} onChange={(event) => updateRoomImage(room.id, event.target.value)}>
                {roomImageOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
      </article>
	      <article className="glass-panel">
	        <PanelHeader icon={<ClipboardList size={18} />} title="Galeri Kuralları" subtitle="Sıralama ve görünürlük" />
	        {rooms.length > 0 ? (
	          <ActionFeed items={rooms.slice(0, 5).map((room) => `${room.name} • ${room.imageClass} görsel sınıfı kullanılıyor`)} />
	        ) : (
	          <EmptyState text="Henüz görsel kaydı bulunmuyor." compact />
	        )}
	      </article>
    </div>
  )
}

function HotelSettingsWorkflow({
  activeItem,
  contact,
  description,
  galleryImages,
  nearbyPlaces,
  onUpdate,
  policies,
  services,
  socialMedia,
}: {
  activeItem: string
  contact: HotelContactInfo
  description: string
  galleryImages: string[]
  nearbyPlaces: HotelNearbyPlace[]
  onUpdate: (patch: HotelCustomization) => void
  policies: string[]
  services: string[]
  socialMedia: NonNullable<HotelCustomization['socialMedia']>
}) {
  const hotelGalleryInputRef = useRef<HTMLInputElement | null>(null)
  const completedContactFields = [contact.phone, contact.email, contact.address, contact.responseTime].filter(Boolean).length
  const profileCompleteness = percentageOf(completedContactFields + policies.length + nearbyPlaces.length, 4 + Math.max(policies.length, 1) + Math.max(nearbyPlaces.length, 1))
  const updateNearbyPlace = (placeId: string, field: keyof HotelNearbyPlace, value: string) => {
    onUpdate({
      nearbyPlaces: nearbyPlaces.map((place) => place.id === placeId ? { ...place, [field]: value } : place),
    })
  }
  const addNearbyPlace = () => {
    onUpdate({
      nearbyPlaces: [
        ...nearbyPlaces,
        {
          distance: '1,0 km',
          id: `nearby-${Date.now()}`,
          name: 'Yeni yakın nokta',
          note: 'restoran',
          type: 'restoran',
          x: '48%',
          y: '44%',
        },
      ],
    })
  }
  const updateSocial = (field: keyof NonNullable<HotelCustomization['socialMedia']>, value: string) => {
    onUpdate({ socialMedia: { ...socialMedia, [field]: value } })
  }
  const uploadHotelImages = async (files: FileList | null) => {
    if (!files?.length) {
      return
    }

    const images = await Promise.all(Array.from(files).map(fileToDataUrl))

    onUpdate({ galleryImages: [...galleryImages, ...images] })
  }
  const removeHotelImage = (image: string) => {
    onUpdate({ galleryImages: galleryImages.filter((item) => item !== image) })
  }

  return (
    <div className="owner-management-grid">
      <article className="glass-panel wide">
        <PanelHeader icon={<Settings2 size={18} />} title="Otel Hakkında" subtitle={`${activeItem} yönetimi, hizmetler, politikalar ve sosyal medya`} />
        <div className="management-form two-column">
          <label><span>Otel açıklaması</span><textarea value={description} onChange={(event) => onUpdate({ description: event.target.value })} /></label>
          <label><span>Hizmetler</span><textarea value={services.join('\n')} onChange={(event) => onUpdate({ services: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} /></label>
          <label><span>İletişim telefonu</span><input value={contact.phone} onChange={(event) => onUpdate({ contact: { ...contact, phone: event.target.value } })} /></label>
          <label><span>E-posta</span><input value={contact.email} onChange={(event) => onUpdate({ contact: { ...contact, email: event.target.value } })} /></label>
          <label><span>Adres</span><input value={contact.address} onChange={(event) => onUpdate({ contact: { ...contact, address: event.target.value } })} /></label>
          <label><span>Yanıt süresi</span><input value={contact.responseTime} onChange={(event) => onUpdate({ contact: { ...contact, responseTime: event.target.value } })} /></label>
          <label><span>Otel politikaları</span><textarea value={policies.join('\n')} onChange={(event) => onUpdate({ policies: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} /></label>
          <label><span>Instagram</span><input value={socialMedia.instagram ?? ''} onChange={(event) => updateSocial('instagram', event.target.value)} /></label>
          <label><span>X/Twitter</span><input value={socialMedia.x ?? ''} onChange={(event) => updateSocial('x', event.target.value)} /></label>
          <label><span>Facebook</span><input value={socialMedia.facebook ?? ''} onChange={(event) => updateSocial('facebook', event.target.value)} /></label>
          <label><span>TikTok</span><input value={socialMedia.tiktok ?? ''} onChange={(event) => updateSocial('tiktok', event.target.value)} /></label>
          <label><span>Website</span><input value={socialMedia.website ?? ''} onChange={(event) => updateSocial('website', event.target.value)} /></label>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Camera size={18} />} title="Otel Fotoğrafları" subtitle="Bilgisayardan eklenen görseller otel galerisinde kalıcı saklanır." />
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div
              className="gallery-tile uploaded-gallery-tile"
              key={`${image}-${index}`}
              style={{ '--uploaded-image': `url(${image})` } as CSSProperties}
            >
              <span>{index + 1}</span>
              <strong>Otel Galerisi</strong>
              <button type="button" onClick={() => removeHotelImage(image)}>Görsel Sil</button>
            </div>
          ))}
          {galleryImages.length === 0 ? <EmptyState text="Henüz otel fotoğrafı eklenmedi." compact /> : null}
        </div>
        <input
          ref={hotelGalleryInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            void uploadHotelImages(event.target.files)
            event.target.value = ''
          }}
        />
        <div className="table-action-row">
          <button type="button" onClick={() => hotelGalleryInputRef.current?.click()}>Fotoğraf Ekle</button>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Activity size={18} />} title="Yakındaki Yerler" subtitle="Misafir detay sayfasında gösterilir" />
        <div className="nearby-editor-list">
          {nearbyPlaces.map((place) => (
            <div key={place.id}>
              <input value={place.name} onChange={(event) => updateNearbyPlace(place.id, 'name', event.target.value)} />
              <select value={place.type ?? place.note} onChange={(event) => updateNearbyPlace(place.id, 'type', event.target.value)}>
                {['restoran', 'metro', 'sahil', 'alışveriş merkezi', 'havaalanı', 'kültür merkezi'].map((type) => <option key={type}>{type}</option>)}
              </select>
              <input value={place.distance} onChange={(event) => updateNearbyPlace(place.id, 'distance', event.target.value)} />
              <input value={place.note} onChange={(event) => updateNearbyPlace(place.id, 'note', event.target.value)} />
            </div>
          ))}
        </div>
        <div className="table-action-row">
          <button type="button" onClick={addNearbyPlace}>Yakındaki Yer Ekle</button>
        </div>
      </article>
	      <article className="glass-panel">
	        <PanelHeader icon={<Activity size={18} />} title="Yayın Durumu" subtitle="Profil görünürlüğü" />
	        <ProgressStack items={[
	          { label: 'Profil tamamlığı', value: profileCompleteness, detail: `${completedContactFields} iletişim alanı dolu` },
	          { label: 'Politika kapsamı', value: policies.length > 0 ? 100 : 0, detail: `${policies.length} politika kaydı` },
	          { label: 'Yakındaki yerler', value: nearbyPlaces.length > 0 ? 100 : 0, detail: `${nearbyPlaces.length} konum etiketi` },
	        ]} />
	      </article>
    </div>
  )
}

function GuestExperience({
  addNotification,
  allGuestHotels,
  guestProfile,
  hotelCustomizations,
  hotelConversations,
  hotelReviews,
  hotels,
  isLoading,
  language,
  onLogout,
  onRefresh,
  search,
  setHotelConversations,
  setHotelReviews,
  setLanguage,
  setSearch,
  setSupportRequests,
  setSystemNotifications,
  setTwoFactorSettings,
  supportRequests,
  systemNotifications,
  twoFactorSettings,
  user,
}: {
  addNotification: (notification: GuestNotification) => void
  allGuestHotels: HotelRecord[]
  guestProfile: GuestProfileResponse | null
  hotelCustomizations: Record<string, HotelCustomization>
  hotelConversations: GuestConversation[]
  hotelReviews: GuestReview[]
  hotels: HotelRecord[]
  isLoading: boolean
  language: LanguageCode
  onLogout: () => void
  onRefresh: () => Promise<void> | void
  search: string
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setHotelReviews: Dispatch<SetStateAction<GuestReview[]>>
  setLanguage: (language: LanguageCode) => void
  setSearch: (value: string) => void
  setSupportRequests: Dispatch<SetStateAction<SupportTicket[]>>
  setSystemNotifications: Dispatch<SetStateAction<GuestNotification[]>>
  setTwoFactorSettings: Dispatch<SetStateAction<TwoFactorSettings>>
  supportRequests: SupportTicket[]
  systemNotifications: GuestNotification[]
  twoFactorSettings: TwoFactorSettings
  user: AuthUser
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentState<boolean>(GUEST_SIDEBAR_STORAGE_KEY, false)
  const [isGuestProfileMenuOpen, setIsGuestProfileMenuOpen] = usePersistentState<boolean>(GUEST_PROFILE_MENU_STORAGE_KEY, false)
  const [activeItem, setActiveItem] = usePersistentState<string>(GUEST_ACTIVE_ITEM_STORAGE_KEY, 'Ana Sayfa')
  const [openSections, setOpenSections] = usePersistentState<Record<string, boolean>>(GUEST_OPEN_SECTIONS_STORAGE_KEY, {
    'ana-panel': true,
    rezervasyon: false,
  })
  const [bookingForm, setBookingForm] = usePersistentState<{
    adults: number
    checkIn: string
    checkOut: string
    children: number
    couponCode: string
    extraServices: string[]
    hasBreakfast: boolean
    paymentMethod: string
    roomCount: number
    roomType: string
    selectedBookingHotelId: string | null
    selectedRoomId: string
    isReservationConfirmed: boolean
  }>(GUEST_BOOKING_FORM_STORAGE_KEY, createDefaultGuestBookingForm())
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityCheckKey, setAvailabilityCheckKey] = useState(0)
  const [selectedHotelId, setSelectedHotelId] = usePersistentState<string | null>(GUEST_SELECTED_HOTEL_STORAGE_KEY, null)
  const favoriteHotelsStorageKey = guestScopedStorageKey(FAVORITE_HOTELS_STORAGE_KEY, user.id)
  const savedRoomsStorageKey = guestScopedStorageKey(SAVED_ROOMS_STORAGE_KEY, user.id)
  const [favoriteHotelIds, setFavoriteHotelIds] = usePersistentState<string[]>(
    favoriteHotelsStorageKey,
    readGuestScopedIdList(FAVORITE_HOTELS_STORAGE_KEY, user.id),
  )
  const [savedRoomIds, setSavedRoomIds] = usePersistentState<string[]>(
    savedRoomsStorageKey,
    readGuestScopedIdList(SAVED_ROOMS_STORAGE_KEY, user.id),
  )
  const [createdGuestReservations, setCreatedGuestReservations] = usePersistentState<GuestReservation[]>(
    GUEST_RESERVATIONS_STORAGE_KEY,
    getAllGuestReservations(),
  )
  const [ownerCoupons, setOwnerCoupons] = usePersistentState<OwnerCoupon[]>(OWNER_COUPONS_STORAGE_KEY, [])
  const [isRefreshingGuest, setIsRefreshingGuest] = useState(false)
  const displayHotels = hotels
  const {
    adults,
    checkIn,
    checkOut,
    children,
    couponCode,
    extraServices,
    isReservationConfirmed,
    paymentMethod,
    roomCount,
    roomType,
    selectedBookingHotelId,
    selectedRoomId,
  } = bookingForm
  const updateBookingForm = (patch: Partial<typeof bookingForm>) => {
    setBookingForm((current) => ({ ...current, ...patch }))
  }
  const setCheckIn = (value: string) => {
    setBookingForm((current) => {
      const minCheckOut = getMinimumReservationCheckOut(value)
      const shouldMoveCheckOut = compareDateInputValues(current.checkOut, minCheckOut) < 0

      return {
        ...current,
        checkIn: value,
        checkOut: shouldMoveCheckOut ? minCheckOut : current.checkOut,
      }
    })
  }
  const setCheckOut = (value: string) => updateBookingForm({ checkOut: value })
  const setRoomType = (value: string) => updateBookingForm({ roomType: value })
  const setAdults = (value: number) => updateBookingForm({ adults: value })
  const setChildren = (value: number) => updateBookingForm({ children: value })
  const setRoomCount = (value: number) => updateBookingForm({ roomCount: value })
  const setCouponCode = (value: string) => updateBookingForm({ couponCode: value })
  const setPaymentMethod = (value: string) => updateBookingForm({ paymentMethod: value })
  const setSelectedBookingHotelId = (value: string | null) => updateBookingForm({ selectedBookingHotelId: value })
  const setSelectedRoomId = (value: string) => updateBookingForm({ selectedRoomId: value })
  const setIsReservationConfirmed = (value: boolean) => updateBookingForm({ isReservationConfirmed: value })
  const setExtraServices: Dispatch<SetStateAction<string[]>> = (value) => {
    setBookingForm((current) => ({
      ...current,
      extraServices: typeof value === 'function' ? value(current.extraServices) : value,
    }))
  }
  const selectedBookingHotel = displayHotels.find((hotel) => hotel.id === selectedBookingHotelId) ?? null
  const selectedHotel = selectedHotelId
    ? displayHotels.find((hotel) => hotel.id === selectedHotelId) ?? null
    : null
  const selectedBookingHotelIndex = selectedBookingHotel
    ? Math.max(displayHotels.findIndex((hotel) => hotel.id === selectedBookingHotel.id), 0)
    : -1
  const selectedHotelRooms = selectedBookingHotel
    ? getHotelRooms(selectedBookingHotel, selectedBookingHotelIndex, hotelCustomizations).map((room) => ({
        ...room,
        available: getEffectiveRoomAvailability(
          room,
          createdGuestReservations.filter((reservation) =>
            reservation.status === 'Aktif' &&
            reservationMatchesHotel(reservation, selectedBookingHotel),
          ).filter((reservation) =>
            reservationOverlapsDateRange(reservation, checkIn, checkOut),
          ),
        ),
      }))
    : []
  const selectedRoom = selectedHotelRooms.find((room) => room.id === selectedRoomId) ?? selectedHotelRooms[0] ?? null
  const allHotelRooms = displayHotels.flatMap((hotel, index) => getHotelRooms(hotel, index, hotelCustomizations))
  const nights = calculateNights(checkIn, checkOut)
  const totalGuests = adults + children
  const filteredRooms = selectedHotelRooms.filter((room) => {
    const requestedRoomCount = Math.max(roomCount, 1)
    const minimumCapacityPerRoom = Math.max(Math.ceil(totalGuests / requestedRoomCount), 1)

    return (
      (roomType === 'Tümü' || room.type === roomType) &&
      room.available > 0 &&
      Number(room.price) > 0 &&
      room.capacity >= minimumCapacityPerRoom
    )
  })
  const roomTotal = selectedRoom ? selectedRoom.price * nights * Math.max(roomCount, 1) : 0
  const includedServices = useMemo(
    () => getReservationIncludedServices(selectedBookingHotel, selectedRoom, hotelCustomizations),
    [hotelCustomizations, selectedBookingHotel?.id, selectedRoom?.id],
  )
  const paidExtras = useMemo(
    () => getReservationPaidExtras(selectedBookingHotel, selectedRoom, hotelCustomizations),
    [hotelCustomizations, selectedBookingHotel?.id, selectedRoom?.id],
  )
  const selectedPaidExtras = paidExtras.filter((extra) => extraServices.includes(extra.extraId))
  const paidExtraTotal = calculatePaidExtraTotal(selectedPaidExtras, nights, Math.max(roomCount, 1), totalGuests)
  const subTotal = roomTotal + paidExtraTotal
  const couponValidation = useMemo(
    () => validateBookingCoupon(couponCode, selectedBookingHotel, ownerCoupons, subTotal, language),
    [couponCode, language, ownerCoupons, selectedBookingHotel?.id, subTotal],
  )
  const discount = couponValidation.discountAmount
  const totalPrice = Math.max(subTotal - discount, 0)
  const reservationDateError = reservationDateValidationMessage(checkIn, checkOut, language)

  useEffect(() => {
    setBookingForm((current) => {
      const normalizedDates = normalizeReservationDateRange(current.checkIn, current.checkOut)

      if (current.checkIn === normalizedDates.checkIn && current.checkOut === normalizedDates.checkOut) {
        return current
      }

      return {
        ...current,
        ...normalizedDates,
        isReservationConfirmed: false,
      }
    })
  }, [setBookingForm])

  useEffect(() => {
    const availableExtraIds = new Set(paidExtras.map((extra) => extra.extraId))

    setBookingForm((current) => {
      const nextExtraServices = current.extraServices.filter((extraId) => availableExtraIds.has(extraId))

      if (nextExtraServices.length === current.extraServices.length) {
        return current
      }

      return {
        ...current,
        extraServices: nextExtraServices,
        isReservationConfirmed: false,
      }
    })
  }, [paidExtras, setBookingForm])
  const visibleGuestReservations = useMemo(
    () => [
      ...createdGuestReservations,
      ...guestReservations.filter((reservation) => (
        !createdGuestReservations.some((createdReservation) => createdReservation.id === reservation.id)
      )),
    ],
    [createdGuestReservations],
  )
  const currentGuestReservations = useMemo(
    () => {
      const userSignals = [
        user.id,
        user.email,
        user.username ?? '',
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        guestProfile ? `${guestProfile.firstName} ${guestProfile.lastName}`.trim() : '',
      ].map((value) => normalizeSearch(value)).filter(Boolean)

      return visibleGuestReservations.filter((reservation) => (
        idsMatch(reservation.guestId, user.id) ||
        idsMatch(reservation.guestId, user.email) ||
        (reservation.guestName ? userSignals.includes(normalizeSearch(reservation.guestName)) : false)
      ))
    },
    [guestProfile, user.email, user.firstName, user.id, user.lastName, user.username, visibleGuestReservations],
  )
  const guestHotelConversations = useMemo(
    () => hotelConversations.filter((conversation) => isConversationOwnedByGuest(conversation, user.id)),
    [hotelConversations, user.id],
  )
  const dynamicGuestMetrics = useMemo<Metric[]>(() => {
    const publishedHotels = allGuestHotels.length > 0 ? allGuestHotels : displayHotels
    const metricHotels = search.trim() ? displayHotels : publishedHotels
    const favoriteHotels = publishedHotels.filter((hotel) => favoriteHotelIds.includes(hotel.id))
    const scoreSource = favoriteHotels.length > 0
      ? favoriteHotels
      : selectedHotel
        ? [selectedHotel]
        : displayHotels
    const averageScore = scoreSource.length > 0
      ? scoreSource.reduce((total, hotel) => total + hotel.starRating, 0) / scoreSource.length
      : 0

    return [
      {
        accent: 'cyan',
        detail: search.trim() ? 'Aramana göre listelenen gerçek tesisler' : 'Şu an görüntülenen uygun tesisler',
        label: 'Uygun Tesis',
        value: String(metricHotels.length),
      },
      {
	        accent: 'gold',
	        detail: 'Onaylanmış yaklaşan konaklama planı',
	        label: 'Aktif Rezervasyon',
	        value: String(currentGuestReservations.filter(isActiveReservationRecord).length),
	      },
      {
        accent: 'white',
        detail: 'Kalıcı favori listendeki tesisler',
        label: 'Favori Tesis',
        value: String(favoriteHotelIds.length),
      },
      {
        accent: 'cyan',
        detail: favoriteHotels.length > 0 ? 'Favori tesislerinin ortalama puanı' : 'Görüntülenen tesislerin ortalama puanı',
        label: 'Misafir Puanı',
        value: averageScore > 0 ? averageScore.toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '0,0',
      },
    ]
  }, [allGuestHotels, currentGuestReservations, displayHotels, favoriteHotelIds, search, selectedHotel])

  useEffect(() => {
    const validGuestItems = new Set([
      ...guestSections.flatMap((section) => [section.title, ...section.items]),
      'Aktif Cihazlar',
      'Bildirim Tercihleri',
      'Güvenlik Ayarları',
      'Kişisel Bilgiler',
      'Ödeme Yöntemleri',
      'Profilim',
      'Rezervasyon Yap',
      'Uygun Oteller',
    ])

    if (activeItem === 'Mesajlar') {
      setActiveItem('Otel Mesajları')
      setOpenSections((current) => ({ ...current, destek: true }))
      return
    }

    if (!validGuestItems.has(activeItem)) {
      setActiveItem('Ana Sayfa')
      setOpenSections((current) => ({ ...current, 'ana-panel': true }))
    }
  }, [activeItem, setActiveItem, setOpenSections])

  useEffect(() => {
    if (availabilityCheckKey === 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setIsCheckingAvailability(false)
    }, 520)

    return () => window.clearTimeout(timeoutId)
  }, [availabilityCheckKey])

  const markAvailabilityCheck = () => {
    setIsCheckingAvailability(true)
    setAvailabilityCheckKey((current) => current + 1)
  }

  const toggleGuestSection = (sectionId: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false)
    }

    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }

  const selectGuestSection = (section: SidebarSection) => {
    toggleGuestSection(section.id)
    selectGuestItem(section.title)
  }

  const selectGuestItem = (item: string) => {
    setActiveItem(item)
    localStorage.removeItem(GUEST_SELECTED_RESERVATION_STORAGE_KEY)
    setSelectedHotelId(null)
    setSelectedBookingHotelId(null)
    setSelectedRoomId('')
    setIsReservationConfirmed(false)
  }

  const selectGuestProfileItem = (item: string) => {
    setIsGuestProfileMenuOpen(false)

    if (item === 'Çıkış Yap') {
      onLogout()
      return
    }

    selectGuestItem(item)
  }

  const toggleService = (service: string) => {
    setExtraServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    )
  }

  const toggleFavoriteHotel = (hotelId: string) => {
    setFavoriteHotelIds((current) => {
      const isRemoving = current.includes(hotelId)
      const next = isRemoving
        ? current.filter((item) => item !== hotelId)
        : [...current, hotelId]
      const hotel = displayHotels.find((item) => item.id === hotelId)

      addNotification(createSystemNotification(
        'Favoriler',
        isRemoving ? 'Favori otel kaldırıldı' : 'Favori otel kaydedildi',
        `${hotel?.name ?? 'Seçili tesis'} favori listenizde güncellendi.`,
        'Favori Oteller',
      ))

      return next
    })
  }

  const toggleSavedRoom = (roomId: string) => {
    setSavedRoomIds((current) => {
      const isRemoving = current.includes(roomId)
      addNotification(createSystemNotification(
        'Favoriler',
        isRemoving ? 'Kaydedilen oda kaldırıldı' : 'Oda kaydedildi',
        'Kaydedilen odalar listeniz kalıcı olarak güncellendi.',
        'Kaydedilen Odalar',
      ))

      return isRemoving
        ? current.filter((item) => item !== roomId)
        : [...current, roomId]
    })
  }

  const handleGuestRefresh = async () => {
    setIsRefreshingGuest(true)
    await onRefresh()
    setIsRefreshingGuest(false)
  }

  const guestUnreadMessages = guestHotelConversations.filter((conversation) =>
    conversation.messages.some((message) => message.sender === 'Otel Sahibi' && !message.read),
  ).length
  const guestUnreadSupport = supportRequests.filter((request) => request.unreadForGuest).length
  const unreadNotifications = systemNotifications.filter((notification) => notification.unread).length
  const getGuestBadge = (item: string) => {
    if (item === 'Otel Mesajları' || item === 'Mesajlar') {
      return guestUnreadMessages
    }

    if (item === 'Destek Merkezi') {
      return guestUnreadSupport + guestUnreadMessages
    }

    if (item === 'Canlı Destek' || item === 'Destek Talepleri' || item === 'Destek Talebi Oluştur') {
      return guestUnreadSupport
    }

    if (item === 'Bildirimler' || item === 'Kampanya Bildirimleri' || item === 'Rezervasyon Güncellemeleri') {
      return unreadNotifications
    }

    return 0
  }

  const openHotelDetail = (hotel: HotelRecord) => {
    setSelectedHotelId(hotel.id)
    setIsReservationConfirmed(false)
  }

  const startBookingFlow = (hotelId?: string, roomId?: string) => {
    const targetHotel = hotelId
      ? displayHotels.find((hotel) => hotel.id === hotelId)
      : selectedHotel ?? displayHotels[0]

    if (targetHotel) {
      const targetHotelIndex = Math.max(displayHotels.findIndex((hotel) => hotel.id === targetHotel.id), 0)
      const targetRooms = getHotelRooms(targetHotel, targetHotelIndex, hotelCustomizations)
      const targetRoom = roomId
        ? targetRooms.find((room) => room.id === roomId) ?? targetRooms[0]
        : targetRooms[0]

      setSelectedBookingHotelId(targetHotel.id)
      setSelectedRoomId(targetRoom?.id ?? '')
    }

    setActiveItem('Rezervasyon Yap')
    setSelectedHotelId(null)
    setIsReservationConfirmed(false)
    setOpenSections((current) => ({ ...current, rezervasyon: true }))
    markAvailabilityCheck()
  }

  const openAvailableHotelsPage = () => {
    if (reservationDateError) {
      addNotification(createSystemNotification(
        'Rezervasyon',
        language === 'en' ? 'Date validation required' : 'Tarih kontrolü gerekli',
        reservationDateError,
        activeItem,
      ))
      return
    }

    setActiveItem('Uygun Oteller')
    setSelectedHotelId(null)
    setSelectedBookingHotelId(null)
    setSelectedRoomId('')
    setIsReservationConfirmed(false)
    markAvailabilityCheck()
  }

  const confirmGuestReservation = () => {
    if (!selectedBookingHotel || !selectedRoom || isReservationConfirmed) {
      return
    }

    if (reservationDateError) {
      addNotification(createSystemNotification(
        'Rezervasyon',
        language === 'en' ? 'Reservation could not be created' : 'Rezervasyon oluşturulamadı',
        reservationDateError,
        'Rezervasyon Yap',
      ))
      return
    }

    if (selectedRoom.price <= 0 || totalPrice <= 0) {
      if (import.meta.env.DEV) {
        console.debug('[Rezervasyon Kaydı]', selectedBookingHotel.name, selectedRoom.name, selectedRoom.price <= 0 ? 'oda fiyatı bulunamadı' : 'totalPrice 0/null')
      }
      addNotification(createSystemNotification(
        'Rezervasyon',
        language === 'en' ? 'Reservation could not be created' : 'Rezervasyon oluşturulamadı',
        language === 'en' ? 'Room price could not be found. Please select another room.' : 'Oda fiyatı bulunamadı. Lütfen farklı bir oda seçin.',
        'Rezervasyon Yap',
      ))
      return
    }

    if (!filteredRooms.some((room) => room.id === selectedRoom.id)) {
      if (import.meta.env.DEV) {
        console.debug('[Rezervasyon Kaydı]', selectedBookingHotel.name, selectedRoom.name, 'tarih/kapasite/stok uygun değil')
      }
      addNotification(createSystemNotification(
        'Rezervasyon',
        language === 'en' ? 'Reservation could not be created' : 'Rezervasyon oluşturulamadı',
        language === 'en' ? 'This room is not available for the selected date or guest count.' : 'Bu oda seçilen tarih veya kişi sayısı için uygun değil.',
        'Rezervasyon Yap',
      ))
      return
    }

    if (couponCode.trim() && !couponValidation.isValid) {
      addNotification(createSystemNotification(
        'Rezervasyon',
        language === 'en' ? 'Coupon could not be applied' : 'Kupon uygulanamadı',
        couponValidation.message,
        'Rezervasyon Yap',
      ))
      return
    }

    const targetHotelIndex = Math.max(displayHotels.findIndex((hotel) => hotel.id === selectedBookingHotel.id), 0)
    const reservationTimestamp = Date.now()
    const reservationId = `res-${reservationTimestamp}`
    const reservationCode = `RZ-${reservationTimestamp.toString().slice(-5)}`
    const createdAt = formatDateTime(new Date())
    const ownerId = getOwnerIdForHotel(selectedBookingHotel.id, displayHotels)
    const basePrice = normalizeRevenueAmount(selectedRoom.price)
    const reservationNightCount = Math.max(nights, 1)
    const reservationRoomCount = Math.max(roomCount, 1)
    const reservationGuestCount = Math.max(totalGuests, 1)
    const reservationPaidExtras = selectedPaidExtras.map((extra) => ({ ...extra }))
    const reservationPaidExtraTotal = calculatePaidExtraTotal(
      reservationPaidExtras,
      reservationNightCount,
      reservationRoomCount,
      reservationGuestCount,
    )
    const reservationSubtotal = basePrice * reservationNightCount * reservationRoomCount + reservationPaidExtraTotal
    const reservationCouponDiscount = couponValidation.coupon ? couponValidation.discountAmount : 0
    const reservationTotalPrice = Math.max(reservationSubtotal - reservationCouponDiscount, 0)
    const newReservation: GuestReservation = {
      appliedCouponCode: couponValidation.coupon ? normalizedCouponCode(couponCode) : undefined,
      appliedCouponId: couponValidation.coupon ? couponId(couponValidation.coupon) : undefined,
      basePrice,
      baseRoomPrice: basePrice,
      checkIn,
      checkInDate: checkIn,
      checkOut,
      checkOutDate: checkOut,
      code: reservationCode,
      createdAt,
      guestCount: reservationGuestCount,
      guestId: user.id,
      guestName: guestDisplayName,
      hotelId: selectedBookingHotel.id,
      hotelImageClass: hotelMediaClass(targetHotelIndex),
      hotelName: selectedBookingHotel.name,
      id: reservationId,
      includedServices,
      nightCount: reservationNightCount,
      notes: `${selectedRoom.name} için ${reservationNightCount} gece konaklama ön onayı oluşturuldu.`,
      ownerId,
      paidExtraTotal: reservationPaidExtraTotal,
      paymentStatus: 'paid',
      couponDiscountAmount: reservationCouponDiscount,
      roomCount: reservationRoomCount,
      roomId: selectedRoom.id,
      roomImageClass: selectedRoom.imageClass,
      roomName: selectedRoom.name,
      roomType: selectedRoom.type,
      reservationStatus: 'Aktif',
      reservationId,
      selectedPaidExtras: reservationPaidExtras,
      status: 'Aktif',
      subtotalBeforeDiscount: reservationSubtotal,
      total: reservationTotalPrice,
      totalPrice: reservationTotalPrice,
      totalPriceAfterDiscount: reservationTotalPrice,
    }

    if (import.meta.env.DEV) {
      const includedInRevenue = isRevenueEligibleReservation(newReservation, [selectedRoom])

      console.debug('[Rezervasyon Gelir Bağı]', {
        baseRoomPrice: newReservation.baseRoomPrice,
        gelirHesabinaDahil: includedInRevenue,
        paidExtraTotal: newReservation.paidExtraTotal,
        reservationHotelId: newReservation.hotelId,
        reservationRoomId: newReservation.roomId,
        selectedHotelId: selectedBookingHotel.id,
        selectedPaidExtras: newReservation.selectedPaidExtras,
        selectedRoomId: selectedRoom.id,
        totalPrice: newReservation.totalPrice,
      })
    }

    if (import.meta.env.DEV && normalizeSearch(selectedBookingHotel.name).includes('tekirdag')) {
      console.debug('[Tekirdağ Rezervasyon Kaydı]', {
        basePrice: newReservation.basePrice,
        baseRoomPrice: newReservation.baseRoomPrice,
        hotelId: selectedBookingHotel.id,
        ownerId: newReservation.ownerId,
        paidExtraTotal: newReservation.paidExtraTotal,
        paymentStatus: newReservation.paymentStatus,
        reservationHotelId: newReservation.hotelId,
        reservationStatus: newReservation.reservationStatus,
        roomId: newReservation.roomId,
        roomName: newReservation.roomName,
        selectedPaidExtras: newReservation.selectedPaidExtras,
        totalPrice: newReservation.totalPrice,
      })
    }

    setCreatedGuestReservations((current) => [newReservation, ...current])
    if (couponValidation.coupon) {
      setOwnerCoupons((current) => current.map((coupon) =>
        couponId(coupon) === couponId(couponValidation.coupon!)
          ? { ...coupon, usedCount: couponUsedCount(coupon) + 1 }
          : coupon,
      ))
    }
    setIsReservationConfirmed(true)
    addNotification(createSystemNotification(
      'Rezervasyon',
      'Rezervasyonunuz onaylandı',
      `${selectedBookingHotel.name} için ${reservationCode} kodlu rezervasyonunuz Aktif Rezervasyonlar bölümüne eklendi.`,
      'Aktif Rezervasyonlar',
    ))
  }
  const cancelGuestReservation = (reservation: GuestReservation, reason: string, detail: string) => {
    const cancellationReason = [reason, detail.trim()].filter(Boolean).join(' • ')
    const cancelledReservation: GuestReservation = {
      ...reservation,
      cancellationReason,
      cancelledAt: formatDateTime(new Date()),
      cancelledBy: 'Misafir',
      notes: `${reservation.code} kodlu rezervasyon misafir tarafından iptal edildi.`,
      reservationStatus: 'İptal Edildi',
      status: 'İptal Edildi',
    }

    setCreatedGuestReservations((current) => {
      const exists = current.some((item) => item.id === reservation.id)

      return exists
        ? current.map((item) => item.id === reservation.id ? cancelledReservation : item)
        : [cancelledReservation, ...current]
    })
    setHotelConversations((current) => {
      const targetHotelId = reservation.hotelId ?? normalizeSearch(reservation.hotelName)
      const conversationId = getGuestHotelConversationId(user.id, targetHotelId)
      const nextMessage: ConversationMessage = {
        createdAt: formatDateTime(new Date()),
        id: `msg-${Date.now()}`,
        messageText: `${reservation.code} kodlu rezervasyon iptal edildi. Neden: ${cancellationReason}`,
        read: false,
        readStatus: 'İletildi',
        receiverId: `owner-${targetHotelId}`,
        sender: 'Misafir',
        senderId: user.id,
        status: 'İletildi',
        text: `${reservation.code} kodlu rezervasyon iptal edildi. Neden: ${cancellationReason}`,
        time: formatDateTime(new Date()),
      }
      const existingConversation = current.find((conversation) => conversation.id === conversationId)

      if (existingConversation) {
          return current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  category: 'Rezervasyon İptali',
                  guestId: user.id,
                  guestName: guestDisplayName,
                  ownerId: conversation.ownerId ?? `owner-${targetHotelId}`,
                  status: 'Yanıt bekliyor',
                  unreadCount: conversation.unreadCount + 1,
                  updatedAt: formatDateTime(new Date()),
                messages: [...conversation.messages, nextMessage],
              }
            : conversation,
        )
      }

      return [
        {
          category: 'Rezervasyon İptali',
          conversationId,
          guestId: user.id,
          guestName: guestDisplayName,
          hotelId: reservation.hotelId,
          hotelName: reservation.hotelName,
          id: conversationId,
          messages: [nextMessage],
          ownerId: `owner-${targetHotelId}`,
          receiverId: `owner-${targetHotelId}`,
          reservationCode: reservation.code,
          status: 'Yanıt bekliyor',
          unreadCount: 1,
          updatedAt: formatDateTime(new Date()),
        },
        ...current,
      ]
    })
    addNotification(createSystemNotification(
      'Rezervasyon',
      'Rezervasyon iptal edildi',
      `${reservation.hotelName} için ${reservation.code} kodlu rezervasyon İptal Edilen Rezervasyonlar bölümüne taşındı.`,
      'İptal Edilen Rezervasyonlar',
    ))
  }
  const guestDisplayName = guestProfile
    ? `${guestProfile.firstName} ${guestProfile.lastName}`.trim()
    : `${user.firstName} ${user.lastName}`.trim() || user.email
  const guestInitials = guestDisplayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('') || 'M'

  return (
    <section className={`dashboard-layout guest-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar guest-sidebar">
        <div className="guest-sidebar-top">
          <div className="guest-profile-shell">
            <button
              className="guest-profile-card"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setIsGuestProfileMenuOpen((current) => !current)
              }}
              aria-expanded={isGuestProfileMenuOpen}
              title="Profil"
            >
              <span className="guest-avatar">{guestInitials}</span>
              <span className="guest-profile-copy">
                <small>Profil</small>
                <strong>{guestDisplayName}</strong>
              </span>
              <ChevronDown size={16} />
            </button>
            {isGuestProfileMenuOpen ? (
              <div className="guest-profile-menu" onClick={(event) => event.stopPropagation()}>
                {['Profilim', 'Güvenlik Ayarları', 'Bildirim Tercihleri', 'Ödeme Yöntemleri', 'Aktif Cihazlar'].map((item) => (
                  <button key={item} type="button" onClick={(event) => { event.stopPropagation(); selectGuestProfileItem(item) }}>
                    {item === 'Profilim' ? <User size={15} /> : item === 'Ödeme Yöntemleri' ? <CreditCard size={15} /> : item === 'Bildirim Tercihleri' ? <Bell size={15} /> : <ShieldCheck size={15} />}
                    <span>{tLabel(item, language)}</span>
                  </button>
                ))}
                <button className="danger" type="button" onClick={(event) => { event.stopPropagation(); selectGuestProfileItem('Çıkış Yap') }}>
                  <LogOut size={15} />
                  <span>{tLabel('Çıkış Yap', language)}</span>
                </button>
              </div>
            ) : null}
          </div>
          <button
            className="sidebar-collapse"
            type="button"
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            title={isSidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
            aria-label={isSidebarCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
          >
            {isSidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Misafir menüsü">
          {guestSections.map((section) => (
            <div className="sidebar-section" key={section.id}>
              <button
                className={`section-trigger ${section.title === activeItem || section.items.includes(activeItem) ? 'active' : ''}`}
                type="button"
                onClick={() => selectGuestSection(section)}
                title={section.title}
              >
                {sectionIcon(section.id)}
                <span>{tLabel(section.title, language)}</span>
                {getGuestBadge(section.title) > 0 || section.items.some((item) => getGuestBadge(item) > 0) ? (
                  <b className="menu-badge">
                    {getGuestBadge(section.title) || section.items.reduce((total, item) => total + getGuestBadge(item), 0)}
                  </b>
                ) : null}
                {section.items.length > 0 ? (
                  <ChevronDown
                    className={`section-chevron ${openSections[section.id] ? 'open' : ''}`}
                    size={16}
                  />
                ) : null}
              </button>

              {section.items.length > 0 ? (
                <div className={`submenu ${openSections[section.id] && !isSidebarCollapsed ? 'open' : ''}`}>
                  {section.items.map((item) => (
                    <button
                      className={activeItem === item ? 'active' : ''}
                      key={item}
                      type="button"
                      onClick={() => selectGuestItem(item)}
                    >
                      <ChevronRight size={14} />
                      <span>{tLabel(item, language)}</span>
                      {getGuestBadge(item) > 0 ? <b className="menu-badge">{getGuestBadge(item)}</b> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

      </aside>

      <section className="workspace guest-workspace">
        <header className="dashboard-topbar">
          <div>
            <span>{language === 'en' ? 'Premium hotel experience' : 'Premium otel deneyimi'}</span>
            <h1>{selectedHotel ? (language === 'en' ? 'Hotel Detail' : 'Otel Detayı') : tLabel(activeItem, language)}</h1>
          </div>

          <div className="workspace-actions guest-actions">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <span className="system-status-pill">
              <Activity size={15} />
              {language === 'en' ? 'Density' : 'Yoğunluk'}
            </span>
            <button className={isRefreshingGuest ? 'loading-action' : ''} type="button" onClick={() => void handleGuestRefresh()}>
              <Activity size={18} />
              {isRefreshingGuest ? (language === 'en' ? 'Refreshing' : 'Yenileniyor') : (language === 'en' ? 'Refresh' : 'Yenile')}
            </button>
            <button className="logout-button" type="button" onClick={onLogout}>
              <LogOut size={16} />
              {tLabel('Çıkış Yap', language)}
            </button>
          </div>
        </header>

        <GuestPageContent
          activeItem={activeItem}
          addNotification={addNotification}
          adults={adults}
          allHotels={displayHotels}
          hotelCustomizations={hotelCustomizations}
          language={language}
          checkIn={checkIn}
          checkOut={checkOut}
          children={children}
          roomCount={roomCount}
          couponCode={couponCode}
          discount={discount}
          extraServices={extraServices}
          filteredRooms={filteredRooms}
          includedServices={includedServices}
          isCheckingAvailability={isCheckingAvailability}
          isLoading={isLoading}
          isReservationConfirmed={isReservationConfirmed}
          nights={nights}
          paymentMethod={paymentMethod}
          favoriteHotelIds={favoriteHotelIds}
          savedRoomIds={savedRoomIds}
          allHotelRooms={allHotelRooms}
          selectedBookingHotel={selectedBookingHotel}
          selectedHotel={selectedHotel}
          guestProfile={guestProfile}
          hotelConversations={guestHotelConversations}
          hotelReviews={hotelReviews}
          profileName={guestProfile ? `${guestProfile.firstName} ${guestProfile.lastName}` : null}
          roomType={roomType}
          selectedRoom={selectedRoom}
          roomTotal={roomTotal}
          paidExtras={paidExtras}
          paidExtraTotal={paidExtraTotal}
          selectedPaidExtras={selectedPaidExtras}
          subTotal={subTotal}
          totalPrice={totalPrice}
          supportRequests={supportRequests}
          systemNotifications={systemNotifications}
          twoFactorSettings={twoFactorSettings}
          guestReservations={currentGuestReservations}
          guestMetrics={dynamicGuestMetrics}
          couponValidation={couponValidation}
          reservationDateError={reservationDateError}
          user={user}
          onBackToHotels={() => setSelectedHotelId(null)}
          onConfirmReservation={confirmGuestReservation}
          onCancelReservation={cancelGuestReservation}
          onMessageHotel={() => {
            setSelectedHotelId(null)
            setActiveItem('Otel Mesajları')
            setOpenSections((current) => ({ ...current, destek: true }))
          }}
          onOpenHotelDetail={openHotelDetail}
          onLogout={onLogout}
          onResetBookingHotel={() => {
            setSelectedBookingHotelId(null)
            setSelectedRoomId('')
            setIsReservationConfirmed(false)
          }}
          onSearchAvailableHotels={openAvailableHotelsPage}
          onSelectRoom={setSelectedRoomId}
          onStartBooking={startBookingFlow}
          onToggleFavoriteHotel={toggleFavoriteHotel}
          onToggleSavedRoom={toggleSavedRoom}
          onToggleService={toggleService}
          setHotelReviews={setHotelReviews}
          setActiveItem={selectGuestItem}
          setAdults={(value) => {
            setAdults(value)
            markAvailabilityCheck()
          }}
          setCheckIn={(value) => {
            setCheckIn(value)
            markAvailabilityCheck()
          }}
          setCheckOut={(value) => {
            setCheckOut(value)
            markAvailabilityCheck()
          }}
          setChildren={(value) => {
            setChildren(value)
            markAvailabilityCheck()
          }}
          setRoomCount={(value) => {
            setRoomCount(value)
            markAvailabilityCheck()
          }}
          search={search}
          setHotelConversations={setHotelConversations}
          setSupportRequests={setSupportRequests}
          setSystemNotifications={setSystemNotifications}
          setTwoFactorSettings={setTwoFactorSettings}
          setCouponCode={setCouponCode}
          setPaymentMethod={setPaymentMethod}
          setSearch={setSearch}
          setRoomType={(value) => {
            setRoomType(value)
            markAvailabilityCheck()
          }}
        />
      </section>
    </section>
  )
}

function GuestPageContent({
  activeItem,
  addNotification,
  adults,
  allHotels,
  hotelCustomizations,
  language,
  checkIn,
  checkOut,
  children,
  roomCount,
  couponCode,
  couponValidation,
  discount,
  extraServices,
  filteredRooms,
  includedServices,
  isCheckingAvailability,
  isLoading,
  isReservationConfirmed,
  nights,
  paymentMethod,
  favoriteHotelIds,
  savedRoomIds,
  allHotelRooms,
  selectedBookingHotel,
  selectedHotel,
  guestProfile,
  hotelConversations,
  hotelReviews,
  profileName,
  roomType,
  selectedRoom,
  roomTotal,
  paidExtras,
  paidExtraTotal,
  selectedPaidExtras,
  subTotal,
  totalPrice,
  supportRequests,
  systemNotifications,
  twoFactorSettings,
  guestReservations,
  guestMetrics,
  reservationDateError,
  user,
  onBackToHotels,
  onCancelReservation,
  onConfirmReservation,
  onMessageHotel,
  onOpenHotelDetail,
  onLogout,
  onResetBookingHotel,
  onSearchAvailableHotels,
  onSelectRoom,
  onStartBooking,
  onToggleFavoriteHotel,
  onToggleSavedRoom,
  onToggleService,
  setHotelReviews,
  setActiveItem,
  setAdults,
  setCheckIn,
  setCheckOut,
  setChildren,
  setRoomCount,
  search,
  setHotelConversations,
  setSupportRequests,
  setSystemNotifications,
  setTwoFactorSettings,
  setCouponCode,
  setPaymentMethod,
  setSearch,
  setRoomType,
}: {
  activeItem: string
  addNotification: (notification: GuestNotification) => void
  adults: number
  allHotels: HotelRecord[]
  hotelCustomizations: Record<string, HotelCustomization>
  language: LanguageCode
  checkIn: string
  checkOut: string
  children: number
  roomCount: number
  couponCode: string
  couponValidation: CouponValidationResult
  discount: number
  extraServices: string[]
  filteredRooms: RoomOption[]
  includedServices: string[]
  isCheckingAvailability: boolean
  isLoading: boolean
  isReservationConfirmed: boolean
  nights: number
  paymentMethod: string
  favoriteHotelIds: string[]
  savedRoomIds: string[]
  allHotelRooms: RoomOption[]
  selectedBookingHotel: HotelRecord | null
  selectedHotel: HotelRecord | null
  guestProfile: GuestProfileResponse | null
  hotelConversations: GuestConversation[]
  hotelReviews: GuestReview[]
  profileName: string | null
  roomType: string
  selectedRoom: RoomOption | null
  roomTotal: number
  paidExtras: PaidExtraOption[]
  paidExtraTotal: number
  selectedPaidExtras: PaidExtraOption[]
  subTotal: number
  totalPrice: number
  supportRequests: SupportTicket[]
  systemNotifications: GuestNotification[]
  twoFactorSettings: TwoFactorSettings
  guestReservations: GuestReservation[]
  guestMetrics: Metric[]
  reservationDateError: string | null
  user: AuthUser
  onBackToHotels: () => void
  onCancelReservation: (reservation: GuestReservation, reason: string, detail: string) => void
  onConfirmReservation: () => void
  onMessageHotel: () => void
  onOpenHotelDetail: (hotel: HotelRecord) => void
  onLogout: () => void
  onResetBookingHotel: () => void
  onSearchAvailableHotels: () => void
  onSelectRoom: (roomId: string) => void
  onStartBooking: (hotelId?: string, roomId?: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
  onToggleSavedRoom: (roomId: string) => void
  onToggleService: (service: string) => void
  setHotelReviews: Dispatch<SetStateAction<GuestReview[]>>
  setActiveItem: (item: string) => void
  setAdults: (value: number) => void
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  setChildren: (value: number) => void
  setRoomCount: (value: number) => void
  search: string
  setHotelConversations: Dispatch<SetStateAction<GuestConversation[]>>
  setSupportRequests: Dispatch<SetStateAction<SupportTicket[]>>
  setSystemNotifications: Dispatch<SetStateAction<GuestNotification[]>>
  setTwoFactorSettings: Dispatch<SetStateAction<TwoFactorSettings>>
  setCouponCode: (value: string) => void
  setPaymentMethod: (value: string) => void
  setSearch: (value: string) => void
  setRoomType: (value: string) => void
}) {
  const repeatReservation = (reservation?: GuestReservation) => {
    if (!reservation) {
      onStartBooking()
      return
    }

    const targetHotel = allHotels.find((hotel) => reservationMatchesHotel(reservation, hotel))
      ?? allHotels[0]

    if (!targetHotel) {
      onStartBooking()
      return
    }

    const targetHotelIndex = Math.max(allHotels.findIndex((hotel) => hotel.id === targetHotel.id), 0)
    const targetRoom = getHotelRooms(targetHotel, targetHotelIndex, hotelCustomizations).find((room) => (
      reservationMatchesRoom(reservation, room)
    ))

    onStartBooking(targetHotel.id, targetRoom?.id)
  }

  if (selectedHotel) {
    const detailHotelIndex = Math.max(allHotels.findIndex((hotel) => hotel.id === selectedHotel.id), 0)

    return (
      <HotelDetailPage
        hotel={selectedHotel}
        hotelIndex={detailHotelIndex}
        galleryImages={hotelCustomizations[selectedHotel.id]?.galleryImages ?? []}
        isFavorite={favoriteHotelIds.includes(selectedHotel.id)}
        contact={getHotelContact(selectedHotel, hotelCustomizations)}
        nearbyPlaces={getHotelNearbyPlaces(selectedHotel, detailHotelIndex, hotelCustomizations)}
        policies={getHotelPolicies(selectedHotel, hotelCustomizations)}
        reviews={hotelReviews.filter((review) => review.hotelId === selectedHotel.id && !review.userId.startsWith('default-'))}
        rooms={getHotelRooms(selectedHotel, detailHotelIndex, hotelCustomizations)}
        savedRoomIds={savedRoomIds}
        user={user}
        onBack={onBackToHotels}
        onBookRoom={(roomId) => onStartBooking(selectedHotel.id, roomId)}
        onDeleteReview={() => {
          setHotelReviews((current) => current.filter((review) => !(review.hotelId === selectedHotel.id && review.userId === user.id)))
          addNotification(createSystemNotification('Yorum', 'Yorumunuz silindi', `${selectedHotel.name} için yorumunuz kaldırıldı.`, 'Bildirimler'))
        }}
        onMessageHotel={onMessageHotel}
        onSubmitReview={(review) => {
          setHotelReviews((current) => {
            const existingIndex = current.findIndex((item) => item.hotelId === review.hotelId && item.userId === review.userId)

            if (existingIndex === -1) {
              return [review, ...current]
            }

            return current.map((item, index) => index === existingIndex ? review : item)
          })
          addNotification(createSystemNotification('Yorum', 'Otel yorumunuz güncellendi', `${selectedHotel.name} için puanlama kaydedildi.`, 'Bildirimler'))
        }}
        onToggleFavorite={() => onToggleFavoriteHotel(selectedHotel.id)}
        onToggleSavedRoom={onToggleSavedRoom}
      />
    )
  }

  if (activeItem === 'Ana Sayfa') {
    return (
      <HotelDiscoveryPage
        activeItem={activeItem}
        favoriteHotelIds={favoriteHotelIds}
        guestMetrics={guestMetrics}
        reservationDateError={reservationDateError}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        isLoading={isLoading}
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        roomCount={roomCount}
	        search={search}
	        onOpenHotelDetail={onOpenHotelDetail}
	        onStartBooking={(hotelId) => onStartBooking(hotelId)}
	        onSearchAvailableHotels={onSearchAvailableHotels}
	        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
      />
    )
  }

  if (activeItem === 'Rezervasyonlarım') {
    return (
      <GuestReservationsPage
        activeItem={activeItem}
        guestMetrics={guestMetrics}
        reservations={guestReservations}
        onBookAgain={repeatReservation}
        onCancelReservation={onCancelReservation}
        onMessageHotel={onMessageHotel}
      />
    )
  }

  if (activeItem === 'Favoriler') {
    return (
      <section className="section-overview-stack">
        <FavoriteHotelsPage
          favoriteHotelIds={favoriteHotelIds}
          hotelCustomizations={hotelCustomizations}
          hotels={allHotels}
          onOpenHotelDetail={onOpenHotelDetail}
          onStartBooking={(hotelId) => onStartBooking(hotelId)}
          onToggleFavoriteHotel={onToggleFavoriteHotel}
        />
        <SavedRoomsPage
          rooms={allHotelRooms}
          savedRoomIds={savedRoomIds}
          onBookRoom={(roomId) => {
            const hotelId = findHotelIdByRoomId(roomId, allHotels, hotelCustomizations)
            onStartBooking(hotelId, roomId)
          }}
          onToggleSavedRoom={onToggleSavedRoom}
        />
      </section>
    )
  }

  if (activeItem === 'Profilim') {
    return (
      <section className="section-overview-stack">
        <GuestProfilePage guestProfile={guestProfile} user={user} />
        <PaymentMethodsPage />
        <SecuritySettingsPage
          user={user}
          onLogout={onLogout}
          onNotify={addNotification}
          setTwoFactorSettings={setTwoFactorSettings}
          twoFactorSettings={twoFactorSettings}
        />
      </section>
    )
  }

  if (activeItem === 'Bildirimler') {
    return (
      <NotificationCenterPage
        notifications={systemNotifications}
        setActiveItem={setActiveItem}
        setNotifications={setSystemNotifications}
      />
    )
  }

  if (activeItem === 'Destek Merkezi') {
    return (
      <SupportCenterHome
        hotelMessageCount={hotelConversations.length}
        onSelect={setActiveItem}
        supportRequestCount={supportRequests.filter((request) => request.category !== 'Canlı destek').length}
        unreadSupportCount={supportRequests.filter((request) => request.unreadForGuest).length}
      />
    )
  }

  if (['Otel Önerileri', 'Popüler Oteller', 'Kampanyalar'].includes(activeItem)) {
    return (
      <HotelDiscoveryPage
        activeItem={activeItem}
        favoriteHotelIds={favoriteHotelIds}
        guestMetrics={guestMetrics}
        reservationDateError={reservationDateError}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        isLoading={isLoading}
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        roomCount={roomCount}
	        search={search}
	        onOpenHotelDetail={onOpenHotelDetail}
	        onStartBooking={(hotelId) => onStartBooking(hotelId)}
	        onSearchAvailableHotels={onSearchAvailableHotels}
	        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
      />
    )
  }

  if (['Aktif Rezervasyonlar', 'Geçmiş Rezervasyonlar', 'İptal İşlemleri', 'İptal Edilen Rezervasyonlar'].includes(activeItem)) {
    return (
      <GuestReservationsPage
        activeItem={activeItem}
        guestMetrics={guestMetrics}
        reservations={guestReservations}
        onBookAgain={repeatReservation}
        onCancelReservation={onCancelReservation}
        onMessageHotel={onMessageHotel}
      />
    )
  }

  if (activeItem === 'Favori Oteller') {
    return (
      <FavoriteHotelsPage
        favoriteHotelIds={favoriteHotelIds}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        onOpenHotelDetail={onOpenHotelDetail}
        onStartBooking={(hotelId) => onStartBooking(hotelId)}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
      />
    )
  }

  if (activeItem === 'Kaydedilen Odalar') {
    return (
      <SavedRoomsPage
        rooms={allHotelRooms}
        savedRoomIds={savedRoomIds}
        onBookRoom={(roomId) => {
          const hotelId = findHotelIdByRoomId(roomId, allHotels, hotelCustomizations)
          onStartBooking(hotelId, roomId)
        }}
        onToggleSavedRoom={onToggleSavedRoom}
      />
    )
  }

  if (activeItem === 'Otel Mesajları') {
    return (
      <GuestMessagesPage
        conversations={hotelConversations}
        hotels={allHotels}
        onNotify={addNotification}
        profileName={profileName}
        setConversations={setHotelConversations}
        user={user}
      />
    )
  }

  if (activeItem === 'Kişisel Bilgiler') {
    return <GuestProfilePage guestProfile={guestProfile} user={user} />
  }

  if (activeItem === 'Ödeme Yöntemleri') {
    return <PaymentMethodsPage />
  }

  if (activeItem === 'Güvenlik Ayarları' || activeItem === 'Aktif Cihazlar') {
    return (
      <SecuritySettingsPage
        user={user}
        onLogout={onLogout}
        onNotify={addNotification}
        setTwoFactorSettings={setTwoFactorSettings}
        twoFactorSettings={twoFactorSettings}
      />
    )
  }

  if (activeItem === 'Bildirim Tercihleri') {
    return <GuestNotificationPreferencesPage />
  }

  if (['Kampanya Bildirimleri', 'Rezervasyon Güncellemeleri'].includes(activeItem)) {
    return (
      <NotificationCenterPage
        notifications={systemNotifications}
        setActiveItem={setActiveItem}
        setNotifications={setSystemNotifications}
      />
    )
  }

  if (activeItem === 'Canlı Destek') {
    return (
      <GuestLiveSupportPage
        onNotify={addNotification}
        requests={supportRequests}
        setRequests={setSupportRequests}
      />
    )
  }

  if (activeItem === 'Destek Talepleri' || activeItem === 'Destek Talebi Oluştur') {
    return (
      <SupportTicketCreatePage
        onNotify={addNotification}
        requests={supportRequests}
        setRequests={setSupportRequests}
      />
    )
  }

  if (activeItem === 'Yardım Merkezi') {
    return <HelpCenterPage />
  }

	  if (activeItem === 'Sık Sorulan Sorular') {
	    return <FaqPage />
	  }

  if (activeItem === 'Uygun Oteller') {
    return (
      <AvailableHotelsPage
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        favoriteHotelIds={favoriteHotelIds}
        guestMetrics={guestMetrics}
        reservationDateError={reservationDateError}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        isLoading={isLoading}
        onOpenHotelDetail={onOpenHotelDetail}
        onSearchAvailableHotels={onSearchAvailableHotels}
        onStartBooking={(hotelId) => onStartBooking(hotelId)}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
        roomCount={roomCount}
        search={search}
        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
      />
    )
  }

  if (activeItem !== 'Rezervasyon Yap') {
    return (
      <HotelDiscoveryPage
        activeItem={activeItem}
        favoriteHotelIds={favoriteHotelIds}
        guestMetrics={guestMetrics}
        reservationDateError={reservationDateError}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        isLoading={isLoading}
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        roomCount={roomCount}
	        search={search}
	        onOpenHotelDetail={onOpenHotelDetail}
	        onStartBooking={(hotelId) => onStartBooking(hotelId)}
	        onSearchAvailableHotels={onSearchAvailableHotels}
	        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
      />
    )
  }

  if (!selectedBookingHotel || !selectedRoom) {
    return (
      <HotelDiscoveryPage
        activeItem="Rezervasyon Yap"
        favoriteHotelIds={favoriteHotelIds}
        guestMetrics={guestMetrics}
        reservationDateError={reservationDateError}
        hotelCustomizations={hotelCustomizations}
        hotels={allHotels}
        isLoading={isLoading}
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        roomCount={roomCount}
	        search={search}
	        onOpenHotelDetail={onOpenHotelDetail}
	        onStartBooking={(hotelId) => onStartBooking(hotelId)}
	        onSearchAvailableHotels={onSearchAvailableHotels}
	        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
        onToggleFavoriteHotel={onToggleFavoriteHotel}
      />
    )
  }

  return (
    <>
      <section className="booking-experience">
        <article className="glass-panel booking-form-panel">
          <PanelHeader
            icon={<CalendarCheck size={18} />}
            title="Rezervasyon Akışı"
            subtitle="Otel seçimi tamamlandı, şimdi tarih ve oda filtrelerini kontrol et"
          />
          <div className="booking-flow-strip">
            <span className="active">1. Otel seçildi</span>
            <span className="active">2. Oda seçimi</span>
            <span>3. Ödeme</span>
            <span>4. Onay</span>
          </div>
          <div className="selected-hotel-mini">
            <div className={`selected-hotel-image ${hotelMediaClass(Math.max(allHotels.findIndex((hotel) => hotel.id === selectedBookingHotel.id), 0))}`} aria-hidden="true"></div>
            <div>
              <span>Seçili otel</span>
              <strong>{selectedBookingHotel.name}</strong>
              <p>{selectedBookingHotel.city}{selectedBookingHotel.district ? ` / ${selectedBookingHotel.district}` : ''}</p>
            </div>
            <button type="button" onClick={onResetBookingHotel}>
              Otel değiştir
            </button>
          </div>
          <div className="booking-form-grid">
            <label>
              <span>Giriş tarihi</span>
              <input value={checkIn} min={getTodayDateInputValue()} type="date" onChange={(event) => setCheckIn(event.target.value)} />
            </label>
            <label>
              <span>Çıkış tarihi</span>
              <input value={checkOut} min={getMinimumReservationCheckOut(checkIn)} type="date" onChange={(event) => setCheckOut(event.target.value)} />
            </label>
            <label>
              <span>Oda tipi</span>
              <select value={roomType} onChange={(event) => setRoomType(event.target.value)}>
                <option>Tümü</option>
                <option>Deluxe</option>
                <option>Süit</option>
                <option>Premium</option>
              </select>
            </label>
            <label>
              <span>Yetişkin</span>
              <input value={editableNumberValue(adults)} inputMode="numeric" placeholder="1" onChange={(event) => setAdults(event.target.value === '' ? 0 : Number(event.target.value))} />
            </label>
            <label>
              <span>Çocuk</span>
              <input value={editableNumberValue(children)} inputMode="numeric" placeholder="0" onChange={(event) => setChildren(event.target.value === '' ? 0 : Number(event.target.value))} />
            </label>
            <label>
              <span>Kupon kodu</span>
              <input value={couponCode} placeholder="Kupon kodu" onChange={(event) => setCouponCode(event.target.value)} />
            </label>
          </div>
          {couponCode.trim() ? (
            <div className={`coupon-feedback ${couponValidation.isValid ? 'success' : 'error'}`}>
              <span>{couponAppliedMessage(couponValidation, language)}</span>
              {couponValidation.coupon || couponCode.trim() ? (
                <button type="button" onClick={() => setCouponCode('')}>
                  {language === 'en' ? 'Remove' : 'Kuponu Kaldır'}
                </button>
              ) : null}
            </div>
          ) : null}
          {reservationDateError ? (
            <p className="security-inline-alert error">{reservationDateError}</p>
          ) : null}

          <div className="service-toggle-grid">
            {includedServices.map((service) => (
              <button className="included" disabled key={service} type="button">
                <Utensils size={17} />
                <span>{service}</span>
                <small>{language === 'en' ? 'Included' : 'Dahil'}</small>
              </button>
            ))}
            {paidExtras.map((service) => (
              <button
                className={extraServices.includes(service.extraId) ? 'active' : ''}
                key={service.extraId}
                type="button"
                onClick={() => onToggleService(service.extraId)}
              >
                <Sparkles size={17} />
                <span>{service.extraName}</span>
                <small>{formatCurrency(calculatePaidExtraCharge(service, nights, roomCount, adults + children))} • {paidExtraTypeLabel(service.extraType, language)}</small>
              </button>
            ))}
            {includedServices.length === 0 && paidExtras.length === 0 ? (
              <div className="service-empty-state">
                {language === 'en' ? 'No extra services are defined for this room.' : 'Bu oda için tanımlı ek hizmet bulunmuyor.'}
              </div>
            ) : null}
          </div>

          <div className="availability-strip">
            <span className={isCheckingAvailability ? 'checking' : ''}></span>
            <div>
              <strong>{isCheckingAvailability ? 'Müsaitlik kontrol ediliyor' : `${selectedBookingHotel.name} içinde ${filteredRooms.length} oda tipi müsait`}</strong>
              <p>{nights} gece için seçilen otel, oda, sezon ve kapasiteye göre fiyat hesaplandı.</p>
            </div>
          </div>
        </article>

        <article className="glass-panel room-selection-panel wide">
          <PanelHeader
            icon={<BedDouble size={18} />}
            title={`${selectedBookingHotel.name} Odaları`}
            subtitle="Yalnızca seçilen otele ait özel oda seçenekleri"
          />
          <div className="room-card-grid">
            {filteredRooms.map((room) => (
              <article
                className={`room-card ${room.imageClass} ${selectedRoom.id === room.id ? 'selected' : ''}`}
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
              >
                <button
                  className={`favorite-button room-save-button ${savedRoomIds.includes(room.id) ? 'active' : ''}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleSavedRoom(room.id)
                  }}
                  aria-label={savedRoomIds.includes(room.id) ? 'Odayı kaydedilenlerden çıkar' : 'Odayı kaydet'}
                >
                  <Heart size={17} />
                </button>
                <div className="room-card-media" aria-hidden="true"></div>
                <div className="room-card-body">
                  <div>
                    <span>{room.type} • {room.size}</span>
                    <strong>{room.name}</strong>
                    <p>{room.capacity} kişi • {room.bedType} • {room.features.join(' • ')}</p>
                    <p>{room.bedType} • {room.wifi} • {room.refundPolicy}</p>
                  </div>
                  <div className="room-card-bottom">
                    <span>{room.available} oda müsait • {room.seasonNote}</span>
                    <div>
                      {room.oldPrice ? <small>{formatCurrency(room.oldPrice)}</small> : null}
                      <strong>{formatCurrency(room.price)} / gece</strong>
                    </div>
                  </div>
                  <button
                    className="room-select-inline"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelectRoom(room.id)
                    }}
                  >
                    Bu Odayı Seç
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-panel reservation-summary-panel">
          <PanelHeader
            icon={<ReceiptText size={18} />}
            title="Rezervasyon Özeti"
            subtitle="Seçilen oda, hizmet ve ödeme bilgileri"
          />
          <div className="selected-room-preview">
            <div className={`selected-room-image ${selectedRoom.imageClass}`} aria-hidden="true"></div>
            <div>
              <span>Seçili otel ve oda</span>
              <strong>{selectedBookingHotel.name}</strong>
              <strong>{selectedRoom.name}</strong>
              <p>
                {nights} gece • {adults} yetişkin • {children} çocuk
                {profileName ? ` • ${profileName} adına` : ''}
              </p>
            </div>
          </div>

          <div className="payment-methods" aria-label="Ödeme yöntemi">
            {['Kredi Kartı', 'Sanal POS', 'Tesiste Ödeme'].map((method) => (
              <button
                className={paymentMethod === method ? 'active' : ''}
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
              >
                <CreditCard size={16} />
                {method}
              </button>
            ))}
          </div>

          <div className="price-breakdown">
            <div><span>Gecelik oda fiyatı</span><strong>{formatCurrency(selectedRoom.price)}</strong></div>
            <div><span>Gece sayısı</span><strong>{nights} gece</strong></div>
            <div><span>Oda toplamı</span><strong>{formatCurrency(roomTotal)}</strong></div>
            <div><span>{language === 'en' ? 'Included services' : 'Dahil hizmetler'}</span><strong>{includedServices.length > 0 ? `${includedServices.length} ${language === 'en' ? 'services' : 'hizmet'}` : (language === 'en' ? 'None' : 'Yok')}</strong></div>
            <div><span>{language === 'en' ? 'Paid extras' : 'Ücretli ekstra'}</span><strong>{selectedPaidExtras.length > 0 ? `${selectedPaidExtras.length} ${language === 'en' ? 'selected' : 'seçim'}` : (language === 'en' ? 'Not selected' : 'Seçilmedi')}</strong></div>
            <div><span>{language === 'en' ? 'Extra service total' : 'Ekstra hizmet toplamı'}</span><strong>{formatCurrency(paidExtraTotal)}</strong></div>
            <div><span>Ara toplam</span><strong>{formatCurrency(subTotal)}</strong></div>
            <div><span>Kupon indirimi{couponValidation.coupon ? ` (${couponValidation.coupon.code})` : ''}</span><strong>-{formatCurrency(discount)}</strong></div>
            <div className="total"><span>Toplam</span><strong>{formatCurrency(totalPrice)}</strong></div>
          </div>

          <button className="premium-login-button reservation-confirm-button" type="button" onClick={onConfirmReservation} disabled={Boolean(reservationDateError)}>
            <ShieldCheck size={18} />
            Rezervasyonu Onayla
          </button>
        </article>

        {isReservationConfirmed ? (
          <article className="glass-panel reservation-confirmed-panel wide">
            <div className="confirmation-icon">
              <ShieldCheck size={32} />
            </div>
            <div>
              <span>Rezervasyon onay ekranı</span>
              <h3>Rezervasyon başarıyla oluşturuldu</h3>
              <p>
                {selectedBookingHotel.name} tesisinde {selectedRoom.name} için {formatGuestDate(checkIn)} - {formatGuestDate(checkOut)}
                tarihleri arasında {paymentMethod} yöntemiyle ön onay alındı.
              </p>
            </div>
          </article>
        ) : null}
      </section>
      <GuestMetricsFooter metrics={guestMetrics} />
    </>
  )
}

function HotelDiscoveryPage({
  activeItem,
  adults,
  checkIn,
  checkOut,
  children,
  favoriteHotelIds,
  guestMetrics,
  reservationDateError,
  hotelCustomizations,
  hotels,
  isLoading,
  roomCount,
	  search,
	  onOpenHotelDetail,
	  onSearchAvailableHotels,
	  onStartBooking,
  setAdults,
  setCheckIn,
  setCheckOut,
  setChildren,
  setRoomCount,
  setSearch,
  onToggleFavoriteHotel,
}: {
  activeItem: string
  adults: number
  checkIn: string
  checkOut: string
  children: number
  favoriteHotelIds: string[]
  guestMetrics: Metric[]
  reservationDateError: string | null
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  isLoading: boolean
  roomCount: number
	  search: string
	  onOpenHotelDetail: (hotel: HotelRecord) => void
	  onSearchAvailableHotels: () => void
	  onStartBooking: (hotelId?: string) => void
  setAdults: (value: number) => void
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  setChildren: (value: number) => void
  setRoomCount: (value: number) => void
  setSearch: (value: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
}) {
  const discoveryHotels = hotels.slice(0, 6)
  const titleByPage: Record<string, string> = {
    'Ana Sayfa': 'Ana Sayfa',
    'Otel Önerileri': 'Sana özel lüks tesis önerileri',
    'Popüler Oteller': 'Bu hafta en çok incelenen tesisler',
    Kampanyalar: 'Seçili tarihler için premium kampanyalar',
    'Rezervasyon Yap': 'Rezervasyon için önce otel seç',
  }

  const discoverySectionOptions = [
    {
      className: 'glow-gold layout-panorama',
      hotels: rotateItems(discoveryHotels, 0).slice(0, 3),
      kicker: 'Luxury booking app vitrini',
      subtitle: 'Havuz, rooftop ve deniz atmosferi güçlü tesisler',
      title: 'Popüler Oteller',
    },
    {
      className: 'glow-cyan layout-slider',
      hotels: rotateItems(discoveryHotels, 1).slice(0, 4),
      kicker: 'Profiline göre seçildi',
      subtitle: 'Sessiz kat, premium suit ve hızlı check-in odaklı öneriler',
      title: 'Size Özel Öneriler',
    },
    {
      className: 'glow-emerald layout-featured',
      hotels: rotateItems(discoveryHotels, 2).slice(0, 3),
      kicker: 'Eski fiyat / yeni fiyat',
      subtitle: 'Kampanyalı oda fiyatı ve sezon farkı hazır tesisler',
      title: 'Kampanyalı Oteller',
    },
    {
      className: 'glow-violet layout-featured',
      hotels: discoveryHotels,
      kicker: 'Otel seçimi',
      subtitle: 'Rezervasyona başlamadan önce konaklamak istediğin tesisi seç',
      title: 'Rezervasyon İçin Otel Seçimi',
    },
  ]
  const activeDiscoveryTitle =
    activeItem === 'Popüler Oteller'
      ? 'Popüler Oteller'
      : activeItem === 'Kampanyalar'
        ? 'Kampanyalı Oteller'
        : activeItem === 'Rezervasyon Yap'
          ? 'Rezervasyon İçin Otel Seçimi'
          : 'Size Özel Öneriler'
  const activeDiscoverySection =
    discoverySectionOptions.find((section) => section.title === activeDiscoveryTitle) ?? discoverySectionOptions[1]
  const visibleDiscoverySections =
    activeItem === 'Ana Sayfa' ? discoverySectionOptions.slice(0, 3) : [activeDiscoverySection]

  return (
    <section className="hotel-discovery-page cinematic-discovery-page">
      <QuickReservationPanel
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        reservationDateError={reservationDateError}
	        hotelCount={discoveryHotels.length}
	        isLoading={isLoading}
	        roomCount={roomCount}
	        search={search}
	        onQuickBooking={onSearchAvailableHotels}
	        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
      />

      {activeItem !== 'Ana Sayfa' ? (
        <article className={`cinematic-discovery-hero ${hotelMediaClass(0)}`}>
          <div>
            <span>{isLoading ? 'Tesisler yükleniyor' : `${discoveryHotels.length} tesis listeleniyor`}</span>
            <h2>{titleByPage[activeItem] ?? activeItem}</h2>
            <p>
              Büyük görseller, gerçekçi fiyat sinyalleri, otel atmosferi ve oda müsaitliğiyle
              sinematik bir konaklama vitrini.
            </p>
          </div>
          <button className="premium-login-button" type="button" onClick={() => onStartBooking(discoveryHotels[0]?.id)}>
            <CalendarCheck size={18} />
            Hızlı Rezervasyon
          </button>
        </article>
      ) : null}

      {discoveryHotels.length === 0 ? (
        <p className="empty-state">
          Aramana uygun tesis bulunamadı. Otel adı, şehir veya bölge bilgisini sadeleştirerek tekrar deneyebilirsin.
        </p>
      ) : null}

      {visibleDiscoverySections.map((section) => {
        const sectionIndex = Math.max(
          discoverySectionOptions.findIndex((option) => option.title === section.title),
          0,
        )

        return (
          <section className={`cinematic-hotel-section ${section.className}`} key={section.title}>
            <div className="cinematic-section-header">
              <div>
                <span>{section.kicker}</span>
                <h3>{section.title}</h3>
                <p>{section.subtitle}</p>
              </div>
              <strong>{section.hotels.length} tesis</strong>
            </div>
            <div className="cinematic-hotel-strip">
              {section.hotels.map((hotel, index) => (
                <CinematicHotelCard
                  hotel={hotel}
                  hotelCustomizations={hotelCustomizations}
                  hotelIndex={(sectionIndex + index) % Math.max(discoveryHotels.length, 1)}
                  isCampaign={section.title === 'Kampanyalı Oteller' || activeItem === 'Kampanyalar'}
                  isFavorite={favoriteHotelIds.includes(hotel.id)}
                  key={`${section.title}-${hotel.id}`}
                  onOpenHotelDetail={onOpenHotelDetail}
                  onStartBooking={onStartBooking}
                  onToggleFavoriteHotel={onToggleFavoriteHotel}
                />
              ))}
            </div>
          </section>
        )
      })}

      {activeItem === 'Ana Sayfa' ? (
        <section className="guest-content-grid discovery-insight-grid">
          <article className="glass-panel">
            <PanelHeader icon={<Bell size={18} />} title="Canlı Misafir Sinyalleri" subtitle="Favori, fiyat ve müsaitlik uyarıları" />
            <ActionFeed
              items={[
                'Favori tesislerinde iki oda tipi için indirim aktif',
                'Hafta sonu deniz manzaralı oda talebi yükseldi',
                'Kaydedilen odalarından biri son 3 müsaitlikte',
                'Destek ekibi rezervasyon talebine hazır',
              ]}
            />
          </article>
          <article className="glass-panel">
            <PanelHeader icon={<CalendarCheck size={18} />} title="Plan Önerileri" subtitle="Arama niyetine göre rota" />
            <DataList rows={guestPlanRows} />
          </article>
          <article className="glass-panel">
            <PanelHeader icon={<BarChart3 size={18} />} title="Fiyat Eğilimi" subtitle="Seçili bölge için 12 günlük talep" />
            <BarGraph values={[42, 48, 53, 61, 72, 88, 83, 76, 92, 86, 78, 90]} />
          </article>
        </section>
      ) : null}
      <GuestMetricsFooter metrics={guestMetrics} />
    </section>
	  )
	}

function AvailableHotelsPage({
  adults,
  checkIn,
  checkOut,
  children,
  favoriteHotelIds,
  guestMetrics,
  reservationDateError,
  hotelCustomizations,
  hotels,
  isLoading,
  onOpenHotelDetail,
  onSearchAvailableHotels,
  onStartBooking,
  onToggleFavoriteHotel,
  roomCount,
  search,
  setAdults,
  setCheckIn,
  setCheckOut,
  setChildren,
  setRoomCount,
  setSearch,
}: {
  adults: number
  checkIn: string
  checkOut: string
  children: number
  favoriteHotelIds: string[]
  guestMetrics: Metric[]
  reservationDateError: string | null
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  isLoading: boolean
  onOpenHotelDetail: (hotel: HotelRecord) => void
  onSearchAvailableHotels: () => void
  onStartBooking: (hotelId?: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
  roomCount: number
  search: string
  setAdults: (value: number) => void
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  setChildren: (value: number) => void
  setRoomCount: (value: number) => void
  setSearch: (value: string) => void
}) {
  const [sortOption, setSortOption] = usePersistentState<string>(GUEST_AVAILABLE_SORT_STORAGE_KEY, 'Önerilen')
  const totalGuests = adults + children
  const nights = calculateNights(checkIn, checkOut)
  const results = getAvailableHotelResults(hotels, hotelCustomizations, totalGuests, roomCount, checkIn, checkOut, search)
  const visibleResults = sortAvailableHotelResults(results, sortOption)

  return (
    <section className="available-hotels-page">
      <QuickReservationPanel
        adults={adults}
        checkIn={checkIn}
        checkOut={checkOut}
        children={children}
        reservationDateError={reservationDateError}
        hotelCount={visibleResults.length}
        isLoading={isLoading}
        onQuickBooking={onSearchAvailableHotels}
        roomCount={roomCount}
        search={search}
        setAdults={setAdults}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setChildren={setChildren}
        setRoomCount={setRoomCount}
        setSearch={setSearch}
      />

      <article className={`available-results-hero ${hotelMediaClass(2)}`}>
        <div>
          <span>Uygun Oteller</span>
          <h2>Seçtiğin tarihlere göre müsait tesisler</h2>
          <p>
            Önce otelleri incele, fotoğraflara ve yorumlara bak, oda fiyatlarını karşılaştır.
            Rezervasyon yalnızca otel kartındaki Rezervasyon Yap butonuyla başlar.
          </p>
        </div>
        <div className="available-hero-metrics">
          <div><span>Sonuç</span><strong>{visibleResults.length}</strong></div>
          <div><span>Gece</span><strong>{nights}</strong></div>
          <div><span>Misafir</span><strong>{totalGuests}</strong></div>
          <div><span>Oda</span><strong>{roomCount}</strong></div>
        </div>
      </article>

      <section className="available-filter-bar">
        <div>
          <span>Filtreler</span>
          <strong>{formatGuestDate(checkIn)} - {formatGuestDate(checkOut)} • {totalGuests} kişi • {roomCount} oda</strong>
        </div>
        <label>
          <span>Sıralama</span>
          <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
            {['Önerilen', 'En yüksek puan', 'En düşük fiyat', 'En yüksek fiyat', 'Kampanyalı', 'En popüler'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </section>

      {visibleResults.length === 0 ? (
        <p className="empty-state">
          {hotels.length > 0
            ? 'Aramana uyan otel var ancak seçilen tarih, kişi veya oda bilgisi için uygun oda bulunamadı. Otel sahibinin oda stok, kapasite ve fiyat bilgilerini kontrol etmesi gerekebilir.'
            : 'Seçtiğin tarih, kişi ve oda bilgisine uygun tesis bulunamadı. Misafir veya oda sayısını değiştirerek tekrar ara.'}
        </p>
      ) : (
        <section className="available-results-grid">
          {visibleResults.map((result) => (
            <AvailableHotelCard
              isFavorite={favoriteHotelIds.includes(result.hotel.id)}
              key={result.hotel.id}
              nights={nights}
              onOpenHotelDetail={onOpenHotelDetail}
              onStartBooking={onStartBooking}
              onToggleFavoriteHotel={onToggleFavoriteHotel}
              result={result}
            />
          ))}
        </section>
      )}

      <GuestMetricsFooter metrics={guestMetrics} />
    </section>
  )
}

function AvailableHotelCard({
  isFavorite,
  nights,
  onOpenHotelDetail,
  onStartBooking,
  onToggleFavoriteHotel,
  result,
}: {
  isFavorite: boolean
  nights: number
  onOpenHotelDetail: (hotel: HotelRecord) => void
  onStartBooking: (hotelId?: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
  result: AvailableHotelResult
}) {
  const campaignLabel = result.campaignRate > 0 ? `%${result.campaignRate} kampanya` : 'Esnek fiyat'
  const totalStartingPrice = result.minPrice * nights

  return (
    <article className={`cinematic-hotel-card available-hotel-card ${hotelMediaClass(result.hotelIndex)}`}>
      <button
        className={`favorite-button cinematic-favorite ${isFavorite ? 'active' : ''}`}
        type="button"
        onClick={() => onToggleFavoriteHotel(result.hotel.id)}
        aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        <Heart size={18} />
      </button>
      <button
        className="cinematic-card-visual-hit"
        type="button"
        onClick={() => onOpenHotelDetail(result.hotel)}
        aria-label={`${result.hotel.name} detayını aç`}
      >
        <span>Fotoğrafları ve Detayı İncele</span>
      </button>
      <div className="cinematic-hotel-info available-hotel-info">
        <div className="cinematic-title-row">
          <div>
            <span>{result.hotel.city}{result.hotel.district ? ` / ${result.hotel.district}` : ''}</span>
            <strong>{result.hotel.name}</strong>
          </div>
          <span className="rating-pill">
            <Star size={14} />
            {result.hotel.starRating.toFixed(1)}
          </span>
        </div>
        <p>{result.hotel.description}</p>
        <div className="available-badge-row">
          <span>{campaignLabel}</span>
          <span>{result.availableRoomCount} müsait oda</span>
          <span>{result.suitableRooms.length} oda tipi uygun</span>
        </div>
        <div className="availability-room-list">
          {result.suitableRooms.slice(0, 3).map((room) => (
            <div key={`${result.hotel.id}-${room.id}`}>
              <strong>{room.type}</strong>
              <span>{room.capacity} kişi • {room.bedType}</span>
              <b>{formatCurrency(room.price)}</b>
            </div>
          ))}
        </div>
        <div className="cinematic-price-actions">
          <div className="hotel-price-row">
            <span>Gecelik başlangıç</span>
            <div className="hotel-price-values">
              {result.oldPrice ? <small>{formatCurrency(result.oldPrice)}</small> : null}
              <strong>{formatCurrency(result.minPrice)}</strong>
              <em>{nights} gece: {formatCurrency(totalStartingPrice)}</em>
            </div>
          </div>
          <div className="hotel-card-actions">
            <button type="button" onClick={() => onOpenHotelDetail(result.hotel)}>
              <Sparkles size={16} />
              İncele
            </button>
            <button type="button" onClick={() => onStartBooking(result.hotel.id)}>
              <CalendarCheck size={16} />
              Rezervasyon Yap
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function CinematicHotelCard({
  hotel,
  hotelCustomizations,
  hotelIndex,
  isCampaign,
  isFavorite,
  onOpenHotelDetail,
  onStartBooking,
  onToggleFavoriteHotel,
}: {
  hotel: HotelRecord
  hotelCustomizations: Record<string, HotelCustomization>
  hotelIndex: number
  isCampaign: boolean
  isFavorite: boolean
  onOpenHotelDetail: (hotel: HotelRecord) => void
  onStartBooking: (hotelId?: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
}) {
  const hotelRooms = getHotelRooms(hotel, hotelIndex, hotelCustomizations)
  const startingPrice = getHotelStartingPrice(hotel, hotelIndex, hotelCustomizations)
  const campaignRoom = hotelRooms.find((room) => room.oldPrice)
  const displayPrice = isCampaign && campaignRoom ? campaignRoom.price : startingPrice
  const oldPrice = isCampaign ? campaignRoom?.oldPrice : undefined
  const discountRate = oldPrice ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100) : 0

  return (
    <article className={`cinematic-hotel-card ${hotelMediaClass(hotelIndex)}`}>
      <button
        className={`favorite-button cinematic-favorite ${isFavorite ? 'active' : ''}`}
        type="button"
        onClick={() => onToggleFavoriteHotel(hotel.id)}
        aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        <Heart size={18} />
      </button>
      <button
        className="cinematic-card-visual-hit"
        type="button"
        onClick={() => onOpenHotelDetail(hotel)}
        aria-label={`${hotel.name} görselinden detay sayfasını aç`}
      >
        <span>İncele</span>
      </button>
      <div className="cinematic-hotel-info">
        <div className="cinematic-title-row">
          <div>
            <span>{hotel.city}{hotel.district ? ` / ${hotel.district}` : ''}</span>
            <strong>{hotel.name}</strong>
          </div>
          <span className="rating-pill">
            <Star size={14} />
            {hotel.starRating.toFixed(1)}
          </span>
        </div>
        <p>{hotel.description}</p>
        <div className="hotel-card-meta">
          <span>{hotelRooms.length} özel oda tipi</span>
          <span>{hotelRooms.reduce((total, room) => total + room.available, 0)} müsait oda</span>
          <span>{isCampaign ? 'Kampanya aktif' : hotelRooms[0].seasonNote}</span>
        </div>
        <div className="cinematic-price-actions">
          <div className="hotel-price-row">
            <span>Gecelik başlangıç</span>
            <div className="hotel-price-values">
              {oldPrice ? <small>{formatCurrency(oldPrice)}</small> : null}
              <strong>{formatCurrency(displayPrice)}</strong>
              {discountRate > 0 ? <em>%{discountRate} indirim</em> : null}
            </div>
          </div>
          <div className="hotel-card-actions">
            <button type="button" onClick={() => onOpenHotelDetail(hotel)}>
              <Sparkles size={16} />
              İncele
            </button>
            <button type="button" onClick={() => onStartBooking(hotel.id)}>
              <CalendarCheck size={16} />
              Rezervasyon Yap
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function QuickReservationPanel({
  adults,
  checkIn,
  checkOut,
  children,
  reservationDateError,
  hotelCount,
  isLoading,
  roomCount,
  search,
  onQuickBooking,
  setAdults,
  setCheckIn,
  setCheckOut,
  setChildren,
  setRoomCount,
  setSearch,
}: {
  adults: number
  checkIn: string
  checkOut: string
  children: number
  reservationDateError: string | null
  hotelCount: number
  isLoading: boolean
  roomCount: number
  search: string
  onQuickBooking: () => void
  setAdults: (value: number) => void
  setCheckIn: (value: string) => void
  setCheckOut: (value: string) => void
  setChildren: (value: number) => void
  setRoomCount: (value: number) => void
  setSearch: (value: string) => void
}) {
  const totalGuests = adults + children

  const changeCheckIn = (value: string) => {
    setCheckIn(value)
  }

  return (
    <article className="quick-reservation-panel">
      <div className="quick-reservation-copy">
        <PanelHeader
          icon={<CalendarCheck size={18} />}
          title="Hızlı Rezervasyon Yap"
          subtitle="Otel kartlarını inceledikten sonra tarih, kişi ve oda bilgisini netleştir"
        />
        <p>
          {isLoading
            ? 'Müsait tesisler güncelleniyor.'
            : `${hotelCount} tesis, ${totalGuests} misafir ve ${roomCount} oda için filtreleniyor.`}
        </p>
      </div>

      <div className="quick-reservation-controls">
        <label className="dashboard-search quick-search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Şehir, bölge veya tesis ara"
          />
        </label>

        <div className="quick-reservation-form-grid">
          <label className="quick-date-field">
            <span>Giriş tarihi</span>
            <input
              min={getTodayDateInputValue()}
              type="date"
              value={checkIn}
              onChange={(event) => changeCheckIn(event.target.value)}
            />
          </label>
          <label className="quick-date-field">
            <span>Çıkış tarihi</span>
            <input
              min={getMinimumReservationCheckOut(checkIn)}
              type="date"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </label>
          <QuickCounter label="Misafir sayısı" icon={<Users size={16} />} min={1} max={8} value={adults} onChange={setAdults} />
          <QuickCounter label="Oda sayısı" icon={<BedDouble size={16} />} min={1} max={5} value={roomCount} onChange={setRoomCount} />
          <QuickCounter label="Çocuk sayısı" icon={<Users size={16} />} min={0} max={6} value={children} onChange={setChildren} />
        </div>

        {reservationDateError ? (
          <p className="security-inline-alert error">{reservationDateError}</p>
        ) : null}

        <div className="quick-reservation-summary">
          <span>
            <CalendarCheck size={15} />
            {formatGuestDate(checkIn)} - {formatGuestDate(checkOut)}
          </span>
          <span>
            <Users size={15} />
            {totalGuests} kişi
          </span>
          <span>
            <BedDouble size={15} />
            {roomCount} oda
          </span>
          <button className="premium-login-button" type="button" onClick={onQuickBooking} disabled={hotelCount === 0 || Boolean(reservationDateError)}>
            <Sparkles size={17} />
            Uygun Otel Ara
          </button>
        </div>
      </div>
    </article>
  )
}

function QuickCounter({
  icon,
  label,
  max,
  min,
  onChange,
  value,
}: {
  icon: ReactNode
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
}) {
  return (
    <div className="quick-counter">
      <span>
        {icon}
        {label}
      </span>
      <div className="counter-stepper">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
          -
        </button>
        <strong>{value}</strong>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
	  )
	}

function getAvailableHotelResults(
  hotels: HotelRecord[],
  hotelCustomizations: Record<string, HotelCustomization>,
  totalGuests: number,
  roomCount: number,
  checkIn: string,
  checkOut: string,
  search = '',
): AvailableHotelResult[] {
  const normalizedSearch = normalizeSearch(search)
  const requestedRoomCount = Math.max(roomCount, 1)
  const minimumCapacityPerRoom = Math.max(Math.ceil(totalGuests / requestedRoomCount), 1)

  return hotels
    .map((hotel, hotelIndex) => {
      const status = getAdminHotelStatus(hotel)
      const isApprovedActiveHotel = status === 'Aktif'
      const hotelSearchText = normalizeSearch([hotel.name, hotel.city, hotel.district, hotel.country, hotel.address].join(' '))
      const matchesSearch = normalizedSearch.length === 0 || hotelSearchText.includes(normalizedSearch)
      const activeReservations = getAllGuestReservations()
        .filter((reservation) =>
          normalizeSearch(getReservationStatus(reservation)).includes('aktif') && reservationMatchesHotel(reservation, hotel),
        )
        .filter((reservation) => reservationOverlapsDateRange(reservation, checkIn, checkOut))
      const rooms = getHotelRooms(hotel, hotelIndex, hotelCustomizations).map((room) => ({
        ...room,
        available: getEffectiveRoomAvailability(room, activeReservations),
      }))
      const roomsWithStock = rooms.filter((room) => room.available > 0)
      const pricedRoomsWithStock = roomsWithStock.filter((room) => Number(room.price) > 0)
      const totalAvailableRoomUnits = pricedRoomsWithStock.reduce((total, room) => total + room.available, 0)
      const totalGuestCapacity = pricedRoomsWithStock.reduce((total, room) => total + room.available * room.capacity, 0)
      const singleRoomTypeFit = pricedRoomsWithStock.some((room) => room.available >= requestedRoomCount && room.capacity * requestedRoomCount >= totalGuests)
      const aggregateRoomFit = requestedRoomCount > 1 && totalAvailableRoomUnits >= requestedRoomCount && totalGuestCapacity >= totalGuests
      const suitableRooms = (singleRoomTypeFit || aggregateRoomFit)
        ? pricedRoomsWithStock.filter((room) => room.capacity >= minimumCapacityPerRoom || room.capacity * room.available >= minimumCapacityPerRoom)
        : []
      const prices = suitableRooms.map((room) => room.price)
      const campaignRoom = suitableRooms.find((room) => room.oldPrice && room.oldPrice > room.price)
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
      const availableRoomCount = suitableRooms.reduce((total, room) => total + room.available, 0)
      const campaignRate = campaignRoom?.oldPrice
        ? Math.round(((campaignRoom.oldPrice - campaignRoom.price) / campaignRoom.oldPrice) * 100)
        : 0

      return {
        availableRoomCount,
        campaignRate,
        debugReasons: [
          !isApprovedActiveHotel ? `aktif/onaylı değil (${status})` : '',
          !matchesSearch ? 'şehir/otel adı eşleşmedi' : '',
          ['Askıda', 'Kaldırıldı', 'Reddedildi', 'Onay Bekliyor'].includes(status) ? status : '',
          rooms.length === 0 ? 'oda yok' : '',
          roomsWithStock.length === 0 ? 'tarih uygun değil' : '',
          roomsWithStock.length > 0 && pricedRoomsWithStock.length === 0 ? 'oda fiyatı tanımlı değil' : '',
          suitableRooms.length === 0 && roomsWithStock.length > 0 ? 'kapasite yetersiz' : '',
        ].filter(Boolean),
        hotel,
        hotelIndex,
        maxPrice,
        minPrice,
        oldPrice: campaignRoom?.oldPrice,
        popularityScore: Math.round(hotel.starRating * 20 + availableRoomCount + suitableRooms.length * 4 + campaignRate),
        rooms,
        suitableRooms,
      }
    })
    .filter((result) => {
      const isVisible = getAdminHotelStatus(result.hotel) === 'Aktif' &&
        result.debugReasons.length === 0 &&
        result.suitableRooms.length > 0

      if (!isVisible && import.meta.env.DEV) {
        console.debug('[Uygun Otel Filtresi]', result.hotel.name, result.debugReasons)
      }

      return isVisible
    })
}

function sortAvailableHotelResults(results: AvailableHotelResult[], sortOption: string) {
  const orderedResults = sortOption === 'Kampanyalı'
    ? results.filter((result) => result.campaignRate > 0)
    : [...results]

  return orderedResults.sort((first, second) => {
    if (sortOption === 'En yüksek puan') {
      return second.hotel.starRating - first.hotel.starRating
    }

    if (sortOption === 'En düşük fiyat') {
      return first.minPrice - second.minPrice
    }

    if (sortOption === 'En yüksek fiyat') {
      return second.maxPrice - first.maxPrice
    }

    if (sortOption === 'Kampanyalı') {
      return second.campaignRate - first.campaignRate
    }

    if (sortOption === 'En popüler') {
      return second.popularityScore - first.popularityScore
    }

    return (second.hotel.starRating * 12 + second.campaignRate + second.availableRoomCount)
      - (first.hotel.starRating * 12 + first.campaignRate + first.availableRoomCount)
  })
}

function RatingStars({
  onChange,
  readonly = false,
  value,
}: {
  onChange?: (value: number) => void
  readonly?: boolean
  value: number
}) {
  return (
    <div className={`rating-stars ${readonly ? 'readonly' : ''}`} aria-label={`Puan ${value}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          className={star <= Math.round(value) ? 'active' : ''}
          disabled={readonly}
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
        >
          <Star size={16} />
        </button>
      ))}
    </div>
  )
}

function HotelDetailPage({
  contact,
  galleryImages,
  hotel,
  hotelIndex,
  isFavorite,
  nearbyPlaces,
  policies,
  reviews,
  rooms,
  savedRoomIds,
  user,
  onBack,
  onBookRoom,
  onDeleteReview,
  onMessageHotel,
  onSubmitReview,
  onToggleFavorite,
  onToggleSavedRoom,
}: {
  contact: HotelContactInfo
  galleryImages: string[]
  hotel: HotelRecord
  hotelIndex: number
  isFavorite: boolean
  nearbyPlaces: HotelNearbyPlace[]
  policies: string[]
  reviews: GuestReview[]
  rooms: RoomOption[]
  savedRoomIds: string[]
  user: AuthUser
  onBack: () => void
  onBookRoom: (roomId?: string) => void
  onDeleteReview: () => void
  onMessageHotel: () => void
  onSubmitReview: (review: GuestReview) => void
  onToggleFavorite: () => void
  onToggleSavedRoom: (roomId: string) => void
}) {
  const [galleryState, setGalleryState] = usePersistentState<{ activeIndex: number; openIndex: number | null }>(
    GUEST_HOTEL_GALLERY_STORAGE_KEY,
    { activeIndex: 0, openIndex: null },
  )
  const activeGalleryIndex = galleryState.activeIndex
  const openGalleryIndex = galleryState.openIndex
  const setActiveGalleryIndex = (activeIndex: number) => setGalleryState((current) => ({ ...current, activeIndex }))
  const setOpenGalleryIndex = (openIndex: number | null) => setGalleryState((current) => ({ ...current, openIndex }))
  const userReview = reviews.find((review) => review.userId === user.id)
  const [reviewComment, setReviewComment] = useState(userReview?.comment ?? '')
  const [reviewRating, setReviewRating] = useState(userReview?.rating ?? 5)
  const gallery = getHotelGalleryGroups(hotelIndex).map((group, index) =>
    index === 0 && galleryImages.length > 0
      ? { ...group, photos: [...galleryImages, ...group.photos].slice(0, 8) }
      : group,
  )
  const averageRating = reviews.length > 0
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : hotel.starRating
  const submitReview = () => {
    const comment = reviewComment.trim()

    if (!comment) {
      return
    }

    const now = formatDateTime(new Date())

    onSubmitReview({
      comment,
      createdAt: userReview?.createdAt ?? now,
      hotelId: hotel.id,
      id: `${hotel.id}-${user.id}`,
      rating: reviewRating,
      updatedAt: now,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
    })
  }
  const deleteReview = () => {
    onDeleteReview()
    setReviewComment('')
    setReviewRating(5)
  }

  return (
    <section className="hotel-detail-page">
      <article className={`detail-hero ${hotelMediaClass(hotelIndex + activeGalleryIndex)}`}>
        <div className="detail-hero-overlay">
          <button className="soft-action" type="button" onClick={onBack}>
            <ChevronRight size={16} />
            Otellere dön
          </button>
          <span className="luxury-chip">
            <Star size={15} />
            {hotel.starRating.toFixed(1)} yıldızlı tesis
          </span>
          <h2>{hotel.name}</h2>
          <p>{hotel.description}</p>
          <div className="detail-hero-actions">
            <button className="premium-login-button" type="button" onClick={() => onBookRoom()}>
              <CalendarCheck size={18} />
              Rezervasyon Yap
            </button>
            <button className="soft-action" type="button" onClick={onMessageHotel}>
              <MessageSquareText size={17} />
              Otelle Mesajlaş
            </button>
            <button className={`favorite-button detail-favorite ${isFavorite ? 'active' : ''}`} type="button" onClick={onToggleFavorite}>
              <Heart size={18} />
              {isFavorite ? 'Favoride' : 'Favoriye Ekle'}
            </button>
          </div>
        </div>
      </article>

      <section className="detail-gallery">
        {gallery.map((group, index) => (
          <button
            className={activeGalleryIndex === index ? 'active' : ''}
            key={group.title}
            style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(5, 7, 10, 0.76)), url("${group.photos[0]}")` }}
            type="button"
            onClick={() => {
              setActiveGalleryIndex(index)
              setOpenGalleryIndex(index)
            }}
          >
            <span>{group.title}</span>
            <small>Galeriyi aç</small>
          </button>
        ))}
      </section>

      {openGalleryIndex !== null ? (
        <HotelGalleryModal
          gallery={gallery[openGalleryIndex]}
          hotelName={hotel.name}
          onClose={() => setOpenGalleryIndex(null)}
        />
      ) : null}

      <article className="glass-panel wide detail-experience-card">
        <PanelHeader icon={<Hotel size={18} />} title="Tesis Deneyimi" subtitle={`${hotel.city}${hotel.district ? ` / ${hotel.district}` : ''} • ${hotel.address}`} />
        <p className="detail-copy">
          Bu tesis, şehir erişimi ile lüks konaklama konforunu birleştiren premium bir otel
          profili olarak kurgulandı. Misafir deneyimi; sessiz oda katları, kişisel talepler,
          hızlı iletişim ve net rezervasyon politikaları ile yönetilir.
        </p>
        <div className="amenity-grid">
          {hotelAmenities.map((amenity) => (
            <span key={amenity}>
              <Sparkles size={15} />
              {amenity}
            </span>
          ))}
        </div>
      </article>

      <section className="detail-info-grid">
        <article className="glass-panel">
          <PanelHeader icon={<Headphones size={18} />} title="Hizmetler" subtitle="Konaklama sırasında sunulan servisler" />
          <ActionFeed items={hotelServices} />
        </article>

        <article className="glass-panel detail-policy-card">
          <PanelHeader icon={<ShieldCheck size={18} />} title="Otel Politikaları" subtitle="Rezervasyon öncesi bilgilendirme" />
          <ActionFeed items={policies} />
        </article>

        <article className="glass-panel nearby-map-panel">
          <PanelHeader icon={<Activity size={18} />} title="Yakındaki Yerler" subtitle="Harita ve ulaşım önizlemesi" />
          <div className="nearby-map" aria-hidden="true">
            <span style={{ '--x': '24%', '--y': '36%' } as CSSProperties}>Otel</span>
            {nearbyPlaces.map((place) => (
              <span key={place.id} style={{ '--x': place.x, '--y': place.y } as CSSProperties}>{place.name}</span>
            ))}
          </div>
          <div className="nearby-card-list">
            {nearbyPlaces.map((place) => (
              <div key={`nearby-${place.id}`}>
                <strong>{place.name}</strong>
                <span>{place.distance}</span>
                <p>{place.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <PanelHeader icon={<MessageSquareText size={18} />} title="Otel İletişimi" subtitle="Rezervasyon öncesi hızlı temas" />
          <div className="contact-card">
            <strong>{hotel.name}</strong>
            <span>{contact.address}</span>
            <span>{contact.phone}</span>
            <span>{contact.email}</span>
            <span>Yanıt süresi: {contact.responseTime}</span>
            <button type="button" onClick={onMessageHotel}>
              <MessageSquareText size={16} />
              Mesaj Gönder
            </button>
          </div>
        </article>
      </section>

      <article className="glass-panel wide detail-room-section">
        <PanelHeader icon={<BedDouble size={18} />} title="Müsait Odalar" subtitle="Oda bazlı fiyat, özellik ve kaydetme işlemleri" />
        <div className="detail-room-grid">
          {rooms.map((room) => {
            const isSaved = savedRoomIds.includes(room.id)

            return (
              <article className={`detail-room-card ${room.imageClass}`} key={room.id}>
                <div className="detail-room-media" aria-hidden="true">
                  <button
                    className={`favorite-button ${isSaved ? 'active' : ''}`}
                    type="button"
                    onClick={() => onToggleSavedRoom(room.id)}
                    aria-label={isSaved ? 'Odayı kaydedilenlerden çıkar' : 'Odayı kaydet'}
                  >
                    <Heart size={18} />
                  </button>
                </div>
                <div className="detail-room-body">
                  <span>{room.type} • {room.size} • {room.capacity} kişi</span>
                  <strong>{room.name}</strong>
                  <div className="room-detail-list">
                    <span>{room.bedType}</span>
                    <span>{room.balcony}</span>
                    <span>{room.bathroom}</span>
                    <span>{room.wifi}</span>
                    <span>{room.breakfastIncluded ? 'Kahvaltı dahil' : 'Kahvaltı opsiyonel'}</span>
                    <span>{room.refundPolicy}</span>
                  </div>
                  <div className="room-card-bottom">
                    <span>{room.available} oda müsait</span>
                    <div>
                      {room.oldPrice ? <small>{formatCurrency(room.oldPrice)}</small> : null}
                      <strong>{formatCurrency(room.price)} / gece</strong>
                    </div>
                  </div>
                  <span className="season-note">{room.seasonNote}</span>
                  <button className="premium-login-button" type="button" onClick={() => onBookRoom(room.id)}>
                    <CalendarCheck size={17} />
                    Bu Odayı Seç
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </article>

      <section className="detail-review-section">
        <article className="glass-panel wide detail-review-panel">
          <PanelHeader icon={<Star size={18} />} title="Misafir Yorumları" subtitle={`Ortalama puan ${averageRating.toFixed(1)} • ${reviews.length} yorum`} />
          <div className="review-form-card">
            <div>
              <strong>{userReview ? 'Yorumunu düzenle' : 'Yorum yaz'}</strong>
              <RatingStars value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Konaklama deneyimini yaz" />
            <div className="review-actions">
              <button type="button" onClick={submitReview}>{userReview ? 'Yorumu Güncelle' : 'Yorum Gönder'}</button>
              {userReview ? <button type="button" onClick={deleteReview}>Yorumu Sil</button> : null}
            </div>
          </div>
          <div className="review-stack">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <strong>{review.rating.toFixed(1)}</strong>
                <RatingStars readonly value={review.rating} />
                <p>{review.comment}</p>
                <span>{review.userName} • {review.updatedAt}</span>
                {review.ownerReply ? (
                  <div className="owner-reply-block">
                    <strong>Otel sahibi cevabı</strong>
                    <p>{review.ownerReply}</p>
                    <span>{review.ownerReplyAt}</span>
                  </div>
                ) : null}
              </div>
            ))}
            {reviews.length === 0 ? <p className="empty-state compact">Henüz yorum yapılmadı.</p> : null}
          </div>
        </article>
      </section>
    </section>
  )
}

function HotelGalleryModal({
  gallery,
  hotelName,
  onClose,
}: {
  gallery: HotelGalleryGroup
  hotelName: string
  onClose: () => void
}) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const activePhoto = gallery.photos[photoIndex] ?? gallery.photos[0]
  const goToPrevious = () => setPhotoIndex((current) => (current === 0 ? gallery.photos.length - 1 : current - 1))
  const goToNext = () => setPhotoIndex((current) => (current + 1) % gallery.photos.length)

  return (
    <div className="hotel-gallery-backdrop" role="presentation" onClick={onClose}>
      <article className="hotel-gallery-modal" role="dialog" aria-modal="true" aria-label={`${hotelName} ${gallery.title} galerisi`} onClick={(event) => event.stopPropagation()}>
        <header className="hotel-gallery-header">
          <div>
            <span>{hotelName}</span>
            <h3>{gallery.title} Galerisi</h3>
          </div>
          <button type="button" onClick={onClose}>Kapat</button>
        </header>

        <div className="hotel-gallery-main" style={{ backgroundImage: `linear-gradient(180deg, rgba(5, 7, 10, 0.08), rgba(5, 7, 10, 0.55)), url("${activePhoto}")` }}>
          <button className="gallery-arrow previous" type="button" onClick={goToPrevious} aria-label="Önceki fotoğraf">
            <ChevronRight size={22} />
          </button>
          <button className="gallery-arrow next" type="button" onClick={goToNext} aria-label="Sonraki fotoğraf">
            <ChevronRight size={22} />
          </button>
          <span>{photoIndex + 1} / {gallery.photos.length}</span>
        </div>

        <div className="hotel-gallery-thumbs">
          {gallery.photos.map((photo, index) => (
            <button
              className={photoIndex === index ? 'active' : ''}
              key={`${gallery.title}-${photo}`}
              style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(5, 7, 10, 0.42)), url("${photo}")` }}
              type="button"
              onClick={() => setPhotoIndex(index)}
              aria-label={`${gallery.title} fotoğraf ${index + 1}`}
            />
          ))}
        </div>
      </article>
    </div>
  )
}

function GuestReservationsPage({
  activeItem,
  guestMetrics,
  onBookAgain,
  onCancelReservation,
  onMessageHotel,
  reservations,
}: {
  activeItem: string
  guestMetrics: Metric[]
  onBookAgain: (reservation?: GuestReservation) => void
  onCancelReservation: (reservation: GuestReservation, reason: string, detail: string) => void
  onMessageHotel: () => void
  reservations: GuestReservation[]
}) {
  const [selectedReservationId, setSelectedReservationId] = usePersistentState<string | null>(
    GUEST_SELECTED_RESERVATION_STORAGE_KEY,
    null,
  )
  const previousActiveItemRef = useRef(activeItem)
  const status = reservationStatusForItem(activeItem)
  const reservationSectionOptions = [
    {
      className: 'glow-cyan layout-featured',
      reservations: prioritizeReservations(reservations, status).filter((reservation) => reservation.status === 'Aktif'),
      subtitle: 'Bugün takip edilmesi gereken onaylı konaklamalar',
      title: 'Aktif Rezervasyonlar',
    },
    {
      className: 'glow-gold layout-panorama',
      reservations: prioritizeReservations(reservations, status).filter((reservation) => reservation.status === 'Aktif'),
      subtitle: 'Giriş tarihi yaklaşan premium rezervasyon deneyimleri',
      title: 'Yaklaşan Konaklamalar',
    },
    {
      className: 'glow-emerald layout-slider',
      reservations: reservations.filter((reservation) => reservation.status === 'Geçmiş'),
      subtitle: 'Tamamlanan konaklamalar ve tekrar rezervasyon fırsatları',
      title: 'Geçmiş Konaklamalar',
    },
    {
      className: 'glow-violet layout-slider dense',
      reservations: reservations.filter((reservation) => reservation.status === 'İptal Edildi'),
      subtitle: 'İade ve yeniden planlama akışı tamamlanan rezervasyonlar',
      title: 'İptal Edilen Rezervasyonlar',
    },
  ]
  const activeReservationTitle =
    activeItem === 'Rezervasyonlarım'
      ? 'Aktif Rezervasyonlar'
      : activeItem === 'Geçmiş Rezervasyonlar'
      ? 'Geçmiş Konaklamalar'
      : activeItem === 'İptal İşlemleri' || activeItem === 'İptal Edilen Rezervasyonlar'
        ? 'İptal Edilen Rezervasyonlar'
        : 'Aktif Rezervasyonlar'
  const activeReservationSection =
    reservationSectionOptions.find((section) => section.title === activeReservationTitle) ?? reservationSectionOptions[0]
  const visibleReservationSections =
    activeItem === 'Rezervasyonlarım'
      ? reservationSectionOptions.filter((section) => ['Aktif Rezervasyonlar', 'Geçmiş Konaklamalar'].includes(section.title))
      : [activeReservationSection]
  const selectedReservation = selectedReservationId
    ? reservations.find((reservation) => reservation.id === selectedReservationId) ?? null
    : null

  useEffect(() => {
    if (selectedReservationId && !selectedReservation) {
      setSelectedReservationId(null)
    }
  }, [selectedReservation, selectedReservationId, setSelectedReservationId])

  useEffect(() => {
    if (previousActiveItemRef.current !== activeItem) {
      setSelectedReservationId(null)
      previousActiveItemRef.current = activeItem
    }
  }, [activeItem, setSelectedReservationId])

  if (selectedReservation) {
    return (
      <ReservationDetailPage
        reservation={selectedReservation}
        onBack={() => setSelectedReservationId(null)}
        onBookAgain={() => onBookAgain(selectedReservation)}
        onCancelReservation={onCancelReservation}
        onMessageHotel={onMessageHotel}
      />
    )
  }

  return (
    <section className="reservation-board cinematic-reservation-page">
      <article className={`cinematic-reservation-hero ${hotelMediaClass(1)}`}>
        <div>
          <span>Premium rezervasyon deneyimi</span>
          <h2>{activeItem}</h2>
          <p>
            Rezervasyon yaptığın tesisler büyük otel görselleri, oda önizlemeleri, ödeme özeti
            ve hızlı iletişim aksiyonlarıyla gösterilir.
          </p>
        </div>
        <div className="reservation-status-grid">
          {(['Aktif', 'Geçmiş', 'İptal Edildi'] as ReservationStatus[]).map((item) => (
            <div className={item === status ? 'active' : ''} key={item}>
              <span>{item}</span>
              <strong>{reservations.filter((reservation) => reservation.status === item).length}</strong>
            </div>
          ))}
        </div>
      </article>

      {visibleReservationSections.map((section, sectionIndex) => (
        <section className={`cinematic-reservation-section ${section.className}`} key={section.title}>
          <div className="cinematic-section-header">
            <div>
              <span>{section.title === 'Aktif Rezervasyonlar' ? 'Canlı rezervasyon takibi' : 'Konaklama kayıtları'}</span>
              <h3>{section.title}</h3>
              <p>{section.subtitle}</p>
            </div>
            <strong>{section.reservations.length} kayıt</strong>
          </div>
          <div className="cinematic-reservation-grid">
            {section.reservations.map((reservation, index) => (
              <CinematicReservationCard
                key={`${section.title}-${reservation.id}`}
                onBookAgain={onBookAgain}
                onMessageHotel={onMessageHotel}
                onViewReservation={(reservation) => setSelectedReservationId(reservation.id)}
                reservation={reservation}
                visualIndex={sectionIndex + index}
              />
            ))}
          </div>
        </section>
      ))}
      <GuestMetricsFooter metrics={guestMetrics} />
    </section>
  )
}

function CinematicReservationCard({
  onBookAgain,
  onMessageHotel,
  onViewReservation,
  reservation,
  visualIndex,
}: {
  onBookAgain: (reservation?: GuestReservation) => void
  onMessageHotel: () => void
  onViewReservation: (reservation: GuestReservation) => void
  reservation: GuestReservation
  visualIndex: number
}) {
  return (
    <article className={`cinematic-reservation-card ${reservation.hotelImageClass || hotelMediaClass(visualIndex)}`}>
      <div className="reservation-hero-layer">
        <span className="live-badge">{reservation.status}</span>
        <div className={`reservation-room-floating ${reservation.roomImageClass}`} aria-hidden="true"></div>
      </div>
      <div className="cinematic-reservation-info">
        <div className="cinematic-title-row">
          <div>
            <span>{reservation.code} • {reservation.paymentStatus}</span>
            <strong>{reservation.hotelName}</strong>
          </div>
          <span className="rating-pill">
            <CalendarCheck size={14} />
            {formatGuestDate(reservation.checkIn)}
          </span>
        </div>
        <p>
          {reservation.roomType ?? reservation.roomName} için {reservation.guestCount ?? 2} kişi ve {reservation.roomCount ?? 1} oda
          üzerinden premium konaklama rezervasyonu.
        </p>
        <div className="reservation-meta-grid">
          <div><span>Giriş</span><strong>{formatGuestDate(reservation.checkIn)}</strong></div>
          <div><span>Çıkış</span><strong>{formatGuestDate(reservation.checkOut)}</strong></div>
          <div><span>Kişi / oda</span><strong>{reservation.guestCount ?? 2} kişi • {reservation.roomCount ?? 1} oda</strong></div>
          <div><span>Toplam ödeme</span><strong>{formatCurrency(getReservationTotal(reservation))}</strong></div>
        </div>
        <div className="hotel-card-actions reservation-actions">
          <button type="button" onClick={onMessageHotel}>
            <MessageSquareText size={16} />
            Otelle Mesajlaş
          </button>
          <button type="button" onClick={() => onViewReservation(reservation)}>
            <Sparkles size={16} />
            Rezervasyonu Görüntüle
          </button>
          <button type="button" onClick={() => onBookAgain(reservation)}>
            <CalendarCheck size={16} />
            Tekrar Rezervasyon Yap
          </button>
        </div>
      </div>
    </article>
  )
}

function ReservationDetailPage({
  onBack,
  onBookAgain,
  onCancelReservation,
  onMessageHotel,
  reservation,
}: {
  onBack: () => void
  onBookAgain: () => void
  onCancelReservation: (reservation: GuestReservation, reason: string, detail: string) => void
  onMessageHotel: () => void
  reservation: GuestReservation
}) {
  const [invoiceNotice, setInvoiceNotice] = useState('')
  const [cancelDraft, setCancelDraft] = useState<{ detail: string; reason: string } | null>(null)
  const nights = calculateNights(reservation.checkIn, reservation.checkOut)
  const isPastReservation = reservation.status === 'Geçmiş'
  const isCancelledReservation = reservation.status === 'İptal Edildi'
  const canCancelReservation = reservation.status === 'Aktif'
  const reservationNotes = isPastReservation
    ? 'Bu konaklama tamamlandı. Kart yalnızca geçmiş rezervasyon kaydı olarak görüntülenir.'
    : isCancelledReservation
      ? 'Bu rezervasyon iptal edildi. Ödeme ve iade süreci kayıt altında tutulur.'
      : 'Rezervasyon onaylıdır. Check-in sırasında kimlik doğrulama ve ödeme durumu kontrol edilir.'

  return (
    <section className="reservation-detail-page">
      <button className="soft-action reservation-detail-back" type="button" onClick={onBack}>
        <ChevronRight size={16} />
        Rezervasyonlara dön
      </button>

      <article className={`reservation-detail-hero ${reservation.hotelImageClass}`}>
        <div className="reservation-detail-overlay">
          <span className="luxury-chip">{reservation.status}</span>
          <h2>{reservation.hotelName}</h2>
          <p>{reservation.roomName} rezervasyon detayları, ödeme bilgileri ve otel iletişim aksiyonları.</p>
          <div className="reservation-detail-actions">
            <button className="premium-login-button" type="button" onClick={onMessageHotel}>
              <MessageSquareText size={17} />
              Otelle Mesajlaş
            </button>
            <button type="button" onClick={() => setInvoiceNotice('Fatura ön izlemesi güvenli şekilde hazırlandı.')}>
              <ReceiptText size={17} />
              Fatura Görüntüle
            </button>
            <button type="button" onClick={onBookAgain}>
              <CalendarCheck size={17} />
              Tekrar Rezervasyon Yap
            </button>
            {canCancelReservation ? (
              <button className="danger-soft-action" type="button" onClick={() => setCancelDraft({ detail: '', reason: 'Plan değişikliği' })}>
                <CircleAlert size={17} />
                Rezervasyonu İptal Et
              </button>
            ) : null}
          </div>
          {invoiceNotice ? <span className="inline-success">{invoiceNotice}</span> : null}
        </div>
      </article>

      <section className="reservation-detail-grid">
        <article className="glass-panel reservation-detail-main">
          <PanelHeader icon={<Hotel size={18} />} title="Rezervasyon Bilgileri" subtitle={reservation.code} />
          <div className={`reservation-detail-room ${reservation.roomImageClass}`} aria-hidden="true"></div>
          <div className="reservation-detail-data">
            <div><span>Oda tipi</span><strong>{reservation.roomName}</strong></div>
            <div><span>Giriş tarihi</span><strong>{formatGuestDate(reservation.checkIn)}</strong></div>
            <div><span>Çıkış tarihi</span><strong>{formatGuestDate(reservation.checkOut)}</strong></div>
            <div><span>Gece sayısı</span><strong>{nights}</strong></div>
            <div><span>Misafir sayısı</span><strong>{reservation.guestCount ?? 2} kişi</strong></div>
            <div><span>Oda sayısı</span><strong>{reservation.roomCount ?? 1} oda</strong></div>
            <div><span>Toplam ödeme</span><strong>{formatCurrency(getReservationTotal(reservation))}</strong></div>
            <div><span>Ödeme durumu</span><strong>{reservation.paymentStatus}</strong></div>
            <div><span>Rezervasyon durumu</span><strong>{reservation.status}</strong></div>
          </div>
        </article>

        <aside className="reservation-detail-side">
          <article className="glass-panel contact-card">
            <PanelHeader icon={<MessageSquareText size={18} />} title="Otel İletişimi" subtitle="Rezervasyon bağlantılı iletişim" />
            <strong>{reservation.hotelName}</strong>
            <span>Rezervasyon hattı: +90 212 000 00 00</span>
            <span>E-posta: rezervasyon@tesis.local</span>
            <span>Yanıt süresi: ortalama 5 dakika</span>
            <button type="button" onClick={onMessageHotel}>
              <MessageSquareText size={16} />
              Mesaj Gönder
            </button>
          </article>

          <article className="glass-panel reservation-note-card">
            <PanelHeader icon={<ShieldCheck size={18} />} title="Check-in / Check-out" subtitle="Operasyon notları" />
            <div>
              <strong>Check-in</strong>
              <span>14:00 sonrası, kimlik doğrulama ile yapılır.</span>
            </div>
            <div>
              <strong>Check-out</strong>
              <span>12:00 öncesi. Geç çıkış otel müsaitliğine göre değerlendirilir.</span>
            </div>
            <p>{reservation.notes ?? reservationNotes}</p>
          </article>
        </aside>
      </section>
      {cancelDraft ? (
        <div className="admin-action-modal" role="dialog" aria-modal="true">
          <article className="glass-panel">
            <PanelHeader icon={<CircleAlert size={18} />} title="Rezervasyonu İptal Et" subtitle="İptal nedeni oda stoğu, gelir ve otel sahibi bildirimlerine işlenir." />
            <label className="admin-reason-field">
              <span>İptal nedeni</span>
              <select value={cancelDraft.reason} onChange={(event) => setCancelDraft((current) => current ? { ...current, reason: event.target.value } : current)}>
                <option>Plan değişikliği</option>
                <option>Tarih değişikliği</option>
                <option>Fiyat / ödeme tercihi</option>
                <option>Otel ile ilgili soru</option>
                <option>Diğer</option>
              </select>
            </label>
            <label className="admin-reason-field">
              <span>Ek açıklama</span>
              <textarea value={cancelDraft.detail} placeholder="İstersen iptal detayını yazabilirsin." onChange={(event) => setCancelDraft((current) => current ? { ...current, detail: event.target.value } : current)} />
            </label>
            <div className="table-action-row">
              <button type="button" onClick={() => { onCancelReservation(reservation, cancelDraft.reason, cancelDraft.detail); setCancelDraft(null) }}>
                İptali Onayla
              </button>
              <button type="button" onClick={() => setCancelDraft(null)}>Vazgeç</button>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

function GuestMetricsFooter({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="guest-metrics-footer" aria-label="Misafir istatistik özeti">
      {metrics.map((metric) => (
        <article className={`guest-mini-metric ${metric.accent}`} key={`footer-${metric.label}`}>
          {guestMetricIcon(metric.label)}
          <div>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

function guestMetricIcon(label: string) {
  if (label === 'Aktif Rezervasyon') {
    return <CalendarCheck size={18} />
  }

  if (label === 'Favori Tesis') {
    return <Heart size={18} />
  }

  if (label === 'Misafir Puanı') {
    return <Star size={18} />
  }

  return <Hotel size={18} />
}

function FavoriteHotelsPage({
  favoriteHotelIds,
  hotelCustomizations,
  hotels,
  onOpenHotelDetail,
  onStartBooking,
  onToggleFavoriteHotel,
}: {
  favoriteHotelIds: string[]
  hotelCustomizations: Record<string, HotelCustomization>
  hotels: HotelRecord[]
  onOpenHotelDetail: (hotel: HotelRecord) => void
  onStartBooking: (hotelId?: string) => void
  onToggleFavoriteHotel: (hotelId: string) => void
}) {
  const favoriteHotels = hotels.filter((hotel) => favoriteHotelIds.includes(hotel.id))
  const visibleHotels = favoriteHotels.length > 0 ? favoriteHotels : hotels.slice(0, 3)

  return (
    <section className="hotel-discovery-page favorites-page">
      <article className="glass-panel wide discovery-hero favorite-hero">
        <div>
          <span>{favoriteHotels.length > 0 ? 'Kaydedilen favoriler' : 'Favori listesi önerileri'}</span>
          <h2>Favori Oteller</h2>
          <p>
            Beğendiğin tesisleri tek listede takip et, son eklenenleri gör ve hızlı rezervasyon
            kısayoluyla akışı devam ettir.
          </p>
        </div>
        <div className="favorite-pulse">
          <Heart size={28} />
          <strong>{favoriteHotels.length}</strong>
        </div>
      </article>

      {favoriteHotels.length === 0 ? (
        <p className="empty-state">Henüz favori otel eklenmedi. Aşağıdaki önerilerden kalp ikonuyla favori oluşturabilirsin.</p>
      ) : null}

      <section className="guest-hotel-grid discovery-hotel-grid">
        {visibleHotels.map((hotel, index) => {
          const isFavorite = favoriteHotelIds.includes(hotel.id)
          const startingPrice = getHotelStartingPrice(hotel, index, hotelCustomizations)

          return (
            <article className="guest-hotel-card discovery-card" key={`fav-${hotel.id}`}>
              <div className={`guest-hotel-media ${hotelMediaClass(index)}`} aria-hidden="true">
                <button
                  className={`favorite-button ${isFavorite ? 'active' : ''}`}
                  type="button"
                  onClick={() => onToggleFavoriteHotel(hotel.id)}
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="guest-hotel-body">
                <div className="guest-hotel-title">
                  <strong>{hotel.name}</strong>
                  <span><Star size={14} /> {hotel.starRating.toFixed(1)}</span>
                </div>
                <p>{hotel.city} • Son eklenen favoriler ve hızlı rezervasyon önizlemesi.</p>
                <div className="hotel-price-row">
                  <span>Başlangıç fiyatı</span>
                  <div className="hotel-price-values">
                    <strong>{formatCurrency(startingPrice)}</strong>
                  </div>
                </div>
                <div className="hotel-card-actions">
                  <button type="button" onClick={() => onOpenHotelDetail(hotel)}>
                    <Sparkles size={16} />
                    İncele
                  </button>
                  <button type="button" onClick={() => onStartBooking(hotel.id)}>
                    <CalendarCheck size={16} />
                    Hızlı Rezervasyon
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </section>
  )
}

function SavedRoomsPage({
  rooms,
  savedRoomIds,
  onBookRoom,
  onToggleSavedRoom,
}: {
  rooms: RoomOption[]
  savedRoomIds: string[]
  onBookRoom: (roomId?: string) => void
  onToggleSavedRoom: (roomId: string) => void
}) {
  const savedRooms = rooms.filter((room) => savedRoomIds.includes(room.id))
  const visibleRooms = savedRooms.length > 0 ? savedRooms : rooms
  const minRoomPrice = rooms.length > 0 ? Math.min(...rooms.map((room) => room.price)) : 0

  return (
    <section className="saved-room-page">
      <article className="glass-panel wide saved-room-hero">
        <PanelHeader icon={<Heart size={18} />} title="Kaydedilen Odalar" subtitle="Sonradan incelemek için kaydettiğin oda seçenekleri" />
        <div className="reservation-status-grid">
          <div className="active"><span>Kaydedilen</span><strong>{savedRooms.length}</strong></div>
          <div><span>En uygun fiyat</span><strong>{rooms.length > 0 ? formatCurrency(minRoomPrice) : 'Arama bekleniyor'}</strong></div>
          <div><span>Müsait oda</span><strong>{rooms.reduce((total, room) => total + room.available, 0)}</strong></div>
        </div>
      </article>

      {savedRooms.length === 0 ? (
        <p className="empty-state">Henüz kaydedilen oda yok. Aşağıdaki oda kartlarından kalp ikonuyla liste oluşturabilirsin.</p>
      ) : null}

      <div className="detail-room-grid">
        {visibleRooms.map((room) => {
          const isSaved = savedRoomIds.includes(room.id)

          return (
            <article className={`detail-room-card ${room.imageClass}`} key={`saved-${room.id}`}>
              <div className="detail-room-media" aria-hidden="true">
                <button className={`favorite-button ${isSaved ? 'active' : ''}`} type="button" onClick={() => onToggleSavedRoom(room.id)}>
                  <Heart size={18} />
                </button>
              </div>
              <div className="detail-room-body">
                <span>{room.type} • {room.size} • {room.capacity} kişi</span>
                <strong>{room.name}</strong>
                <div className="room-detail-list">
                  <span>{room.bedType}</span>
                  <span>{room.balcony}</span>
                  <span>{room.breakfastIncluded ? 'Kahvaltı dahil' : 'Kahvaltı opsiyonel'}</span>
                  <span>{room.refundPolicy}</span>
                </div>
                <button className="premium-login-button" type="button" onClick={() => onBookRoom(room.id)}>
                  <CalendarCheck size={17} />
                  Rezervasyon Akışına Geç
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function GuestMessagesPage({
  conversations,
  hotels,
  onNotify,
  profileName,
  setConversations,
  user,
}: {
  conversations: GuestConversation[]
  hotels: HotelRecord[]
  onNotify: (notification: GuestNotification) => void
  profileName: string | null
  setConversations: Dispatch<SetStateAction<GuestConversation[]>>
  user: AuthUser
}) {
  const [messageNav, setMessageNav] = usePersistentState<{
    activeConversationId: string
    category: string
    chatSearch: string
    selectedHotelId: string
  }>(GUEST_MESSAGES_NAV_STORAGE_KEY, {
    activeConversationId: conversations[0]?.id ?? '',
    category: 'Tümü',
    chatSearch: '',
    selectedHotelId: hotels[0]?.id ?? '',
  })
  const [chatDraft, setChatDraft] = useState('')
  const visibleHotels = hotels
  const activeConversationId = messageNav.activeConversationId
  const category = messageNav.category
  const chatSearch = messageNav.chatSearch
  const selectedHotelId = visibleHotels.some((hotel) => hotel.id === messageNav.selectedHotelId)
    ? messageNav.selectedHotelId
    : visibleHotels[0]?.id ?? ''
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0]
  const categories = ['Tümü', ...Array.from(new Set(conversations.map((conversation) => conversation.category)))]
  const filteredConversations = conversations.filter((conversation) => {
    const searchMatch = [conversation.hotelName, conversation.reservationCode, conversation.status]
      .join(' ')
      .toLocaleLowerCase('tr-TR')
      .includes(chatSearch.toLocaleLowerCase('tr-TR'))
    return (category === 'Tümü' || conversation.category === category) && searchMatch
  })

  useEffect(() => {
    if (activeConversationId && !conversations.some((conversation) => conversation.id === activeConversationId)) {
      setMessageNav((current) => ({ ...current, activeConversationId: conversations[0]?.id ?? '' }))
    }
  }, [activeConversationId, conversations, setMessageNav])

  const createConversation = () => {
    const hotel = visibleHotels.find((item) => item.id === selectedHotelId) ?? visibleHotels[0]

    if (!hotel) {
      return null
    }

    const conversationId = getGuestHotelConversationId(user.id, hotel.id)
    const existingConversation = conversations.find((conversation) => conversation.id === conversationId || conversation.conversationId === conversationId)

    if (existingConversation) {
      setMessageNav((current) => ({ ...current, activeConversationId: existingConversation.id }))
      return existingConversation
    }

    const nextConversation: GuestConversation = {
      conversationId,
      guestId: user.id,
      guestName: profileName ?? (`${user.firstName} ${user.lastName}`.trim() || user.email),
      id: conversationId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      ownerId: `owner-${hotel.id}`,
      receiverId: `owner-${hotel.id}`,
      category: 'Otel sohbeti',
      messages: [],
      reservationCode: 'Genel görüşme',
      status: 'Yanıt bekliyor',
      unreadCount: 0,
      userId: user.id,
      updatedAt: formatDateTime(new Date()),
    }

    setConversations((current) => [nextConversation, ...current])
    setMessageNav((current) => ({ ...current, activeConversationId: nextConversation.id }))
    return nextConversation
  }

  const openConversation = (conversationId: string) => {
    setMessageNav((current) => ({ ...current, activeConversationId: conversationId }))
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
              messages: conversation.messages.map((message) =>
                message.sender === 'Otel Sahibi' || message.sender === 'Otel'
                  ? { ...message, read: true, status: 'Okundu' }
                  : message,
              ),
            }
          : conversation,
      ),
    )
  }

  const sendMessage = () => {
    const text = chatDraft.trim()

    if (!text) {
      return
    }

    const targetConversation = activeConversation ?? createConversation()

    if (!targetConversation) {
      return
    }

    setConversations((current) => {
      const conversationExists = current.some((conversation) => conversation.id === targetConversation.id)
      const messageTime = formatDateTime(new Date())
      const nextMessage: ConversationMessage = {
        createdAt: messageTime,
        id: `msg-${Date.now()}`,
        messageText: text,
        read: false,
        readStatus: 'İletildi',
        receiverId: targetConversation.ownerId ?? `owner-${targetConversation.hotelId ?? 'hotel'}`,
        sender: 'Misafir',
        senderId: user.id,
        status: 'İletildi',
        text,
        time: messageTime,
      }

      if (!conversationExists) {
        return [
          {
            ...targetConversation,
            guestId: user.id,
            guestName: targetConversation.guestName ?? profileName ?? user.email,
            messages: [nextMessage],
            status: 'Yanıt bekliyor',
            unreadCount: 0,
            updatedAt: messageTime,
            userId: user.id,
          },
          ...current,
        ]
      }

      return current.map((conversation) =>
        conversation.id === targetConversation.id
          ? {
              ...conversation,
              guestId: conversation.guestId ?? user.id,
              guestName: conversation.guestName ?? profileName ?? user.email,
              status: 'Yanıt bekliyor',
              updatedAt: messageTime,
              userId: conversation.userId ?? user.id,
              messages: [
                ...conversation.messages,
                nextMessage,
              ],
            }
          : conversation,
      )
    })
    onNotify(createSystemNotification('Mesaj', 'Otele mesaj gönderildi', `${targetConversation.hotelName} için sohbet kaydı oluşturuldu.`, 'Otel Mesajları'))
    setChatDraft('')
  }

  return (
    <section className="chat-page">
      <article className="glass-panel chat-sidebar-panel">
        <PanelHeader icon={<MessageSquareText size={18} />} title="Otel Mesajları" subtitle="Rezervasyon bağlantılı konuşmalar" />
        <label className="dashboard-search compact-search">
          <Search size={16} />
          <input value={chatSearch} onChange={(event) => setMessageNav((current) => ({ ...current, chatSearch: event.target.value }))} placeholder="Sohbet ara" />
        </label>
        <label className="security-select-field">
          <span>Yeni sohbet için otel seç</span>
          <select value={selectedHotelId} onChange={(event) => setMessageNav((current) => ({ ...current, selectedHotelId: event.target.value }))}>
            {visibleHotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </label>
        <button className="secondary-auth-button" type="button" onClick={createConversation}>
          Otelle sohbet başlat
        </button>
        <div className="chat-filter-row">
          {categories.map((item) => (
            <button className={category === item ? 'active' : ''} key={item} type="button" onClick={() => setMessageNav((current) => ({ ...current, category: item }))}>
              {item}
            </button>
          ))}
        </div>
        <div className="conversation-list">
          {filteredConversations.map((conversation) => (
            <button
              className={activeConversation?.id === conversation.id ? 'active' : ''}
              key={conversation.id}
              type="button"
              onClick={() => openConversation(conversation.id)}
            >
              <strong>{conversation.hotelName}</strong>
              <span>{conversation.category} • {conversation.reservationCode}</span>
              <small>{conversation.status}</small>
              {conversation.messages.some((message) => message.sender === 'Otel Sahibi' && !message.read) ? <b>1</b> : null}
            </button>
          ))}
          {filteredConversations.length === 0 ? <p className="empty-state compact">Henüz otel sohbeti yok. Bir otel seçip mesaj başlatabilirsin.</p> : null}
        </div>
      </article>

      <article className="glass-panel chat-window-panel wide">
        {activeConversation ? (
          <>
            <div className="chat-window-header">
              <div>
                <span>{activeConversation.category}</span>
                <strong>{activeConversation.hotelName}</strong>
                <p>{activeConversation.reservationCode} bağlantılı konuşma</p>
              </div>
              <span className="system-status-pill">Gönderildi / iletildi / okundu takibi</span>
            </div>
            <div className="message-stack">
              {activeConversation.messages.map((message, index) => (
                <div className={`message-bubble ${message.sender === 'Misafir' ? 'mine' : ''}`} key={message.id ?? `${message.time}-${index}`}>
                  <span>{message.sender} • {message.time} • {message.status ?? (message.read ? 'Okundu' : 'İletildi')}</span>
                  <p>{message.text}</p>
                  {message.imageLabel ? <small><Camera size={14} /> {message.imageLabel}</small> : null}
                </div>
              ))}
              {activeConversation.messages.length === 0 ? <p className="empty-state compact">Bu otelle henüz mesajlaşma başlamadı.</p> : null}
            </div>
          </>
        ) : (
          <div className="empty-state">Mesajlaşmak için bir otel seç ve sohbet başlat.</div>
        )}
        <div className="chat-composer">
          <button type="button">
            <Camera size={17} />
            Görsel
          </button>
          <input value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder="Mesaj yaz" />
          <button className="premium-login-button" type="button" onClick={sendMessage}>
            Gönder
          </button>
        </div>
      </article>
    </section>
  )
}

function GuestProfilePage({
  guestProfile,
  user,
}: {
  guestProfile: GuestProfileResponse | null
  user: AuthUser
}) {
  const profileRows = [
    ['Ad Soyad', guestProfile ? `${guestProfile.firstName} ${guestProfile.lastName}` : `${user.firstName} ${user.lastName}`],
    ['T.C. Kimlik No', maskSensitive(guestProfile?.tcKimlikNo ?? '')],
    ['Telefon', guestProfile?.phone ?? 'Profil tamamlanmadı'],
    ['Doğum tarihi', guestProfile?.birthDate ?? 'Profil tamamlanmadı'],
    ['Adres', guestProfile ? `${guestProfile.address}, ${guestProfile.city}` : 'Profil tamamlanmadı'],
    ['Uyruk', guestProfile?.nationality ?? 'Profil tamamlanmadı'],
    ['Pasaport bilgileri', guestProfile?.passportNumber ? maskSensitive(guestProfile.passportNumber) : 'Gerekli değil'],
  ]
  const preferenceRows = [
    ['Dil', guestProfile?.preferredLanguage ?? 'Türkçe'],
    ['Yatak tercihi', guestProfile?.bedTypePreference ?? 'King yatak'],
    ['Kahvaltı', guestProfile?.breakfastPreference ? 'Tercih ediliyor' : 'Opsiyonel'],
    ['Sigara içilmeyen oda', guestProfile?.nonSmokingRoomPreference ? 'Evet' : 'Hayır'],
    ['Erişilebilirlik', guestProfile?.accessibilityNeeds ? 'İhtiyaç var' : 'Standart'],
    ['Acil kişi', guestProfile?.emergencyContactName ?? 'Profil tamamlanmadı'],
  ]

  return (
    <section className="profile-detail-page">
      <article className="glass-panel wide profile-identity-hero">
        <PanelHeader icon={<User size={18} />} title="Kişisel Bilgiler" subtitle="Kayıt sırasında girilen profil verileri otomatik görüntülenir" />
        <div className="profile-summary-strip">
          <div><span>Kullanıcı adı</span><strong>{user.username ?? user.email}</strong></div>
          <div><span>E-posta</span><strong>{user.email}</strong></div>
          <div><span>Rol</span><strong>{roleLabels[user.role]}</strong></div>
        </div>
      </article>

      <section className="profile-detail-grid">
        <article className="glass-panel">
          <PanelHeader icon={<ShieldCheck size={18} />} title="Kimlik ve İletişim" subtitle="Hassas alanlar maskeli gösterilir" />
          <DataList rows={profileRows} />
        </article>
        <article className="glass-panel">
          <PanelHeader icon={<Sparkles size={18} />} title="Konaklama Tercihleri" subtitle="Rezervasyon sırasında otomatik doldurulur" />
          <DataList rows={preferenceRows} />
        </article>
        <article className="glass-panel">
          <PanelHeader icon={<ReceiptText size={18} />} title="Fatura ve Ödeme Tercihi" subtitle="Rezervasyon ödeme adımına aktarılır" />
          <ActionFeed
            items={[
              `Fatura bilgisi: ${guestProfile?.invoiceInfo || 'Profil tamamlanmadı'}`,
              `Ödeme tercihi: ${guestProfile?.paymentPreference || 'Kredi Kartı'}`,
              `Özel istek: ${guestProfile?.specialRequests || 'Belirtilmedi'}`,
              `Evcil hayvan bilgisi: ${guestProfile?.petInfo || 'Yok'}`,
            ]}
          />
        </article>
      </section>
    </section>
  )
}

function PaymentMethodsPage() {
  const [preferredCard, setPreferredCard] = useState('card-1')
  const [cards, setCards] = useState([
    ['card-1', 'Seyahat kartı', '**** **** **** 4821', '08/29'],
    ['card-2', 'Yedek kart', '**** **** **** 1164', '03/28'],
  ])

  const addCard = () => {
    setCards((current) => [
      ...current,
      [`card-${current.length + 1}`, 'Yeni kart', '**** **** **** 9002', '12/30'],
    ])
  }

  return (
    <section className="payment-page">
      <article className="glass-panel wide payment-hero">
        <PanelHeader icon={<CreditCard size={18} />} title="Ödeme Yöntemleri" subtitle="Maskeli kart görüntüleme ve tercih edilen ödeme seçimi" />
        <button className="premium-login-button" type="button" onClick={addCard}>
          <CreditCard size={17} />
          Ödeme Yöntemi Ekle
        </button>
      </article>
      <section className="payment-card-grid">
        {cards.map(([id, nickname, maskedNumber, expiration]) => (
          <article className={`payment-card glass-panel ${preferredCard === id ? 'active' : ''}`} key={id}>
            <span>{nickname}</span>
            <strong>{maskedNumber}</strong>
            <p>Son kullanım: {expiration}</p>
            <button type="button" onClick={() => setPreferredCard(id)}>
              <ShieldCheck size={16} />
              {preferredCard === id ? 'Tercih edilen' : 'Tercih et'}
            </button>
          </article>
        ))}
      </section>
      <article className="glass-panel security-note-panel">
        <PanelHeader icon={<LockKeyhole size={18} />} title="Güvenli Saklama Notu" subtitle="Kart bilgileri arayüzde maskeli gösterilir" />
        <p>Gerçek ödeme altyapısında kart verisi PCI-DSS uyumlu ödeme sağlayıcı tokenı ile saklanmalıdır. Bu ekranda kullanıcıya güvenli ve maskeli görünüm sunulur.</p>
      </article>
    </section>
  )
}

function SecuritySettingsPage({
  onLogout,
  onNotify,
  setTwoFactorSettings,
  twoFactorSettings,
  user,
}: {
  onLogout: () => void
  onNotify: (notification: GuestNotification) => void
  setTwoFactorSettings: Dispatch<SetStateAction<TwoFactorSettings>>
  twoFactorSettings: TwoFactorSettings
  user: AuthUser
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailNotice, setEmailNotice] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneNotice, setPhoneNotice] = useState('')
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(true)
  const [activeDevices, setActiveDevices] = useState([
    ['device-1', 'MacBook Pro', 'Safari • İstanbul', 'Şu an aktif', '185.42.16.24'],
    ['device-2', 'iPhone', 'Mobil uygulama • İstanbul', 'Dün 22:18', '185.42.18.81'],
    ['device-3', 'Chrome Web', 'Ankara', '3 gün önce', '88.247.10.14'],
  ])
  const sessionRows = [
    ['08.05.2026 19:42', 'MacBook Safari', 'İstanbul', '185.42.16.24', 'Aktif'],
    ['07.05.2026 22:18', 'iPhone Uygulama', 'İstanbul', '185.42.18.81', 'Doğrulandı'],
    ['05.05.2026 11:04', 'Chrome Web', 'Ankara', '88.247.10.14', 'Kapandı'],
  ]

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordNotice('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Tüm şifre alanlarını doldurmalısın.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifre ve tekrar alanı eşleşmiyor.')
      return
    }

    setPasswordError('')
    setPasswordNotice('Şifre başarıyla güncellendi.')
    onNotify(createSystemNotification('Güvenlik', 'Şifreniz değiştirildi', 'Güvenlik ayarlarından şifre güncellemesi yapıldı.', 'Güvenlik Ayarları'))
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const sendEmailVerification = () => {
    setEmailNotice('Doğrulama maili gönderildi. Gelen kutunu kontrol edebilirsin.')
    setEmailVerified(true)
    onNotify(createSystemNotification('Güvenlik', 'E-posta doğrulandı', `${user.email} adresi doğrulandı.`, 'Güvenlik Ayarları'))
  }

  const sendPhoneCode = () => {
    setPhoneCodeSent(true)
    setPhoneNotice('Telefon doğrulama kodu gönderildi.')
  }

  const verifyPhoneCode = () => {
    if (phoneCode.trim().length < 4) {
      setPhoneNotice('Lütfen gelen doğrulama kodunu gir.')
      return
    }

    setPhoneVerified(true)
    setPhoneNotice('Telefon başarıyla doğrulandı.')
    onNotify(createSystemNotification('Güvenlik', 'Telefon doğrulandı', 'Telefon doğrulama kodu başarıyla onaylandı.', 'Güvenlik Ayarları'))
  }

  const toggleTwoFactor = () => {
    setTwoFactorSettings((current) => ({
      ...current,
      enabled: !current.enabled,
    }))
  }

  const changeTwoFactorMethod = (value: string) => {
    setTwoFactorSettings((current) => ({
      ...current,
      method: value === 'Telefon ile kod' ? 'phone' : 'email',
    }))
  }

  const removeDevice = (deviceId: string) => {
    setActiveDevices((current) => current.filter((item) => item[0] !== deviceId))
    onNotify(createSystemNotification('Güvenlik', 'Cihaz oturumu sonlandırıldı', 'Aktif cihazlar listeniz güncellendi.', 'Güvenlik Ayarları'))

    if (deviceId === CURRENT_DEVICE_ID) {
      onLogout()
    }
  }

  return (
    <section className="security-page">
      <article className="glass-panel wide security-hero">
        <PanelHeader icon={<LockKeyhole size={18} />} title="Güvenlik Ayarları" subtitle={`${user.email} hesabı için güvenlik merkezi`} />
        <div className="security-toggle-grid">
          <button className="active" type="button">
            <ShieldCheck size={16} />
            Şifre Değiştir
          </button>
          <button className={twoFactorSettings.enabled ? 'active' : ''} type="button" onClick={toggleTwoFactor}>
            <ShieldCheck size={16} />
            İki Adımlı Doğrulama
          </button>
          <button className={emailVerified ? 'active' : ''} type="button" onClick={sendEmailVerification}>
            <Mail size={16} />
            E-posta Doğrulama
          </button>
          <button className={phoneVerified ? 'active' : ''} type="button" onClick={sendPhoneCode}>
            <Users size={16} />
            Telefon Doğrulama
          </button>
          <button className={suspiciousAlerts ? 'active' : ''} type="button" onClick={() => setSuspiciousAlerts((current) => !current)}>
            <CircleAlert size={16} />
            Şüpheli Giriş Bildirimleri
          </button>
        </div>
      </article>

      <section className="security-grid interactive-security-grid">
        <article className="glass-panel security-form-card">
          <PanelHeader icon={<LockKeyhole size={18} />} title="Şifre Değiştir" subtitle="Hesap şifreni güvenli şekilde güncelle" />
          <form className="security-form" onSubmit={handlePasswordSubmit}>
            <label>
              <span>Eski şifre</span>
              <input value={currentPassword} type="password" onChange={(event) => setCurrentPassword(event.target.value)} />
            </label>
            <label>
              <span>Yeni şifre</span>
              <input value={newPassword} type="password" onChange={(event) => setNewPassword(event.target.value)} />
            </label>
            <label>
              <span>Yeni şifre tekrar</span>
              <input value={confirmPassword} type="password" onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
            {passwordError ? <p className="security-inline-alert error">{passwordError}</p> : null}
            {passwordNotice ? <p className="security-inline-alert success">{passwordNotice}</p> : null}
            <button className="premium-login-button" type="submit">
              <ShieldCheck size={17} />
              Şifreyi Güncelle
            </button>
          </form>
        </article>

        <article className="glass-panel security-control-card">
          <PanelHeader icon={<ShieldCheck size={18} />} title="İki Adımlı Doğrulama" subtitle="Ek giriş güvenliği" />
          <div className="security-toggle-row">
            <div>
              <strong>{twoFactorSettings.enabled ? 'Aktif' : 'Kapalı'}</strong>
              <span>{twoFactorSettings.enabled ? 'Girişlerde ikinci doğrulama istenir.' : 'Hesap yalnızca şifre ile korunur.'}</span>
            </div>
            <button className={twoFactorSettings.enabled ? 'toggle active' : 'toggle'} type="button" onClick={toggleTwoFactor}>
              <span></span>
            </button>
          </div>
          {twoFactorSettings.enabled ? (
            <label className="security-select-field">
              <span>Doğrulama yöntemi</span>
              <select value={twoFactorSettings.method === 'phone' ? 'Telefon ile kod' : 'E-posta ile kod'} onChange={(event) => changeTwoFactorMethod(event.target.value)}>
                <option>E-posta ile kod</option>
                <option>Telefon ile kod</option>
              </select>
            </label>
          ) : null}
        </article>

        <article className="glass-panel security-control-card">
          <PanelHeader icon={<CircleAlert size={18} />} title="Şüpheli Giriş Bildirimleri" subtitle="Yeni cihaz ve risk uyarıları" />
          <div className="security-toggle-row">
            <div>
              <strong>{suspiciousAlerts ? 'Bildirimler aktif' : 'Bildirimler kapalı'}</strong>
              <span>{suspiciousAlerts ? 'Şüpheli girişlerde e-posta ve panel bildirimi gönderilir.' : 'Risk uyarıları pasif durumda.'}</span>
            </div>
            <button className={suspiciousAlerts ? 'toggle active' : 'toggle'} type="button" onClick={() => setSuspiciousAlerts((current) => !current)}>
              <span></span>
            </button>
          </div>
        </article>

        <article className="glass-panel wide">
          <PanelHeader icon={<Activity size={18} />} title="Oturum Geçmişi" subtitle="Son güvenli giriş kayıtları" />
          <EnterpriseTable
            headers={['Tarih', 'Cihaz', 'Konum', 'IP', 'Durum']}
            rows={sessionRows}
          />
        </article>

        <article className="glass-panel security-devices-card">
          <PanelHeader icon={<Database size={18} />} title="Aktif Cihazlar" subtitle="Güvenli çıkış ve cihaz kontrolü" />
          <div className="active-device-list">
            {activeDevices.map(([id, device, detail, time, ip]) => (
              <div className="active-device-card" key={id}>
                <div>
                  <strong>{device}</strong>
                  <span>{detail}</span>
                  <small>{time} • {ip}</small>
                </div>
                <button type="button" onClick={() => removeDevice(id)}>
                  Bu cihazdan çıkış yap
                </button>
              </div>
            ))}
            {activeDevices.length === 0 ? <p className="empty-state compact">Aktif cihaz kaydı kalmadı.</p> : null}
          </div>
        </article>

        <article className="glass-panel security-verification-card">
          <PanelHeader icon={<Mail size={18} />} title="E-posta Doğrulama" subtitle="Hesap kurtarma ve bildirim güvenliği" />
          <div className="verification-status">
            <span className={emailVerified ? 'verified' : 'pending'}>{emailVerified ? 'Doğrulandı' : 'Doğrulama bekliyor'}</span>
            <p>{emailNotice || `${user.email} adresi için doğrulama maili gönderilebilir.`}</p>
          </div>
          <button type="button" onClick={sendEmailVerification}>
            <Mail size={16} />
            Doğrulama maili gönder
          </button>
        </article>

        <article className="glass-panel security-verification-card">
          <PanelHeader icon={<Users size={18} />} title="Telefon Doğrulama" subtitle="SMS kodu ile güvenli doğrulama" />
          <div className="verification-status">
            <span className={phoneVerified ? 'verified' : 'pending'}>{phoneVerified ? 'Telefon doğrulandı' : 'Kod bekleniyor'}</span>
            <p>{phoneNotice || 'Telefon numaranı doğrulamak için SMS kodu gönderebilirsin.'}</p>
          </div>
          <div className="phone-code-row">
            <button type="button" onClick={sendPhoneCode}>
              Kod gönder
            </button>
            <input value={phoneCode} placeholder={phoneCodeSent ? 'Gelen kod' : 'Önce kod gönder'} onChange={(event) => setPhoneCode(event.target.value)} />
            <button type="button" onClick={verifyPhoneCode}>
              Kodu doğrula
            </button>
          </div>
        </article>
      </section>
    </section>
  )
}

function GuestNotificationPreferencesPage() {
  const [preferences, setPreferences] = usePersistentState<GuestNotificationPreferences>(
    GUEST_NOTIFICATION_PREFS_STORAGE_KEY,
    {
      campaigns: true,
      emailEnabled: true,
      hotelMessages: true,
      inAppEnabled: true,
      reservations: true,
      security: true,
      support: true,
    },
  )
  const preferenceRows: Array<[keyof GuestNotificationPreferences, string, string]> = [
    ['reservations', 'Rezervasyon bildirimleri', 'Onay, iptal ve yaklaşan konaklama uyarıları'],
    ['hotelMessages', 'Otel mesajları', 'Otel cevapları ve rezervasyon bağlantılı mesajlar'],
    ['support', 'Destek yanıtları', 'Destek talebi ve canlı destek güncellemeleri'],
    ['campaigns', 'Kampanya bildirimleri', 'İndirim kodları ve favori otel kampanyaları'],
    ['security', 'Güvenlik bildirimleri', 'Kendi hesabınla ilgili güvenlik olayları'],
    ['emailEnabled', 'E-posta bildirimi', 'Önemli güncellemeleri e-posta ile al'],
    ['inAppEnabled', 'Sistem içi bildirim', 'Bildirim merkezinde anlık uyarı göster'],
  ]
  const togglePreference = (key: keyof GuestNotificationPreferences) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <section className="security-page notification-preference-page">
      <article className="glass-panel wide security-hero">
        <PanelHeader icon={<Bell size={18} />} title="Bildirim Tercihleri" subtitle="Misafir hesabın için hangi uyarıları almak istediğini seç." />
      </article>
      <section className="security-grid interactive-security-grid">
        {preferenceRows.map(([key, title, detail]) => (
          <article className="glass-panel security-control-card" key={key}>
            <PanelHeader icon={<Bell size={18} />} title={title} subtitle={detail} />
            <div className="security-toggle-row">
              <div>
                <strong>{preferences[key] ? 'Aktif' : 'Kapalı'}</strong>
                <span>{preferences[key] ? 'Bu bildirim türü açık.' : 'Bu bildirim türü kapalı.'}</span>
              </div>
              <button className={preferences[key] ? 'toggle active' : 'toggle'} type="button" onClick={() => togglePreference(key)}>
                <span></span>
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}

function getNotificationCategoryLabel(category: string) {
  const normalized = category.toLocaleLowerCase('tr-TR')

  if (normalized.includes('rezervasyon')) {
    return 'Rezervasyon'
  }

  if (normalized.includes('mesaj') || normalized.includes('otel')) {
    return 'Mesaj'
  }

  if (normalized.includes('destek') || normalized.includes('talep')) {
    return 'Destek'
  }

  if (normalized.includes('kampanya') || normalized.includes('indirim')) {
    return 'Kampanya'
  }

  if (normalized.includes('güven') || normalized.includes('şifre') || normalized.includes('cihaz') || normalized.includes('oturum')) {
    return 'Güvenlik'
  }

  return category || 'Genel'
}

function getNotificationCategoryClass(category: string) {
  const label = getNotificationCategoryLabel(category)

  if (label === 'Rezervasyon') {
    return 'reservation'
  }

  if (label === 'Mesaj') {
    return 'message'
  }

  if (label === 'Destek') {
    return 'support'
  }

  if (label === 'Kampanya') {
    return 'campaign'
  }

  if (label === 'Güvenlik') {
    return 'security'
  }

  return 'general'
}

function NotificationCenterPage({
  notifications,
  setActiveItem,
  setNotifications,
}: {
  notifications: GuestNotification[]
  setActiveItem: (item: string) => void
  setNotifications: Dispatch<SetStateAction<GuestNotification[]>>
}) {
  const unreadCount = notifications.filter((notification) => notification.unread).length
  const readCount = notifications.length - unreadCount

  const markNotificationAsRead = (notification: GuestNotification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, unread: false } : item,
      ),
    )

    if (notification.target) {
      setActiveItem(notification.target)
    }
  }

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <section className="notification-center-page">
      <article className="glass-panel wide notification-center-hero">
        <PanelHeader icon={<Bell size={18} />} title="Bildirim Merkezi" subtitle="Tüm sistem bildirimleri tek listede, kategori ve okundu durumuyla gösterilir." />
        <div className="notification-action-row">
          <span className="notification-mini-stat">Toplam <strong>{notifications.length}</strong></span>
          <span className="notification-mini-stat unread">Okunmamış <strong>{unreadCount}</strong></span>
          <span className="notification-mini-stat read">Okundu <strong>{readCount}</strong></span>
          <button type="button" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Tümünü okundu yap
          </button>
          <button className="danger-action" type="button" onClick={clearNotifications} disabled={notifications.length === 0}>
            Bildirimleri temizle
          </button>
        </div>
      </article>

      <div className="notification-list">
        {notifications.map((notification) => {
          const categoryLabel = getNotificationCategoryLabel(notification.category)
          const categoryClass = getNotificationCategoryClass(notification.category)

          return (
            <button
              className={`notification-row ${notification.unread ? 'unread' : ''}`}
              key={notification.id}
              type="button"
              onClick={() => markNotificationAsRead(notification)}
            >
              <span className="notification-row-top">
                <span className={`notification-category ${categoryClass}`}>{categoryLabel}</span>
                <em>{notification.unread ? 'Okunmadı' : 'Okundu'}</em>
              </span>
              <strong>{notification.title}</strong>
              <p>{notification.detail}</p>
              <small>
                {notification.time}
                {notification.target ? ` • İlgili ekran: ${notification.target}` : ''}
              </small>
            </button>
          )
        })}
        {notifications.length === 0 ? (
          <p className="empty-state">Henüz sistem olayı oluşmadı. Rezervasyon, mesaj, destek veya güvenlik işlemleri yaptıkça bildirimler burada görünecek.</p>
        ) : null}
      </div>
    </section>
  )
}

function getBotSupportReply(message: string) {
  const normalized = message.toLocaleLowerCase('tr-TR')

  if (normalized.includes('iptal') || normalized.includes('iade')) {
    return 'Rezervasyon iptali için Rezervasyonlarım sayfasından ilgili rezervasyonu seçebilirsiniz.'
  }

  if (normalized.includes('ödeme') || normalized.includes('kart') || normalized.includes('provizyon')) {
    return 'Ödeme sorunları için kayıtlı kartınızı kontrol edebilir veya yeni ödeme yöntemi ekleyebilirsiniz.'
  }

  if (normalized.includes('otel') || normalized.includes('oda') || normalized.includes('mesaj')) {
    return 'Otel ile ilgili sorularınız için otel detay sayfasından mesaj gönderebilirsiniz.'
  }

  if (normalized.includes('şifre') || normalized.includes('güvenlik') || normalized.includes('doğrulama')) {
    return 'Şifre işlemleri için Güvenlik Ayarları bölümünü kullanabilirsiniz.'
  }

  return 'Talebinizi anladım. Rezervasyon, ödeme, otel mesajları veya hesap güvenliği başlıklarından biriyle ilerleyebiliriz.'
}

function SupportCenterHome({
  hotelMessageCount,
  onSelect,
  supportRequestCount,
  unreadSupportCount,
}: {
  hotelMessageCount: number
  onSelect: (item: string) => void
  supportRequestCount: number
  unreadSupportCount: number
}) {
  const sections = [
    {
      detail: `${hotelMessageCount} otel konuşması`,
      icon: <MessageSquareText size={20} />,
      title: 'Otel Mesajları',
    },
    {
      detail: unreadSupportCount > 0 ? `${unreadSupportCount} okunmamış canlı destek yanıtı` : 'Canlı destek ekibiyle anlık yazışma',
      icon: <Headphones size={20} />,
      title: 'Canlı Destek',
    },
    {
      detail: `${supportRequestCount} kayıtlı destek talebi`,
      icon: <FileText size={20} />,
      title: 'Destek Talepleri',
    },
    {
      detail: 'Rezervasyon, ödeme ve hesap konuları',
      icon: <Sparkles size={20} />,
      title: 'Yardım Merkezi',
    },
    {
      detail: 'En sık sorulan konaklama soruları',
      icon: <CircleAlert size={20} />,
      title: 'Sık Sorulan Sorular',
    },
  ]

  return (
    <section className="support-hub-page">
      <article className="glass-panel wide help-hero">
        <PanelHeader icon={<Headphones size={18} />} title="Destek Merkezi" subtitle="Otel mesajları, canlı destek ve destek talepleri tek merkezde ayrı akışlarla yönetilir." />
        <p>Canlı destek anlık sohbet içindir; destek talepleri ise konu bazlı ticket süreci olarak çalışır.</p>
      </article>
      <div className="support-hub-tabs">
        {sections.map((section) => (
          <button key={section.title} type="button" onClick={() => onSelect(section.title)}>
            {section.icon}
            <strong>{section.title}</strong>
            <span>{section.detail}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function GuestLiveSupportPage({
  onNotify,
  requests,
  setRequests,
}: {
  onNotify: (notification: GuestNotification) => void
  requests: SupportTicket[]
  setRequests: Dispatch<SetStateAction<SupportTicket[]>>
}) {
  const [draft, setDraft] = useState('')
  const [activeChatId, setActiveChatId] = usePersistentState<string | null>(GUEST_LIVE_SUPPORT_NAV_STORAGE_KEY, null)
  const supportAgents = readStoredValue<SupportAgentAccount[]>(SUPPORT_AGENTS_STORAGE_KEY, [])
  const liveChats = requests.filter((request) => request.category === 'Canlı destek')
  const activeChat = liveChats.find((request) => request.id === activeChatId)
    ?? liveChats.find((request) => request.status !== 'Kapatıldı')
    ?? liveChats[0]
  const assignedAgent = activeChat?.assignedAgent
    ? supportAgents.find((agent) => agent.username === activeChat.assignedAgent)
    : null
  const messages = activeChat?.messages ?? []
  const supportStatus = assignedAgent
    ? `${assignedAgent.displayName} • ${assignedAgent.status}`
    : supportAgents.some((agent) => agent.status !== 'Offline')
      ? 'Temsilci ataması bekleniyor'
      : 'Destek ekibi şu anda offline'

  const sendLiveMessage = () => {
    const text = draft.trim()

    if (!text) {
      return
    }

    const guestMessage: ConversationMessage = {
      id: `live-guest-${Date.now()}`,
      read: false,
      sender: 'Misafir',
      status: 'İletildi',
      text,
      time: formatDateTime(new Date()),
    }

    if (!activeChat || activeChat.status === 'Kapatıldı') {
      const assignedAgent = assignSupportAgent(requests)
      const ticketId = `LIVE-${Date.now().toString().slice(-6)}`
      setActiveChatId(ticketId)

      setRequests((current) => [
        {
          assignedAgent,
          category: 'Canlı destek',
          id: ticketId,
          lastUpdate: formatDateTime(new Date()),
          messages: [guestMessage],
          priority: 'Yüksek',
          status: 'Açık',
          subject: 'Canlı destek görüşmesi',
          unreadForAdmin: true,
          unreadForGuest: false,
        },
        ...current,
      ])
      onNotify(createSystemNotification('Destek', 'Canlı destek görüşmesi başlatıldı', `${ticketId} kodlu canlı sohbet destek ekibine iletildi.`, 'Canlı Destek'))
    } else {
      setRequests((current) =>
        current.map((request) =>
          request.id === activeChat.id
            ? {
                ...request,
                lastUpdate: formatDateTime(new Date()),
                messages: [...(request.messages ?? []), guestMessage],
                status: 'Açık',
                unreadForAdmin: true,
              }
            : request,
        ),
      )
    }

    setDraft('')
  }

  const markSupportRepliesAsRead = () => {
    if (!activeChat) {
      return
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === activeChat.id
          ? {
              ...request,
              unreadForGuest: false,
              messages: request.messages?.map((message) =>
                message.sender === 'Destek Temsilcisi'
                  ? { ...message, read: true, status: 'Okundu' }
                  : message,
              ),
            }
          : request,
      ),
    )
  }

  return (
    <section className="guest-live-support-page">
      <article className="glass-panel wide support-live-panel">
        <PanelHeader icon={<Headphones size={18} />} title="Canlı Destek" subtitle="Destek çalışanıyla anlık yazışma, okundu bilgisi ve kalıcı mesaj geçmişi" />
        <div className="reservation-status-grid">
          <div className="active"><span>Durum</span><strong>{supportStatus}</strong></div>
          <div><span>Görüşme</span><strong>{activeChat?.id ?? 'Yeni'}</strong></div>
          <div><span>Mesaj</span><strong>{messages.length}</strong></div>
        </div>
      </article>
      <article className="glass-panel chat-window-panel wide">
        <div className="message-stack">
          {messages.map((message, index) => (
            <div className={`message-bubble ${message.sender === 'Misafir' ? 'mine' : ''}`} key={message.id ?? `live-${index}`}>
              <span>{message.sender} • {message.time} • {message.status ?? 'Gönderildi'}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {messages.length === 0 ? <EmptyState text="Canlı destek için ilk mesajınızı yazın." compact /> : null}
          <div className="typing-indicator"><span></span><span></span><span></span>{assignedAgent ? `${assignedAgent.displayName} çevrim içi` : 'Uygun temsilci bekleniyor'}</div>
        </div>
        <div className="chat-composer">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Canlı destek mesajı yaz" />
          <button className="premium-login-button" type="button" onClick={sendLiveMessage}>Gönder</button>
        </div>
        {activeChat?.unreadForGuest ? (
          <button className="secondary-auth-button" type="button" onClick={markSupportRepliesAsRead}>
            Destek yanıtlarını okundu yap
          </button>
        ) : null}
      </article>
    </section>
  )
}

function SupportTicketCreatePage({
  onNotify,
  requests,
  setRequests,
}: {
  onNotify: (notification: GuestNotification) => void
  requests: SupportTicket[]
  setRequests: Dispatch<SetStateAction<SupportTicket[]>>
}) {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Rezervasyon İşlemleri')
  const [priority, setPriority] = useState('Orta')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const guestTickets = requests.filter((request) => request.category !== 'Canlı destek' && request.messages?.some((item) => item.sender === 'Misafir'))

  const createTicket = () => {
    if (!subject.trim() || !message.trim()) {
      setNotice('Konu ve açıklama alanı zorunludur.')
      return
    }

    const assignedAgent = assignSupportAgent(requests)
    const ticketId = `TK-${Date.now().toString().slice(-6)}`
    const guestMessage: ConversationMessage = {
      id: `guest-ticket-message-${Date.now()}`,
      read: false,
      sender: 'Misafir',
      status: 'İletildi',
      text: message.trim(),
      time: formatDateTime(new Date()),
    }

    setRequests((current) => [
      {
        assignedAgent,
        category,
        id: ticketId,
        lastUpdate: formatDateTime(new Date()),
        messages: [guestMessage],
        priority,
        status: 'Açık',
        subject: subject.trim(),
        unreadForAdmin: true,
        unreadForGuest: false,
      },
      ...current,
    ])
    onNotify(createSystemNotification('Destek', 'Destek talebiniz oluşturuldu', `${ticketId} kodlu talebiniz destek ekibine iletildi.`, 'Destek Talepleri'))
    setNotice(`${ticketId} kodlu destek talebi oluşturuldu${assignedAgent ? ` ve ${assignedAgent} kullanıcısına atandı` : ''}.`)
    setSubject('')
    setMessage('')
    setPriority('Orta')
    setCategory('Rezervasyon İşlemleri')
  }

  const markTicketAsRead = (ticketId: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === ticketId
          ? {
              ...request,
              unreadForGuest: false,
              messages: request.messages?.map((item) =>
                item.sender === 'Destek Temsilcisi' || item.sender === 'Yönetici'
                  ? { ...item, read: true, status: 'Okundu' }
                  : item,
              ),
            }
          : request,
      ),
    )
  }

  return (
    <section className="support-ticket-page">
      <article className="glass-panel wide support-live-panel">
        <PanelHeader icon={<FileText size={18} />} title="Destek Talepleri" subtitle="Canlı sohbetten ayrı, konu bazlı ticket süreci oluşturun." />
        <div className="management-form two-column">
          <label><span>Konu</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Örn. ödeme onayı görünmüyor" /></label>
          <label><span>Kategori</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Rezervasyon İşlemleri</option><option>Ödeme Sorunları</option><option>Hesap Güvenliği</option><option>Otel Mesajlaşma</option><option>Kampanya Kullanımı</option></select></label>
          <label><span>Öncelik</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Düşük</option><option>Orta</option><option>Yüksek</option></select></label>
          <label className="span-two"><span>Açıklama</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Talebinizi kısa ve net şekilde yazın." /></label>
        </div>
        {notice ? <p className="security-inline-alert success">{notice}</p> : null}
        <div className="table-action-row">
          <button type="button" onClick={createTicket} disabled={!subject.trim() || !message.trim()}>
            Destek Talebi Oluştur
          </button>
        </div>
      </article>

      <article className="glass-panel wide">
        <PanelHeader icon={<FileText size={18} />} title="Destek Taleplerim" subtitle="Canlı destek ekibine iletilen kalıcı talepler" />
        <div className="ticket-grid compact-ticket-grid">
          {guestTickets.map((ticket) => (
            <article className="ticket-card" key={`guest-ticket-${ticket.id}`}>
              <span className="live-badge">{ticket.status}</span>
              <strong>{ticket.id} • {ticket.category}</strong>
              <p>{ticket.subject}</p>
              <small>{ticket.priority} öncelik • {ticket.lastUpdate} • {ticket.assignedAgent ? `${ticket.assignedAgent} üzerinde` : 'Sırada'}</small>
              <div className="admin-response-box">
                {(ticket.messages ?? []).slice(-3).map((item, index) => (
                  <p key={`${ticket.id}-${index}`}><strong>{item.sender}:</strong> {item.text}</p>
                ))}
              </div>
              {ticket.unreadForGuest ? (
                <button className="secondary-auth-button" type="button" onClick={() => markTicketAsRead(ticket.id)}>
                  Yanıtı okundu yap
                </button>
              ) : null}
            </article>
          ))}
          {guestTickets.length === 0 ? <p className="empty-state compact">Henüz destek talebi oluşturulmadı.</p> : null}
        </div>
      </article>
    </section>
  )
}

function LiveSupportPage({
  onNotify,
  requests,
  setRequests,
}: {
  onNotify: (notification: GuestNotification) => void
  requests: SupportTicket[]
  setRequests: Dispatch<SetStateAction<SupportTicket[]>>
}) {
  const [supportDraft, setSupportDraft] = useState('')
  const [botReplyCount, setBotReplyCount] = useState(0)
  const [ticketNotice, setTicketNotice] = useState('')
  const [supportMessages, setSupportMessages] = useState<ConversationMessage[]>([
    {
      id: 'bot-welcome',
      read: true,
      sender: 'Destek Botu',
      status: 'Okundu',
      text: 'Merhaba, canlı destek botuna hoş geldiniz. Rezervasyon, ödeme, otel mesajları veya hesap güvenliği için kısa cevaplar verebilirim.',
      time: formatDateTime(new Date()),
    },
  ])
  const guestTickets = requests.filter((request) => request.messages?.some((message) => message.sender === 'Misafir'))
  const latestAdminReply = guestTickets.find((request) => request.unreadForGuest)

  const sendSupportMessage = (text: string) => {
    const message = text.trim()

    if (!message) {
      return
    }

    const lowerMessage = message.toLocaleLowerCase('tr-TR')

    if ((lowerMessage === 'evet' || lowerMessage.includes('canlı destek')) && botReplyCount >= 2) {
      createSupportTicket('Canlı desteğe bağlanmak istiyorum.')
      setSupportDraft('')
      return
    }

    if (lowerMessage === 'hayır' && botReplyCount >= 2) {
      setSupportMessages((current) => [
        ...current,
        {
          id: `support-${Date.now()}-guest`,
          read: true,
          sender: 'Misafir',
          status: 'Gönderildi',
          text: message,
          time: formatDateTime(new Date()),
        },
        {
          id: `support-${Date.now()}-bot`,
          read: true,
          sender: 'Destek Botu',
          status: 'Okundu',
          text: 'Tamam, bot desteğiyle devam edelim. Sorunu birkaç kelimeyle yazman yeterli.',
          time: formatDateTime(new Date()),
        },
      ])
      setSupportDraft('')
      return
    }

    const botReply = getBotSupportReply(message)

    setSupportMessages((current) => [
      ...current,
      {
        id: `support-${Date.now()}-guest`,
        read: true,
        sender: 'Misafir',
        status: 'Gönderildi',
        text: message,
        time: formatDateTime(new Date()),
      },
      {
        id: `support-${Date.now()}-bot`,
        read: true,
        sender: 'Destek Botu',
        status: 'Okundu',
        text: botReply,
        time: formatDateTime(new Date()),
      },
    ])
    setBotReplyCount((current) => current + 1)
    setSupportDraft('')
  }

  const createSupportTicket = (subject = 'Canlı destek bağlantı talebi') => {
    const sequence = requests.length + supportMessages.length + 1
    const ticketId = `TK-${2400 + sequence}`
    const guestMessage: ConversationMessage = {
      id: `support-ticket-${sequence}`,
      read: false,
      sender: 'Misafir',
      status: 'İletildi',
      text: subject,
      time: formatDateTime(new Date()),
    }

    setRequests((current) => [
      {
        id: ticketId,
        category: 'Canlı destek',
        priority: 'Orta',
        status: 'Açık',
        subject,
        lastUpdate: formatDateTime(new Date()),
        unreadForAdmin: true,
        unreadForGuest: false,
        messages: [...supportMessages, guestMessage],
      },
      ...current,
    ])
    setSupportMessages((current) => [
      ...current,
      guestMessage,
      {
        id: `support-${Date.now()}-bot-confirm`,
        read: true,
        sender: 'Destek Botu',
        status: 'Okundu',
        text: `Destek talebiniz oluşturuldu. Talep kodu: ${ticketId}`,
        time: formatDateTime(new Date()),
      },
    ])
    onNotify(createSystemNotification('Destek', 'Destek talebiniz oluşturuldu', `${ticketId} kodlu talep admin destek paneline iletildi.`, 'Canlı Destek'))
    setTicketNotice(`${ticketId} kodlu destek talebi admin paneline gönderildi.`)
  }

  const markGuestRepliesAsRead = () => {
    setRequests((current) =>
      current.map((request) =>
        request.unreadForGuest
          ? {
              ...request,
              unreadForGuest: false,
              messages: request.messages?.map((message) =>
                message.sender === 'Yönetici' ? { ...message, read: true, status: 'Okundu' } : message,
              ),
            }
          : request,
      ),
    )
  }

  return (
    <section className="live-support-page">
      <article className="glass-panel wide support-live-panel">
        <PanelHeader icon={<Headphones size={18} />} title="Canlı Destek" subtitle="Temsilci, hızlı yanıt ve akıllı öneriler" />
        <div className="support-quick-actions">
          {['Rezervasyonumu kontrol et', 'Ödeme yardımı istiyorum', 'Otele ulaşamıyorum', 'Şifre işlemleri'].map((item) => (
            <button key={item} type="button" onClick={() => sendSupportMessage(item)}>
              {item}
            </button>
          ))}
        </div>
        {botReplyCount >= 2 ? (
          <div className="human-support-prompt">
            <strong>Canlı desteğe bağlanmak ister misiniz?</strong>
            <div>
              <button type="button" onClick={() => createSupportTicket()}>Evet</button>
              <button type="button" onClick={() => sendSupportMessage('Hayır')}>Hayır</button>
            </div>
          </div>
        ) : null}
      </article>
      <article className="glass-panel chat-window-panel wide">
        <div className="message-stack">
          {supportMessages.map((message, index) => (
            <div className={`message-bubble ${message.sender === 'Misafir' ? 'mine' : ''}`} key={message.id ?? `${message.text}-${index}`}>
              <span>{message.sender} • {message.time} • {message.status ?? 'Gönderildi'}</span>
              <p>{message.text}</p>
            </div>
          ))}
          <div className="typing-indicator"><span></span><span></span><span></span>Destek botu hazır</div>
        </div>
        <div className="chat-composer">
          <input value={supportDraft} onChange={(event) => setSupportDraft(event.target.value)} placeholder="Destek mesajı yaz" />
          <button className="premium-login-button" type="button" onClick={() => sendSupportMessage(supportDraft)}>
            Gönder
          </button>
        </div>
      </article>
      <article className="glass-panel">
        <PanelHeader icon={<Sparkles size={18} />} title="Yapay Zeka Önerileri" subtitle="Destek hızlandırıcı cevaplar" />
        <ActionFeed items={['Rezervasyon kodunu paylaş', 'Ödeme ekran görüntüsü ekle', 'Otel mesaj geçmişini kontrol et', 'Acil talepleri yüksek öncelik yap']} />
        {ticketNotice ? <p className="security-inline-alert success">{ticketNotice}</p> : null}
        {latestAdminReply ? (
          <button className="secondary-auth-button" type="button" onClick={markGuestRepliesAsRead}>
            Yönetici yanıtını okundu yap
          </button>
        ) : null}
      </article>
      <article className="glass-panel wide">
        <PanelHeader icon={<FileText size={18} />} title="Destek Geçmişi" subtitle="Admin paneline iletilen kalıcı talepler" />
        <div className="ticket-grid compact-ticket-grid">
          {guestTickets.map((ticket) => (
            <article className="ticket-card" key={`guest-ticket-${ticket.id}`}>
              <span className="live-badge">{ticket.status}</span>
              <strong>{ticket.id} • {ticket.category}</strong>
              <p>{ticket.subject}</p>
              <small>{ticket.lastUpdate} • {ticket.unreadForGuest ? 'Yeni admin yanıtı' : 'Güncel'}</small>
              <div className="admin-response-box">
                {(ticket.messages ?? []).slice(-2).map((message, index) => (
                  <p key={`${ticket.id}-${index}`}><strong>{message.sender}:</strong> {message.text}</p>
                ))}
              </div>
            </article>
          ))}
          {guestTickets.length === 0 ? <p className="empty-state compact">Henüz admin destek talebi oluşturulmadı.</p> : null}
        </div>
      </article>
    </section>
  )
}

void LiveSupportPage

function HelpCenterPage() {
  return (
    <section className="help-center-page">
      <article className="glass-panel wide help-hero">
        <PanelHeader icon={<Headphones size={18} />} title="Yardım Merkezi" subtitle="Otel uygulaması destek konuları" />
        <p>Rezervasyon, iptal, ödeme, oda bilgisi, check-in ve hesap güvenliği konularında hızlı rehberlik.</p>
      </article>
      <section className="help-topic-grid">
        {helpTopics.map(([title, detail]) => (
          <article className="glass-panel help-topic-card" key={title}>
            <Sparkles size={20} />
            <strong>{title}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </section>
    </section>
  )
}

function FaqPage() {
  const [openQuestion, setOpenQuestion] = useState(faqItems[0][0])

  return (
    <section className="faq-page">
      <article className="glass-panel wide faq-hero">
        <PanelHeader icon={<CircleAlert size={18} />} title="Sık Sorulan Sorular" subtitle="Rezervasyon ve konaklama hakkında profesyonel yanıtlar" />
      </article>
      <div className="faq-list">
        {faqItems.map(([question, answer]) => (
          <button
            className={openQuestion === question ? 'active' : ''}
            key={question}
            type="button"
            onClick={() => setOpenQuestion(question)}
          >
            <strong>{question}</strong>
            {openQuestion === question ? <p>{answer}</p> : null}
          </button>
        ))}
      </div>
    </section>
  )
}

function adminSupportFilterForItem(activeItem: string) {
  const filters: Record<string, string> = {
    'Açık Talepler': 'Açık',
    'Bekleyen Talepler': 'Beklemede',
    'Canlı Destek Mesajları': 'Tüm mesajlar',
    'Destek Talepleri': 'Tüm mesajlar',
    'Kapatılan Talepler': 'Kapatıldı',
    'Yanıtlanan Talepler': 'Yanıtlandı',
  }

  return filters[activeItem] ?? 'Tüm mesajlar'
}

function AdminSupportMessagesPage({
  activeItem,
  onNotify,
  requests,
  setRequests,
}: {
  activeItem: string
  onNotify: (notification: GuestNotification) => void
  requests: SupportTicket[]
  setRequests: Dispatch<SetStateAction<SupportTicket[]>>
}) {
  const [activeTicketId, setActiveTicketId] = useState(requests[0]?.id ?? '')
  const [replyDraft, setReplyDraft] = useState('Merhaba, talebinizi inceledik. Gerekli kontrol tamamlandı ve size çözüm adımlarını iletiyoruz.')
  const [filter, setFilter] = useState(adminSupportFilterForItem(activeItem))
  const filteredRequests = requests.filter((request) => {
    if (filter === 'Okunmamış') {
      return request.unreadForAdmin
    }

    if (filter === 'Açık') {
      return request.status === 'Açık'
    }

    if (filter === 'Yanıtlandı') {
      return request.status === 'Yanıtlandı'
    }

    if (filter === 'Beklemede') {
      return request.status === 'Beklemede'
    }

    if (filter === 'Kapatıldı') {
      return request.status === 'Kapatıldı'
    }

    return true
  })
  const activeTicket = requests.find((request) => request.id === activeTicketId) ?? filteredRequests[0] ?? requests[0]
  const unreadCount = requests.filter((request) => request.unreadForAdmin).length

  const openTicket = (ticketId: string) => {
    setActiveTicketId(ticketId)
    setRequests((current) =>
      current.map((request) =>
        request.id === ticketId
          ? {
              ...request,
              unreadForAdmin: false,
              messages: request.messages?.map((message) =>
                message.sender === 'Misafir' ? { ...message, read: true, status: 'Okundu' } : message,
              ),
            }
          : request,
      ),
    )
  }

  const sendAdminReply = () => {
    const text = replyDraft.trim()

    if (!text || !activeTicket) {
      return
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === activeTicket.id
          ? {
              ...request,
              lastUpdate: formatDateTime(new Date()),
              status: 'Yanıtlandı',
              unreadForAdmin: false,
              unreadForGuest: true,
              messages: [
                ...(request.messages ?? []),
                {
                  id: `admin-support-${Date.now()}`,
                  read: false,
                  sender: 'Yönetici',
                  status: 'İletildi',
                  text,
                  time: formatDateTime(new Date()),
                },
              ],
            }
          : request,
      ),
    )
    onNotify(createSystemNotification('Destek', 'Destek talebiniz yanıtlandı', `${activeTicket.id} kodlu talebinize yönetici yanıt verdi.`, 'Canlı Destek'))
    setReplyDraft('')
  }

  const updateTicketStatus = (status: string) => {
    if (!activeTicket) {
      return
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === activeTicket.id
          ? { ...request, status, lastUpdate: formatDateTime(new Date()) }
          : request,
      ),
    )
  }

  return (
    <section className="admin-support-page">
      <article className="glass-panel wide owner-inbox-hero">
        <PanelHeader icon={<Headphones size={18} />} title="Canlı Destek Mesajları" subtitle={`${activeItem} • admin destek merkezi`} />
        <div className="reservation-status-grid">
          <div className="active"><span>Toplam talep</span><strong>{requests.length}</strong></div>
          <div><span>Okunmamış</span><strong>{unreadCount}</strong></div>
          <div><span>Yanıtlanan</span><strong>{requests.filter((request) => request.status === 'Yanıtlandı').length}</strong></div>
        </div>
      </article>

      <section className="chat-page owner-chat-layout">
        <article className="glass-panel chat-sidebar-panel">
          <PanelHeader icon={<Bell size={18} />} title="Destek Kuyruğu" subtitle="Talep filtresi ve öncelik" />
          <div className="chat-filter-row">
            {['Tüm mesajlar', 'Okunmamış', 'Açık', 'Beklemede', 'Yanıtlandı', 'Kapatıldı'].map((item) => (
              <button className={filter === item ? 'active' : ''} key={item} type="button" onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="conversation-list">
            {filteredRequests.map((request) => (
              <button
                className={activeTicket?.id === request.id ? 'active' : ''}
                key={`admin-support-${request.id}`}
                type="button"
                onClick={() => openTicket(request.id)}
              >
                <strong>{request.id} • {request.category}</strong>
                <span>{request.priority} öncelik • {request.subject}</span>
                <small>{request.status} • {request.lastUpdate}</small>
                {request.unreadForAdmin ? <b>1</b> : null}
              </button>
            ))}
            {filteredRequests.length === 0 ? <p className="empty-state compact">Bu filtrede destek mesajı yok.</p> : null}
          </div>
        </article>

        <article className="glass-panel chat-window-panel wide">
          {activeTicket ? (
            <>
              <div className="chat-window-header">
                <div>
                  <span>{activeTicket.category} • {activeTicket.priority} öncelik</span>
                  <strong>{activeTicket.subject}</strong>
                  <p>{activeTicket.id} kodlu destek talebi</p>
                </div>
                <span className="system-status-pill">{activeTicket.status}</span>
              </div>
              <div className="message-stack">
                {(activeTicket.messages ?? []).map((message, index) => (
                  <div className={`message-bubble ${message.sender === 'Yönetici' ? 'mine' : ''}`} key={message.id ?? `support-message-${index}`}>
                    <span>{message.sender} • {message.time} • {message.status ?? 'İletildi'}</span>
                    <p>{message.text}</p>
                  </div>
                ))}
                {(activeTicket.messages ?? []).length === 0 ? <p className="empty-state compact">Bu talepte mesaj geçmişi yok.</p> : null}
              </div>
              <div className="support-admin-actions">
                {['Açık', 'Beklemede', 'Yanıtlandı', 'Kapatıldı'].map((status) => (
                  <button className={activeTicket.status === status ? 'active' : ''} key={status} type="button" onClick={() => updateTicketStatus(status)}>
                    {status}
                  </button>
                ))}
              </div>
              <div className="quick-reply-panel">
                <label>
                  <span>Yönetici yanıtı</span>
                  <textarea value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} />
                </label>
                <button className="premium-login-button" type="button" onClick={sendAdminReply}>
                  Yanıtı Gönder
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">Henüz admin destek talebi yok.</div>
          )}
        </article>
      </section>
    </section>
  )
}

function OwnerSupportInbox({
  activeItem,
  conversations,
  onNotify,
  setConversations,
}: {
  activeItem: string
  conversations: GuestConversation[]
  onNotify: (notification: GuestNotification) => void
  setConversations: Dispatch<SetStateAction<GuestConversation[]>>
}) {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id ?? '')
  const [quickReply, setQuickReply] = useState('Merhaba, talebinizi rezervasyon kaydınızla eşleştirdik ve ilgili ekibe aktardık.')
  const [filter, setFilter] = useState('Tüm mesajlar')
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0]
  const filteredConversations = conversations.filter((conversation) => {
    if (filter === 'Okunmamış') {
      return conversation.messages.some((message) => message.sender === 'Misafir' && message.status !== 'Okundu')
    }

    if (filter === 'Cevaplanan') {
      return conversation.messages.some((message) => message.sender === 'Otel Sahibi')
    }

    if (filter === 'Rezervasyon bağlantılı') {
      return conversation.category.includes('Rezervasyon') || conversation.reservationCode.startsWith('RZ-')
    }

    return true
  })
  const unreadCount = conversations.filter((conversation) =>
    conversation.messages.some((message) => message.sender === 'Misafir' && message.status !== 'Okundu'),
  ).length
  const latestConversationUpdate = conversations
    .map((conversation) => conversation.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) ?? 'Kayıt yok'

  const openConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.sender === 'Misafir'
                  ? { ...message, read: true, status: 'Okundu' }
                  : message,
              ),
            }
          : conversation,
      ),
    )
  }

  const sendOwnerReply = () => {
    const text = quickReply.trim()

    if (!text || !activeConversation) {
      return
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              status: 'Cevaplanan',
              updatedAt: formatDateTime(new Date()),
              messages: [
                ...conversation.messages,
                {
                  createdAt: formatDateTime(new Date()),
                  id: `msg-${Date.now()}`,
                  messageText: text,
                  read: false,
                  readStatus: 'İletildi',
                  receiverId: activeConversation.guestId ?? activeConversation.userId,
                  sender: 'Otel Sahibi',
                  senderId: activeConversation.ownerId ?? `owner-${activeConversation.hotelId ?? 'hotel'}`,
                  status: 'İletildi',
                  text,
                  time: formatDateTime(new Date()),
                },
              ],
            }
          : conversation,
      ),
    )
    onNotify(createSystemNotification('Mesaj', 'Mesajınıza geri dönüş yapıldı', `${activeConversation.hotelName} yeni bir yanıt gönderdi.`, 'Otel Mesajları'))
    setQuickReply('')
  }

  return (
    <section className="owner-inbox-page">
      <article className="glass-panel wide owner-inbox-hero">
        <PanelHeader icon={<MessageSquareText size={18} />} title="Misafir Destek Gelen Kutusu" subtitle={`${activeItem} • rezervasyon bağlantılı konuşma yönetimi`} />
	        <div className="reservation-status-grid">
	          <div className="active"><span>Açık konuşma</span><strong>{conversations.length}</strong></div>
	          <div><span>Son güncelleme</span><strong>{latestConversationUpdate}</strong></div>
	          <div><span>Okunmamış</span><strong>{unreadCount}</strong></div>
	        </div>
      </article>

      <section className="chat-page owner-chat-layout">
        <article className="glass-panel chat-sidebar-panel">
          <PanelHeader icon={<Bell size={18} />} title="Misafir Kutusu" subtitle="Filtre ve destek durumu" />
          <div className="chat-filter-row">
            {['Tüm mesajlar', 'Okunmamış', 'Cevaplanan', 'Rezervasyon bağlantılı'].map((item) => (
              <button className={filter === item ? 'active' : ''} key={item} type="button" onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="conversation-list">
            {filteredConversations.map((conversation) => (
              <button
                className={conversation.id === activeConversationId ? 'active' : ''}
                key={`owner-${conversation.id}`}
                type="button"
                onClick={() => openConversation(conversation.id)}
              >
                <strong>{conversation.guestName ?? 'Misafir'} • {conversation.hotelName}</strong>
                <span>{conversation.reservationCode} • {conversation.category}</span>
                <small>{conversation.status}</small>
                {conversation.messages.some((message) => message.sender === 'Misafir' && message.status !== 'Okundu') ? <b>1</b> : null}
              </button>
            ))}
            {filteredConversations.length === 0 ? <p className="empty-state compact">Bu filtrede mesaj yok.</p> : null}
          </div>
        </article>

        <article className="glass-panel chat-window-panel wide">
          {activeConversation ? (
            <>
              <div className="chat-window-header">
                <div>
                  <span>Misafir konuşması</span>
                  <strong>{activeConversation.guestName ?? 'Misafir'} • {activeConversation.hotelName}</strong>
                  <p>{activeConversation.reservationCode} bağlantılı operasyon notu</p>
                </div>
                <span className="system-status-pill">Otel sahibi yetkisi</span>
              </div>
              <div className="message-stack">
                {activeConversation.messages.map((message, index) => (
                  <div className={`message-bubble ${message.sender === 'Otel Sahibi' ? 'mine' : ''}`} key={message.id ?? `owner-message-${index}`}>
                    <span>{message.sender} • {message.time} • {message.status ?? 'İletildi'}</span>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="quick-reply-panel">
                <label>
                  <span>Hızlı yanıt</span>
                  <textarea value={quickReply} onChange={(event) => setQuickReply(event.target.value)} />
                </label>
                <button className="premium-login-button" type="button" onClick={sendOwnerReply}>
                  Yanıtı Gönder
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">Henüz misafir mesajı yok.</div>
          )}
        </article>
      </section>
    </section>
  )
}

function PanelHeader({
  icon,
  subtitle,
  title,
}: {
  icon: ReactNode
  subtitle: string
  title: string
}) {
  return (
    <div className="panel-header">
      <div className="panel-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function BarGraph({ values }: { values: number[] }) {
  return (
    <div className="bar-graph" aria-hidden="true">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ '--height': `${value}%` } as CSSProperties}></span>
      ))}
    </div>
  )
}

function LineGraph({ values }: { values: number[] }) {
  return (
    <div className="line-graph" aria-hidden="true">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ '--height': `${value}%` } as CSSProperties}></span>
      ))}
    </div>
  )
}

function Heatmap({ values }: { values: number[] }) {
  return (
    <div className="heatmap" aria-hidden="true">
      {values.map((value, index) => (
        <span
          className={value > 85 ? 'hot' : value > 70 ? 'warm' : 'calm'}
          key={`${value}-${index}`}
        >
          {value}
        </span>
      ))}
    </div>
  )
}

function DataList({ rows }: { rows: string[][] }) {
  return (
    <div className="data-list">
      {rows.map((row) => (
        <div className="data-row" key={row.join('-')}>
          {row.map((cell) => (
            <span key={cell}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

function ActionFeed({ items }: { items: string[] }) {
  return (
    <div className="action-feed">
      {items.map((item) => (
        <div key={item}>
          <span></span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  )
}

function EnterpriseTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="premium-table">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>
                  {index === row.length - 1 ? (
                    <span className="live-badge">{cell}</span>
                  ) : index === 0 ? (
                    <strong>{cell}</strong>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProgressStack({ items }: { items: ProgressItem[] }) {
  return (
    <div className="progress-stack">
      {items.map((item) => (
        <div className="progress-row" key={item.label}>
          <div>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
          </div>
          <small>{item.value}%</small>
          <div className="progress-track" aria-hidden="true">
            <span style={{ '--value': `${item.value}%` } as CSSProperties}></span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getPermittedPanels(role: ManagementRole) {
  if (role === 'SuperAdmin') {
    return ['admin'] as DashboardPanelId[]
  }

  return ['owner'] as DashboardPanelId[]
}

function panelIcon(panelId: DashboardPanelId) {
  const icons: Record<DashboardPanelId, ReactNode> = {
    admin: <ShieldCheck size={17} />,
    owner: <Hotel size={17} />,
    reception: <DoorOpen size={17} />,
    staff: <UserCog size={17} />,
    accounting: <WalletCards size={17} />,
    technical: <Settings2 size={17} />,
  }

  return icons[panelId]
}

function getOwnerPageType(activeItem: string): OwnerPageType {
  if (activeItem === 'Otel Ekle') {
    return 'addHotel'
  }

  if (
	    [
	      'Oda Yönetimi',
	      'Oda Listesi',
      'Yeni Oda Ekle',
      'Oda Düzenleme',
      'Oda Görselleri',
      'Oda Özellikleri',
    ].includes(activeItem)
  ) {
    return 'room'
  }

  if (
	    [
	      'Fiyat Yönetimi',
	      'Günlük Fiyatlar',
      'Sezonluk Fiyatlar',
      'Hafta Sonu Fiyatları',
      'İndirim Tanımları',
      'Dinamik Fiyatlandırma',
    ].includes(activeItem)
  ) {
    return 'price'
  }

  if (
	    [
	      'Rezervasyon Yönetimi',
	      'Aktif Rezervasyonlar',
	      'İptal Edilen Rezervasyonlar',
	      'Rezervasyon Onayları',
      'İptal Yönetimi',
      'Müşteri Notları',
      'VIP İşaretleme',
      'Check-in / Check-out',
    ].includes(activeItem)
  ) {
    return 'reservation'
  }

  if (
	    [
	      'Görsel Yönetimi',
	      'Otel Görselleri',
      'Kapak Görseli',
      'Galeri Düzenleme',
      'Oda Görsel Sıralama',
    ].includes(activeItem)
  ) {
    return 'gallery'
  }

  return 'settings'
}

function ownerPageDescription(pageType: OwnerPageType) {
  const descriptions: Record<OwnerPageType, string> = {
    addHotel: 'Yeni tesis başvurusu, yönetici onayı sonrası aktifleşecek şekilde kayıt altına alınır.',
    room: 'Oda ekleme, düzenleme, silme, kapasite, açıklama ve özellik seçimi için tam sayfa yönetim deneyimi.',
    price: 'Günlük fiyat, sezonluk fiyat, hafta sonu kuralı, indirim ve dinamik fiyatlandırma ayarları.',
    reservation: 'Rezervasyon onayı, iptal yönetimi, müşteri notları, VIP işaretleme ve check-in/check-out kontrolü.',
    gallery: 'Otel kapak görseli, galeri düzeni, oda görsel sıralaması ve yüksek çözünürlüklü medya yönetimi.',
    settings: 'Otel açıklaması, hizmet bilgileri, iletişim, konum ve sosyal medya bağlantıları yönetimi.',
  }

  return descriptions[pageType]
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = parseDateInputValue(checkIn)?.getTime()
  const end = parseDateInputValue(checkOut)?.getTime()

  if (typeof start !== 'number' || typeof end !== 'number' || !Number.isFinite(start) || !Number.isFinite(end)) {
    return 1
  }

  const diff = Math.ceil((end - start) / 86_400_000)

  return Math.max(diff, 1)
}

function reservationMatchesHotel(reservation: GuestReservation, hotel: HotelRecord) {
  return idsMatch(reservation.hotelId, hotel.id)
}

function findHotelForReservationRecord(reservation: GuestReservation, hotels: HotelRecord[]) {
  const matchedById = hotels.find((hotel) => idsMatch(reservation.hotelId, hotel.id))

  if (matchedById) {
    return matchedById
  }

  return hotels.find((hotel) => normalizeSearch(reservation.hotelName ?? '') === normalizeSearch(hotel.name))
}

function reservationMatchesRoom(reservation: GuestReservation, room: RoomOption) {
  if (reservation.roomId) {
    return idsMatch(reservation.roomId, room.id)
  }

  const reservationRoomName = normalizeSearch(reservation.roomName ?? '')
  const reservationRoomType = normalizeSearch(reservation.roomType ?? '')
  const roomName = normalizeSearch(room.name)
  const roomType = normalizeSearch(room.type)

  return (
    idsMatch(reservation.roomId, room.id) ||
    reservationRoomName === roomName ||
    reservationRoomType === roomType ||
    (reservationRoomName.length > 0 && reservationRoomName.includes(roomType)) ||
    (roomName.length > 0 && roomName.includes(reservationRoomName))
  )
}

function getReservedRoomCount(room: RoomOption, reservations: GuestReservation[]) {
  return reservations
    .filter((reservation) => normalizeSearch(getReservationStatus(reservation)).includes('aktif') && reservationMatchesRoom(reservation, room))
    .reduce((total, reservation) => total + (reservation.roomCount ?? 1), 0)
}

function getEffectiveRoomAvailability(room: RoomOption, reservations: GuestReservation[]) {
  return Math.max((room.available ?? 0) - getReservedRoomCount(room, reservations), 0)
}

function getRoomsForReservation(
  reservation: GuestReservation,
  hotels: HotelRecord[] = [],
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  const matchedHotel = findHotelForReservationRecord(reservation, hotels)
  const hotelIndex = matchedHotel ? hotels.findIndex((hotel) => hotel.id === matchedHotel.id) : -1
  const hotel = hotelIndex >= 0 ? hotels[hotelIndex] : undefined

  return hotel ? getHotelRooms(hotel, hotelIndex, hotelCustomizations) : []
}

function parseStoredMoney(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value !== 'string') {
    return 0
  }

  const cleanedValue = value.replace(/[^\d,.-]/g, '')

  if (!cleanedValue) {
    return 0
  }

  const lastCommaIndex = cleanedValue.lastIndexOf(',')
  const lastDotIndex = cleanedValue.lastIndexOf('.')
  const normalizedValue = cleanedValue.includes(',') && cleanedValue.includes('.')
    ? lastCommaIndex > lastDotIndex
      ? cleanedValue.replace(/\./g, '').replace(',', '.')
      : cleanedValue.replace(/,/g, '')
    : /^\d{1,3}(\.\d{3})+$/.test(cleanedValue)
      ? cleanedValue.replace(/\./g, '')
      : /^\d{1,3}(,\d{3})+$/.test(cleanedValue)
        ? cleanedValue.replace(/,/g, '')
        : cleanedValue.replace(',', '.')
  const parsedValue = Number(normalizedValue)

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function normalizeRevenueAmount(value: unknown) {
  const parsedValue = parseStoredMoney(value)

  return parsedValue > 0 && parsedValue < 1000 ? Math.round(parsedValue * 1000) : parsedValue
}

function uniqueServiceNames(services: string[]) {
  const seen = new Set<string>()

  return services
    .map((service) => service.trim())
    .filter((service) => {
      if (!service) {
        return false
      }

      const key = normalizeSearch(service)

      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
}

function normalizePaidExtra(extra: Partial<PaidExtraOption>, fallbackId: string): PaidExtraOption | null {
  const extraName = `${extra.extraName ?? ''}`.trim()
  const extraPrice = normalizeRevenueAmount(extra.extraPrice ?? 0)
  const extraType = extra.extraType === 'perNight' || extra.extraType === 'perRoom' || extra.extraType === 'perGuest'
    ? extra.extraType
    : 'perStay'

  if (!extraName || extraPrice <= 0 || extra.isActive === false) {
    return null
  }

  return {
    description: `${extra.description ?? ''}`.trim(),
    extraId: `${extra.extraId ?? fallbackId}`,
    extraName,
    extraPrice,
    extraType,
    isActive: true,
  }
}

function getReservationIncludedServices(
  hotel: HotelRecord | null | undefined,
  room: RoomOption | null | undefined,
  hotelCustomizations: Record<string, HotelCustomization>,
) {
  if (!hotel || !room) {
    return []
  }

  const customization = hotelCustomizations[hotel.id] ?? {}
  const unavailableKeys = new Set(
    [...(customization.unavailableServices ?? []), ...(room.unavailableServices ?? [])].map((service) => normalizeSearch(service)),
  )
  const services = uniqueServiceNames([
    ...(customization.includedServices ?? []),
    ...(customization.services ?? []),
    ...(room.includedServices ?? []),
    ...(room.features ?? []),
    room.breakfastIncluded ? 'Kahvaltı' : '',
    room.wifi,
  ])

  return services.filter((service) => !unavailableKeys.has(normalizeSearch(service)))
}

function getReservationPaidExtras(
  hotel: HotelRecord | null | undefined,
  room: RoomOption | null | undefined,
  hotelCustomizations: Record<string, HotelCustomization>,
) {
  if (!hotel || !room) {
    return []
  }

  const customization = hotelCustomizations[hotel.id] ?? {}
  const unavailableKeys = new Set(
    [...(customization.unavailableServices ?? []), ...(room.unavailableServices ?? [])].map((service) => normalizeSearch(service)),
  )
  const extras = [...(customization.paidExtras ?? []), ...(room.paidExtras ?? [])]
    .map((extra, index) => normalizePaidExtra(extra, `${hotel.id}-${room.id}-extra-${index}`))
    .filter((extra): extra is PaidExtraOption => Boolean(extra))
    .filter((extra) => !unavailableKeys.has(normalizeSearch(extra.extraName)))
  const extraMap = new Map<string, PaidExtraOption>()

  extras.forEach((extra) => {
    if (!extraMap.has(extra.extraId)) {
      extraMap.set(extra.extraId, extra)
    }
  })

  return Array.from(extraMap.values())
}

function calculatePaidExtraCharge(extra: PaidExtraOption, nightCount: number, roomCount: number, guestCount: number) {
  const basePrice = normalizeRevenueAmount(extra.extraPrice)

  if (extra.extraType === 'perNight') {
    return basePrice * Math.max(nightCount, 1)
  }

  if (extra.extraType === 'perRoom') {
    return basePrice * Math.max(roomCount, 1)
  }

  if (extra.extraType === 'perGuest') {
    return basePrice * Math.max(guestCount, 1)
  }

  return basePrice
}

function calculatePaidExtraTotal(extras: PaidExtraOption[], nightCount: number, roomCount: number, guestCount: number) {
  return extras.reduce((total, extra) => total + calculatePaidExtraCharge(extra, nightCount, roomCount, guestCount), 0)
}

function paidExtraTypeLabel(extraType: PaidExtraType, language: LanguageCode = 'tr') {
  if (extraType === 'perNight') {
    return language === 'en' ? 'per night' : 'gece başı'
  }

  if (extraType === 'perRoom') {
    return language === 'en' ? 'per room' : 'oda başı'
  }

  if (extraType === 'perGuest') {
    return language === 'en' ? 'per guest' : 'misafir başı'
  }

  return language === 'en' ? 'per stay' : 'konaklama başı'
}

type CouponValidationResult = {
  coupon: OwnerCoupon | null
  discountAmount: number
  isValid: boolean
  message: string
}

function normalizedCouponCode(code: string) {
  return code.trim().toLocaleUpperCase('tr-TR')
}

function couponId(coupon: OwnerCoupon) {
  return coupon.couponId ?? coupon.id
}

function couponDiscountValue(coupon: OwnerCoupon) {
  return Math.max(parseStoredMoney(coupon.discountValue ?? coupon.value ?? 0), 0)
}

function couponMinimumSpend(coupon: OwnerCoupon) {
  return Math.max(parseStoredMoney(coupon.minSpend ?? coupon.minimumSpend ?? 0), 0)
}

function couponUsedCount(coupon: OwnerCoupon) {
  return Math.max(Number(coupon.usedCount ?? 0), 0)
}

function couponUsageLimit(coupon: OwnerCoupon) {
  return Math.max(Number(coupon.usageLimit ?? 0), 0)
}

function couponDiscountKind(coupon: OwnerCoupon) {
  const kind = normalizeSearch(coupon.discountType)

  return kind.includes('percentage') || kind.includes('yuzde') || kind.includes('yüzde') ? 'percentage' : 'fixed'
}

function couponMessage(key: 'notFound' | 'wrongHotel' | 'expired' | 'minSpend' | 'limit' | 'inactive' | 'applied', language: LanguageCode) {
  const messages = {
    applied: language === 'en' ? 'Coupon applied successfully.' : 'Kupon başarıyla uygulandı.',
    expired: language === 'en' ? 'This coupon has expired.' : 'Kuponun kullanım süresi dolmuş.',
    inactive: language === 'en' ? 'This coupon is not active.' : 'Kupon aktif değil.',
    limit: language === 'en' ? 'Coupon usage limit has been reached.' : 'Kupon kullanım limiti dolmuş.',
    minSpend: language === 'en' ? 'Minimum spend requirement was not met.' : 'Minimum harcama tutarı sağlanmadı.',
    notFound: language === 'en' ? 'Coupon code was not found.' : 'Kupon kodu bulunamadı.',
    wrongHotel: language === 'en' ? 'This coupon is not valid for this hotel.' : 'Bu kupon bu otelde geçerli değil.',
  }

  return messages[key]
}

function validateBookingCoupon(
  couponCode: string,
  selectedHotel: HotelRecord | null,
  coupons: OwnerCoupon[],
  subtotal: number,
  language: LanguageCode,
): CouponValidationResult {
  const code = normalizedCouponCode(couponCode)

  if (!code) {
    return { coupon: null, discountAmount: 0, isValid: true, message: '' }
  }

  const matchingCoupons = coupons.filter((coupon) => normalizedCouponCode(coupon.code) === code)

  if (matchingCoupons.length === 0) {
    return { coupon: null, discountAmount: 0, isValid: false, message: couponMessage('notFound', language) }
  }

  const hotelCoupon = matchingCoupons.find((coupon) => selectedHotel && idsMatch(coupon.hotelId, selectedHotel.id))

  if (!hotelCoupon) {
    return { coupon: null, discountAmount: 0, isValid: false, message: couponMessage('wrongHotel', language) }
  }

  if (!hotelCoupon.isActive) {
    return { coupon: hotelCoupon, discountAmount: 0, isValid: false, message: couponMessage('inactive', language) }
  }

  const today = getTodayDateInputValue()

  if (
    (hotelCoupon.startDate && compareDateInputValues(today, hotelCoupon.startDate) < 0) ||
    (hotelCoupon.endDate && compareDateInputValues(today, hotelCoupon.endDate) > 0)
  ) {
    return { coupon: hotelCoupon, discountAmount: 0, isValid: false, message: couponMessage('expired', language) }
  }

  if (subtotal < couponMinimumSpend(hotelCoupon)) {
    return { coupon: hotelCoupon, discountAmount: 0, isValid: false, message: couponMessage('minSpend', language) }
  }

  const usageLimit = couponUsageLimit(hotelCoupon)

  if (usageLimit > 0 && couponUsedCount(hotelCoupon) >= usageLimit) {
    return { coupon: hotelCoupon, discountAmount: 0, isValid: false, message: couponMessage('limit', language) }
  }

  const rawDiscount = couponDiscountKind(hotelCoupon) === 'percentage'
    ? Math.round(subtotal * (Math.min(couponDiscountValue(hotelCoupon), 100) / 100))
    : couponDiscountValue(hotelCoupon)
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal)

  return {
    coupon: hotelCoupon,
    discountAmount,
    isValid: true,
    message: couponMessage('applied', language),
  }
}

function couponAppliedMessage(result: CouponValidationResult, language: LanguageCode) {
  if (!result.coupon || !result.isValid) {
    return result.message
  }

  if (couponDiscountKind(result.coupon) === 'percentage') {
    const percentage = Math.min(couponDiscountValue(result.coupon), 100)

    return language === 'en'
      ? `${percentage}% discount applied.`
      : `%${percentage} indirim uygulandı.`
  }

  return language === 'en'
    ? `${formatCurrency(result.discountAmount)} discount applied.`
    : `${formatCurrency(result.discountAmount)} indirim uygulandı.`
}

function getReservationTotal(reservation: GuestReservation, rooms: RoomOption[] = []) {
  const discountedTotal = normalizeRevenueAmount(reservation.totalPriceAfterDiscount ?? 0)

  if (Number.isFinite(discountedTotal) && discountedTotal > 0) {
    return discountedTotal
  }

  const nightCount = Math.max(Number(reservation.nightCount ?? calculateNights(reservation.checkIn, reservation.checkOut)), 1)
  const roomCount = Math.max(Number(reservation.roomCount ?? 1), 1)
  const guestCount = Math.max(Number(reservation.guestCount ?? 1), 1)
  const selectedPaidExtras = reservation.selectedPaidExtras ?? []
  const paidExtraTotal = normalizeRevenueAmount(
    reservation.paidExtraTotal ?? calculatePaidExtraTotal(selectedPaidExtras, nightCount, roomCount, guestCount),
  )
  const basePrice = normalizeRevenueAmount(reservation.baseRoomPrice ?? reservation.basePrice ?? 0)

  if (Number.isFinite(basePrice) && basePrice > 0) {
    const calculatedTotal = basePrice * nightCount * roomCount + paidExtraTotal
    const storedTotal = normalizeRevenueAmount(reservation.totalPrice ?? reservation.total ?? 0)

    return storedTotal > 0 ? Math.max(storedTotal, calculatedTotal) : calculatedTotal
  }

  const matchedRoom = rooms.find((room) => reservationMatchesRoom(reservation, room))

  const matchedRoomPrice = matchedRoom ? normalizeRevenueAmount(matchedRoom.price) : 0

  if (matchedRoomPrice > 0) {
    const calculatedTotal = matchedRoomPrice * nightCount * roomCount + paidExtraTotal
    const storedTotal = normalizeRevenueAmount(reservation.totalPrice ?? reservation.total ?? 0)

    return storedTotal > 0 ? Math.max(storedTotal, calculatedTotal) : calculatedTotal
  }

  const storedTotal = normalizeRevenueAmount(reservation.totalPrice ?? reservation.total ?? 0)

  if (Number.isFinite(storedTotal) && storedTotal > 0) {
    return storedTotal
  }

  if (import.meta.env.DEV) {
    console.debug('[Gelir Hesabı]', reservation.code, 'oda fiyatı bulunamadı')
  }

  return 0
}

function getReservationStatus(reservation: GuestReservation) {
  return reservation.reservationStatus ?? reservation.status
}

function debugTekirdagRevenueDecision(
  reservation: GuestReservation,
  rooms: RoomOption[],
  total: number,
  included: boolean,
  reason?: string,
) {
  const isTekirdagReservation = normalizeSearch(`${reservation.hotelName} ${reservation.hotelId ?? ''}`).includes('tekirdag')

  if (!isTekirdagReservation || !import.meta.env.DEV) {
    return
  }

  const matchedRoom = rooms.find((room) => reservationMatchesRoom(reservation, room))

  console.debug('[Tekirdağ Gelir Debug]', {
    basePrice: reservation.basePrice,
    baseRoomPrice: reservation.baseRoomPrice,
    included,
    matchedRoomId: matchedRoom?.id,
    matchedRoomPrice: matchedRoom?.price,
    ownerId: reservation.ownerId,
    paidExtraTotal: reservation.paidExtraTotal,
    paymentStatus: reservation.paymentStatus,
    reason,
    reservationHotelId: reservation.hotelId,
    reservationId: reservation.reservationId ?? reservation.id,
    reservationStatus: getReservationStatus(reservation),
    roomId: reservation.roomId,
    roomName: reservation.roomName,
    selectedPaidExtras: reservation.selectedPaidExtras,
    total,
    totalPrice: reservation.totalPrice ?? reservation.total,
  })
}

function isRevenueEligibleReservation(reservation: GuestReservation, rooms: RoomOption[] = []) {
  const status = normalizeSearch(getReservationStatus(reservation))
  const paymentStatus = normalizeSearch(reservation.paymentStatus ?? '')
  const total = getReservationTotal(reservation, rooms)

  if (total <= 0) {
    if (import.meta.env.DEV) {
      console.debug('[Gelir Hesabı]', reservation.code, 'totalPrice 0/null')
    }
    debugTekirdagRevenueDecision(reservation, rooms, total, false, 'totalPrice 0/null')
    return false
  }

  if (status.includes('iptal') || status.includes('cancelled') || paymentStatus.includes('iade') || paymentStatus.includes('refunded')) {
    if (import.meta.env.DEV) {
      console.debug('[Gelir Hesabı]', reservation.code, 'reservationStatus iptal veya iade')
    }
    debugTekirdagRevenueDecision(reservation, rooms, total, false, 'iptal/cancelled/iade')
    return false
  }

  const isReservationStatusAccepted =
    status.includes('aktif') ||
    status.includes('active') ||
    status.includes('gecmis') ||
    status.includes('past') ||
    status.includes('completed') ||
    status.includes('tamamlandi')
  const isPaymentAccepted =
    paymentStatus.length === 0 ||
    paymentStatus.includes('onay') ||
    paymentStatus.includes('on odeme') ||
    paymentStatus.includes('ön ödeme') ||
    paymentStatus.includes('odendi') ||
    paymentStatus.includes('ödendi') ||
    paymentStatus.includes('odenmis') ||
    paymentStatus.includes('ödenmiş') ||
    paymentStatus.includes('odeme alindi') ||
    paymentStatus.includes('ödeme alındı') ||
    paymentStatus.includes('kapandi') ||
    paymentStatus.includes('kapandı') ||
    paymentStatus.includes('basarili') ||
    paymentStatus.includes('başarılı') ||
    paymentStatus.includes('success') ||
    paymentStatus.includes('succeeded') ||
    paymentStatus.includes('tamamlandi') ||
    paymentStatus.includes('tamamlandı') ||
    paymentStatus.includes('completed') ||
    paymentStatus.includes('paid') ||
    paymentStatus.includes('kredi') ||
    paymentStatus.includes('kart') ||
    paymentStatus.includes('card') ||
    paymentStatus.includes('havale') ||
    paymentStatus.includes('eft') ||
    paymentStatus.includes('tesiste odeme') ||
    paymentStatus.includes('tesiste ödeme')

  if (!reservation.hotelId && import.meta.env.DEV) {
    console.debug('[Gelir Hesabı]', reservation.code, 'hotelId eksik')
  }

  if (!reservation.ownerId && import.meta.env.DEV) {
    console.debug('[Gelir Hesabı]', reservation.code, 'ownerId eksik')
  }

  if (!isReservationStatusAccepted && import.meta.env.DEV) {
    console.debug('[Gelir Hesabı]', reservation.code, 'reservationStatus uygun değil')
  }

  if (!isPaymentAccepted && import.meta.env.DEV) {
    console.debug('[Gelir Hesabı]', reservation.code, 'paymentStatus uygun değil')
  }

  const included = isReservationStatusAccepted && isPaymentAccepted

  debugTekirdagRevenueDecision(
    reservation,
    rooms,
    total,
    included,
    included ? 'gelire dahil edildi' : !isReservationStatusAccepted ? 'reservationStatus uygun değil' : 'paymentStatus uygun değil',
  )

  return included
}

function reservationOverlapsDateRange(reservation: Pick<GuestReservation, 'checkIn' | 'checkOut'>, checkIn: string, checkOut: string) {
  if (!parseDateInputValue(reservation.checkIn) || !parseDateInputValue(reservation.checkOut)) {
    return true
  }

  return compareDateInputValues(reservation.checkIn, checkOut) < 0 && compareDateInputValues(reservation.checkOut, checkIn) > 0
}

function getDateKey(date = new Date()) {
  return formatDateInputValue(date)
}

function getReservationRevenueDate(reservation: GuestReservation) {
  const rawDate = reservation.createdAt?.trim()

  if (rawDate) {
    const isoDate = new Date(rawDate)

    if (!Number.isNaN(isoDate.getTime())) {
      return isoDate
    }

    const localDateMatch = rawDate.match(/(\d{2})[./-](\d{2})[./-](\d{4})(?:\D+(\d{2}):(\d{2}))?/)

    if (localDateMatch) {
      const [, day, month, year, hour = '00', minute = '00'] = localDateMatch
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    }
  }

  return parseDateInputValue(reservation.checkIn) ?? new Date()
}

function isReservationRevenueOnDate(reservation: GuestReservation, dateKey: string) {
  return getDateKey(getReservationRevenueDate(reservation)) === dateKey
}

function isReservationRevenueWithinLastDays(reservation: GuestReservation, days: number) {
  const date = getReservationRevenueDate(reservation).getTime()
  const now = Date.now()

  return Number.isFinite(date) && date >= now - days * 86_400_000 && date <= now + 86_400_000
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(getStoredLanguage() === 'en' ? 'en-US' : 'tr-TR', {
    currency: 'TRY',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatGuestDate(value: string) {
  const date = parseDateInputValue(value) ?? new Date(value)

  if (Number.isNaN(date.getTime())) {
    return getStoredLanguage() === 'en' ? 'Date not selected' : 'Tarih seçilmedi'
  }

  return new Intl.DateTimeFormat(getStoredLanguage() === 'en' ? 'en-US' : 'tr-TR', {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function getHotelRooms(
  hotel: HotelRecord,
  hotelIndex: number,
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  const customizedRooms = hotelCustomizations[hotel.id]?.rooms

  if (customizedRooms && customizedRooms.length > 0) {
    return customizedRooms.map((room) => ({
      ...room,
      oldPrice: room.oldPrice ? normalizeRevenueAmount(room.oldPrice) : room.oldPrice,
      price: normalizeRevenueAmount(room.price),
      seasonPrice: room.seasonPrice ? normalizeRevenueAmount(room.seasonPrice) : room.seasonPrice,
      specialDayPrice: room.specialDayPrice ? normalizeRevenueAmount(room.specialDayPrice) : room.specialDayPrice,
    }))
  }

  const templateGroup = hotelRoomTemplates[hotelIndex % hotelRoomTemplates.length]
  const starFactor = 1 + Math.max(hotel.starRating - 4, 0) * 0.07
  const locationFactor = (hotelIndex % 4) * 0.045

  return templateGroup.map((room, roomIndex) => {
    const priceFactor = starFactor + locationFactor + roomIndex * 0.025
    const adjustedPrice = roundToNearest(room.price * priceFactor, 10)
    const adjustedOldPrice = room.oldPrice ? roundToNearest(room.oldPrice * priceFactor, 10) : undefined
    const availabilityShift = (hotelIndex + roomIndex) % 3

    return {
      ...room,
      id: `${hotel.id}-${room.id}`,
      price: adjustedPrice,
      oldPrice: adjustedOldPrice,
      available: Math.max(1, room.available - availabilityShift),
      features: [
        ...room.features.slice(0, 3),
        `${hotel.city} deneyimi`,
      ],
    }
  })
}

function getHotelStartingPrice(
  hotel: HotelRecord,
  hotelIndex: number,
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  return Math.min(...getHotelRooms(hotel, hotelIndex, hotelCustomizations).map((room) => room.price))
}

function findHotelIdByRoomId(
  roomId: string | undefined,
  hotels: HotelRecord[],
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  if (!roomId) {
    return hotels[0]?.id
  }

  return hotels.find((hotel, index) =>
    getHotelRooms(hotel, index, hotelCustomizations).some((room) => room.id === roomId),
  )?.id
}

function getHotelPolicies(
  hotel: HotelRecord,
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  return hotelCustomizations[hotel.id]?.policies?.length
    ? hotelCustomizations[hotel.id].policies!
    : defaultHotelPolicies
}

function getHotelNearbyPlaces(
  hotel: HotelRecord,
  hotelIndex: number,
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  const customizedPlaces = hotelCustomizations[hotel.id]?.nearbyPlaces

  if (customizedPlaces && customizedPlaces.length > 0) {
    return customizedPlaces
  }

  const locationSets: HotelNearbyPlace[][] = [
    [
      { id: `${hotel.id}-metro`, name: 'Metro', distance: '7 dk yürüyüş', note: 'Ulaşım kolay', x: '64%', y: '28%' },
      { id: `${hotel.id}-sahil`, name: 'Sahil', distance: '12 dk yürüyüş', note: 'Manzara rotası', x: '52%', y: '68%' },
      { id: `${hotel.id}-kultur`, name: 'Kültür merkezi', distance: '9 dk araç', note: 'Etkinlik alanı', x: '74%', y: '58%' },
    ],
    [
      { id: `${hotel.id}-marina`, name: 'Marina', distance: '6 dk araç', note: 'Restoran ve yürüyüş aksı', x: '62%', y: '34%' },
      { id: `${hotel.id}-park`, name: 'Şehir parkı', distance: '8 dk yürüyüş', note: 'Sabah yürüyüş rotası', x: '44%', y: '70%' },
      { id: `${hotel.id}-muze`, name: 'Müze', distance: '11 dk araç', note: 'Kültür gezisi', x: '78%', y: '46%' },
    ],
    [
      { id: `${hotel.id}-is`, name: 'İş merkezi', distance: '5 dk araç', note: 'Toplantı bölgesi', x: '66%', y: '31%' },
      { id: `${hotel.id}-avm`, name: 'Alışveriş', distance: '10 dk yürüyüş', note: 'Mağaza ve kafe alanı', x: '48%', y: '65%' },
      { id: `${hotel.id}-terminal`, name: 'Transfer noktası', distance: '13 dk araç', note: 'Havalimanı bağlantısı', x: '76%', y: '58%' },
    ],
  ]

  return locationSets[hotelIndex % locationSets.length]
}

function getHotelContact(
  hotel: HotelRecord,
  hotelCustomizations: Record<string, HotelCustomization> = {},
) {
  return hotelCustomizations[hotel.id]?.contact ?? {
    address: `${hotel.address}, ${hotel.city}${hotel.district ? ` / ${hotel.district}` : ''}`,
    email: `iletisim@${hotel.name.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9ğüşöçıİ]/gi, '').slice(0, 16) || 'tesis'}.local`,
    phone: '+90 212 000 00 00',
    responseTime: 'ortalama 4 dakika',
  }
}

function createEmptyOwnerRoom(index: number): RoomOption {
  return {
    available: 1,
    balcony: 'Şehir manzaralı balkon',
    bathroom: 'Modern duş alanı',
    bedType: 'King yatak',
    breakfastIncluded: true,
    capacity: 2,
    features: ['Premium oda', 'Hızlı Wi-Fi'],
    id: `owner-room-${index + 1}`,
    imageClass: roomImageOptions[index % roomImageOptions.length],
    name: `Yeni Premium Oda ${index + 1}`,
    price: 5200,
    refundPolicy: 'Girişten 48 saat öncesine kadar ücretsiz iptal',
    seasonNote: 'Sezonluk fiyat altyapısı hazır',
    size: '34 m²',
    type: 'Deluxe',
    wifi: 'Fiber Wi-Fi 500 Mbps',
  }
}

function rotateItems<T>(items: T[], offset: number) {
  if (items.length === 0) {
    return []
  }

  return items.map((_, index) => items[(index + offset) % items.length])
}

function getHotelGalleryGroups(hotelIndex: number): HotelGalleryGroup[] {
  return hotelGalleryCategories.map((category, categoryIndex) => ({
    photos: rotateItems(hotelGalleryImageBank[category], hotelIndex + categoryIndex).slice(0, 4),
    title: category,
  }))
}

function prioritizeReservations(reservations: GuestReservation[], status: ReservationStatus) {
  return [
    ...reservations.filter((reservation) => reservation.status === status),
    ...reservations.filter((reservation) => reservation.status !== status),
  ]
}

function roundToNearest(value: number, step: number) {
  return Math.round(value / step) * step
}

function reservationStatusForItem(activeItem: string): ReservationStatus {
  if (activeItem === 'Geçmiş Rezervasyonlar') {
    return 'Geçmiş'
  }

  if (activeItem === 'İptal İşlemleri' || activeItem === 'İptal Edilen Rezervasyonlar') {
    return 'İptal Edildi'
  }

  return 'Aktif'
}

function hotelMediaClass(index: number) {
  const classes = [
    'hotel-media-sea',
    'hotel-media-terrace',
    'hotel-media-city',
    'hotel-media-lobby',
    'hotel-media-pool',
    'hotel-media-rooftop',
    'hotel-media-night',
    'hotel-media-suite',
  ]
  return classes[index % classes.length]
}

function maskSensitive(value: string) {
  if (!value) {
    return 'Profil tamamlanmadı'
  }

  if (value.length <= 4) {
    return '****'
  }

  return `${value.slice(0, 2)}${'*'.repeat(Math.max(value.length - 4, 2))}${value.slice(-2)}`
}

function getPasswordStrength(password: string) {
  const score = [
    password.length >= 8,
    /[A-ZÇĞİÖŞÜ]/.test(password),
    /[a-zçğıöşü]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/.test(password),
  ].filter(Boolean).length

  if (score <= 2) {
    return { className: 'weak', label: 'Zayıf' }
  }

  if (score <= 4) {
    return { className: 'medium', label: 'Orta' }
  }

  return { className: 'strong', label: 'Güçlü' }
}

function validateGuestRegisterForm(form: GuestRegisterForm) {
  if (!form.username.trim()) {
    return 'Kullanıcı adı zorunludur.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Geçerli bir e-posta adresi giriniz.'
  }

  if (!/^\+?[0-9\s()-]{10,20}$/.test(form.phone.trim())) {
    return 'Geçerli bir telefon numarası giriniz.'
  }

  if (form.password.length < 8) {
    return 'Şifre minimum 8 karakter olmalıdır.'
  }

  if (!/[A-ZÇĞİÖŞÜ]/.test(form.password) || !/[a-zçğıöşü]/.test(form.password) || !/\d/.test(form.password)) {
    return 'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.'
  }

  if (form.password !== form.confirmPassword) {
    return 'Şifre ve şifre tekrar aynı olmalıdır.'
  }

  if (!form.kvkkAccepted || !form.userAgreementAccepted) {
    return 'KVKK ve kullanıcı sözleşmesi onayı zorunludur.'
  }

  return null
}

function validateGuestProfileStep(form: GuestProfileForm, step: number) {
  if (step === 0) {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return 'Ad ve soyad zorunludur.'
    }

    if (!/^\d{11}$/.test(form.tcKimlikNo)) {
      return 'T.C. Kimlik Numarası 11 haneli olmalıdır.'
    }

    if (!form.birthDate || new Date(form.birthDate).getTime() > Date.now()) {
      return 'Doğum tarihi boş veya gelecekte bir tarih olamaz.'
    }

    if (!/^\+?[0-9\s()-]{10,20}$/.test(form.phone)) {
      return 'Telefon numarası formatı geçerli değil.'
    }

    if (!form.country.trim() || !form.city.trim() || !form.address.trim()) {
      return 'Ülke, şehir ve adres alanları zorunludur.'
    }
  }

  if (step === 1) {
    if (!form.nationality.trim() || !form.invoiceInfo.trim() || !form.paymentPreference.trim()) {
      return 'Uyruk, fatura bilgileri ve ödeme tercihi zorunludur.'
    }
  }

  if (step === 2) {
    if (!form.emergencyContactName.trim() || !/^\+?[0-9\s()-]{10,20}$/.test(form.emergencyContactPhone)) {
      return 'Acil durum iletişim kişisi ve geçerli telefon numarası zorunludur.'
    }
  }

  return null
}

function validateGuestProfileForm(form: GuestProfileForm) {
  return (
    validateGuestProfileStep(form, 0) ??
    validateGuestProfileStep(form, 1) ??
    validateGuestProfileStep(form, 2)
  )
}

function sectionIcon(sectionId: string) {
  const icons: Record<string, ReactNode> = {
    'ana-panel': <Activity size={18} />,
    sistem: <Database size={18} />,
    oteller: <Hotel size={18} />,
    galeri: <Camera size={18} />,
    favori: <Star size={18} />,
    mesaj: <MessageSquareText size={18} />,
    profil: <User size={18} />,
    bildirim: <Bell size={18} />,
    fatura: <ReceiptText size={18} />,
    odeme: <CreditCard size={18} />,
    teknik: <Settings2 size={18} />,
    takvim: <CalendarCheck size={18} />,
    rezervasyon: <CalendarCheck size={18} />,
    oda: <BedDouble size={18} />,
    musteri: <Users size={18} />,
    personel: <UserCog size={18} />,
    finans: <CreditCard size={18} />,
    hizmetler: <Utensils size={18} />,
    ai: <Sparkles size={18} />,
    performans: <Activity size={18} />,
    raporlama: <BarChart3 size={18} />,
    guvenlik: <Camera size={18} />,
    ayarlar: <Settings2 size={18} />,
    destek: <Headphones size={18} />,
  }

  return icons[sectionId] ?? <FileText size={18} />
}

function filterHotels(hotels: HotelRecord[], search: string) {
  const value = normalizeSearch(search)

  if (!value) {
    return hotels
  }

  return hotels.filter((hotel) => {
    return normalizeSearch([hotel.name, hotel.city, hotel.district, hotel.country, hotel.address].join(' ')).includes(value)
  })
}

export default App
