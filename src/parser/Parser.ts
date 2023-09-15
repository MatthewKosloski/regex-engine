import Expr, { ExprType } from './Expr';
import Token, { TokenType } from './Token';
import Lexer from './Lexer';

/**
 * An LL(k) recursive-descent parser for regular expressions.
 */
abstract class Parser {

    private tokens: Token[] = [];
    private cursor = 0;
    private _expr: Expr;

    /**
     * Initializes a parser to parse the given regular expression string.
     * 
     * @param regex The regular expression that is to be parsed. 
     */
    constructor(regex: string) {
        this._expr = new Expr({ type: ExprType.Root });
        const lexer = new Lexer(regex);
        this.tokens = lexer.lex();
    }

    /**
     * Parses the regular expression, returning a reference
     * to the root AST node of the resulting parse tree.
     * 
     * @returns The root AST node of the parsed regular expression.
     */
    abstract parse(): Expr;

    get expr(): Expr {
        return this._expr;
    }

    /**
     * Indicates whether there are still tokens that need to be parsed.
     * 
     * @return True if not all tokens have been parsed; false otherwise. 
     */
    protected hasTokens() {
        return this.tokens[this.cursor].type !== TokenType.EndOfFile;
    }

    /**
     * Returns the first token of lookahead without consuming it.
     * 
     * @return The next token of lookahead or `null` if there is
     * no such token.
     */
    protected peek() {
        return this.tokens[this.cursor] ?? null;
    }

    /**
     * Indicates whether the first token of lookahead is a regular expression operator.
     * 
     * @returns True if the first token of lookahead is an operator; false otherwise. 
     */
    protected isTokenOperator() {
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
    protected peekNext(): Token | null {
        return this.tokens[this.cursor + 1] ?? null;
    }

    /**
     * If the type of next token is equal to the provided type, then consume and
     * return the token; error otherwise.
     * 
     * @param tokType The type of token that is to be matched.
     * @returns The next token.
     * @throws Error If the next token is not of the provided type or if there is no next token. 
     */
    protected match(tokType: TokenType): Token | null {
        const nextToken = this.peek();

        if (nextToken?.type === tokType) {
            return this.consume();
        } else if (nextToken && nextToken.type !== tokType) {
            throw new Error(`Expected a token of type "${tokType}" but found a token of type "${nextToken.type}" instead.`);
        } else {
            throw new Error(`Expected a token of type "${tokType}" but there are no more tokens.`);
        }
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
     * Consumes the next token or `null` if there are no more tokens to consume.
     * 
     * @returns The next token.
     */
    private consume(): Token | null {
        return this.tokens[this.cursor++] ?? null;
    }
}

export default Parser;