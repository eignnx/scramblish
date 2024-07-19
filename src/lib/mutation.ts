import { Form, Grammar } from './grammar';
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
        public rules: RuleMutation[]
    ) { }

    static fromGrammar(grammar: Grammar): GrammarMutation {
        return new GrammarMutation(
            [...grammar.rules.entries()].flatMap(([ruleName, sequences]) => {
                return sequences.map(([_weight, sequence], ruleIndex) => {
                    return new RuleMutation(ruleName, ruleIndex, sequence.forms);
                });
            })
        );
    }

    randomWord(): string {
        const initialConsonants = "bcdfghjklmnpqrstvwxyz".split("");
        const trailingConsonants = "bcgklprstyz".split("");
        const vowels = "aeiou".split("");

        const r = Math.random();
        const length = 1 + Math.floor(r * r * 6);

        let letters: string[] = [];

        const addInitC = () => letters.push(Random.choice(initialConsonants));
        const addTrailC = () => letters.push(Random.choice(trailingConsonants));
        const addV = () => letters.push(Random.choice(vowels));

        while (letters.length < length) {
            if (Math.random() < 0.05) addV();
            if (Math.random() < 1.00) addInitC();
            if (Math.random() < 0.20) addTrailC();
            if (Math.random() < 0.05) addTrailC();
            if (Math.random() < 1.00) addV();
            if (Math.random() < 0.20) addV();
            if (Math.random() < 0.10) addV();
        }
        if (Math.random() < 0.333) addInitC();

        return letters.join("");
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
        return new GrammarMutation(this.rules.map(rule => rule.inverse()));
    }
}