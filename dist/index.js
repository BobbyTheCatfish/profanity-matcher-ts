"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
class ProfanityMatcher {
    constructor(filepath = __dirname + "/naughty.txt") {
        const words = fs_1.default.readFileSync(filepath, "utf-8").split("\n").map(word => word.toLowerCase());
        this.badwords = new Set(words);
        this.filepath = filepath;
    }
    scan(text, highlight = "**") {
        // remove meaningless chars and pad with spaces to make detection better
        const words = text.toLowerCase()
            .replace(/[-_=\+\/\\\.<>\?\*;\(\)\{\}:]/g, ' ')
            .split(/[ \n]/);
        const profane = [];
        for (let i = 0; i < words.length; i++) {
            if (this.badwords.has(words[i])) {
                words[i] = `${highlight}${words[i]}${highlight}`;
                profane.push(words[i]);
            }
        }
        return { profane, highlighted: words };
    }
    addWord(word) {
        const status = !this.badwords.has(word);
        this.badwords.add(word);
        this.saveWords();
        return status;
    }
    removeWord(word) {
        const status = this.badwords.has(word);
        this.badwords.delete(word);
        this.saveWords();
        return status;
    }
    saveWords() {
        try {
            fs_1.default.writeFileSync(this.filepath, [...this.badwords.values()].join("\n"));
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
module.exports = ProfanityMatcher;
