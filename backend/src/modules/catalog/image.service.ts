import { Permission } from "../../constant/permision.js";
import { requirePermission } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { uploadImage } from "../../lib/upload-image.js";

// add()
const addImage = async (productId: string, altText: string, imageBuffer: Buffer) => {
    try {
        requirePermission(Permission.PRODUCT_CREATE, "add image");
        const imageUrl = await uploadImage(imageBuffer);
        const image = await prisma.productImage.create({
            data: { productId, url: imageUrl, altText },
        });
        return image;
    } catch (error) {
        throw error;
    }
}
// remove()
const removeImage = async (id: string) => {
    try {
        requirePermission(Permission.PRODUCT_CREATE, "remove image");
        await prisma.productImage.delete({
            where: { id },
        });
        return;
    } catch (error) {
        throw error;
    }
}
// reorder()
const reorderImage = async (id: string, sortOrder: number) => {
    try {
        requirePermission(Permission.PRODUCT_CREATE, "reorder image");
        const image = await prisma.productImage.update({
            where: { id },
            data: { sortOrder },
        });
        return image;
    } catch (error) {
        throw error;
    }
}

// list()
const listImages = async (productId: string) => {
    try {
        requirePermission(Permission.PRODUCT_READ, "list images");
        const images = await prisma.productImage.findMany({
            where: { productId },
        });
        return images;
    } catch (error) {
        throw error;
    }
}

export default {
    addImage,
    removeImage,
    reorderImage,
    listImages,
}