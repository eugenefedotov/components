import {SimpleChanges} from '@angular/core';
import {isDefined} from './is-defined';

export function hasAnyChanges(changes: SimpleChanges, keys: string[], first?: boolean) {
    return keys.some(key => changes.hasOwnProperty(key) && (!isDefined(first) || changes[key].firstChange === first));
}
