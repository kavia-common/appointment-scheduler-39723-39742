import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';

/**
 * PUBLIC_INTERFACE
 * BookingComponent
 * Dedicated booking page with calendar and form.
 */
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, CalendarComponent, BookingFormComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  selectedDate: string | null = new Date().toISOString().slice(0, 10);

  // PUBLIC_INTERFACE
  onDateChange(date: string) {
    /** Handle calendar date change */
    this.selectedDate = date;
  }
}
