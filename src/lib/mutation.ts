import { Form, Grammar } from './grammar';
import { LatinOrthography, Orthography } from './orthography';
import { Random } from './Random';
import { Syntax, SyntaxLeaf, SyntaxNode } from './syntax-tree';

export class RuleMutation {
    ruleName: string;
    ruleIndex: number;
    permutation: number[];

    constructor(
        ruleName: string,
        ruleIndex: number,
        forms: Form[],
    ) {
        this.ruleName = ruleName;
        this.ruleIndex = ruleIndex;
        this.permutation = Random.shuffled(Array.from({ length: forms.length }, (_, i) => i));
    }

    applyToSequence(grammarMutation: GrammarMutation, children: Syntax[]): Syntax {
        return new SyntaxNode(
            this.ruleName,
            this.ruleIndex,
            this.permutation
                .map(i => children[i])
                .map(child => grammarMutation.applyToSyntax(child)),
        );
    }

    private get reversePermutation(): number[] {
        const reverse = new Array(this.permutation.length);
        for (const i in this.permutation) {
            reverse[this.permutation[i]] = +i;
        }
        return reverse;
    }

    inverse(): RuleMutation {
        return new RuleMutation(
            this.ruleName,
            this.ruleIndex,
            this.reversePermutation,
        );
    }
}

export class TokenMutation {
    original: string;
    scramblish: string;

    constructor(original: string) {
        this.original = original;
        this.scramblish = Random.shuffled(original.split("")).join("");
    }
}

export class GrammarMutation {
    tokenMutations: Map<string, string> = new Map();

    constructor(
        public rules: RuleMutation[],
        public orthography: Orthography,
    ) { }

    static fromGrammar(grammar: Grammar, ortho: Orthography): GrammarMutation {
        return new GrammarMutation(
            [...grammar.rules.entries()].flatMap(([ruleName, sequences]) => {
                return sequences.map(([_weight, sequence], ruleIndex) => {
                    return new RuleMutation(ruleName, ruleIndex, sequence.forms);
                });
            }),
            ortho,
        );
    }

    randomWord(): string {
        return this.orthography.generateWord();
    }

    applyToSyntax(syntax: Syntax): Syntax {
        if (syntax instanceof SyntaxLeaf) {
            const rendered = syntax.render();
            if (!this.tokenMutations.has(rendered)) {
                this.tokenMutations.set(rendered, this.randomWord());
            }
            return new SyntaxLeaf(this.tokenMutations.get(rendered)!);
        } else if (syntax instanceof SyntaxNode) {
            const { ruleName, ruleIndex, children } = syntax;
            const rule = this.rules.find(rule => rule.ruleName === ruleName && rule.ruleIndex === ruleIndex);
            if (!rule) throw new Error(`No rule for ${ruleName} ${ruleIndex}`);
            return rule.applyToSequence(this, children);
        } else {
            throw new Error(`Unknown syntax: ${syntax}`);
        }
    }

    applyToGrammar(oldGrammar: Grammar): Grammar {
        const newGrammar = new Grammar();
        for (const ruleMut of this.rules) {
            const { ruleName, ruleIndex } = ruleMut;
            const rules = oldGrammar.rules.get(ruleName);
            const [weight, sequence] = rules![ruleIndex];
            newGrammar.addRule(weight, ruleName, ruleMut.permutation.map(i => sequence.forms[i]));
        }
        return newGrammar;
    }

    inverse(): GrammarMutation {
        return new GrammarMutation(this.rules.map(rule => rule.inverse()), this.orthography);
    }
}