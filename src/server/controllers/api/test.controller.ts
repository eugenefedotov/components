import {Controller, Get, IgnoreProperty} from '@tsed/common';
import 'reflect-metadata';
import {jsonIgnore} from 'json-ignore';

class Test {

    emptyProperty;

    property = 'property';

    @jsonIgnore()
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