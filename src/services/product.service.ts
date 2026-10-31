import connectToDatabase from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { Product } from '@/types';

// In-memory store fallback for zero-downtime operation
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];

export async function getProducts(filters?: {
  model?: string;
  family?: string;
  storage?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  minBattery?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}): Promise<Product[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, unknown> = {};

      if (filters?.model) query.model = { $regex: new RegExp(filters.model, 'i') };
      if (filters?.family) query.modelFamily = filters.family;
      if (filters?.storage) query.storage = filters.storage;
      if (filters?.condition) query.condition = filters.condition;
      if (filters?.minBattery) query.batteryHealth = { $gte: Number(filters.minBattery) };
      if (filters?.minPrice || filters?.maxPrice) {
        query.price = {};
        if (filters.minPrice) (query.price as Record<string, number>).$gte = Number(filters.minPrice);
        if (filters.maxPrice) (query.price as Record<string, number>).$lte = Number(filters.maxPrice);
      }
      if (filters?.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { model: { $regex: filters.search, $options: 'i' } },
          { color: { $regex: filters.search, $options: 'i' } },
        ];
      }

      let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
      if (filters?.sortBy === 'price_asc') sortObj = { price: 1 };
      if (filters?.sortBy === 'price_desc') sortObj = { price: -1 };
      if (filters?.sortBy === 'rating') sortObj = { rating: -1 };

      // Auto-populate initial catalog into MongoDB if empty
      const totalCount = await ProductModel.countDocuments();
      if (totalCount === 0 && INITIAL_PRODUCTS.length > 0) {
        await ProductModel.insertMany(INITIAL_PRODUCTS);
      }

      const dbProducts = await ProductModel.find(query).sort(sortObj).lean();
      return (dbProducts || []).map((p) => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
      })) as unknown as Product[];
    }
  } catch (err) {
    console.warn('Falling back to memory store for products:', err);
  }

  // Filter in memory
  let results = [...memoryProducts];

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.model.toLowerCase().includes(s) ||
        p.color.toLowerCase().includes(s) ||
        p.storage.toLowerCase().includes(s)
    );
  }

  if (filters?.family) {
    results = results.filter((p) => p.modelFamily.toLowerCase() === filters.family?.toLowerCase());
  }

  if (filters?.model) {
    results = results.filter((p) => p.model.toLowerCase().includes(filters.model!.toLowerCase()));
  }

  if (filters?.storage) {
    results = results.filter((p) => p.storage === filters.storage);
  }

  if (filters?.condition) {
    results = results.filter((p) => p.condition.toLowerCase() === filters.condition?.toLowerCase());
  }

  if (filters?.minPrice) {
    results = results.filter((p) => p.price >= Number(filters.minPrice));
  }

  if (filters?.maxPrice) {
    results = results.filter((p) => p.price <= Number(filters.maxPrice));
  }

  if (filters?.minBattery) {
    results = results.filter((p) => p.batteryHealth >= Number(filters.minBattery));
  }

  if (filters?.sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (filters?.sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (filters?.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  return results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbProduct = await ProductModel.findOne({
        $or: [{ slug }, { _id: slug }, { id: slug }],
      }).lean();
      if (dbProduct) {
        return {
          ...dbProduct,
          _id: dbProduct._id.toString(),
          id: dbProduct._id.toString(),
        } as unknown as Product;
      }
      return null;
    }
  } catch (err) {
    console.warn('Memory fallback for slug:', slug);
  }

  const found = memoryProducts.find((p) => p.slug === slug || p._id === slug || p.id === slug);
  return found || null;
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    _id: `prod_${Date.now()}`,
    id: `prod_${Date.now()}`,
    title: productData.title || 'iPhone',
    slug: (productData.title || 'iphone')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`,
    brand: 'Apple',
    model: productData.model || 'iPhone 15',
    modelFamily: (productData.modelFamily as Product['modelFamily']) || 'iPhone 15',
    storage: (productData.storage as Product['storage']) || '128GB',
    color: productData.color || 'Space Black',
    colorHex: productData.colorHex || '#1C1C1E',
    condition: productData.condition || 'Good',
    batteryHealth: productData.batteryHealth || 90,
    price: productData.price || 49999,
    originalPrice: productData.originalPrice || 64999,
    images: productData.images && productData.images.length > 0 ? productData.images : [
      'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-black-select-202309?wid=940&hei=1112&fmt=png-alpha'
    ],
    thumbnail: productData.thumbnail || productData.images?.[0] || 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-black-select-202309?wid=940&hei=1112&fmt=png-alpha',
    videoUrl: productData.videoUrl || '',
    specifications: productData.specifications || {
      display: 'Super Retina XDR OLED display',
      processor: 'Apple Bionic chip',
      camera: 'Advanced dual-camera system',
      battery: 'All-day battery life',
      os: 'iOS 18',
      sim: 'Dual SIM',
      biometrics: 'Face ID',
    },
    warranty: productData.warranty || '6 Months iPhoneHub Warranty',
    stock: productData.stock ?? 1,
    status: 'available',
    rating: 4.8,
    reviewsCount: 1,
    isFeatured: !!productData.isFeatured,
    isBestDeal: !!productData.isBestDeal,
    createdAt: new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const created = await ProductModel.create(newProduct);
      return {
        ...created.toObject(),
        _id: created._id.toString(),
        id: created._id.toString(),
      } as unknown as Product;
    }
  } catch (err) {
    console.warn('Saved to memory store:', err);
  }

  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updated = await ProductModel.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        { $set: updates },
        { new: true }
      ).lean();
      if (updated) {
        const mapped = {
          ...updated,
          _id: updated._id.toString(),
          id: updated._id.toString(),
        } as unknown as Product;

        const idx = memoryProducts.findIndex((p) => p._id === id || p.id === id || p.slug === id);
        if (idx !== -1) {
          memoryProducts[idx] = { ...memoryProducts[idx], ...mapped };
        }
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Updating in memory store:', err);
  }

  const idx = memoryProducts.findIndex((p) => p._id === id || p.id === id || p.slug === id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...updates };
    return memoryProducts[idx];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await ProductModel.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }
  } catch (err) {
    console.warn('Deleting in memory store:', err);
  }

  memoryProducts = memoryProducts.filter((p) => p._id !== id && p.id !== id && p.slug !== id);
  return true;
}

