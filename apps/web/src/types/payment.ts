import { PaymentStatus } from "./enums";
import { User } from "./user";

export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountCents: number;
  status: PaymentStatus;
  qrToken: string;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface Ticket {
  id: string;
  paymentId: string;
  userId: string;
  user: User;
  eventId: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: Date;
}
