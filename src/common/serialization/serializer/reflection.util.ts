import { ExecutionContext } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ClassConstructor } from 'class-transformer';
import { ContextType, SERIALIZABLE_META_KEY } from '../constants';

interface ISerializable<T extends object> {
  [SERIALIZABLE_META_KEY]?: ClassConstructor<T>;
}

export function apiSerializedMeta<T extends object, V extends T | T[]>(dto: V, dtoClass: ClassConstructor<T>) {
  if (!dto) return;

  if (Array.isArray(dto)) {
    dto.forEach((item) => ((item as ISerializable<T>)[SERIALIZABLE_META_KEY] = dtoClass));
  } else {
    (dto as ISerializable<T>)[SERIALIZABLE_META_KEY] = dtoClass;
  }
}

/**
 * @description It returns the first dtoClass that was used to serialize the dto.
 * If array with many variants, it returns the first one.
 */
export function getSerializedMeta<T extends object, V extends T | T[]>(dto: V): ClassConstructor<T> | null {
  if (!dto) return null;

  if (Array.isArray(dto)) {
    return dto.find((item) => (item as ISerializable<T>)[SERIALIZABLE_META_KEY]);
  }

  return (dto as ISerializable<T>)[SERIALIZABLE_META_KEY] ?? null;
}

export function getDtoClassFromContext<T extends object>(context: ExecutionContext): ClassConstructor<T> | null {
  const handler = context.getHandler();

  const dtoMetadata = Reflect.getMetadata(DECORATORS.API_RESPONSE, handler) as
    | Record<string, ApiResponseOptions>
    | undefined;

  if (!dtoMetadata) return null;

  switch (context.getType()) {
    case ContextType.http:
      return extractHttpDtoClass<T>(context, dtoMetadata);

    case ContextType.ws:
    case ContextType.rpc:
    default:
      return null;
  }
}

function isClassConstructor(value: unknown): boolean {
  return value?.toString().startsWith('class') === true;
}

function extractDtoClassFromMeta<T>(responseMeta?: ApiResponseOptions): ClassConstructor<T> | null {
  if (responseMeta && 'type' in responseMeta && isClassConstructor(responseMeta.type)) {
    return responseMeta.type as ClassConstructor<T>;
  }

  return null;
}

function extractHttpDtoClass<T>(
  context: ExecutionContext,
  dtoMetadata: Record<string, ApiResponseOptions>,
): ClassConstructor<T> | null {
  const httpStatus = context.switchToHttp().getResponse().statusCode;

  const responseMeta = dtoMetadata[httpStatus];

  return extractDtoClassFromMeta<T>(responseMeta);
}
