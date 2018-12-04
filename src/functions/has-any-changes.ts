import {SimpleChanges} from '@angular/core';
import {isDefined} from './is-defined';

export function hasAnyChanges<T>(changes: SimpleChanges, keys: (keyof T)[], first?: boolean) {
    return keys.some(key =>
        changes.hasOwnProperty(key) && (!isDefined(first) || changes[key as string].firstChange === first)
    );
}
