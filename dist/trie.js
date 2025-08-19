"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ProfanityMatcher {
    constructor(filepath = path_1.default.join(__dirname, "../naughty.txt")) {
        this.badwordsTrie = {};
        this.filepath = filepath;
        const badwords = fs_1.default.readFileSync(this.filepath, "utf-8")
            .split("\n")
            .filter(word => word !== "")
            .map(word => this.normalize(word).join(" "));
        this.badwordsSet = new Set(badwords);
        this.init();
    }
    // Normalize text: lowercase, remove punctuation, split into words
    normalize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word !== "");
    }
    // Build a Trie from the list of bad phrases
    init() {
        const root = {};
        // for each line of the filter
        for (const phrase of this.badwordsSet) {
            const words = phrase.split(" "); // split into words
            let node = root;
            // create an object that looks like
            // { this: { is: { a: { bad: { word: { _end: "this is a bad word" } } } } } }
            for (const word of words) {
                if (!node[word])
                    node[word] = {};
                node = node[word];
            }
            // Store the original word/phrase at the end
            node._end = phrase;
        }
        this.badwordsTrie = root;
    }
    /**
     * Scan input text for bad words or phrases
     * @param text The text to scan
     * @returns Array of detected profanity
     */
    scan(text) {
        const words = this.normalize(text);
        const profane = [];
        // loop through words in input
        for (let i = 0; i < words.length; i++) {
            let node = this.badwordsTrie;
            // loop through all words at and after current word (treats it as a phrase)
            for (let j = i; j < words.length; j++) {
                const triePart = node[words[j]]; // find the word 
                if (!triePart)
                    break; // didn't match the badword
                node = triePart; // move on to the next part
                // it matched the whole phrase
                if (node._end) {
                    profane.push(node._end);
                    break;
                }
            }
        }
        return profane;
    }
    /**
     * Add a word or phrase to the profanity filter
     * @param word The word or phrase to add
     * @returns Whether or not it was added (false means it was already in the filter)
     */
    addWord(word) {
        word = this.normalize(word).join(" ");
        const exists = this.badwordsSet.has(word);
        if (!exists) {
            this.badwordsSet.add(word);
            fs_1.default.writeFileSync(this.filepath, [...this.badwordsSet.values()].join("\n"));
            this.init();
        }
        return !exists;
    }
    /**
     * Remove a word or phrase from the profanity filter
     * @param word The word or phrase to remove
     * @returns Whether or not it was removed (false means it wasn't in the filter)
     */
    removeWord(word) {
        word = this.normalize(word).join(" ");
        if (this.badwordsSet.delete(word)) {
            fs_1.default.writeFileSync(this.filepath, [...this.badwordsSet.values()].join("\n"));
            this.init();
            return true;
        }
        return false;
    }
}
module.exports = ProfanityMatcher;
//# sourceMappingURL=trie.js.map