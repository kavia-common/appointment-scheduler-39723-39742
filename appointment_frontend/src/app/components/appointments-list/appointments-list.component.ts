import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { RescheduleModalComponent } from '../reschedule-modal/reschedule-modal.component';

/**
 * PUBLIC_INTERFACE
 * AppointmentsListComponent
 * Displays current appointments and allows cancellation and rescheduling.
 */
@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RescheduleModalComponent],
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

  /** Modal state for rescheduling */
  rescheduleOpen = false;
  activeAppointment: Appointment | null = null;

  constructor(private readonly service: AppointmentService) {}

  // PUBLIC_INTERFACE
  cancel(id: string) {
    /** Cancel an appointment by id. */
    this.service.cancel(id);
  }

  // PUBLIC_INTERFACE
  openReschedule(appt: Appointment) {
    /** Open the reschedule modal for a given appointment. */
    this.activeAppointment = appt;
    this.rescheduleOpen = true;
    // The modal will initialize its local state from @Input() when opened.
  }

  // PUBLIC_INTERFACE
  closeReschedule() {
    /** Close the reschedule modal without changes. */
    this.rescheduleOpen = false;
    this.activeAppointment = null;
  }

  // PUBLIC_INTERFACE
  onRescheduleConfirmed(payload: { date: string; time: string }) {
    /**
     * Handle confirmed reschedule action.
     * For now, implement a simple in-memory swap using the service:
     * - Free old slot
     * - Occupy new slot
     * - Update appointment's date/time
     */
    const appt = this.activeAppointment;
    if (!appt) return;

    // Free old slot
    this.service.cancel(appt.id);

    // Book new slot with same name/email/notes
    this.service.book({
      name: appt.name,
      email: appt.email,
      date: payload.date,
      time: payload.time,
      notes: appt.notes
    });

    this.closeReschedule();
  }
}
