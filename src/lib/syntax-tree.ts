import { Terminal } from './grammar';

export interface Syntax {
    render(): string;
}

export class SyntaxNode implements Syntax {
    constructor(
        public ruleName: string,
        public ruleIndex: number,
        public children: Syntax[],
    ) { }

    render(): string {
        return this.children.map(child => child.render()).join(" ");
    }
}

export class SyntaxLeaf implements Syntax {
    constructor(
        public text: string
    ) { }

    render(): string {
        return this.text;
    }
}