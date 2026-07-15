import { Permission } from "../../constant/permision.js";
import { Role } from "../../generated/prisma/enums.js";
import { hasPermission } from "./role-permissions.js";

const canAccess = (role: Role, permission: Permission): boolean => {
    return hasPermission(role, permission);
}

const canAny = (role: Role, permissions: Permission[]): boolean => {
    return permissions.some((permission) => canAccess(role, permission));
}

const canAll = (role: Role, permissions: Permission[]): boolean => {
    return permissions.every((permission) => canAccess(role, permission));
}

export default {
    canAccess,
    canAny,
    canAll
}