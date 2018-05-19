import {Component} from '@angular/core';
import {UserEntity} from '../dao/core/auth/user/user.entity';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    user: UserEntity = new UserEntity();

    title = 'app';
}
