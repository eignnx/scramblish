import { En } from './en';
import { GrammarMutation } from './mutation';
import { Random } from './Random';
import { Syntax } from './syntax-tree';
import { FillInEnglishBlank, FillInScrambledBlank, Question, TranslateEnglishToScrambled, TranslateScrambledToEnglish } from './question';

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

    generateQuestion(): Question {
        type QuestionConstructor = new (english: Syntax, scrambled: Syntax) => Question;
        const questionChoices: [number, QuestionConstructor][] = [
            [5, FillInEnglishBlank],
            [4, FillInScrambledBlank],
            [2, TranslateScrambledToEnglish],
            [1, TranslateEnglishToScrambled],
        ];
        const [_, qClass] = Random.weightedChoice(questionChoices);
        const { english, scrambled } = this.generateTranslation();
        return new qClass(english, scrambled);
    }

    generateQuestions(): Question[] {
        return Array.from({ length: this.exCount }, () => this.generateQuestion());
    }
}
