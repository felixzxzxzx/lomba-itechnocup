export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'donor' | 'receiver' | 'admin';
  roles?: string[];
  is_verified?: boolean;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    token?: string;
    user?: User;
    id?: string;
    name?: string;
    email?: string;
    role?: 'donor' | 'receiver' | 'admin';
    is_verified?: boolean;
  };
}

export interface DonorProfile {
  public_id?: string;
  business_name?: string;
  business_type?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  operational_hours?: string;
  description?: string;
  is_verified?: boolean | number;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export interface ReceiverProfile {
  public_id?: string;
  receiver_type?: 'individu' | 'komunitas' | 'panti asuhan' | 'lainnya' | string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_verified?: boolean | number;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export interface FoodItem {
  id: string;
  public_id?: string;
  title: string;
  description?: string;
  food_type?: string;
  category?: 'Makanan Berat' | 'Roti & Pastry' | 'Katering' | 'Minuman' | string;
  photo_url?: string;
  imageUrl?: string;
  total_portions: number;
  available_portions: number;
  portionsAvailable?: number;
  pickup_address?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  pickup_start_at?: string;
  pickup_end_at?: string;
  pickupStartTime?: string;
  pickupEndTime?: string;
  donor_public_id?: string;
  donor_name?: string;
  donaturName?: string;
  donor_phone?: string;
  donor_email?: string;
  donaturRating?: number;
  donaturReviewsCount?: number;
  distanceKm?: number;
  status: 'available' | 'claimed' | 'expired' | 'cancelled' | string;
  created_at?: string;
}

export interface MoneyDonation {
  public_id?: string;
  id?: string;
  title: string;
  description?: string;
  amount: number | string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'cancelled' | string;
  donor_public_id?: string;
  donor_name?: string;
  created_at?: string;
}

export interface DonationRequest {
  public_id: string;
  requested_portions: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled' | 'rejected' | 'expired' | string;
  notes?: string;
  food_public_id?: string;
  food_item_id?: string;
  food_title?: string;
  total_portions?: number;
  available_portions?: number;
  receiver_name?: string;
  receiver_public_id?: string;
  donor_name?: string;
  donor_phone?: string;
  pickup_address?: string;
  pickup_start_at?: string;
  pickup_end_at?: string;
  confirmed_at?: string;
  created_at?: string;
}

export interface DonationHistory {
  id: string;
  date: string;
  foodTitle: string;
  portions: number;
  status: 'Selesai' | 'Proses' | 'Batal' | 'Menunggu' | string;
  claimId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProfile {
  name: string;
  role: 'Donatur' | 'Penerima' | 'Relawan' | 'Admin' | string;
  organization: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  badges: Badge[];
  stats: {
    totalDonations: number;
    portionsSaved: number;
    co2SavedKg: number;
  };
}