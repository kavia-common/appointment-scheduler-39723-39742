import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../services/appointment.service';

/**
 * PUBLIC_INTERFACE
 * AppointmentsListComponent
 * Displays current appointments and allows cancellation.
 */
@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private readonly service: AppointmentService) {}

  // PUBLIC_INTERFACE
  cancel(id: string) {
    /** Cancel an appointment by id. */
    this.service.cancel(id);
  }
}
