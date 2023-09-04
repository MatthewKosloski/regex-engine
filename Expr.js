class Expr {

    type = '';
    parent = null;
    children = [];

    constructor(type, parent = null, ...children) {
        this.type = type;
        this.parent = parent;
        this.children = children;
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    get type() {
        return this.type;
    }

    get parent() {
        return this.parent;
    }

    get children() {
        return this.children
    }

    get first() {
        return this.children[0] ?? null;
    }

    get second() {
        return this.children[1] ?? null;
    }

    get third() {
        return this.children[2] ?? null;
    }

    get last() {
        return this.children[this.children.length - 1] ?? null;
    }
}

module.exports = Expr;