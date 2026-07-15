export default (text: string, addRandomSuffix: boolean = false) => {
    let slug = text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    if (addRandomSuffix) {
        slug += `-${Math.random().toString(36).substring(2, 15)}`;
    }
    return slug;
}