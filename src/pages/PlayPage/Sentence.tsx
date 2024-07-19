import React from 'react';
import cx from 'classnames';
import { Lang } from '../../App';
import { WordCountContext, WordHighlight, SelectedWordsContext } from '../PlayPage';
import Word from './Word';

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

const Sentence: React.FC<SentenceProps> = ({ lang, words, wordHighlight }) => {
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
                    placeholder={lang === 'english' ? 'English word...' : 'Scramblish word...'}
                    onChange={(e) => setBlankContent(e.target.value)}
                />;
            } else {
                const { word } = item;
                return <Word
                    key={`Word-${lang}-${word}-${i}`}
                    lang={lang}
                    word={word}
                    wordHighlight={wordHighlight}
                    wordCounts={wordCounts}
                />;
            }
        })}</p >
    );
};


export default Sentence;