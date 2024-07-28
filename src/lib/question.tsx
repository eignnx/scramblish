import React from 'react';
import cx from 'classnames';
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

type WordsOrBlanksGenerator = (
    lang: Lang,
    sentence: Syntax,
    onBlankSubmit: (guess: string) => void,
    correct: boolean | undefined,
) => WordOrBlank[];

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

    wordsOrBlanks(
        lang: Lang,
        sentence: Syntax,
        onBlankSubmit: (guess: string) => void,
        correct: boolean | undefined,
    ): WordOrBlank[] {
        return sentence.render().split(" ").map((word, i) =>
            i === this.wordBlankIndex && lang === this.blankLang
                ? { type: 'blank', onSubmit: onBlankSubmit, correct }
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
        const wordsOrBlanks: WordsOrBlanksGenerator = (lang, sentence, onBlankSubmit, correct) => {
            return this.wordsOrBlanks(lang, sentence, onBlankSubmit, correct);
        };

        return <FillInBlankSection
            wordsOrBlanks={wordsOrBlanks}
            wordHighlight={wordHighlight}
            scramblish={this.scramblish}
            english={this.english}
            getAnswer={() => this.getAnswer()}
        />;
    }
}

export class FillInEnglishBlank extends FillInBlank {
    blankLang: Lang = 'english';

}

export class FillInScramblishBlank extends FillInBlank {
    blankLang: Lang = 'scramblish';
}

function FillInBlankSection({ wordsOrBlanks, wordHighlight, getAnswer, scramblish, english }: {
    wordsOrBlanks: WordsOrBlanksGenerator;
    wordHighlight: WordHighlight;
    getAnswer: () => string;
    scramblish: Syntax;
    english: Syntax;
}) {
    const [isCorrect, setIsCorrect] = React.useState<boolean | undefined>(undefined);

    const onBlankSubmit = (guess: string) => {
        if (guess.trim() === getAnswer()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    return <div>
        <Sentence
            lang='scramblish'
            words={wordsOrBlanks('scramblish', scramblish, onBlankSubmit, isCorrect)}
            wordHighlight={wordHighlight}
        />
        <Sentence
            lang='english'
            words={wordsOrBlanks('english', english, onBlankSubmit, isCorrect)}
            wordHighlight={wordHighlight}
        />
    </div>;
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
            return <TranslationAnswerSection
                answerLang={this.answerLang}
                answer={this.getAnswer()}
                fullWidth
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
            return <TranslationAnswerSection
                answerLang={this.answerLang}
                answer={this.getAnswer()}
                fullWidth
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

function TranslationAnswerSection({ answerLang, answer, fullWidth }: { answerLang: Lang; answer: string; fullWidth: boolean; }) {
    const [inputText, setInputText] = React.useState('');
    const [checkAnswer, setCheckAnswer] = React.useState(false);
    const [revealAnswer, setRevealAnswer] = React.useState(false);

    const answerIsCorrect = inputText.trim() === answer;

    return (
        <div>
            <button
                onPointerDown={() => setCheckAnswer(true)}
                onPointerUp={() => setCheckAnswer(false)}
                onClick={e => { if (e.ctrlKey) setRevealAnswer(prev => !prev); }}
            >Check Answer</button>
            <input
                type="text"
                className={cx({
                    [answerLang]: true,
                    incorrect: checkAnswer && !answerIsCorrect,
                    correct: checkAnswer && answerIsCorrect,
                })}
                style={{ ...(fullWidth ? { width: "100%" } : {}) }}
                placeholder={`${answerLang} sentence...`}
                value={inputText}
                onInput={e => setInputText((e.target as HTMLInputElement).value)}
            />
            <div>
                {revealAnswer && answer}
            </div>
        </div>
    );
}