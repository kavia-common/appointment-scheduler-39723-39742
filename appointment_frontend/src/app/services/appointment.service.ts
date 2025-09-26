import { Injectable, signal } from '@angular/core';

export interface AvailabilitySlot {
  date: string; // YYYY-MM-DD
  times: string[]; // e.g., '09:00', '09:30'
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  notes?: string;
}

// Simple UUID fallback (no external deps)
function uuid(): string {
  // RFC4122 v4-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * PUBLIC_INTERFACE
 * AppointmentService
 * Provides in-memory availability and appointment management.
 * Replace with real API integration when backend is available.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentService {
  /** Reactive list of appointments */
  readonly appointments = signal<Appointment[]>([]);

  /** Mock availability slots for the next 14 days */
  readonly availability = signal<AvailabilitySlot[]>(this.generateAvailability());

  // PUBLIC_INTERFACE
  getAvailabilityByDate(date: string): AvailabilitySlot | undefined {
    /** Returns available times for the provided date. */
    return this.availability().find((s: AvailabilitySlot) => s.date === date);
  }

  // PUBLIC_INTERFACE
  book(payload: Omit<Appointment, 'id'>): Appointment {
    /** Adds an appointment if slot is available and returns it. */
    const id = uuid();
    const appt: Appointment = { id, ...payload };
    this.appointments.update((list: Appointment[]) => [...list, appt]);

    // remove time from availability
    const slots = this.availability().map((s: AvailabilitySlot) => {
      if (s.date === payload.date) {
        return { ...s, times: s.times.filter((t: string) => t !== payload.time) };
      }
      return s;
    });
    this.availability.set(slots);
    return appt;
  }

  // PUBLIC_INTERFACE
  cancel(id: string): boolean {
    /** Cancels an appointment and frees the slot. */
    const current = this.appointments();
    const appt = current.find((a: Appointment) => a.id === id);
    if (!appt) return false;
    this.appointments.set(current.filter((a: Appointment) => a.id !== id));
    // return slot back
    const slots = this.availability().map((s: AvailabilitySlot) => {
      if (s.date === appt.date && !s.times.includes(appt.time)) {
        return { ...s, times: [...s.times, appt.time].sort() };
      }
      return s;
    });
    this.availability.set(slots);
    return true;
  }

  // PUBLIC_INTERFACE
  reschedule(id: string, newDate: string, newTime: string): boolean {
    /** Reschedules an appointment to a new date/time if the slot is available.
     * - Validates new slot availability
     * - Returns old slot to availability
     * - Updates appointment
     * - Removes new slot from availability
     */
    const list = this.appointments();
    const index = list.findIndex((a: Appointment) => a.id === id);
    if (index === -1) return false;

    const appt = list[index];

    // Validate requested slot is available
    const availForNew = this.getAvailabilityByDate(newDate);
    if (!availForNew || !availForNew.times.includes(newTime)) {
      return false;
    }

    // 1) Return old slot back
    const withOldBack = this.availability().map((s: AvailabilitySlot) => {
      if (s.date === appt.date && !s.times.includes(appt.time)) {
        return { ...s, times: [...s.times, appt.time].sort() };
      }
      return s;
    });

    // 2) Remove new slot from availability
    const withNewRemoved = withOldBack.map((s: AvailabilitySlot) => {
      if (s.date === newDate) {
        return { ...s, times: s.times.filter((t: string) => t !== newTime) };
      }
      return s;
    });
    this.availability.set(withNewRemoved);

    // 3) Update appointment entry
    const updated: Appointment = { ...appt, date: newDate, time: newTime };
    const nextList = [...list];
    nextList[index] = updated;
    this.appointments.set(nextList);

    return true;
  }

  private generateAvailability(): AvailabilitySlot[] {
    const out: AvailabilitySlot[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const date = d.toISOString().slice(0, 10);
      const times: string[] = [];
      for (let h = 9; h <= 16; h++) {
        times.push(`${String(h).padStart(2, '0')}:00`);
        times.push(`${String(h).padStart(2, '0')}:30`);
      }
      out.push({ date, times });
    }
    return out;
  }
}
