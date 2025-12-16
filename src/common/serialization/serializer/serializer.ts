import { ExecutionContext, InternalServerErrorException, Logger } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ApiCode, ApiException } from 'src/common/exceptions';
import { isSkipSerialization } from '../decorators';
import { getDtoClassFromContext } from './reflection.util';
import { isClassSerializable, isSerializable } from './type.utils';
import { Nullable, SerializeDtoOptions, SerializeResult } from './types';

const weakCache = new WeakMap<object, SerializeResult<object, object>>();

export function serializeDto<T extends object, V extends Nullable<T | T[]>>(
  dtoClass: ClassConstructor<T> | null | undefined,
  obj: V,
  options: SerializeDtoOptions = {},
): V extends null | undefined ? V : SerializeResult<T, NonNullable<V>> {
  options = {
    returnObjOnError: false,
    excludeExtraneousValues: false,
    ...options,
  };

  try {
    // Return early if obj is null or undefined
    if (obj === null || obj === undefined) {
      return obj as V extends null | undefined ? V : never;
    }

    // Check cache for existing serialized result
    const cachedResult = weakCache.get(obj);
    if (cachedResult) {
      return cachedResult as V extends null | undefined ? V : SerializeResult<T, NonNullable<V>>;
    }

    // Use object's serialize method if available
    if (isSerializable(obj)) {
      const result = obj.serialize() as SerializeResult<T, NonNullable<V>>;

      weakCache.set(obj, result);

      return result as V extends null | undefined ? V : SerializeResult<T, NonNullable<V>>;
    }

    // Handle case where no dtoClass is provided
    if (!dtoClass) {
      if (options.returnObjOnError) {
        return obj as V extends null | undefined ? V : never;
      }
      throw new InternalServerErrorException(`No dto class found for serialization.`);
    }

    // Use dtoClass's static serialize method if available
    if (isClassSerializable(dtoClass)) {
      const serializeItem = (item: T) => dtoClass.serialize(item);

      const res = Array.isArray(obj)
        ? ((obj as T[]).map(serializeItem) as V extends null | undefined ? V : SerializeResult<T, NonNullable<V>>)
        : (serializeItem(obj as T) as V extends null | undefined ? V : SerializeResult<T, NonNullable<V>>);

      weakCache.set(obj, res as object);

      return res;
    }

    // ! TODO: serialize method is instanceToPlain
    const result = plainToInstance(dtoClass, obj, options);

    // Cache the result to prevent multiple serialization
    weakCache.set(obj, result);
    return result as V extends null | undefined ? V : SerializeResult<T, NonNullable<V>>;
  } catch (error) {
    if (options.returnObjOnError) {
      return obj as V extends null | undefined ? V : never;
    }
    throw error;
  }
}

/**
 * @description Used to serialize any HTTP response using
 * "@nestjs/swagger" metadata that determines which DTO should be used.
 */
export function serializeApiResponse(data: object, context: ExecutionContext) {
  try {
    if (isSkipSerialization(context)) return data;

    const dtoClass = getDtoClassFromContext(context) ?? null;

    return serializeDto(dtoClass, data);
  } catch (error) {
    // ! TODO: Add custom logger here
    Logger.error(
      'Serialization',
      `Error during serialization in context "${context.getClass().name}::${context.getHandler().name}"`,
      {
        responseBody: data,
      },
      error,
    );

    const httpStatus = context.switchToHttp().getResponse().statusCode;

    throw new ApiException(ApiCode.STATUS_CODE_WITH_FAILED_RESPONSE(httpStatus));
  }
}
