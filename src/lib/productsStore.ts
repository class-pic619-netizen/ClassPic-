import { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

interface ProductsState {
  products: Product[];
}

declare global {
  // eslint-disable-next-line no-var
  var __classpic_products_store__: ProductsState | undefined;
}

function initProductsStore(): ProductsState {
  if (globalThis.__classpic_products_store__) {
    return globalThis.__classpic_products_store__;
  }

  const state: ProductsState = {
    products: [...MOCK_PRODUCTS],
  };

  globalThis.__classpic_products_store__ = state;
  return state;
}

const productsStore = initProductsStore();

export function getAllProducts(): Product[] {
  return [...productsStore.products];
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsStore.products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return productsStore.products.find((p) => p.id === id);
}

export function addProduct(product: Omit<Product, "id" | "created_at">): Product {
  const newProduct: Product = {
    ...product,
    id: `cp-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString(),
  };

  productsStore.products.unshift(newProduct);
  return newProduct;
}

export function updateProductStatus(id: string, isComingSoon: boolean): boolean {
  const product = productsStore.products.find((p) => p.id === id);
  if (!product) return false;
  product.is_coming_soon = isComingSoon;
  return true;
}

export function deleteProduct(id: string): boolean {
  const initialLength = productsStore.products.length;
  productsStore.products = productsStore.products.filter((p) => p.id !== id);
  return productsStore.products.length < initialLength;
}
