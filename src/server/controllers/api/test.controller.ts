import {Controller, Get, IgnoreProperty} from '@tsed/common';
import 'reflect-metadata';

class Test {

    emptyProperty;

    property = 'property';

    @IgnoreProperty()
    ignoredProperty = 'ignoredProperty';
}


@Controller('')
export class TestController {

    @Get('')
    get() {
        return new Test();
    }
}