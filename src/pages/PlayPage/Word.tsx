import React from 'react';
import { Lang } from '../../App';
import { HighlightInteraction, SelectedWordsContext, WordCountContext, WordCounts, WordHighlight } from '../PlayPage';
import cx from 'classnames';

type WordProps = {
    lang: Lang;
    word: string;
    wordHighlight: WordHighlight;
    showLinkedWord?: boolean;
};

export default function Word({
    lang, word, wordHighlight: {
        setHighlight, clearHighlight, clickWord, linkWord
    }, showLinkedWord
}: WordProps) {
    const selectedWords = React.useContext(SelectedWordsContext);
    const wordCounts = React.useContext(WordCountContext);

    const highlightInteraction: HighlightInteraction = selectedWords.marked[lang][word];
    const wordIsMarked = typeof highlightInteraction === 'string';
    const linkedWord = highlightInteraction instanceof Object ? highlightInteraction.linkedTo : undefined;
    const wordIsLinked = typeof linkedWord === 'string';
    const wordToBeLinked = highlightInteraction instanceof Object && highlightInteraction.linkedTo === null;
    const wordIsHovered = (
        selectedWords.hovered?.[0] === lang &&
        selectedWords.hovered?.[1] === word
    );

    const occurrances = wordCounts[lang][word];
    const titleForWord = (occurrances === 1)
        ? `1 occurrance of ${word}`
        : `${occurrances} occurrances of ${word}`;

    return <span className={cx({
        "word-wrapper": true,
        "word-wrapper-linked": wordIsLinked,
    })}>
        <span
            className={cx({
                word: true,
                [lang]: true,
                'word-hovered': wordIsHovered,
                'word-marked': wordIsMarked && !wordIsLinked,
                'word-linked': wordIsLinked,
                'word-to-be-linked': wordToBeLinked,
                'hapax-legomenon': occurrances === 1,
            })}
            style={
                wordIsMarked || wordIsHovered || wordIsLinked || wordToBeLinked
                    ? { color: chooseColor(lang, word, linkedWord) }
                    : {}
            }
            title={occurrances === 1 ? "Only 1 occurrance of this word in corpus" : undefined}
            onMouseEnter={() => setHighlight(lang, word)}
            onMouseLeave={() => clearHighlight(lang, word)}
            onClick={e => handleClick(e, lang, word)}
        ><span className="word-text">{word}</span>
            {wordIsLinked && showLinkedWord && (
                <span
                    className="linked-word-note"
                    style={{ color: chooseColor(lang, word, linkedWord) }}
                >({linkedWord})</span>
            )}
        </span>
        <span
            className="word-count"
            title={titleForWord}
        >
            {occurrances}
        </span>
        {" "}
    </span>;

    function handleClick(e: React.MouseEvent, lang: Lang, word: string) {
        if (e.ctrlKey) {
            console.log('shift-click');
            linkWord(lang, word);
        } else {
            clickWord(lang, word);
        }
    }
}

// good enough.
function hashWord(text: string): number {
    const MODULUS = 10000;
    const OFFSET = (1 << 16) - 1;
    const FACTOR = (1 << 12) - 1;
    return text.split('').reduce((acc, char) => {
        return (FACTOR * (acc + char.charCodeAt(0)) + OFFSET) % MODULUS;
    }, 0) / MODULUS;
}

function chooseColor(lang: Lang, word: string, linkedWord: string | null | undefined): string {
    const SPREAD = 55;
    const S = 85;
    const L = 50;
    const EN_OFFSET = -10;
    const SCRAMBLISH_OFFSET = 50;
    const LINKED_OFFSET = 200;

    if (linkedWord === undefined) {
        const seed = hashWord(`${lang}:${word}`);
        switch (lang) {
            case 'english':
                return `hsl(${seed * SPREAD + EN_OFFSET}, ${0.8 * S}%, ${1.2 * L}%)`;
            case 'scramblish':
                return `hsl(${seed * SPREAD + SCRAMBLISH_OFFSET}, ${0.8 * S}%, ${1.3 * L}%)`;
        }
    } else if (linkedWord === null) {
        const seed = hashWord(`${lang}:${word}`);
        return `hsl(${seed * SPREAD + LINKED_OFFSET}, ${0.75 * S}%, 80%)`;
    } else {
        const words = [word, linkedWord].sort().join('<=>');
        const seed = hashWord(words);
        return `hsl(${seed * 3 * SPREAD + LINKED_OFFSET}, ${S / 2}%, ${1.5 * L}%)`;
    }
}
