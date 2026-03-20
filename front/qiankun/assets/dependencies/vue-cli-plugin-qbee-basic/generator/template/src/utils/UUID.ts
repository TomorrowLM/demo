import uuidv1 from 'uuid/v1';
import { padStart } from 'lodash';

/**
 * 生成UUID
 *
 * @export
 * @returns {string}
 */
export function uuid(): string {
  return uuidv1()
    .replace(/-/g, '')
    .toLowerCase();
}

export function genLocalId(): string {
  return uuid();
}

let count = 0;
const baseNumber = -900000000000000;
export function genMessageId(): string {
  return baseNumber - (Date.now() + (count += 1)) + '';
}

export function parseMessageId(id: string | number): string {
  return padStart(`${id || ''}`, 19, '0');
}
