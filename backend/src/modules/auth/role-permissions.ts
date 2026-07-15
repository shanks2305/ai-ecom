import { Permission } from "../../constant/permision.js";
import { Role } from "../../generated/prisma/enums.js";

const ALL_PERMISSIONS = Object.values(Permission).filter(
    (value): value is Permission => typeof value === "number",
);

export const rolePermissions = {
    [Role.SUPER_ADMIN]: ALL_PERMISSIONS,
    [Role.ADMIN]: ALL_PERMISSIONS.filter(
        (permission) => permission !== Permission.SUPER_ADMIN_CREATE,
    ),
    [Role.CUSTOMER]: [
        Permission.PRODUCT_READ,
        Permission.CART_READ,
        Permission.CART_UPDATE,
        Permission.ORDER_CREATE,
        Permission.ORDER_READ,
        Permission.ORDER_UPDATE,
    ],
} as const satisfies Record<Role, readonly Permission[]>;

export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = rolePermissions[role] as readonly Permission[];
    return permissions.includes(permission);
}
