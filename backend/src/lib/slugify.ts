import crypto from 'crypto';

export default (text: string, addRandomSuffix: boolean = false) => {
    let slug = text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    if (addRandomSuffix) {
        slug += `-${crypto.randomUUID()}`;
    }
    return slug;
}