
import { Component, ChangeDetectionStrategy, input, output, signal, effect, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Filters {
  text: string;
  author: string;
  type: string;
  scope: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  // --- Inputs ---
  types = input<string[]>([]);
  scopes = input<string[]>([]);
  authors = input<string[]>([]);

  // --- Outputs ---
  filtersChanged = output<Filters>();

  // --- Internal State Signals ---
  text = signal('');
  author = signal('all');
  type = signal('all');
  scope = signal('all');
  startDate = signal('');
  endDate = signal('');
  sortBy = signal('date-desc');

  constructor() {
    // Effect to watch all filter signals and emit the changes
    effect(() => {
      this.filtersChanged.emit({
        text: this.text(),
        author: this.author(),
        type: this.type(),
        scope: this.scope(),
        startDate: this.startDate(),
        endDate: this.endDate(),
        sortBy: this.sortBy()
      });
    }, { allowSignalWrites: true }); // Necessary for effects that might indirectly cause writes
  }
  
  clearDates() {
    this.startDate.set('');
    this.endDate.set('');
  }
}
