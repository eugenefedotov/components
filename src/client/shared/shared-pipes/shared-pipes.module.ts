import {NgModule} from '@angular/core';
import {DateTimePipe} from './date-time/date-time.pipe';

@NgModule({
    imports: [],
    declarations: [
        DateTimePipe
    ],
    exports: [
        DateTimePipe
    ]
})
export class SharedPipesModule {
}
