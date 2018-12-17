import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-overview',
  templateUrl: './demo-overview.component.html',
  styleUrls: ['./demo-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
