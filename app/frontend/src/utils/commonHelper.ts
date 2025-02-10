

export const isKeywordsIncluded = (message: string, keywords: string[]): boolean => {
    // check if message includes any of the keywords
    return keywords.some(keyword => message.includes(keyword));
}