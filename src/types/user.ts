export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WellnessPreferences = {
  user_id: string;
  goals: string[];
  product_interests: string[];
  updated_at: string;
};