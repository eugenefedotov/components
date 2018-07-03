import {Comparator} from './comparator';

export class CustomComparator<T> implements Comparator<T> {
    constructor(public equals: (obj1: T, obj2: T) => boolean) {

    }
}
