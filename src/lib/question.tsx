import { Lang } from '../App';
import { SelectedWordState, WordCounts, WordHighlight } from '../pages/PlayPage';
import Sentence, { WordOrBlank } from '../pages/PlayPage/Sentence';
import { Random } from './Random';
import { Syntax } from './syntax-tree';

type QuestionRenderProps = {
    wordHighlight: WordHighlight;
};

export interface Question {
    getAnswer(): string;
    render(props: QuestionRenderProps, key: number): JSX.Element;
    countWords(wordCounts: WordCounts): void;
}

abstract class FillInBlank implements Question {
    wordBlankIndex: number = 0;
    answer: string = '!!!!';
    abstract blankLang: Lang;

    constructor(public english: Syntax, public scramblish: Syntax) {
        this.init();
    }

    init() {
        const blanksSentence = this.blanksLangSentence().render().split(" ");
        this.wordBlankIndex = Random.select(blanksSentence);
        this.answer = blanksSentence[this.wordBlankIndex];
    }

    blanksLangSentence(): Syntax {
        return this.blankLang === 'english' ? this.english : this.scramblish;
    }

    wordsOrBlanks(lang: Lang, sentence: Syntax): WordOrBlank[] {
        return sentence.render().split(" ").map((word, i) =>
            i === this.wordBlankIndex && lang === this.blankLang
                ? { type: 'blank', onSubmit: (word) => { } }
                : { type: 'word', word }
        );
    }

    getAnswer(): string {
        return this.answer;
    }

    countWords(wordCounts: WordCounts): void {
        this.english.countWords('english', wordCounts);
        this.scramblish.countWords('scramblish', wordCounts);

        // Don't count the blank word, that would give away answer.
        if (wordCounts[this.blankLang][this.answer] !== undefined) {
            wordCounts[this.blankLang][this.answer]--;
        }
    }

    render({ wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        return (
            <div key={`FillInBlank-div-${key}`}>
                <Sentence
                    key={`FillInBlank-scramblish-${key}`}
                    lang='scramblish'
                    words={this.wordsOrBlanks('scramblish', this.scramblish)}
                    wordHighlight={wordHighlight}
                />
                <Sentence
                    key={`FillInBlank-english-${key}`}
                    lang='english'
                    words={this.wordsOrBlanks('english', this.english)}
                    wordHighlight={wordHighlight}
                />
            </div>
        );
    }
}

export class FillInEnglishBlank extends FillInBlank {
    blankLang: Lang = 'english';

}

export class FillInScramblishBlank extends FillInBlank {
    blankLang: Lang = 'scramblish';
}

abstract class TranslationQuestion implements Question {
    /**
     * The language of the answer sentence.
     */
    abstract answerLang: Lang;

    constructor(public english: Syntax, public scramblish: Syntax) { }

    answerLangSentence(): Syntax {
        return this.answerLang === 'english' ? this.english : this.scramblish;
    }

    getAnswer(): string {
        return this.answerLangSentence().render();
    }

    countWords(wordCounts: WordCounts): void {
        switch (this.answerLang) {
            case 'scramblish':
                this.english.countWords('english', wordCounts);
                break;
            case 'english':
                this.scramblish.countWords('scramblish', wordCounts);
                break;
        }
    }

    renderScramblish({ wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        if (this.answerLang === 'english') {
            return <Sentence
                key={`TranslationQuestion-Sentence-scramblish-${key}`}
                lang='scramblish'
                words={this.scramblish.render().split(" ").map((word) => ({ type: 'word', word }))}
                wordHighlight={wordHighlight}
            />;
        } else {
            return <input
                key={`TranslationQuestion-input-scramblish-${key}`}
                type="text"
                className="scramblish"
                style={{ width: "100%" }}
                placeholder="Scramblish sentence..."
            />;
        }
    }

    renderEnglish({ wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        if (this.answerLang === 'scramblish') {
            return <Sentence
                key={`TranslationQuestion-Sentence-english-${key}`}
                lang='english'
                words={this.english.render().split(" ").map((word) => ({ type: 'word', word }))}
                wordHighlight={wordHighlight}
            />;
        } else {
            return <input
                key={`TranslationQuestion-input-english-${key}`}
                type="text"
                className="english"
                style={{ width: "100%" }}
                placeholder="English sentence..."
            />;
        }
    }

    render(props: QuestionRenderProps, key: number): JSX.Element {
        return (
            <div>
                {this.renderScramblish(props, key)}
                {this.renderEnglish(props, key)}
            </div>
        );
    }
}

export class TranslateEnglishToScramblish extends TranslationQuestion {
    answerLang: Lang = 'scramblish';
}

export class TranslateScramblishToEnglish extends TranslationQuestion {
    answerLang: Lang = 'english';
}