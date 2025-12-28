type ProfanityMatcherOptions = {
    filepath?: string;
    /** @description Default: /[^\w\s]/g */
    removalRegex?: RegExp;
    /** @description Default: /\s+/*/
    splitRegex?: RegExp;
};
declare class ProfanityMatcher {
    private badwordsTrie;
    private filepath;
    private badwordsSet;
    private removalRegex;
    private splitRegex;
    constructor(options?: string | ProfanityMatcherOptions);
    private normalize;
    private init;
    /**
     * Scan input text for bad words or phrases
     * @param text The text to scan
     * @returns Array of detected profanity
     */
    scan(text: string): string[];
    /**
     * Add a word or phrase to the profanity filter
     * @param word The word or phrase to add
     * @returns Whether or not it was added (false means it was already in the filter)
     */
    addWord(word: string): boolean;
    /**
     * Remove a word or phrase from the profanity filter
     * @param word The word or phrase to remove
     * @returns Whether or not it was removed (false means it wasn't in the filter)
     */
    removeWord(word: string): boolean;
}
export = ProfanityMatcher;
