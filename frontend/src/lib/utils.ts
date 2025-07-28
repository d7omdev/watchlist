import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imageUrl: string | undefined | null): string | undefined {
  if (!imageUrl) return undefined;
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
  return `${baseUrl}${imageUrl}`;
}
