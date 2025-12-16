import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { SKIP_SERIALIZATION_META_KEY } from '../constants';

export const SkipSerialization = () => SetMetadata(SKIP_SERIALIZATION_META_KEY, true);

export function isSkipSerialization(context: ExecutionContext): boolean {
  const handler = context.getHandler();
  const controllerClass = context.getClass();

  return (
    Reflect.getMetadata(SKIP_SERIALIZATION_META_KEY, handler) === true ||
    Reflect.getMetadata(SKIP_SERIALIZATION_META_KEY, controllerClass) === true
  );
}
