const Expr = require('./Expr');
const Token = require('./Token');
const Lexer = require('./Lexer');

/**
 * An LL(k) recursive-descent parser for regular expressions.
 */
class Parser {

    tokens = null;
    cursor = 0;
    expr = null;

    OPERATOR_TOKEN_TYPES = ['LPAREN', 'RPAREN', 'PIPE', 'STAR'];

    /**
     * Initializes a parser to parse the given regular expression string.
     * 
     * @param {string} regex The regular expression that is to be parsed. 
     */
    constructor(regex) {
        this.expr = new Expr('root');
        const lexer = new Lexer(regex);
        this.tokens = lexer.lex();
    }

    /**
     * Parses the regular expression, returning a reference
     * to the root AST node of the resulting parse tree.
     * 
     * @return The root AST node of the parsed regular expression.
     */
    parse() {
        // regex -> expr* ;
        while (this.hasTokens()) {
            this.expr.addChild(this.parseExpr());
        }
        return this.expr;
    }

    /**
     * Parses an expression.
     * 
     * Grammar rule: expr -> symbol_expr
     *                | parenthesized_expr
     *                | kleene_expr
     *                | concat_expr
     *                | alternation_expr ;
     * 
     * @return The parsed expression as an AST node. 
     */
    parseExpr() {
        return this.parseAlternationExpr();
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule: symbol_expr -> ( "" | [a-z] | [A-Z] | [0-9] )* ;
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    parseCharacterExpr() {
        if (this.peek()?.type === 'CHAR') {
            return new Expr('char', null, this.match('CHAR'));
        }

        throw new Error('Failed to parse.');
    }
    
    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule: parenthesized_expr -> "(" expr+ ")" ;
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    parseParenthesizedExpr() {
        if (this.peek()?.type === 'LPAREN') {
            const expr = new Expr('()');

            // "("
            this.match('LPAREN');
    
            // expr+
            do {
                expr.addChild(this.parseExpr());
            } while (this.peek()?.type !== 'RPAREN')
    
            // ")"
            this.match('RPAREN');
    
            return expr;
        } else {
            return this.parseCharacterExpr();
        }
    }

    /**
     * Parses a Kleene Star expression.
     * 
     * Grammar rule: kleene_expr -> expr "*" ;
     * 
     * @return The parsed Kleene Star expression as an AST node. 
     */
    parseKleeneStarExpr() {
        if (this.peekNext()?.type === 'STAR') {
            const operand = this.parseParenthesizedExpr();
            
            this.match('STAR');

            return new Expr('*', null, operand);
        } else {
            return this.parseParenthesizedExpr();
        }
    }

    /**
     * Parses an alternation expression.
     * 
     * @return The parsed alternation expression as an AST node. 
     */
    parseAlternationExpr() {
        if (this.peekNext()?.type === 'PIPE') {

            const left = this.parseConcatExpr();

            this.match('PIPE');

            const right = this.parseConcatExpr();

            return new Expr('|', null, left, right);
        } else {
            return this.parseConcatExpr();
        }
    }
    
    parseConcatExpr() {
        const expr = new Expr('.');

        // kleene_expr+
        do {
            expr.addChild(this.parseKleeneStarExpr());
        } while (!(this.isTokenOperator() || this.peek()?.type === 'EOF'))

        if (expr.children.length === 1) {
            expr.addChild(new Expr('', null, new Token('', '', '')));
        }

        return expr;
    }

    /**
     * Indicates whether there are still tokens that need to be parsed.
     * 
     * @return True if not all tokens have been parsed; false otherwise. 
     */
    hasTokens() {
        return this.tokens[this.cursor].type !== 'EOF';
    }

    /**
     * Returns the first token of lookahead without consuming it.
     * 
     * @return {Token?} The next token of lookahead or `null` if there is
     * no such token.
     */
    peek() {
        return this.tokens[this.cursor] ?? null;
    }

    /**
     * Indicates whether the token type of the first token of lookahead
     * is one of the following types.
     * 
     * @param  {string[]} tokTypes One or more token types.
     * @return {boolean} True if at least one of the provided token types
     * matches the token type of the first token of lookahead; false otherwise.
     */
    isTokenType(...tokTypes) {
        return tokTypes.includes(this.peek()?.type);
    }

    /**
     * Indicates whether the token type of the second token of lookahead
     * is one of the following types.
     * 
     * @param  {string[]} tokTypes One or more token types.
     * @return {boolean} True if at least one of the provided token types
     * matches the token type of the second token of lookahead; false otherwise.
     */
    isNextTokenType(...tokTypes) {
        return tokTypes.includes(this.peekNext()?.type);
    }

    /**
     * Indicates whether the first token of lookahead is a regular expression operator.
     * 
     * @returns {boolean} True if the first token of lookahead is an operator; false otherwise. 
     */
    isTokenOperator() {
        return this.isTokenType(...this.OPERATOR_TOKEN_TYPES);
    }

    /**
     * Indicates whether the second token of lookahead is a regular expression operator.
     * 
     * @returns {boolean} True if the second token of lookahead is an operator; false otherwise. 
     */
    isNextTokenOperator() {
        return this.isNextTokenType(...this.OPERATOR_TOKEN_TYPES);
    }

    /**
     * Returns the second token of lookahead without consuming it.
     * 
     * @return {Token?} The second token of lookahead or `null` if there is
     * no such token.
     */
    peekNext() {
        return this.tokens[this.cursor + 1] ?? null;
    }

    /**
     * Consumes the next token or `null` if there are no more tokens to consume.
     * 
     * @return {Token?} The next token or `null`.
     */
    consume() {
        return this.tokens[this.cursor++] ?? null;
    }

    /**
     * If the type of next token is equal to the provided type, then consume and
     * return the token; error otherwise.
     * 
     * @param {string} tokType The type of token that is to be matched.
     * @return {Token} The next token.
     * @throws Error If the next token is not of the provided type or if there
     * is no next token. 
     */
    match(tokType) {
        const nextToken = this.peek();

        if (nextToken?.type === tokType) {
            return this.consume();
        } else if (nextToken && nextToken.type !== tokType) {
            throw new Error(`Expected a token of type "${tokType}" but found a token of type "${nextToken.type}" instead.`);
        } else {
            throw new Error(`Expected a token of type "${tokType}" but there are no more tokens.`);
        }
    }
}

module.exports = Parser;