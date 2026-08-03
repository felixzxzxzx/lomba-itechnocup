export const hasPublicId = () => {
    const random = Math.random().toString(36).slice(2);
    return random;
}