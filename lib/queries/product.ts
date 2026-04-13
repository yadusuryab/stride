import { sanityClient } from "../sanity";

export type Product = {
  rating: number;
  _id: string;
  name: string;
  brand: string;
  images: { url: string; title?: string }[];
  sizes?: string[];
  colors?: string[];
  features?: string[];
  description?: string;
  image: string;
  price: number;
  salesPrice: number;
  featured: boolean;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function getHomeProducts(): Promise<Product[]> {
  const res = await fetch(
    `${baseUrl}/api/product/home?home=true`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function getTrendingProducts(): Promise<Product[]> {
  const res = await fetch(
    `${baseUrl}/api/product/home?trending=true`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function getProduct(id: string) {
  try {
    const res = await fetch(`${baseUrl}/api/product/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch product from API", error);
    return null;
  }
}