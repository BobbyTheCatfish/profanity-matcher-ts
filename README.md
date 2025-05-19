# Profanity Matcher TS
A fork of https://www.npmjs.com/package/profanity-matcher written in TS with custom file support

This is a very small, and simple profanity matcher that scans for 900+ words and/or strings. This is not intended to be used as a robust profanity filter, but as a warning mechanism that a string of text might need to be approved or reviewed by a human before it's published.

Extended from [sloankev](https://www.npmjs.com/~sloankev)'s [profanity-scanner](https://www.npmjs.com/package/profanity-scanner). This version returns an array of matched words, or an empty array if none were found. I also combined the existing word list with the [google banned word list](https://gist.github.com/jamiew/1112488).

### Example Usage

```js
const ProfanityMatcher = require("profanity-scanner-ts");
const pf = new ProfanityMatcher("path-to-txt-file");
pf.scan('hello there!'); // returns []
pf.scan('vomit.'); // returns ['stfu']

pf.addWord('noobie'); // returns true if added
pf.removeWord('noobie'); // returns true if removed
```
