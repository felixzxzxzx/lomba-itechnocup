import { DonationHistory, FoodItem, UserProfile } from './types';

export type MockUser = {
  public_id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'donor' | 'receiver';
  organization: string;
  address: string;
  is_verified: boolean;
};

type MockFood = FoodItem & {
  donor_id: number;
  description: string;
  food_type: string;
  total_portions: number;
  available_portions: number;
  pickup_address: string;
  status: 'available' | 'claimed' | 'expired' | 'cancelled';
};

type MockDatabase = {
  users: MockUser[];
  foodItems: MockFood[];
  donationRequests: Array<{
    public_id: string;
    food_item_id: string;
    receiver_id: string;
    requested_portions: number;
    status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled' | 'expired' | 'rejected';
  }>;
  histories: DonationHistory[];
};

const STORAGE_KEY = 'foodbridge-mock-db-v2';
const SESSION_KEY = 'foodbridge-session';
let cachedSessionRaw: string | null = null;
let cachedSession: MockUser | null = null;

export function hasMockSession() {
  return typeof window !== 'undefined' && Boolean(window.localStorage.getItem(SESSION_KEY));
}

export function getMockSession(): MockUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedSessionRaw) return cachedSession;
  cachedSessionRaw = raw;
  cachedSession = raw ? JSON.parse(raw) as MockUser : null;
  return cachedSession;
}

export function clearMockSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_KEY);
    cachedSessionRaw = null;
    cachedSession = null;
    window.dispatchEvent(new Event('foodbridge-session-change'));
  }
}

const seedDatabase: MockDatabase = {
  users: [
    {
      public_id: 'id_busastro',
      name: 'Sastro Wijaya',
      email: 'donatur@foodbridge.test',
      password: 'password123',
      phone: '+62 812-3456-7890',
      role: 'donor',
      organization: 'Warung Bu Sastro',
      address: 'Jl. Sunter Jaya No. 12, Sunter, Jakarta Utara',
      is_verified: true,
    },
    {
      public_id: 'id_yayasanharapan',
      name: 'Rina Lestari',
      email: 'penerima@foodbridge.test',
      password: 'password123',
      phone: '+62 813-9876-5432',
      role: 'receiver',
      organization: 'Yayasan Harapan Bersama',
      address: 'Jl. Danau Sunter Selatan No. 8, Jakarta Utara',
      is_verified: true,
    },
  ],
  foodItems: [
    {
      id: 'food_001',
      donor_id: 1,
      donaturName: 'Warung Bu Sastro',
      donaturRating: 4.9,
      donaturReviewsCount: 128,
      title: 'Nasi Box Ayam Bakar & Lalapan',
      description: 'Makanan matang hari ini, dikemas individual dan masih layak konsumsi.',
      food_type: 'Makanan Berat',
      category: 'Makanan Berat',
      total_portions: 20,
      available_portions: 8,
      portionsAvailable: 8,
      pickupStartTime: '16:30',
      pickupEndTime: '18:00',
      pickup_address: 'Jl. Sunter Jaya No. 12, Sunter, Jakarta Utara',
      address: 'Jl. Sunter Jaya No. 12, Sunter, Jakarta Utara',
      distanceKm: 0.8,
      latitude: -6.14,
      longitude: 106.87,
      status: 'available',
    },
    {
      id: 'food_002',
      donor_id: 2,
      donaturName: 'Sunter Bakery & Pastry',
      donaturRating: 4.8,
      donaturReviewsCount: 85,
      title: 'Aneka Roti Manis & Croissant',
      description: 'Roti segar dari display hari ini, cocok untuk sarapan keluarga.',
      food_type: 'Roti & Pastry',
      category: 'Roti & Pastry',
      total_portions: 25,
      available_portions: 15,
      portionsAvailable: 15,
      pickupStartTime: '18:00',
      pickupEndTime: '20:00',
      pickup_address: 'Jl. Danau Sunter Utara No. 4, Jakarta Utara',
      address: 'Jl. Danau Sunter Utara No. 4, Jakarta Utara',
      distanceKm: 1.5,
      latitude: -6.13,
      longitude: 106.86,
      status: 'available',
    },
    {
      id: 'food_003',
      donor_id: 1,
      donaturName: 'Warung Bu Sastro',
      donaturRating: 4.9,
      donaturReviewsCount: 128,
      title: 'Sayur Asem & Lauk Pauk',
      description: 'Paket lauk rumahan untuk dibagikan bersama keluarga.',
      food_type: 'Makanan Berat',
      category: 'Makanan Berat',
      total_portions: 12,
      available_portions: 0,
      portionsAvailable: 0,
      pickupStartTime: '19:00',
      pickupEndTime: '20:00',
      pickup_address: 'Jl. Sunter Jaya No. 12, Sunter, Jakarta Utara',
      address: 'Jl. Sunter Jaya No. 12, Sunter, Jakarta Utara',
      distanceKm: 0.8,
      latitude: -6.14,
      longitude: 106.87,
      status: 'claimed',
    },
  ],
  donationRequests: [],
  histories: [
    { id: 'history_001', date: '02/08/2026', foodTitle: 'Nasi Ayam Bakar', portions: 8, status: 'Selesai' },
    { id: 'history_002', date: '01/08/2026', foodTitle: 'Sayur & Lauk Pauk', portions: 12, status: 'Selesai' },
  ],
};

