import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { AvailabilityComponent } from './pages/availability/availability.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Dashboard' },
  { path: 'book', component: BookingComponent, title: 'Book Appointment' },
  { path: 'appointments', component: AppointmentsComponent, title: 'My Appointments' },
  { path: 'availability', component: AvailabilityComponent, title: 'Availability' },
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  { path: '**', redirectTo: '' }
];
