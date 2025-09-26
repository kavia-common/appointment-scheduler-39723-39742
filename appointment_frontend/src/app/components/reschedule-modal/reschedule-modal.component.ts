import { Component, EventEmitter, Input, Output, Signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment, AppointmentService, AvailabilitySlot } from '../../services/appointment.service';
import { CalendarComponent } from '../calendar/calendar.component';

/**
 * PUBLIC_INTERFACE
 * RescheduleModalComponent
 * A presentational modal that allows picking a new date/time for an existing appointment.
 * Emits confirm/cancel events. Business logic to perform the reschedule can be wired later.
 */
@Component({
  selector: 'app-reschedule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './reschedule-modal.component.html',
  styleUrl: './reschedule-modal.component.css'
})
export class RescheduleModalComponent implements OnChanges {
  /** Appointment to be rescheduled */
  @Input() appointment: Appointment | null = null;

  /** Control modal visibility */
  @Input() open = false;

  /** Emit when user closes without saving */
  @Output() closed = new EventEmitter<void>();

  /** Emit when user confirms with new date/time */
  @Output() confirmed = new EventEmitter<{ date: string; time: string }>();

  /** Local selection state */
  selectedDate: string | null = null;
  selectedTime = '';

  /** Loading and error placeholders for future async behavior */
  loading = false;
  error: string | null = null;

  constructor(private readonly service: AppointmentService) {}

  /** Available times for the selected date */
  readonly times: Signal<string[]> = computed(() => {
    if (!this.selectedDate) return [];
    const slot: AvailabilitySlot | undefined = this.service.getAvailabilityByDate(this.selectedDate);
    // Make the current appointment's time available if rescheduling within same date
    const base = slot?.times ?? [];
    if (this.appointment && this.selectedDate === this.appointment.date) {
      if (!base.includes(this.appointment.time)) {
        return [...base, this.appointment.time].sort();
      }
    }
    return base;
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Initialize selection when modal opens or appointment input changes
    if ((changes['open'] || changes['appointment']) && this.open && this.appointment) {
      this.selectedDate = this.appointment.date;
      this.selectedTime = this.appointment.time;
      this.error = null;
    }
    // Reset when closing
    if (changes['open'] && !this.open) {
      this.error = null;
    }
  }

  // PUBLIC_INTERFACE
  onDateChange(date: string) {
    /** Update when calendar selection changes */
    this.selectedDate = date;
    this.selectedTime = '';
    this.error = null;
  }

  // PUBLIC_INTERFACE
  confirm() {
    /**
     * Validate and emit selected date/time.
     * The actual reschedule logic will be implemented in the parent or service later.
     */
    this.error = null;
    if (!this.selectedDate || !this.selectedTime) {
      this.error = 'Please choose a new date and time.';
      return;
    }
    if (!this.times().includes(this.selectedTime)) {
      this.error = 'Selected time is not available.';
      return;
    }
    this.confirmed.emit({ date: this.selectedDate, time: this.selectedTime });
  }

  // PUBLIC_INTERFACE
  close() {
    /** Close the modal without confirming. */
    this.closed.emit();
  }

  // PUBLIC_INTERFACE
  initializeFromAppointment() {
    /**
     * Initialize the modal selections from the bound appointment.
     * This method is kept for potential external/manual calls, but initialization
     * happens automatically via ngOnChanges when inputs change.
     */
    if (this.appointment) {
      this.selectedDate = this.appointment.date;
      this.selectedTime = this.appointment.time;
      this.error = null;
    }
  }
}
