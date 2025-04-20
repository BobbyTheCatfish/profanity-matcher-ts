"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ProfanityMatcher {
    constructor(filepath = path_1.default.join(__dirname, "naughty.txt")) {
        this.filepath = filepath;
        const words = fs_1.default.readFileSync(filepath, "utf-8").split("\n").map(word => word.toLowerCase());
        this.badwords = new Set(words);
    }
    scan(text) {
        // remove meaningless chars and pad with spaces to make detection better
        text = ` ${text.toLowerCase().replace(/[-_=\+\/\\\.<>\?\*;\(\)\{\}:,!:\n]/g, ' ').trim()} `;
        const profane = [];
        for (const str of this.badwords) {
            if (text.includes(` ${str} `))
                profane.push(str);
        }
        return profane;
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
