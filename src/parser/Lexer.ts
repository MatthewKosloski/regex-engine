import Token from './Token';

/**
 * Tokenizes a regular expression string.
 */
class Lexer {

    private cursor = 0;
    private tokens: Token[] = [];
    private regex = '';

    /**
     * Instantiates a new instance of a lexer to tokenize a regular expression.
     * 
     * @param regex The regular expression that is to be tokenized. 
     */
    constructor(regex: string) {
        this.regex = regex;
    }

    /**
     * Tokenize the regular expression.
     * 
     * @returns The tokenized regular expression. 
     */
    public lex(): Token[] {
        while (this.hasChars()) {
            const tok = this.nextToken();
            if (tok) {
                this.tokens.push(tok);
            }
        }

        this.tokens.push(new Token('EOF', '\0', ''));

        return this.tokens;
    }

    private nextToken(): Token | null {
        const char = this.nextChar();

        let token: Token | null = null;

        if (char === null) {
            return null;
        }

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
     * @returns The next character to be processed or `null` if there
     * are no more characters to process. 
     */
    private peek(): string | null {
        return this.regex[this.cursor] ?? null;
    }

    /**
     * Returns the character after the next without incrementing the cursor.
     * 
     * @returns The character after the next character to be processed 
     * or `null` if there is no character following the next character
     * to be processed.
     */
    private peekNext(): string | null {
        return this.regex[this.cursor + 1] ?? null;
    }

    /**
     * Indicates whether there are still characters in the regular
     * expression string that need to be tokenized.
     * 
     * @returns True if not all characters in the regular expression
     * string have been tokenized; false otherwise. 
     */
    private hasChars(): boolean {
        return this.cursor < this.regex.length;
    }

    /**
     * Returns the next character or `null` if there are no more characters.
     * 
     * @returns The next character. 
     */
    private nextChar(): string | null {
        return this.regex[this.cursor++] ?? null;
    }

    private isCharacter(str: string): boolean {
        const charCode = str.charCodeAt(0);

        // " "
        const isSpace = charCode === 32;
        
        // [0-9]
        const isInteger = charCode >= 48 && charCode <= 57;
        
        // [A-Z]
        const isBigLetter = charCode >= 65 && charCode <= 90;
        
        // [a-z]
        const isSmallLetter = charCode >= 97 && charCode <= 122;

        return isSpace || isInteger || isBigLetter || isSmallLetter;
    }

}

export default Lexer;