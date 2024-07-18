import { Lang } from '../App';
import { WordCounts } from '../pages/PlayPage';
import { Terminal } from './grammar';

export interface Syntax {
    render(): string;
    countWords(lang: Lang, wordCounts: WordCounts): void;
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

    countWords(lang: Lang, wordCounts: WordCounts): void {
        this.render().split(" ").forEach(word => {
            if (wordCounts[lang][word] === undefined) {
                wordCounts[lang][word] = 0;
            }
            wordCounts[lang][word]++;
        });
        // for (const child of this.children) {
        //     child.countWords(lang, wordCounts);
        // }
    }
}

export class SyntaxLeaf implements Syntax {
    constructor(
        public text: string
    ) { }

    render(): string {
        return this.text;
    }

    countWords(lang: Lang, wordCounts: WordCounts): void {
        if (wordCounts[lang][this.text] === undefined) {
            wordCounts[lang][this.text] = 0;
        }
        wordCounts[lang][this.text]++;
    }
}