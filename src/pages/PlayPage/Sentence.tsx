// SentenceComponent.tsx
import React from 'react';
import cx from 'classnames';
import { Lang } from '../../App';
import { SelectedWordState } from '../PlayPage';

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
    clickWord: (lang: Lang, word: string) => void;
};

const Sentence: React.FC<SentenceProps> = ({
    lang, words, selectedWords, clickWord
}) => {
    const [blankContent, setBlankContent] = React.useState('');
    return (
        <p className="sentence">{words.map((item, i) => {
            if (item.type === 'blank') {
                return <input
                    key={i}
                    className={cx({ [lang]: true })}
                    type="text"
                    size={blankContent.length || 10}
                    placeholder={lang === 'english' ? 'English word...' : 'Scrambled word...'}
                    onChange={(e) => setBlankContent(e.target.value)}
                />;
            } else {
                const { word } = item;
                return <><span
                    key={i}
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
                    onClick={() => clickWord(lang, word)}
                >{word}</span> </>;
            }
        })}</p>
    );
};

type ColorSeed = number;

function chooseColor(lang: Lang, seed: ColorSeed): string {
    const SPREAD = 45;
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