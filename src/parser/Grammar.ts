import { 
    AlternationExpr,
    CharacterExpr,
    Expr,
    KleeneStarExpr,
    ParenthesizedExpr
} from './expressions';
import { TokenType } from './Token';
import Parser from './Parser';

class Grammar extends Parser {

    constructor(regex: string) {
        super(regex);
    }

    /**
     * Parses the regular expression, returning a reference to the root
     * node of the resulting abstract syntax tree.
     * 
     * @returns The root of the AST. 
     */
    public parse(): Expr {
        // regex -> expr* ;
        while (this.hasTokens()) {
            // expr*
            this.expr.addChild(this.parseExpr());
        }
        return this.expr;
    }

    /**
     * Parses an expression.
     * 
     * Grammar rule:
     *   `expr -> kleene_expr alt_expr ;`
     * 
     * @returns The parsed expression as an AST node. 
     */
    private parseExpr(): Expr {
        // kleene_expr
        const left = this.parseKleeneStarExpr();

        // alt_expr
        const right = this.parseAlternationExpr();

        return right !== null
            ? new AlternationExpr(left, right)
            : left;
    }

    /**
     * Parses an alternation expression.
     * 
     * Grammar rule:
     *   `alt_expr -> "|" kleene_expr alt_expr | ε ;`
     * 
     * @returns The parsed alternation expression as an AST node. 
     */
    private parseAlternationExpr(): Expr | null {
        if (this.peek()?.type === TokenType.Pipe) {
            // "|"
            const tok = this.match(TokenType.Pipe);

            // kleene_expr
            const left = this.parseKleeneStarExpr();

            // alt_expr
            const right = this.parseAlternationExpr();

            return right !== null
                ? new AlternationExpr(left, right, tok)
                : left;
        }

        // ε
        return null;
    }

    /**
     * Parses a Kleene Star expression.
     * 
     * Grammar rule:
     *   `kleene_expr -> paren_expr "*" | paren_expr ;`
     * 
     * @return The parsed Kleene Star expression as an AST node. 
     */
    private parseKleeneStarExpr() {
        if (this.peekNext()?.type === TokenType.Star) {
            // paren_expr
            const operand = this.parseParenthesizedExpr();

            // "*"
            const tok = this.match(TokenType.Star);

            return new KleeneStarExpr(operand, tok);
        } else {
            // paren_expr
            return this.parseParenthesizedExpr();
        }
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule:
     *   `paren_expr -> "(" expr+ ")" | char_expr ;`
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    private parseParenthesizedExpr() {
        if (this.peek()?.type === TokenType.LeftParen) {
            // "("
            const tok = this.match(TokenType.LeftParen);

            // expr+
            const children: Expr[] = [];
            do {
                children.push(this.parseExpr());
            } while (this.peek()?.type !== TokenType.RightParen);

            // ")"
            this.match(TokenType.RightParen);

            return new ParenthesizedExpr(children, tok);
        } else {
            // char_expr
            return this.parseCharacterExpr();
        }
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule:
     *   `char_expr -> [a-z] | [A-Z] | [0-9] ;`
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    private parseCharacterExpr() {
        if (this.peek()?.type === TokenType.Char) {
            const tok = this.match(TokenType.Char);
            return new CharacterExpr(tok);
        }

        // If we reach this point, then the regular expression
        // has a syntax error.

        throw new Error('Failed to parse.');
    }

}

export default Grammar;