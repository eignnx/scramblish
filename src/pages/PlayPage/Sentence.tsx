import React from 'react';
import cx from 'classnames';
import { Lang } from '../../App';
import { WordCountContext, WordHighlight, SelectedWordsContext, OrthographyContext } from '../PlayPage';
import Word from './Word';

export type WordOrBlank = {
    type: 'word';
    word: string;
} | {
    type: 'blank';
    onSubmit: (word: string) => void;
    correct: boolean | undefined;
};

type SentenceProps = {
    lang: Lang;
    words: WordOrBlank[];
    wordHighlight: WordHighlight;
};

const Sentence: React.FC<SentenceProps> = ({ lang, words, wordHighlight }) => {
    const [blankContent, setBlankContent] = React.useState('');
    const ortho = React.useContext(OrthographyContext);

    const isRtl = lang === 'scramblish' && ortho.orthoDir === 'rtl';
    const RLE_MARK = "\u202B"; // PDE: Right-to-Left Embedding
    const PDF_MARK = "\u202C"; // PDF: Pop Directional Formatting

    return (
        <p
            className={cx({
                sentence: true,
                [ortho.orthoDir]: lang === 'scramblish',
            })}
        >
            {isRtl && RLE_MARK}
            {words.map((item, i) => {
                if (item.type === 'blank') {
                    return <input
                        key={`input-blank-${i}`}
                        className={cx({
                            [lang]: true,
                            blank: true,
                        })}
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
                        showLinkedWord
                    />;
                }
            })}
            {isRtl && PDF_MARK}
        </p>
    );
};


export default Sentence;