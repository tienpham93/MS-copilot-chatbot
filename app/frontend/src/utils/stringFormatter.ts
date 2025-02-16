

export const parseAnswer = (response: string): string => {
    const match = response.match(/\*\*\*{(.*)}\*\*\*/);
    if (match && match[1]) {
        return match[1].replace(`'answer': `, '')
            .replace(/"/g, '')
            .replace('answer:', '')
            .replace(', isManIntervention: false', '')
            .replace(', isManIntervention: true', '')
    }
    return '';
};