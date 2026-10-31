import connectToDatabase from '@/lib/mongodb';
import TradeInModel from '@/models/TradeIn';
import { TradeIn } from '@/types';
import { generateId } from '@/lib/utils';

// Runtime in-memory trade-ins fallback if database connection is disrupted
let memoryTradeIns: TradeIn[] = [];

export async function createTradeIn(data: Omit<TradeIn, '_id' | 'tradeInNumber' | 'createdAt'>): Promise<TradeIn> {
  const tradeInNumber = generateId('TI');
  const now = new Date().toISOString();

  const newTradeIn: TradeIn = {
    ...data,
    _id: `ti_${Date.now()}`,
    tradeInNumber,
    createdAt: now,
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const created = await TradeInModel.create(newTradeIn);
      memoryTradeIns.unshift(newTradeIn);
      return {
        ...created.toObject(),
        _id: created._id.toString(),
      } as unknown as TradeIn;
    }
  } catch (err) {
    console.warn('Saving trade-in to memory store:', err);
  }

  memoryTradeIns.unshift(newTradeIn);
  return newTradeIn;
}

export async function getTradeIns(userId?: string): Promise<TradeIn[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query = userId ? { userId } : {};
      const dbTradeIns = await TradeInModel.find(query).sort({ createdAt: -1 }).lean();
      return (dbTradeIns || []).map((t) => ({
        ...t,
        _id: t._id.toString(),
      })) as unknown as TradeIn[];
    }
  } catch (err) {
    console.warn('Memory fallback for trade-ins:', err);
  }

  if (userId) {
    return memoryTradeIns.filter((t) => t.userId === userId);
  }
  return memoryTradeIns;
}

export async function updateTradeIn(
  id: string,
  updates: Partial<TradeIn>
): Promise<TradeIn | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updated = await TradeInModel.findOneAndUpdate(
        { $or: [{ _id: id }, { tradeInNumber: id }] },
        { $set: updates },
        { new: true }
      ).lean();
      if (updated) {
        return {
          ...updated,
          _id: updated._id.toString(),
        } as unknown as TradeIn;
      }
      return null;
    }
  } catch (err) {
    console.warn('Updating trade-in in memory store:', err);
  }

  const idx = memoryTradeIns.findIndex((t) => t._id === id || t.tradeInNumber === id);
  if (idx !== -1) {
    memoryTradeIns[idx] = { ...memoryTradeIns[idx], ...updates };
    return memoryTradeIns[idx];
  }

  return null;
}
