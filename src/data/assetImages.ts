/**
 * Local Asset Resolver
 * Dynamically resolves all garment photos located in src/assets/
 * as provided by the user.
 */

const assetModules = import.meta.glob<{ default: string }>(
  '../assets/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const assetMap: Record<string, string> = {};

for (const [path, mod] of Object.entries(assetModules)) {
  // Extract basename e.g. "cardigan 1.1.jpg"
  const fileName = path.split('/').pop();
  if (fileName) {
    assetMap[fileName.toLowerCase()] = mod.default || (mod as unknown as string);
  }
}

export function getAssetImage(fileName: string, fallbackUrl?: string): string {
  const clean = fileName.trim().toLowerCase();
  if (assetMap[clean]) {
    return assetMap[clean];
  }
  return fallbackUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85';
}

export function hasAssetImage(fileName: string): boolean {
  return !!assetMap[fileName.trim().toLowerCase()];
}

