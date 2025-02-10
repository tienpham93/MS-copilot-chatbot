

export const parseAnswer = (response: string): string => {
    const match = response.match(/\*\*\*{(.*)}\*\*\*/);
    if (match && match[1]) {
        return match[1].replace(`'answer': `, '').replace(/'/g, '').replace(/"/g, '').replace('answer:', '');
    }
    return '';
};