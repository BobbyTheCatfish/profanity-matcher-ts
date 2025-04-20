import fs from "fs"
import path from "path"

type InnerTrie = { [word: string]: InnerTrie }
type TrieNode = InnerTrie & { _end?: string }

class ProfanityMatcher {
	private badwordsTrie: TrieNode = {};
	private filepath: string
	private badwordsSet: Set<string>

	constructor(filepath: string = path.join(__dirname, "naughty.txt")) {
		this.filepath = filepath;

		const badwords = fs.readFileSync(this.filepath, "utf-8")
			.split("\n")
			.filter(word => word !== "")
			.map(word => word.toLowerCase())

		this.badwordsSet = new Set(badwords);

		this.init();
	}

	// Normalize text: lowercase, remove punctuation, split into words
	private normalize(text: string): string[] {
		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.split(/\s+/)
			.filter(word => word !== "");
	}

	// Build a Trie from the list of bad phrases
	private init() {
		const root: TrieNode = {};

		// for each line of the filter
		for (const phrase of this.badwordsSet) {
			const words = this.normalize(phrase); // split into words
			let node = root;

			// create an object that looks like
			// { this: { is: { a: { bad: { word: { _end: "this is a bad word" } } } } } }
			for (const word of words) {
				if (!node[word]) node[word] = {};
				node = node[word];
			}

			// Store the original word/phrase at the end
			node._end = phrase;
		}

		this.badwordsTrie = root;
	}

	// Scan input text for bad phrases
	scan(text: string): string[] {
		const words = this.normalize(text);
		const profane: string[] = [];

		// loop through words in input
		for (let i = 0; i < words.length; i++) {
			let node = this.badwordsTrie;

			// loop through all words at and after current word (treats it as a phrase)
			for (let j = i; j < words.length; j++) {
				const triePart = node[words[j]]; // find the word 
				if (!triePart) break; // didn't match the badword

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
	

	addWord(word: string) {
		word = word.toLowerCase();
		const exists = this.badwordsSet.has(word)
		if (!exists) {
			this.badwordsSet.add(word);
			fs.writeFileSync(this.filepath, [...this.badwordsSet.values()].join("\n"))
	
			this.init();
		}
		
		return exists;
	}
	
	removeWord(word: string) {
		word = word.toLowerCase();
		if (this.badwordsSet.delete(word)) {
			fs.writeFileSync(this.filepath, [...this.badwordsSet.values()].join("\n"))
		
			this.init();
			return true;
		}
		
		return false;
	}
}

export = ProfanityMatcher