function cloneSeed(): MockDatabase {
  return JSON.parse(JSON.stringify(seedDatabase)) as MockDatabase;
}

function getDatabase(): MockDatabase {
  if (typeof window === 'undefined') return cloneSeed();
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved) as MockDatabase;
  const database = cloneSeed();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  return database;
}

function saveDatabase(database: MockDatabase) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
}

export function getMockFoods(): FoodItem[] {
  return getDatabase().foodItems.filter((food) => food.status === 'available' && food.available_portions > 0).map((food) => ({
    ...food,
    portionsAvailable: food.available_portions,
  }));
}

export function getMockFood(id: string): FoodItem | undefined {
  return getDatabase().foodItems.find((food) => food.id === id);
}

export function createMockClaim(foodId: string, portions: number) {
  const database = getDatabase();
  const food = database.foodItems.find((item) => item.id === foodId);
  if (!food || food.available_portions < portions || portions < 1) {
    throw new Error('Jumlah porsi tidak tersedia.');
  }
  food.available_portions -= portions;
  food.portionsAvailable = food.available_portions;
  if (food.available_portions === 0) food.status = 'claimed';
  const request = {
    public_id: `request_${Date.now()}`,
    food_item_id: foodId,
    receiver_id: 'id_yayasanharapan',
    requested_portions: portions,
    status: 'confirmed' as const,
  };
  database.donationRequests.push(request);
  database.histories.unshift({
    id: request.public_id,
    date: new Date().toLocaleDateString('id-ID'),
    foodTitle: food.title,
    portions,
    status: 'Proses',
  });
  saveDatabase(database);
  return request;
}

export function createMockDonation(input: { title: string; portions: number; address: string; time: string }) {
  const database = getDatabase();
  const session = getMockSession();
  if (!session || session.role !== 'donor') throw new Error('Hanya donatur yang dapat membuat donasi.');
  const [pickupStartTime = '17:00', pickupEndTime = '19:00'] = input.time.replace(' WIB', '').split(' - ');
  const food: MockFood = {
    id: `food_${Date.now()}`,
    donor_id: 1,
    donaturName: session.organization,
    donaturRating: 4.9,
    donaturReviewsCount: 128,
    title: input.title,
    description: 'Donasi makanan dari pengguna mock.',
    food_type: 'Makanan Berat',
    category: 'Makanan Berat',
    total_portions: input.portions,
    available_portions: input.portions,
    portionsAvailable: input.portions,
    pickupStartTime,
    pickupEndTime,
    pickup_address: input.address,
    address: input.address,
    distanceKm: 0,
    latitude: -6.14,
    longitude: 106.87,
    status: 'available',
  };
  database.foodItems.unshift(food);
  saveDatabase(database);
  return food;
}

export function loginMock(email: string, password: string, role: MockUser['role']) {
  const user = getDatabase().users.find((item) => item.email === email && item.password === password && item.role === role);
  if (!user) throw new Error('Email, kata sandi, atau peran tidak sesuai.');
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  cachedSessionRaw = null;
  window.dispatchEvent(new Event('foodbridge-session-change'));
  return user;
}

export function registerMock(input: Omit<MockUser, 'public_id' | 'is_verified'>) {
  const database = getDatabase();
  if (database.users.some((user) => user.email === input.email)) throw new Error('Email sudah terdaftar.');
  const user = { ...input, public_id: `id_${Date.now()}`, is_verified: true };
  database.users.push(user);
  saveDatabase(database);
  return user;
}

export function getMockProfile(): UserProfile {
  const user = (typeof window !== 'undefined' && window.localStorage.getItem(SESSION_KEY)
    ? JSON.parse(window.localStorage.getItem(SESSION_KEY) as string)
    : getDatabase().users[0]) as MockUser;
  const database = getDatabase();
  const portionsSaved = database.histories.reduce((total, item) => total + item.portions, 0) + 134;
  return {
    name: user.name,
    role: user.role === 'donor' ? 'Donatur' : 'Penerima',
    organization: user.organization,
    email: user.email,
    phone: user.phone,
    address: user.address,
    joinedDate: 'Januari 2026',
    rating: 4.9,
    totalReviews: 128,
    stats: { totalDonations: database.foodItems.filter((item) => item.donor_id === 1).length + 39, portionsSaved, co2SavedKg: portionsSaved * 0.5 },
    badges: [
      { id: 'badge_1', title: 'Pahlawan Pangan', description: 'Menyelamatkan lebih dari 100 porsi makanan layak konsumsi.', icon: '🌱', unlockedAt: '15 Feb 2026' },
      { id: 'badge_2', title: 'Donatur Aktif', description: 'Melakukan donasi rutin selama 3 bulan berturut-turut.', icon: '🔥', unlockedAt: '01 Mar 2026' },
      { id: 'badge_3', title: 'Bintang Terpercaya', description: 'Mendapatkan rating di atas 4.8 dari penerima manfaat.', icon: '⭐', unlockedAt: '10 Apr 2026' },
    ],
  };
}

export function getMockHistory() {
  return getDatabase().histories;
}
