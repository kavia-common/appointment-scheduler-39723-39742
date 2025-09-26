import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsListComponent } from '../../components/appointments-list/appointments-list.component';

/**
 * PUBLIC_INTERFACE
 * AppointmentsComponent
 * Page that lists and manages user appointments.
 */
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, AppointmentsListComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {}
