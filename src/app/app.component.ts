import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div class="col-4">
        <weather-widget></weather-widget>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding-top: 2.5rem;
    }
  `]
})
export class AppComponent {
  //title = 'app';
}
