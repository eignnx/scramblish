import { En } from './en.ts';
import { GrammarMutation } from './mutation.ts';
import { Syntax, SyntaxNode } from './syntax-tree.ts';

class Puzzle {
    exCount: number = 3;
    questionCount: number = 3;
    minLength: number = 4;
    maxLength: number = 12;
    M: GrammarMutation;
    english: Syntax[];
    scrambled: Syntax[];
    questions: Syntax[];
    answers: Syntax[];

    constructor() {
        this.reset();
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
        this.english = Array.from({ length: this.exCount }, () => this.generateSentence());
        this.scrambled = this.english.map(s => this.M.applyToSyntax(s));
        this.questions = Array.from({ length: this.questionCount }, () => this.generateSentence());
        this.answers = this.questions.map(s => this.M.applyToSyntax(s));
    }

    generateQuestions() {
        for (let i = 0; i < this.questionCount; i++) {
            this.questions[i] = this.generateSentence();
            this.answers[i] = this.M.applyToSyntax(this.questions[i]);
        }
    }

    show(): void {
        for (const i in this.english) {
            console.log(`Example ${+i + 1}:`);
            console.log("  ", this.english[i].render());
            console.log("  ", this.scrambled[i].render());
        }
        console.log();
        console.log("Now translate the following sentences:");
        for (const i in this.questions) {
            console.log(`Question ${+i + 1}:`);
            if (Math.random() < 0.5) {
                console.log("  ", this.questions[i].render(), "= <scrambled>");
            } else {
                console.log("  <english> =", this.answers[i].render());
            }
        }
    }
}

let P = new Puzzle();