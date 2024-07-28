import { Random } from './Random';
import { SyntaxNode, SyntaxLeaf, Syntax } from './syntax-tree';

export class Grammar {
    constructor(
        public rules: Map<string, [Weight, Sequence][]> = new Map()
    ) { }

    addRule(name: string, rule: Form[], weight: number = 1): Grammar {
        if (!this.rules.has(name)) {
            this.rules.set(name, []);
        }
        this.rules.get(name)!.push([weight, new Sequence(rule)]);
        return this;
    }

    addRuleChoice(name: string, weightedRules: [number, Form[]][]): Grammar {
        for (const [weight, rule] of weightedRules) {
            this.addRule(name, rule, weight);
        }
        return this;
    }

    renderTree(start: string): Syntax {
        const startNT = new NT(start);
        return this.doRenderTree(startNT);
    }

    doRenderTree(start: NT): Syntax {
        const rule = this.rules.get(start.name);
        if (!rule) throw new Error(`No rule for ${start.name}`);
        const [ruleIndex, sequence] = Random.weightedChoice(rule);
        return sequence.renderTree(this, start.name, ruleIndex);
    }

    display() {
        for (const [name, rules] of this.rules) {
            console.log(name);
            for (const [weight, rule] of rules) {
                console.log(`  ${weight}: ${rule.forms.map(form => {
                    if (form instanceof NT) {
                        return form.name;
                    } else if (form instanceof Terminal) {
                        return "<terminal>";
                    } else {
                        throw new Error(`Unknown form: ${form}`);
                    }
                }).join(" ")}`);
            }
        }
    }
}

export class Sequence {
    constructor(
        public forms: Form[]
    ) { }

    renderTree(grammar: Grammar, ruleName: string, ruleIndex: number): Syntax {
        return new SyntaxNode(ruleName, ruleIndex, this.forms.map(form => {
            if (form instanceof NT) {
                return grammar.doRenderTree(form);
            } else if (form instanceof Terminal) {
                return new SyntaxLeaf(form.render());
            } else {
                throw new Error(`Unknown form: ${form}`);
            }
        }));
    }
}

export type Weight = number;

export interface Form { }

/**
 * Non-terminal
 */
export class NT implements Form {
    constructor(
        public name: string
    ) { }
}

/**
 * Terminal
 */
export class Terminal implements Form {
    render(): string { throw new Error("Not implemented"); };
}

/**
 * Terminal Class
 */
export class Ts extends Terminal {
    constructor(
        public possibilities: string[]
    ) { super(); }

    render(): string {
        return Random.choice(this.possibilities);
    }
}

/**
 * Terminal
 */
export class T extends Terminal {
    constructor(
        public text: string
    ) { super(); }

    render(): string {
        return this.text;
    }
}
