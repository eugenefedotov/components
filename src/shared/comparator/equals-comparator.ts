import {Comparator} from './comparator';

export class EqualsComparator<T> implements Comparator<T> {
    equals(obj1: T, obj2: T): boolean {
        return obj1 && obj2 && JSON.stringify(obj1) === JSON.stringify(obj2);
    }
}
