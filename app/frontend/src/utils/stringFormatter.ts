

export const parseAnswer = (response: string): string => {
    const match = response.match(/\*{1,3}\{?['"]?answer['"]?:?\s*(.*?)[\}]*\*{1,3}/);
    if (match && match[1]) {
        return match[1].trim();
    }
    return '';
};
