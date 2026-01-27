export type AliExpressCurrency = "USD" | "NGN" | string;

export interface AliExpressSearchItem {
  id: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  currency: AliExpressCurrency;
  price: number;
  originalPrice?: number;
  orders?: number;
  rating?: number;
  shippingPrice?: number;
}

export interface AliExpressSearchResponse {
  items: AliExpressSearchItem[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AliExpressProvider {
  isConfigured(): boolean;
  search(params: {
    query: string;
    page: number;
    limit: number;
  }): Promise<AliExpressSearchResponse>;
}
