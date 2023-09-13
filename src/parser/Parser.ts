import Expr from './Expr';
import Token from './Token';
import Lexer from './Lexer';

/**
 * An LL(k) recursive-descent parser for regular expressions.
 */
class Parser {

    private tokens: Token[] = [];
    private cursor = 0;
    private expr: Expr;

    OPERATOR_TOKEN_TYPES = ['LPAREN', 'RPAREN', 'PIPE', 'STAR'];

    /**
     * Initializes a parser to parse the given regular expression string.
     * 
     * @param {string} regex The regular expression that is to be parsed. 
     */
    constructor(regex: string) {
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
    public parse(): Expr {
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
    private parseExpr() {
        return this.parseAlternationExpr();
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule: symbol_expr -> ( "" | [a-z] | [A-Z] | [0-9] )* ;
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    private parseCharacterExpr() {
        if (this.peek()?.type === 'CHAR') {
            return new Expr('char', this.match('CHAR'));
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
    private parseParenthesizedExpr() {
        if (this.peek()?.type === 'LPAREN') {
            // "("
            const tok = this.match('LPAREN');
    
            // expr+
            const expr = new Expr('()', tok);
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
    private parseKleeneStarExpr() {
        if (this.peekNext()?.type === 'STAR') {
            const operand = this.parseParenthesizedExpr();
            
            return new Expr('*', this.match('STAR'), operand);
        } else {
            return this.parseParenthesizedExpr();
        }
    }

    /**
     * Parses an alternation expression.
     * 
     * @return The parsed alternation expression as an AST node. 
     */
    private parseAlternationExpr() {
        if (this.peekNext()?.type === 'PIPE') {

            const left = this.parseConcatExpr();

            const tok = this.match('PIPE');

            const right = this.parseConcatExpr();

            return new Expr('|', tok, left, right);
        } else {
            return this.parseConcatExpr();
        }
    }
    
    private parseConcatExpr() {
        const expr = new Expr('.');

        // kleene_expr+
        do {
            expr.addChild(this.parseKleeneStarExpr());
        } while (!(this.isTokenOperator() || this.peek()?.type === 'EOF'))

        if (expr.children.length === 1) {
            expr.addChild(new Expr('', null, new Expr('')));
        }

        return expr;
    }

    /**
     * Indicates whether there are still tokens that need to be parsed.
     * 
     * @return True if not all tokens have been parsed; false otherwise. 
     */
    private hasTokens() {
        return this.tokens[this.cursor].type !== 'EOF';
    }

    /**
     * Returns the first token of lookahead without consuming it.
     * 
     * @return The next token of lookahead or `null` if there is
     * no such token.
     */
    private peek() {
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
    private isTokenType(...tokTypes: string[]) {
        return tokTypes.includes(this.peek()?.type);
    }

    /**
     * Indicates whether the first token of lookahead is a regular expression operator.
     * 
     * @returns {boolean} True if the first token of lookahead is an operator; false otherwise. 
     */
    private isTokenOperator() {
        return this.isTokenType(...this.OPERATOR_TOKEN_TYPES);
    }

    /**
     * Returns the second token of lookahead without consuming it.
     * 
     * @return {Token?} The second token of lookahead or `null` if there is
     * no such token.
     */
    private peekNext(): Token | null {
        return this.tokens[this.cursor + 1] ?? null;
    }

    /**
     * Consumes the next token or `null` if there are no more tokens to consume.
     * 
     * @return {Token?} The next token or `null`.
     */
    private consume(): Token | null {
        return this.tokens[this.cursor++] ?? null;
    }

    /**
     * If the type of next token is equal to the provided type, then consume and
     * return the token; error otherwise.
     * 
     * @param {string} tokType The type of token that is to be matched.
     * @return {Token | null} The next token.
     * @throws Error If the next token is not of the provided type or if there
     * is no next token. 
     */
    private match(tokType: string): Token | null {
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

export default Parser;