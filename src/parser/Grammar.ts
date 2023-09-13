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
            return new Expr(ExprType.Character, this.match(TokenType.Char));
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
            const expr = new Expr(ExprType.Parenthesized, tok);
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
            return new Expr(ExprType.KleeneStar, this.match(TokenType.Star), operand);
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

        return new Expr(ExprType.Alternation, tok, left, right);
    } else {
            return this.parseConcatExpr();
        }
    }

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

}

export default Grammar;