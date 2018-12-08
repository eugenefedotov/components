import * as crypto from 'crypto';

export function createHash(value: string, algoritm: string): string {
    return crypto.createHash(algoritm).update(value).digest('hex');
}
