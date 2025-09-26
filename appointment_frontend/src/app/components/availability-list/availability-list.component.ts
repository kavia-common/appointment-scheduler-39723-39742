import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, AvailabilitySlot } from '../../services/appointment.service';

/**
 * PUBLIC_INTERFACE
 * AvailabilityListComponent
 * Shows availability slots for the next 14 days.
 */
@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-list.component.html',
  styleUrl: './availability-list.component.css'
})
export class AvailabilityListComponent {
  readonly slots: Signal<AvailabilitySlot[]> = computed(() =>
    this.service.availability().slice(0, 14)
  );

  constructor(private readonly service: AppointmentService) {}
}
