import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-input',
  templateUrl: './demo-input.component.html',
  styleUrls: ['./demo-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
