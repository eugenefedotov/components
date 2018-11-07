import {Comparator} from '../comparator';

export class CustomComparator<T> implements Comparator<T> {
    constructor(readonly equals: (obj1: T, obj2: T) => boolean) {

    }
}
