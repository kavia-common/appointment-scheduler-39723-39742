import { Component, EventEmitter, Input, Output, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { FormsModule } from '@angular/forms';

/**
 * PUBLIC_INTERFACE
 * BookingFormComponent
 * Presents a form to book an appointment using provided availability service.
 */
@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  @Input() date: string | null = null;
  @Output() booked = new EventEmitter<void>();

  name = '';
  email = '';
  time = '';
  notes = '';

  readonly times: Signal<string[]> = computed(() => {
    if (!this.date) return [];
    const avail = this.service.getAvailabilityByDate(this.date);
    return avail?.times ?? [];
  });

  submitting = false;
  success: string | null = null;
  error: string | null = null;

  constructor(private readonly service: AppointmentService) {}

  // PUBLIC_INTERFACE
  submit() {
    /** Validate and submit booking request. */
    this.error = null;
    this.success = null;

    if (!this.date || !this.name || !this.email || !this.time) {
      this.error = 'Please complete all required fields.';
      return;
    }
    if (!this.times().includes(this.time)) {
      this.error = 'Selected time is no longer available.';
      return;
    }

    this.submitting = true;
    try {
      this.service.book({
        name: this.name,
        email: this.email,
        date: this.date,
        time: this.time,
        notes: this.notes || undefined
      });
      this.success = 'Appointment booked successfully.';
      this.booked.emit();
      // Reset time/notes only
      this.time = '';
      this.notes = '';
    } catch (e) {
      this.error = 'Failed to book. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
