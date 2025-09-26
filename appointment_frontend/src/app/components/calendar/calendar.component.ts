import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarDay {
  date: string;     // YYYY-MM-DD
  label: number;    // day number
  inMonth: boolean; // belongs to current month
  isToday: boolean;
}

/**
 * PUBLIC_INTERFACE
 * CalendarComponent
 * Displays a minimalist monthly calendar to pick a date.
 * Emits selected date in YYYY-MM-DD format.
 */
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @Input() selectedDate: string | null = null;
  @Output() selectedDateChange = new EventEmitter<string>();

  readonly now = new Date();
  readonly view = signal(new Date(this.now.getFullYear(), this.now.getMonth(), 1));

  readonly title = computed(() =>
    this.view().toLocaleString(undefined, { month: 'long', year: 'numeric' })
  );

  readonly days = computed<CalendarDay[]>(() => this.computeDays(this.view()));

  // PUBLIC_INTERFACE
  nextMonth() {
    /** Navigate to next month in view. */
    const v = new Date(this.view());
    v.setMonth(v.getMonth() + 1);
    this.view.set(v);
  }

  // PUBLIC_INTERFACE
  prevMonth() {
    /** Navigate to previous month in view. */
    const v = new Date(this.view());
    v.setMonth(v.getMonth() - 1);
    this.view.set(v);
  }

  // PUBLIC_INTERFACE
  pick(day: CalendarDay) {
    /** Pick a day and emit selection. */
    if (!day.inMonth) return;
    this.selectedDate = day.date;
    this.selectedDateChange.emit(day.date);
  }

  private computeDays(firstOfMonth: Date): CalendarDay[] {
    const year = firstOfMonth.getFullYear();
    const month = firstOfMonth.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const startWeekday = start.getDay(); // 0=Sun
    const totalDays = end.getDate();

    const days: CalendarDay[] = [];
    // leading previous month fillers
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(year, month, -(startWeekday - 1 - i));
      days.push(this.toCalDay(d, false));
    }
    // current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      days.push(this.toCalDay(d, true));
    }
    // trailing fillers to complete 6 rows (42 cells)
    while (days.length % 7 !== 0 || days.length < 42) {
      const last = days[days.length - 1];
      const d = new Date(last.date);
      d.setDate(d.getDate() + 1);
      days.push(this.toCalDay(d, false));
    }
    return days;
  }

  private toCalDay(d: Date, inMonth: boolean): CalendarDay {
    const todayStr = new Date().toISOString().slice(0, 10);
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      label: d.getDate(),
      inMonth,
      isToday: date === todayStr,
    };
  }
}
