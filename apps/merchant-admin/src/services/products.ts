import { apiClient } from "@vayva/api-client";
import {
  ApiResponse,
  ProductResponseData
} from "@vayva/shared";

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || "Request failed");
  }
  return response.data;
};

export const ProductsService = {
  getProducts: async () => {
    const response = await apiClient.get<Record<string, unknown>[]>("/products");
    return unwrap(response);
  },

  getProduct: async (id: string) => {
    const response = await apiClient.get<ProductResponseData>(`/products/${id}`);
    return unwrap(response);
  },

  createProduct: async (data: unknown) => {
    const response = await apiClient.post<Record<string, unknown>>("/products", data);
    return unwrap(response);
  },

  updateProduct: async (id: string, data: unknown) => {
    const response = await apiClient.put<Record<string, unknown>>(`/products/${id}`, data);
    return unwrap(response);
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(`/products/${id}`);
    return unwrap(response);
  },
};

export const ProductService = ProductsService;
