import fs from "fs"

class ProfanityMatcher {

  badwords: Set<string>
  filepath: string
  constructor(filepath: string = __dirname + "/naughty.txt") {
    const words = fs.readFileSync(filepath, "utf-8").split("\n").map(word => word.toLowerCase())
    this.badwords = new Set(words);
    this.filepath = filepath
  }

  scan(text: string, highlight = "**") {
    // remove meaningless chars and pad with spaces to make detection better
    const words = text.toLowerCase()
      .replace(/[-_=\+\/\\\.<>\?\*;\(\)\{\}:]/g, ' ')
      .split(/[ \n]/)

    const profane: string[] = []

    for (let i = 0; i < words.length; i++) {
      if (this.badwords.has(words[i])) {
        words[i] = `${highlight}${words[i]}${highlight}`
        profane.push(words[i])
      }
    }

    return { profane, highlighted: words }
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