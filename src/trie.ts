import fs from "fs"
import path from "path"

type InnerTrie = { [word: string]: InnerTrie }
type TrieNode = InnerTrie & { _end?: string }
type NormalizedString = string

type ProfanityMatcherOptions = {
	filepath?: string
	/** @description Default: /[^\w\s]/g */
	removalRegex?: RegExp,
	/** @description Default: /\s+/*/
	splitRegex?: RegExp
}

function makeRegexGlobal(regex: RegExp) {
	let flags = regex.flags;
	if (!flags.includes("g")) flags += "g"
	return new RegExp(regex.source, flags)
}

class ProfanityMatcher {
	private badwordsTrie: TrieNode = {};
	private filepath: string
	private badwordsSet: Set<NormalizedString>
	private removalRegex: RegExp = /[^\w\s]/g
	private splitRegex: RegExp = /\s+/

	constructor(options?: string | ProfanityMatcherOptions) {
		const defaultFilterPath = path.join(__dirname, "../naughty.txt");

		if (typeof options === "object") {
			this.filepath = options.filepath || defaultFilterPath;

			if (options.removalRegex) this.removalRegex = makeRegexGlobal(options.removalRegex);
			if (options.splitRegex) this.splitRegex = makeRegexGlobal(options.splitRegex);
			
		} else {
			this.filepath = options || defaultFilterPath;
		}

		const badwords = fs.readFileSync(this.filepath, "utf-8")
			.split("\n")
			.filter(word => word !== "")
			.map(word => this.normalize(word).join(" "))

		this.badwordsSet = new Set(badwords);

		this.init();
	}

	// Normalize text: lowercase, remove punctuation, split into words
	private normalize(text: string): NormalizedString[] {
		return text
			.toLowerCase()
			.replace(this.removalRegex, '')
			.split(this.splitRegex)
			.filter(word => word !== "");
	}

	// Build a Trie from the list of bad phrases
	private init() {
		const root: TrieNode = {};

		// for each line of the filter
		for (const phrase of this.badwordsSet) {
			const words: NormalizedString[] = phrase.split(" "); // split into words
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

	/**
	 * Scan input text for bad words or phrases
	 * @param text The text to scan
	 * @returns Array of detected profanity
	 */
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
	
	saveFilter() {
		fs.writeFileSync(this.filepath, [...this.badwordsSet.values()].join("\n"))
		this.init();
	}

	/**
	 * Add a word or phrase to the profanity filter
	 * @param word The word or phrase to add
	 * @returns Whether or not it was added (false means it was already in the filter)
	 */
	addWord(word: string) {
		word = this.normalize(word).join(" ");
		const canAdd = !this.badwordsSet.has(word)

		if (canAdd) {
			this.badwordsSet.add(word);
			this.saveFilter();
		}
		
		return canAdd;
	}
	
	/**
	 * Remove a word or phrase from the profanity filter
	 * @param word The word or phrase to remove
	 * @returns Whether or not it was removed (false means it wasn't in the filter)
	 */
	removeWord(word: string) {
		word = this.normalize(word).join(" ");
		const wasDeleted = this.badwordsSet.delete(word);
		
		if (wasDeleted) this.saveFilter();
		
		return wasDeleted;
	}
}

export = ProfanityMatcher