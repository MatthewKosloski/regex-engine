import Expr, { ExprType } from './Expr';
import Token from './Token';

class ParenthesizedExpr extends Expr {
    constructor(children: Expr[], token: Token) {
        super({ 
            type: ExprType.Parenthesized, 
            children,
            token,
        });
    }

    public toString(): string {
        let str = '';

        str += '(';
        this.children.forEach((child) => {
            str += child.toString();
        });
        str += ')';

        return str;
    }
}

export default ParenthesizedExpr;