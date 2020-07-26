import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'hottek';
  public appCodeName: string;

  constructor( ) {
    this.appCodeName = navigator.appCodeName;
  }
}
