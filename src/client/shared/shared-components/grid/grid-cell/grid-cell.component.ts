import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCellComponent implements OnInit {

  @Input()
  cell: any;

  constructor() { }

  ngOnInit() {
  }

}
