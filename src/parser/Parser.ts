import Expr from './Expr';
import Token, { TokenType } from './Token';
import Lexer from './Lexer';

/**
 * An LL(k) recursive-descent parser for regular expressions.
 */
class Parser {

    private tokens: Token[] = [];
    private cursor = 0;
    private expr: Expr;

    /**
     * Initializes a parser to parse the given regular expression string.
     * 
     * @param regex The regular expression that is to be parsed. 
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
     * @returns The root AST node of the parsed regular expression.
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
        if (this.peek()?.type === TokenType.Char) {
            return new Expr('char', this.match(TokenType.Char));
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
        if (this.peek()?.type === TokenType.LeftParen) {
            // "("
            const tok = this.match(TokenType.LeftParen);
    
            // expr+
            const expr = new Expr('()', tok);
            do {
                expr.addChild(this.parseExpr());
            } while (this.peek()?.type !== TokenType.RightParen)
    
            // ")"
            this.match(TokenType.RightParen);
    
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
        if (this.peekNext()?.type === TokenType.Star) {
            const operand = this.parseParenthesizedExpr();
            
            return new Expr('*', this.match(TokenType.Star), operand);
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
        if (this.peekNext()?.type === TokenType.Pipe) {

            const left = this.parseConcatExpr();

            const tok = this.match(TokenType.Pipe);

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
        } while (!(this.isTokenOperator() || this.peek()?.type === TokenType.EndOfFile))

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
        return this.tokens[this.cursor].type !== TokenType.EndOfFile;
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
     * @param tokTypes One or more token types.
     * @returns True if at least one of the provided token types
     * matches the token type of the first token of lookahead; false otherwise.
     */
    private isTokenType(...tokTypes: TokenType[]) {
        return tokTypes.includes(this.peek()?.type);
    }

    /**
     * Indicates whether the first token of lookahead is a regular expression operator.
     * 
     * @returns True if the first token of lookahead is an operator; false otherwise. 
     */
    private isTokenOperator() {
        return this.isTokenType(...[
            TokenType.LeftParen,
            TokenType.RightParen,
            TokenType.Pipe,
            TokenType.Star,
        ]);
    }

    /**
     * Returns the second token of lookahead without consuming it.
     * 
     * @returns The second token of lookahead or `null` if there is
     * no such token.
     */
    private peekNext(): Token | null {
        return this.tokens[this.cursor + 1] ?? null;
    }

    /**
     * Consumes the next token or `null` if there are no more tokens to consume.
     * 
     * @returns The next token.
     */
    private consume(): Token | null {
        return this.tokens[this.cursor++] ?? null;
    }

    /**
     * If the type of next token is equal to the provided type, then consume and
     * return the token; error otherwise.
     * 
     * @param tokType The type of token that is to be matched.
     * @returns The next token.
     * @throws Error If the next token is not of the provided type or if there is no next token. 
     */
    private match(tokType: TokenType): Token | null {
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