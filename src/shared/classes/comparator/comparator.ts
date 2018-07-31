export interface Comparator<T> {
    equals(obj1: T, obj2: T): boolean;
}
