import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../services/appointment.service';

/**
 * PUBLIC_INTERFACE
 * AppointmentsListComponent
 * Displays current appointments and allows cancellation and rescheduling.
 */
@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {
  readonly items: Signal<Appointment[]> = computed(() => {
    const copy = [...this.service.appointments()];
    return copy.sort((a: Appointment, b: Appointment) =>
      a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    );
  });

  // Reschedule UI state
  reschedulingId: string | null = null;
  rescheduleDate: string = '';
  rescheduleTime: string = '';
  rescheduleSuccess: string | null = null;
  rescheduleError: string | null = null;

  readonly rescheduleTimes = computed(() => {
    if (!this.rescheduleDate) return [];
    const avail = this.service.getAvailabilityByDate(this.rescheduleDate);
    return avail?.times ?? [];
  });

  constructor(private readonly service: AppointmentService) {}

  // PUBLIC_INTERFACE
  cancel(id: string) {
    /** Cancel an appointment by id. */
    this.service.cancel(id);
    if (this.reschedulingId === id) {
      this.clearRescheduleState();
    }
  }

  // PUBLIC_INTERFACE
  toggleReschedule(id: string | null) {
    /** Toggle the reschedule panel for an appointment. */
    this.rescheduleSuccess = null;
    this.rescheduleError = null;
    if (id && this.reschedulingId !== id) {
      this.reschedulingId = id;
      this.rescheduleDate = '';
      this.rescheduleTime = '';
    } else {
      this.clearRescheduleState();
    }
  }

  // PUBLIC_INTERFACE
  applyReschedule(id: string) {
    /** Apply reschedule request using service. */
    this.rescheduleSuccess = null;
    this.rescheduleError = null;

    if (!this.rescheduleDate || !this.rescheduleTime) {
      this.rescheduleError = 'Select a new date and time.';
      return;
    }
    const ok = this.service.reschedule(id, this.rescheduleDate, this.rescheduleTime);
    if (!ok) {
      this.rescheduleError = 'Selected time is not available.';
      return;
    }
    this.rescheduleSuccess = 'Appointment rescheduled successfully.';
    this.clearRescheduleState();
  }

  private clearRescheduleState() {
    this.reschedulingId = null;
    this.rescheduleDate = '';
    this.rescheduleTime = '';
  }
}
