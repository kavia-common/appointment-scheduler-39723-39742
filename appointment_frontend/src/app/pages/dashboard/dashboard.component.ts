import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { AvailabilityListComponent } from '../../components/availability-list/availability-list.component';

/**
 * PUBLIC_INTERFACE
 * DashboardComponent
 * Combines a calendar with a booking form and quick availability overview.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent, BookingFormComponent, AvailabilityListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedDate: string | null = new Date().toISOString().slice(0, 10);

  // PUBLIC_INTERFACE
  onDateChange(date: string) {
    /** Handle calendar date change */
    this.selectedDate = date;
  }
}
