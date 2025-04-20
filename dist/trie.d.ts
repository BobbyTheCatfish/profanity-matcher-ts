declare class ProfanityMatcher {
    private badwordsTrie;
    private filepath;
    private badwordsSet;
    constructor(filepath?: string);
    private normalize;
    private init;
    scan(text: string): string[];
    addWord(word: string): boolean;
    removeWord(word: string): boolean;
}
export = ProfanityMatcher;
