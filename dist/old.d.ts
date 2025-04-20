declare class ProfanityMatcher {
    private badwords;
    private filepath;
    constructor(filepath?: string);
    scan(text: string): string[];
    addWord(word: string): boolean;
    removeWord(word: string): boolean;
    saveWords(): boolean;
}
export = ProfanityMatcher;
