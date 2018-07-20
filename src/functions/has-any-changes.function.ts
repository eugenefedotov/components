import {SimpleChanges} from '@angular/core';
import {isDefinedFunction} from './is-defined.function';

export function hasAnyChangesFunction(changes: SimpleChanges, keys: string[], first?: boolean) {
    return keys.some(key => changes.hasOwnProperty(key) && (!isDefinedFunction(first) || changes[key].firstChange === first));
}
