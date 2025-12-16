import { ClassConstructor } from 'class-transformer';
import { IClassSerializable, ISerializable } from './types';

/**
 * @description Checks if the object has custom serialization strategy.
 */
export function isSerializable(obj: unknown): obj is ISerializable {
  return typeof obj === 'object' && obj !== null && 'serialize' in obj;
}

/**
 * @description Checks if the class has custom serialization strategy.
 */
export function isClassSerializable<T extends object>(
  dtoClass: ClassConstructor<T>,
): dtoClass is IClassSerializable<T> {
  return 'serialize' in dtoClass;
}
