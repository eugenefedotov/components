import {Component, OnInit} from '@angular/core';
import {DialogService} from '../../../../shared/shared-services/services/dialog/dialog.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    constructor(private dialogService: DialogService) {
    }

    ngOnInit() {
    }

}
