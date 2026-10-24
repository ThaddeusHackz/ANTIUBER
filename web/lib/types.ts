export type RideTier = {
  id: string;
  name: string;
  seats: number;
  eta: string;
  blurb: string;
  capacity: string;
  fare: number;
  multiplier: string;
};

export type Place = {
  id: string;
  label: string;
  address: string;
  kind: "saved" | "recent" | "suggestion";
  icon?: "home" | "work" | "star";
};

export type RideRow = {
  id: string;
  user_id: string;
  status: string;
  tier: string;
  pickup: string;
  dropoff: string;
  distance_km: number;
  duration_min: number;
  fare: number;
  currency: string;
  driver_name: string;
  driver_rating: number;
  vehicle: string;
  plate: string;
  payment_method: string;
  rating: number | null;
  requested_at: string;
  completed_at: string | null;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
};

export type PaymentMethod = {
  id: string;
  kind: string;
  brand: string;
  last4: string;
  exp: string;
  is_default: boolean;
};
