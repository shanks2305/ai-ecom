import { env } from "../../config/env.js"
import Role from "../../constant/userRole.js"
import { prisma } from "../../lib/prisma.js"

const isSuperAdminPreset = async () => {
    try {
        const superAdmin = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })
        if (!superAdmin) {
            const payload = {
                data: {
                    email: env.initialSuperAdminEmail,
                    firstName: env.initialSuperAdminFirstName,
                    lastName: env.initialSuperAdminLastName,
                    role: Role.SUPER_ADMIN,
                    isVerified: true,
                    isActive: true,
                }
            }
            const createAdmin = await prisma.user.create(payload)
            return createAdmin
        }
        return superAdmin
    } catch (error) {
        throw new Error("Failed to check if super admin is preset")
    }
}

export default isSuperAdminPreset