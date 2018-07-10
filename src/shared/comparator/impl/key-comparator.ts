import {Comparator} from '../comparator';

export class KeyComparator<T> implements Comparator<T> {

    constructor(private key: keyof T) {

    }

    equals(obj1: T, obj2: T): boolean {
        return obj1 && obj2 && obj1[this.key] === obj2[this.key];
    }

}
