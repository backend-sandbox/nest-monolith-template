import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

/**
 * @description Custom serialization strategy for DTOs with `serialize` method.
 * @example
 * class ExampleDto {
 *   ...
 *   serialize() {
 *     return { ...this };
 *   }
 * }
 */
export type ISerializable = {
  serialize: () => object;
};

/**
 * @description Custom serialization strategy for DTOs with static `serialize` method.
 * @example
 * class ExampleDto {
 *   ...
 *   static serialize(dto: ExampleDto) {
 *     return { ...dto };
 *   }
 * }
 */
export type IClassSerializable<T extends object> = ClassConstructor<T> & {
  serialize: (dto: T) => object;
};

export type SerializeDtoOptions = ClassTransformOptions & {
  returnObjOnError?: boolean;
};

export type Nullable<T> = T | null | undefined;

export type SerializeResult<T extends object, V extends T | T[]> = V extends T[] ? T[] : T;
