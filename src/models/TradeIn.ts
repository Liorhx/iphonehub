import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITradeIn extends Document {
  tradeInNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  storage: string;
  condition: string;
  batteryHealthPercent?: number;
  issues: {
    screenScratches: string;
    bodyCondition: string;
    batteryHealth: string;
    cameraWorking: boolean;
    faceIdWorking: boolean;
    speakersAndMicWorking: boolean;
    boxAndAccessoriesPresent: boolean;
    validIndianBillPresent: boolean;
  };
  estimatedQuote: number;
  exchangeBonus: number;
  finalQuote?: number;
  pickupAddress: {
    fullName: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  pickupDate: string;
  pickupTimeSlot: string;
  payoutMethod: 'UPI' | 'Bank Transfer';
  payoutDetails: string;
  status:
    | 'Quote Generated'
    | 'Pickup Scheduled'
    | 'Device Picked Up'
    | 'Inspection in Progress'
    | 'Price Approved'
    | 'Payment Transferred'
    | 'Cancelled';
  inspectionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TradeInSchema = new Schema(
  {
    _id: { type: String },
    tradeInNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deviceModel: { type: String, required: true },
    storage: { type: String, required: true },
    condition: { type: String, required: true },
    batteryHealthPercent: { type: Number },
    issues: {
      screenScratches: { type: String, default: 'None' },
      bodyCondition: { type: String, default: 'Flawless' },
      batteryHealth: { type: String, default: 'Above 85%' },
      cameraWorking: { type: Boolean, default: true },
      faceIdWorking: { type: Boolean, default: true },
      speakersAndMicWorking: { type: Boolean, default: true },
      boxAndAccessoriesPresent: { type: Boolean, default: false },
      validIndianBillPresent: { type: Boolean, default: false },
    },
    estimatedQuote: { type: Number, required: true },
    exchangeBonus: { type: Number, default: 0 },
    finalQuote: { type: Number },
    pickupAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    pickupDate: { type: String, required: true },
    pickupTimeSlot: { type: String, required: true },
    payoutMethod: { type: String, enum: ['UPI', 'Bank Transfer'], default: 'UPI' },
    payoutDetails: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'Quote Generated',
        'Pickup Scheduled',
        'Device Picked Up',
        'Inspection in Progress',
        'Price Approved',
        'Payment Transferred',
        'Cancelled',
      ],
      default: 'Quote Generated',
    },
    inspectionNotes: { type: String },
  },
  { timestamps: true }
);

export const TradeInModel: Model<ITradeIn> =
  mongoose.models.TradeIn || mongoose.model<ITradeIn>('TradeIn', TradeInSchema);

export default TradeInModel;

