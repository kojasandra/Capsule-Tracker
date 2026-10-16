export interface LookupOption {
  id: number;
  name: string;
}

export interface CapsuleInput {
  name: string;
  brand_id: number;
  intensity: number;
  flavor_note_ids: number[];
  price_per_capsule: string;
  stock: number;
  rating: number | null;
  comment: string | null;
}

export interface Capsule {
  id: number;
  name: string;
  brand_id: number;
  brand: LookupOption;
  intensity: number;
  flavor_notes: LookupOption[];
  price_per_capsule: string;
  stock: number;
  rating: number | null;
  comment: string | null;
  created_at: string;
}
