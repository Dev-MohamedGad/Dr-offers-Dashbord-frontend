export interface Brand {
  id: number;
  brand_name: string;
  status: string;
  business_docs: any;
  clicks: number;
  category_type: string;
  subscription_plan: string;
  visitors: number;
  views: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export enum OfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

export interface Offer {
  id: number;
  title: string;
  price_before: number;
  image: string;
  discount_rate: number;
  coupon?: string;
  category_type: string;
  status: OfferStatus;
  price_after: number;
  brand_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  brand?: Brand | null;
}

export interface CreateOfferDto {
  title: string;
  price_before: string;
  image: string;
  discount_rate: string;
  category_type: string;
  brand_id?: number;
}

export interface UpdateOfferDto {
  title?: string;
  price_before?: string;
  image?: string;
  discount_rate?: string;
  category_type?: string;
  status?: OfferStatus;
  brand_id?: number;
}

export interface OffersResponse {
  data: {
    data: Offer[];
    meta?: {
      total: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export interface OfferResponse {
  data: Offer;
}

export interface OfferFilters {
  category?: 'groceries' | 'premium_fruits' | 'home_kitchen' | 'fashion' | 'electronics' | 'beauty' | 'home_improvement' | 'sports_toys_luggage';
  status?: OfferStatus;
  brand_id?: number;
  min_discount?: number;
  max_price?: number;
  page?: number;
  perPage?: number;
} 