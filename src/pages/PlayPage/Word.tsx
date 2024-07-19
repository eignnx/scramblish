import React from 'react';
import { Lang } from '../../App';
import { SelectedWordsContext, WordCounts, WordHighlight } from '../PlayPage';
import cx from 'classnames';

type WordProps = {
    lang: Lang;
    word: string;
    wordHighlight: WordHighlight;
    wordCounts: WordCounts;
};

export default function Word({
    lang, word, wordHighlight: {
        setHighlight, clearHighlight, clickWord
    }, wordCounts,
}: WordProps) {
    const selectedWords = React.useContext(SelectedWordsContext);
    const wordIsMarked = !!selectedWords.marked[lang][word];
    const wordIsHovered = (
        selectedWords.hovered?.[0] === lang &&
        selectedWords.hovered?.[1] === word
    );

    return <span>
        <span
            className={cx({
                word: true,
                [lang]: true,
                'word-marked': wordIsMarked,
                'word-hovered': wordIsHovered
            })}
            style={
                wordIsMarked || wordIsHovered
                    ? { color: chooseColor(lang, word) }
                    : {}
            }
            onMouseEnter={() => setHighlight(lang, word)}
            onMouseLeave={() => clearHighlight(lang, word)}
            onClick={() => clickWord(lang, word)}
        >{word}</span>
        <span
            className="word-count"
            title={`occurrances of '${word}': ${wordCounts[lang][word]}`}
        >
            {wordCounts[lang][word] ?? 'undefined'}
        </span>
        {" "}
    </span>;
}

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
    const S = 85;
    const L = 50;
    const EN_OFFSET = -10;
    const SCRAMBLISH_OFFSET = 50;
    switch (lang) {
        case 'english':
            return `hsl(${seed * SPREAD + EN_OFFSET}, ${S}%, ${L}%)`;
        case 'scramblish':
            return `hsl(${seed * SPREAD + SCRAMBLISH_OFFSET}, ${S}%, ${L}%)`;
    }
}