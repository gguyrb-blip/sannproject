export type BookingStatus =
  | "New"
  | "Contacted"
  | "Confirmed"
  | "Not Available"
  | "Cancelled";

export type CheckinStatus =
  | "New"
  | "Reviewing"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export const BOOKING_STATUSES: BookingStatus[] = [
  "New",
  "Contacted",
  "Confirmed",
  "Not Available",
  "Cancelled",
];

export const CHECKIN_STATUSES: CheckinStatus[] = [
  "New",
  "Reviewing",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export const PREFERRED_UNITS = [
  "SANN Stay Hatyai - 4 BR House - 4 min to Leegarden",
] as const;

export const BOOKING_CHANNELS = [
  "Direct Booking",
  "Airbnb",
  "Booking.com",
  "Agoda",
  "Expedia",
  "Other",
] as const;

export type BookingInquiry = {
  id: string;
  created_at: string;
  check_in_date: string | null;
  check_out_date: string | null;
  number_of_guests: number | null;
  preferred_unit: string | null;
  guest_name: string;
  phone_line: string | null;
  email: string | null;
  message: string | null;
  status: BookingStatus;
  internal_notes: string | null;
};

export type CheckinGuest = {
  full_name: string;
  date_of_birth: string | null;
  id_passport_number: string | null;
  id_passport_file_path: string | null;
};

export type Checkin = {
  id: string;
  created_at: string;
  booking_name: string | null;
  booking_channel: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  number_of_guests: number | null;
  guest_full_name: string;
  phone: string | null;
  email: string | null;
  nationality: string | null;
  id_passport_number: string | null;
  estimated_arrival_time: string | null;
  special_requests: string | null;
  id_passport_file_path: string | null;
  consent: boolean;
  status: CheckinStatus;
  internal_notes: string | null;
  locker_code: string | null;
  self_checkin_note: string | null;
  guests: CheckinGuest[];
};
