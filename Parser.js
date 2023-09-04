const Expr = require('./Expr');

/**
 * A regular expression parser.
 */
class Parser {

    cursor = 0;
    expr = null;
    regex = '';

    /**
     * Initializes a parser to parse the given regular expression string.
     * 
     * @param {string} regex The regular expression that is to be parsed. 
     */
    constructor(regex) {
        this.expr = new Expr('root');
        this.regex = regex;
    }

    /**
     * Parses the regular expression, returning a reference
     * to the root AST node of the resulting parse tree.
     * 
     * @return The root AST node of the parsed regular expression.
     */
    parse() {
        while (this.hasSymbols()) {
            this.expr.addChild(this.parseExpr());
        }
        return this.expr;
    }

    /**
     * Parses an expression.
     * 
     * @return The parsed expression as an AST node. 
     */
    parseExpr() {
        let expr = null;

        if (this.peek() === '(') {
            expr = this.parseSubExpr();
        } else if (this.peekNext() === '|') {
            expr = this.parseAlternationExpr();
        } else {
            expr = this.parseConcatenationExpr();
        }

        return expr;
    }

    /**
     * Parses a parenthesized subexpression.
     * 
     * @return The parsed subexpression as an AST node. 
     */
    parseSubExpr() {
        this.nextSymbol();

        const expr = new Expr('subexpr');

        while (this.peek(')') !== ')') {
            expr.addChild(this.parseExpr());
        }

        return expr;
    }

    /**
     * Parses an alternation expression.
     * 
     * @return The parsed alternation expression as an AST node. 
     */
    parseAlternationExpr() {
        // Delete alternation operator from expression.
        this.deleteSymbol(this.cursor + 1);

        const left = this.parseExpr();
        const right = this.parseExpr();

        return new Expr('|', null, left, right);
    }

    parseConcatenationExpr() {
        const left = new Expr('symbol', null, this.nextSymbol());
        const right = this.hasSymbols()
            ? this.parseExpr()
            : new Expr('erasure', null, '');

        return new Expr('.', null, left, right);
    }

    /**
     * Indicates whether there are still characters in the regular
     * expression string that need to be processed.
     * 
     * @return True if not all characters in the regular expression
     * string have been processed; false otherwise. 
     */
    hasSymbols() {
        return this.cursor < this.regex.length;
    }

    /**
     * Returns the next symbol to be processed or `null` if there are
     * no more symbols to process.
     * 
     * @return The next symbol to process or `null` if no more symbols.
     */
    nextSymbol() {
        return this.regex[this.cursor++] ?? null;
    }

    /**
     * Indicates if the given string is a character. If the given
     * string has more than one character, then only the first character
     * will be tested.
     * 
     * @param {string} string A string.
     * @return True if the first character of the provided string is
     * a character.
     */
    isCharacter(str) {
        const truncated = str[0];
        return /[a-z]|[A-Z]|[0-9]/.test(truncated);
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
     * Removes the character from the regular expression string at
     * the provided index.
     * 
     * @param {int} index The index of the character that is to
     * be removed from the regular expression string. 
     * @return void
     */
    deleteSymbol(index) {
        this.regex = this.regex.slice(0, index) + this.regex.slice(index + 1);
    }
}

module.exports = Parser;