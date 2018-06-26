import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DemoComponentInfo} from '../demo.components';

@Component({
    selector: 'app-demo-sandbox',
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

    componentInfo: DemoComponentInfo;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { componentInfo: DemoComponentInfo }) => {
            this.componentInfo = data.componentInfo;
        });
    }

}
