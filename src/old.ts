import fs from "fs"
import path from "path"

class ProfanityMatcher {

  private badwords: Set<string>
  private filepath: string


  constructor(filepath: string = path.join(__dirname, "../naughty.txt")) {
    this.filepath = filepath

    const words = fs.readFileSync(filepath, "utf-8").split("\n").map(word => word.toLowerCase())
    this.badwords = new Set(words);
  }

  scan(text: string) {
    // remove meaningless chars and pad with spaces to make detection better
    text = ` ${text.toLowerCase().replace(/[-_=\+\/\\\.<>\?\*;\(\)\{\}:,!:\n]/g, ' ').trim()} `

    const profane: string[] = []

    for (const str of this.badwords) {
      if (text.includes(` ${str} `)) profane.push(str)
    }

    return profane
  }

  addWord(word: string) {
    const status = !this.badwords.has(word);
    this.badwords.add(word);
    this.saveWords();
    return status;
  }

  removeWord(word: string) {
    const status = this.badwords.has(word);
    this.badwords.delete(word);
    this.saveWords();
    return status;
  }

  saveWords() {
    try {
      fs.writeFileSync(this.filepath, [...this.badwords.values()].join("\n"))
      return true
    } catch (e) {
      return false
    }
  }
}

export = ProfanityMatcher