import { Permission } from '@prisma/client';

/**
 * @PERMISSION_NAMING_RULES
 *
 * Permission key format: `resource`.`action`
 *
 * Rules:
 * - `resource` MUST be a plural noun (e.g. `users`, `orders`, `messages`)
 * - `action` MUST be a verb in singular form (e.g. `view`, `create`, `update`)
 * - `action` MAY contain hyphens to clarify intent (e.g. `reset-password`)
 * - Use lowercase letters only
 * - Do NOT use camelCase or snake_case
 *
 * Examples:
 * ```json
 * users.view
 * users.create
 * users.reset-password
 * ```
 */
const PERMISSIONS_ARRAY = [
  {
    key: 'users.view',
    title: 'View user details',
  },
] as const;

export const PERMISSIONS: ReadonlyArray<Permission> = PERMISSIONS_ARRAY;
export type TPermissionKey = (typeof PERMISSIONS_ARRAY)[number]['key'];

export const permissionsSet = new Set<TPermissionKey>(PERMISSIONS_ARRAY.map((permission) => permission.key));

export function hasPermission(key: string): key is TPermissionKey {
  return permissionsSet.has(key as TPermissionKey);
}

// ! discover this further
export const PERMISSION_KEY_MAP = PERMISSIONS_ARRAY.reduce(
  (acc, permission) => {
    acc[permission.key] = permission.key;
    return acc;
  },
  {} as Record<TPermissionKey, TPermissionKey>,
);
