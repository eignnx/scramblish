import { Lang } from '../App';
import { SelectedWordState } from '../pages/PlayPage';
import Sentence, { WordOrBlank } from '../pages/PlayPage/Sentence';
import { Random } from './Random';
import { Syntax } from './syntax-tree';

type QuestionRenderProps = {
    selectedWords: SelectedWordState,
    clickWord: (lang: Lang, word: string) => void,
};

export interface Question {
    getAnswer(): string;
    render(props: QuestionRenderProps): JSX.Element;
}

abstract class FillInBlank implements Question {
    wordBlankIndex: number = 0;
    abstract blankLang: Lang;

    constructor(public english: Syntax, public scrambled: Syntax) {
        this.init();
    }

    init() {
        this.wordBlankIndex = Random.select(this.blanksLangSentence().render().split(" "));
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
        return this.blanksLangSentence().render().split(" ")[this.wordBlankIndex];
    }

    render({ selectedWords, clickWord }: QuestionRenderProps): JSX.Element {
        return (
            <div>
                <Sentence
                    lang='scrambled'
                    words={this.wordsOrBlanks('scrambled', this.scrambled)}
                    selectedWords={selectedWords}
                    clickWord={clickWord}
                />
                <Sentence
                    lang='english'
                    words={this.wordsOrBlanks('english', this.english)}
                    selectedWords={selectedWords}
                    clickWord={clickWord}
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
    abstract questionLang: Lang;

    constructor(public english: Syntax, public scrambled: Syntax) { }

    questionLangSentence(): Syntax {
        return this.questionLang === 'english' ? this.english : this.scrambled;
    }

    getAnswer(): string {
        return this.questionLangSentence().render();
    }

    renderScrambled(selectedWords: SelectedWordState, clickWord: (lang: Lang, word: string) => void): JSX.Element {
        if (this.questionLang === 'scrambled') {
            return <Sentence
                lang='scrambled'
                words={this.scrambled.render().split(" ").map((word) => ({ type: 'word', word }))}
                selectedWords={selectedWords}
                clickWord={clickWord}
            />;
        } else {
            return <input
                type="text"
                className="scrambled"
                style={{ width: "100%" }}
                placeholder="Scrambled sentence..."
            />;
        }
    }

    renderEnglish(selectedWords: SelectedWordState, clickWord: (lang: Lang, word: string) => void): JSX.Element {
        if (this.questionLang === 'english') {
            return <Sentence
                lang='english'
                words={this.english.render().split(" ").map((word) => ({ type: 'word', word }))}
                selectedWords={selectedWords}
                clickWord={clickWord}
            />;
        } else {
            return <input
                type="text"
                className="english"
                style={{ width: "100%" }}
                placeholder="English sentence..."
            />;
        }
    }

    render({ selectedWords, clickWord }: QuestionRenderProps): JSX.Element {
        return (
            <div>
                {this.renderScrambled(selectedWords, clickWord)}
                {this.renderEnglish(selectedWords, clickWord)}
            </div>
        );
    }
}

export class TranslateEnglishToScrambled extends TranslationQuestion {
    questionLang: Lang = 'scrambled';
}

export class TranslateScrambledToEnglish extends TranslationQuestion {
    questionLang: Lang = 'english';
}