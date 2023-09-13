const Token = require('./Token');

/**
 * Tokenizes a regular expression string.
 */
class Lexer {

    cursor = 0;
    tokens = [];
    regex = '';

    /**
     * Instantiates a new instance of a lexer to tokenize a regular expression.
     * 
     * @param {string} regex The regular expression that is to be tokenized. 
     */
    constructor(regex) {
        this.regex = regex;
    }

    lex() {
        while (this.hasChars()) {
            this.tokens.push(this.nextToken());
        }

        this.tokens.push(new Token('EOF', '\0', ''));

        return this.tokens;
    }

    nextToken() {
        const char = this.nextChar();

        let token = null;

        if (char === '(') {
            token = new Token('LPAREN', char, '');
        } else if (char === ')') {
            token = new Token('RPAREN', char, '');
        } else if (char === '*') {
            token = new Token('STAR', char, '');
        } else if (char === '|') {
            token = new Token('PIPE', char, '');
        } else if (this.isCharacter(char)) {
            token = new Token('CHAR', char, '');
        } else {
            throw new Error(`Unexpected character "${char}".`);
        }

        return token;
    }

    /**
     * Returns the next character without incrementing the cursor.
     * 
     * @return The next character to be processed or `null` if there
     * are no more characters to process. 
     */
    peek() {
        return this.regex[this.cursor] ?? null;
    }

    /**
     * Returns the character after the next without incrementing the cursor.
     * 
     * @return The character after the next character to be processed 
     * or `null` if there is no character following the next character
     * to be processed.
     */
    peekNext() {
        return this.regex[this.cursor + 1] ?? null;
    }

    /**
     * Indicates whether there are still characters in the regular
     * expression string that need to be tokenized.
     * 
     * @return True if not all characters in the regular expression
     * string have been tokenized; false otherwise. 
     */
    hasChars() {
        return this.cursor < this.regex.length;
    }

    /**
     * Returns the next character or `null` if there are no more characters.
     * 
     * @returns The next character. 
     */
    nextChar() {
        return this.regex[this.cursor++] ?? null;
    }

    isCharacter(str) {
        const charCode = str.charCodeAt();
        
        // [0-9]
        const isInteger = charCode >= 48 && charCode <= 57;
        
        // [A-Z]
        const isBigLetter = charCode >= 65 && charCode <= 90;
        
        // [a-z]
        const isSmallLetter = charCode >= 97 && charCode <= 122;

        const isSpace = ' ';

        return isInteger || isBigLetter || isSmallLetter || isSpace;
    }

}

module.exports = Lexer;