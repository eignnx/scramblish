import { En } from './en';
import { GrammarMutation } from './mutation';
import { Random } from './Random';
import { Syntax } from './syntax-tree';
import { FillInEnglishBlank, FillInScramblishBlank, Question, TranslateEnglishToScramblish, TranslateScramblishToEnglish } from './question';

export type Translation<T> = {
    english: T;
    scramblish: T;
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
        const scramblish = this.scrambleSentence(english);
        return { english, scramblish: scramblish };
    }

    generateTranslations(): Translation<Syntax>[] {
        return Array.from({ length: this.exCount }, () => this.generateTranslation());
    }

    generateQuestion(): Question {
        type QuestionConstructor = new (english: Syntax, scramblish: Syntax) => Question;
        const questionChoices: [number, QuestionConstructor][] = [
            [5, FillInEnglishBlank],
            [4, FillInScramblishBlank],
            [2, TranslateScramblishToEnglish],
            [1, TranslateEnglishToScramblish],
        ];
        const [_, qClass] = Random.weightedChoice(questionChoices);
        const { english, scramblish } = this.generateTranslation();
        return new qClass(english, scramblish);
    }

    generateQuestions(): Question[] {
        return Array.from({ length: this.exCount }, () => this.generateQuestion());
    }
}
