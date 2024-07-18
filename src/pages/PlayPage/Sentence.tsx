import React from 'react';
import cx from 'classnames';
import { Lang } from '../../App';
import { WordCountContext, HighlightColor, SelectedWordState, WordCounts, WordHighlight } from '../PlayPage';

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
    selectedWords: SelectedWordState;
    wordHighlight: WordHighlight;
};

const Sentence: React.FC<SentenceProps> = ({
    lang, words, selectedWords, wordHighlight: {
        setHighlight, clearHighlight, clickWord
    }
}) => {
    const [blankContent, setBlankContent] = React.useState('');
    const wordCounts = React.useContext(WordCountContext);

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
                return <span key={`word-wrapper-${word}-${i}`}>
                    <span
                        key={`word-${word}-${i}`}
                        className={cx({
                            word: true,
                            [lang]: true,
                            'word-selected': !!selectedWords[lang][word],
                        })}
                        style={
                            selectedWords[lang][word]
                                ? { color: chooseColor(lang, selectedWords[lang][word]) }
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


function chooseColor(lang: Lang, highlightColor: HighlightColor): string {
    const { seed } = highlightColor;
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