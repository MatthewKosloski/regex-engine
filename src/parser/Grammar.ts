import Expr, { ExprType } from './Expr';
import Parser from './Parser';
import { TokenType } from './Token';

class Grammar extends Parser {

    constructor(regex: string) {
        super(regex);
    }

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
     *  `expr -> alt_expr ;`
     * 
     * @returns The parsed expression as an AST node. 
     */
    private parseExpr() {
        // alt_expr
        return this.parseAlternationExpr();
    }

    /**
     * Parses an alternation expression.
     * 
     * Grammar rule:
     *   `alt_expr -> (concat_expr "|" concat_expr) | concat_expr ;`
     * 
     * @returns The parsed alternation expression as an AST node. 
     */
    private parseAlternationExpr() {
        if (this.peekNext()?.type === TokenType.Pipe) {
            // concat_expr
            const left = this.parseConcatExpr();

            // "|"
            const tok = this.match(TokenType.Pipe);

            // concat_expr
            const right = this.parseConcatExpr();

            return new Expr(ExprType.Alternation, tok, left, right);
        } else {
            // concat_expr
            return this.parseConcatExpr();
        }
    }

    /**
     * Parses a concatenation expression.
     * 
     * Grammar rule:
     *   `concat_expr -> kleene_expr+ ;`
     * 
     * @returns The parsed alternation expression as an AST node. 
     */
    private parseConcatExpr() {
        const expr = new Expr(ExprType.Concatenation);

        // kleene_expr+
        do {
            expr.addChild(this.parseKleeneStarExpr());
        } while (!(this.isTokenOperator() || this.peek()?.type === TokenType.EndOfFile))

        if (expr.children.length === 1) {
            expr.addChild(new Expr(ExprType.Erasure));
        }

        return expr;
    }

    /**
     * Parses a Kleene Star expression.
     * 
     * Grammar rule: kleene_expr -> paren_expr "*" | paren_expr ;
     * 
     * @return The parsed Kleene Star expression as an AST node. 
     */
    private parseKleeneStarExpr() {
        if (this.peekNext()?.type === TokenType.Star) {
            // paren_expr
            const operand = this.parseParenthesizedExpr();

            // "*"
            const tok = this.match(TokenType.Star);

            return new Expr(ExprType.KleeneStar, tok, operand);
        } else {
            // paren_expr
            return this.parseParenthesizedExpr();
        }
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule: paren_expr -> "(" expr+ ")" | char_expr ;
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    private parseParenthesizedExpr() {
        if (this.peek()?.type === TokenType.LeftParen) {
            // "("
            const tok = this.match(TokenType.LeftParen);

            // expr+
            const expr = new Expr(ExprType.Parenthesized, tok);
            do {
                expr.addChild(this.parseExpr());
            } while (this.peek()?.type !== TokenType.RightParen)

            // ")"
            this.match(TokenType.RightParen);

            return expr;
        } else {
            // char_expr
            return this.parseCharacterExpr();
        }
    }

    /**
     * Parses a parenthesized expression.
     * 
     * Grammar rule: char_expr -> [a-z] | [A-Z] | [0-9] ;
     * 
     * @return The parsed parenthesized expression as an AST node. 
     */
    private parseCharacterExpr() {
        if (this.peek()?.type === TokenType.Char) {
            const tok = this.match(TokenType.Char);

            return new Expr(ExprType.Character, tok);
        }

        // If we reach this point, then the regular expression
        // has a syntax error.

        throw new Error('Failed to parse.');
    }

}

export default Grammar;