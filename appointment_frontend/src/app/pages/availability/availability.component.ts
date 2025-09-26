import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityListComponent } from '../../components/availability-list/availability-list.component';

/**
 * PUBLIC_INTERFACE
 * AvailabilityComponent
 * Page that displays availability overview.
 */
@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, AvailabilityListComponent],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent {}
