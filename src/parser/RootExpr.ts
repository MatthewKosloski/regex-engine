import Expr, { ExprType } from './Expr';

class RootExpr extends Expr {
    constructor() {
        super({ type: ExprType.Root });
    }

    public toString(): string {
        let str = '';

        this.children.forEach((child) => {
            str += child.toString();
        });

        return str;
    }
}

export default RootExpr;