import connectToDatabase from '@/lib/mongodb';
import TradeInModel from '@/models/TradeIn';
import { TradeIn, TradeInStatus } from '@/types';
import { generateId } from '@/lib/utils';

const INITIAL_TRADE_INS: TradeIn[] = [
  {
    _id: 'ti_101',
    tradeInNumber: 'TI-894120',
    userId: 'user_demo_1',
    customerName: 'Rahul Yadav',
    customerEmail: 'rahul.demo@iphonehub.in',
    customerPhone: '+91 98765 43210',
    deviceModel: 'iPhone 13',
    storage: '128 GB',
    condition: 'Excellent',
    batteryHealthPercent: 88,
    issues: {
      screenScratches: 'None',
      bodyCondition: 'Flawless',
      batteryHealth: 'Above 85%',
      cameraWorking: true,
      faceIdWorking: true,
      speakersAndMicWorking: true,
      boxAndAccessoriesPresent: true,
      validIndianBillPresent: true,
    },
    estimatedQuote: 32500,
    exchangeBonus: 2500,
    pickupAddress: {
      fullName: 'Rahul Yadav',
      phone: '+91 98765 43210',
      street: '402, Apex Signature Heights',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
    },
    pickupDate: '2026-11-02',
    pickupTimeSlot: '10:00 AM - 01:00 PM',
    payoutMethod: 'UPI',
    payoutDetails: 'rahul@okhdfcbank',
    status: 'Pickup Scheduled',
    createdAt: '2026-10-30T10:00:00Z',
  },
  {
    _id: 'ti_102',
    tradeInNumber: 'TI-894105',
    userId: 'user_cust_3',
    customerName: 'Amit Kumar',
    customerEmail: 'amit.k@example.com',
    customerPhone: '+91 98111 22334',
    deviceModel: 'iPhone 12 Pro',
    storage: '128 GB',
    condition: 'Good',
    batteryHealthPercent: 82,
    issues: {
      screenScratches: 'Minor',
      bodyCondition: 'Minor Scratches',
      batteryHealth: '80% - 85%',
      cameraWorking: true,
      faceIdWorking: true,
      speakersAndMicWorking: true,
      boxAndAccessoriesPresent: false,
      validIndianBillPresent: true,
    },
    estimatedQuote: 22800,
    exchangeBonus: 2000,
    finalQuote: 22500,
    pickupAddress: {
      fullName: 'Amit Kumar',
      phone: '+91 98111 22334',
      street: 'H-42, Sector 15, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201301',
    },
    pickupDate: '2026-10-29',
    pickupTimeSlot: '02:00 PM - 05:00 PM',
    payoutMethod: 'Bank Transfer',
    payoutDetails: 'HDFC Bank - A/C 501002348912',
    status: 'Payment Transferred',
    inspectionNotes: 'Verified minor hairline scratches on aluminum frame. Screen pristine. Paid ₹22,500 via IMPS.',
    createdAt: '2026-10-27T08:30:00Z',
  },
];

let memoryTradeIns: TradeIn[] = [...INITIAL_TRADE_INS];

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
      if (dbTradeIns && dbTradeIns.length > 0) {
        return dbTradeIns.map((t) => ({
          ...t,
          _id: t._id.toString(),
        })) as unknown as TradeIn[];
      }
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

