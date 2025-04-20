declare class ProfanityMatcher {
    badwords: Set<string>;
    filepath: string;
    constructor(filepath?: string);
    scan(text: string, highlight?: string): {
        profane: string[];
        highlighted: string[];
    };
    addWord(word: string): boolean;
    removeWord(word: string): boolean;
    saveWords(): boolean;
}
export = ProfanityMatcher;
