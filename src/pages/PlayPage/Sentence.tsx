import React from 'react';
import cx from 'classnames';
import { Lang } from '../../App';
import { WordCountContext, HighlightColor, SelectedWordState, WordCounts, WordHighlight, SelectedWordsContext } from '../PlayPage';

export type WordOrBlank = {
    type: 'word';
    word: string;
} | {
    type: 'blank';
    onSubmit: (word: string) => void;
};

type SentenceProps = {
    lang: Lang;
    words: WordOrBlank[];
    wordHighlight: WordHighlight;
};

const Sentence: React.FC<SentenceProps> = ({
    lang, words, wordHighlight: {
        setHighlight, clearHighlight, clickWord
    }
}) => {
    const [blankContent, setBlankContent] = React.useState('');
    const wordCounts = React.useContext(WordCountContext);
    const selectedWords = React.useContext(SelectedWordsContext);

    const key = words.map((item) => item.type === 'word' ? item.word : '___').join('-');
    return (
        <p className="sentence" key={`Sentence-p--${key}`}>{words.map((item, i) => {
            if (item.type === 'blank') {
                return <input
                    key={`input-blank-${i}`}
                    className={cx({ [lang]: true, blank: true })}
                    type="text"
                    size={blankContent.length || (lang === 'english' ? 10 : 18)}
                    placeholder={lang === 'english' ? 'English word...' : 'Scrambled word...'}
                    onChange={(e) => setBlankContent(e.target.value)}
                />;
            } else {
                const { word } = item;
                const wordIsSelected =
                    !!selectedWords.selected[lang][word]
                    || selectedWords.hovered?.[0] === lang
                    && selectedWords.hovered?.[1] === word;

                return <span key={`word-wrapper-${word}-${i}`}>
                    <span
                        key={`word-${word}-${i}`}
                        className={cx({
                            word: true,
                            [lang]: true,
                            'word-selected': wordIsSelected,
                        })}
                        style={
                            wordIsSelected
                                ? { color: chooseColor(lang, word) }
                                : {}
                        }
                        onMouseEnter={() => setHighlight(lang, word)}
                        onMouseLeave={() => clearHighlight(lang, word)}
                        onClick={() => clickWord(lang, word)}
                    >{word}</span>
                    <span
                        key={`wordcount-${word}-${i}`}
                        className="word-count"
                        title={`occurrances of '${word}': ${wordCounts[lang][word]}`}
                    >
                        {wordCounts[lang][word] ?? 'undefined'}
                    </span>
                    {" "}
                </span>;
            }
        })}</p >
    );
};

// good enough.
function hashWord(lang: Lang, word: string): number {
    const MODULUS = 10000;
    const OFFSET = (1 << 16) - 1;
    const FACTOR = (1 << 12) - 1;
    const langOffset = lang === 'english' ? 2 / 4 * MODULUS : 3 / 4 * MODULUS;
    return word.split('').reduce((acc, char) => {
        return (FACTOR * (acc + char.charCodeAt(0)) + OFFSET) % MODULUS;
    }, langOffset) / MODULUS;
}

function chooseColor(lang: Lang, word: string): string {
    const seed = hashWord(lang, word);
    const SPREAD = 55;
    const EN_OFFSET = 0;
    const S = 80;
    const L = 60;
    const SCRAMBLED_OFFSET = 60;
    switch (lang) {
        case 'english':
            return `hsl(${seed * SPREAD + EN_OFFSET}, ${S}%, ${L}%)`;
        case 'scrambled':
            return `hsl(${seed * SPREAD + SCRAMBLED_OFFSET}, ${S}%, ${L}%)`;
    }
}


export default Sentence;