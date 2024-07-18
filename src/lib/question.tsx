import { Lang } from '../App';
import { SelectedWordState, WordCounts, WordHighlight } from '../pages/PlayPage';
import Sentence, { WordOrBlank } from '../pages/PlayPage/Sentence';
import { Random } from './Random';
import { Syntax } from './syntax-tree';

type QuestionRenderProps = {
    selectedWords: SelectedWordState,
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

    constructor(public english: Syntax, public scrambled: Syntax) {
        this.init();
    }

    init() {
        const blanksSentence = this.blanksLangSentence().render().split(" ");
        this.wordBlankIndex = Random.select(blanksSentence);
        this.answer = blanksSentence[this.wordBlankIndex];
    }

    blanksLangSentence(): Syntax {
        return this.blankLang === 'english' ? this.english : this.scrambled;
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
        this.scrambled.countWords('scrambled', wordCounts);

        // Don't count the blank word, that would give away answer.
        if (wordCounts[this.blankLang][this.answer] !== undefined) {
            wordCounts[this.blankLang][this.answer]--;
        }
    }

    render({ selectedWords, wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        return (
            <div key={`FillInBlank-div-${key}`}>
                <Sentence
                    key={`FillInBlank-scrambled-${key}`}
                    lang='scrambled'
                    words={this.wordsOrBlanks('scrambled', this.scrambled)}
                    selectedWords={selectedWords}
                    wordHighlight={wordHighlight}
                />
                <Sentence
                    key={`FillInBlank-english-${key}`}
                    lang='english'
                    words={this.wordsOrBlanks('english', this.english)}
                    selectedWords={selectedWords}
                    wordHighlight={wordHighlight}
                />
            </div>
        );
    }
}

export class FillInEnglishBlank extends FillInBlank {
    blankLang: Lang = 'english';

}

export class FillInScrambledBlank extends FillInBlank {
    blankLang: Lang = 'scrambled';
}

abstract class TranslationQuestion implements Question {
    /**
     * The language of the answer sentence.
     */
    abstract answerLang: Lang;

    constructor(public english: Syntax, public scrambled: Syntax) { }

    answerLangSentence(): Syntax {
        return this.answerLang === 'english' ? this.english : this.scrambled;
    }

    getAnswer(): string {
        return this.answerLangSentence().render();
    }

    countWords(wordCounts: WordCounts): void {
        switch (this.answerLang) {
            case 'scrambled':
                this.english.countWords('english', wordCounts);
                break;
            case 'english':
                this.scrambled.countWords('scrambled', wordCounts);
                break;
        }
    }

    renderScrambled({ selectedWords, wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        if (this.answerLang === 'english') {
            return <Sentence
                key={`TranslationQuestion-Sentence-scrambled-${key}`}
                lang='scrambled'
                words={this.scrambled.render().split(" ").map((word) => ({ type: 'word', word }))}
                selectedWords={selectedWords}
                wordHighlight={wordHighlight}
            />;
        } else {
            return <input
                key={`TranslationQuestion-input-scrambled-${key}`}
                type="text"
                className="scrambled"
                style={{ width: "100%" }}
                placeholder="Scrambled sentence..."
            />;
        }
    }

    renderEnglish({ selectedWords, wordHighlight }: QuestionRenderProps, key: number): JSX.Element {
        if (this.answerLang === 'scrambled') {
            return <Sentence
                key={`TranslationQuestion-Sentence-english-${key}`}
                lang='english'
                words={this.english.render().split(" ").map((word) => ({ type: 'word', word }))}
                selectedWords={selectedWords}
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
                {this.renderScrambled(props, key)}
                {this.renderEnglish(props, key)}
            </div>
        );
    }
}

export class TranslateEnglishToScrambled extends TranslationQuestion {
    answerLang: Lang = 'scrambled';
}

export class TranslateScrambledToEnglish extends TranslationQuestion {
    answerLang: Lang = 'english';
}