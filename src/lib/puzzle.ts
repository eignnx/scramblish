import { En } from './en';
import { GrammarMutation } from './mutation';
import { Syntax, SyntaxNode } from './syntax-tree';

export type Translation<T> = {
    english: T;
    scrambled: T;
};

export class PuzzleGenerator {
    exCount: number = 3;
    minLength: number = 4;
    maxLength: number = 12;
    M: GrammarMutation;

    constructor() {
        this.M = GrammarMutation.fromGrammar(En);
    }

    generateSentence(): Syntax {
        let tree, len;
        do {
            tree = En.renderTree("S");
            len = tree.render().split(" ").length;
        } while (len < this.minLength || len > this.maxLength);
        return tree;
    }

    reset() {
        this.M = GrammarMutation.fromGrammar(En);
    }

    scrambleSentence(s: Syntax): Syntax {
        return this.M.applyToSyntax(s);
    }

    generateTranslation(): Translation<Syntax> {
        const english = this.generateSentence();
        const scrambled = this.scrambleSentence(english);
        return { english, scrambled };
    }

    generateTranslations(): Translation<Syntax>[] {
        return Array.from({ length: this.exCount }, () => this.generateTranslation());
    }
}