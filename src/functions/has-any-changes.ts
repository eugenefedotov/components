import {SimpleChanges} from '@angular/core';

export function hasAnyChanges(changes: SimpleChanges, keys: string[]) {
    return keys.some(key => changes.hasOwnProperty(key));
}
