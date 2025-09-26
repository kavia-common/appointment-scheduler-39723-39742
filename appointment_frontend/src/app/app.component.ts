import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * AppComponent
 * This is the root shell for the Appointment Scheduler UI.
 * It renders the header, sidebar navigation, and a main content area with a router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** App title shown in header */
  title = 'Appointment Scheduler';

  /** Sidebar collapse state for small screens */
  sidebarOpen = true;

  // PUBLIC_INTERFACE
  toggleSidebar() {
    /** Toggle the sidebar visibility on small screens. */
    this.sidebarOpen = !this.sidebarOpen;
  }
}
