import React from 'react';
import { PuzzleGenerator, Translation } from '../lib/puzzle';
import './PlayPage.css';
import { Lang } from '../App';
import cx from 'classnames';
import { Syntax } from '../lib/syntax-tree';


type Props = {
    wordNote: (lang: Lang, word: string) => string | null;
    setWordNote: (lang: Lang, word: string, note: string) => void;
};

type ColorSeed = number;

type SelectedWordState = {
    [key in Lang]: { [word: string]: ColorSeed; };
};

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

export default function PlayPage({ wordNote, setWordNote }: Props) {
    const [puzzleGen, setPuzzleGen] = React.useState(new PuzzleGenerator());
    const [examples, setExamples] = React.useState<Translation<Syntax>[]>(puzzleGen.generateTranslations());

    const [selectedWords, setSelectedWords] = React.useState<SelectedWordState>({
        english: {},
        scrambled: {},
    });

    function splitSentence(lang: Lang, s: string): JSX.Element {
        const words = s.split(" ");
        return (
            <>{words.map((word, i) => (
                <><span
                    key={i}
                    className={cx({
                        word: true,
                        'word-selected': !!selectedWords[lang][word],
                    })}
                    style={selectedWords[lang][word] ? {
                        color: chooseColor(lang, selectedWords[lang][word]),
                    } : {}}
                    onClick={() => clickWord(word)}
                >{word}</span>{' '}</>
            ))}</>
        );

        function clickWord(word: string) {
            if (!!selectedWords[lang][word]) {
                // Unset the selected word.
                setSelectedWords({
                    ...selectedWords, [lang]: {
                        ...selectedWords[lang],
                        [word]: undefined,
                    }
                });
            } else {
                setSelectedWords({
                    ...selectedWords, [lang]: {
                        ...selectedWords[lang],
                        [word]: Math.random(),
                    }
                });
            }
        }
    }

    function addAnotherExample() {
        const newTranslation = puzzleGen.generateTranslation();
        setExamples([...examples, newTranslation]);
    }

    return (
        <main>
            <h1>Play</h1>
            {examples.map(({ english, scrambled }, i) => (
                <div className='example-wrapper' key={i}>
                    <h2>Example {i + 1}</h2>
                    <div>
                        <p className='example scrambled'>{
                            splitSentence('scrambled', scrambled.render())
                        }</p>
                        <p className='example english'>{
                            splitSentence('english', english.render())
                        }</p>
                    </div>
                </div>
            ))}
            <nav id="play-page-controls">
                <button onClick={addAnotherExample}>Add Another Example</button>
                <button onClick={() => {
                    setPuzzleGen(new PuzzleGenerator());
                    setExamples(puzzleGen.generateTranslations());
                    setSelectedWords({
                        english: {},
                        scrambled: {},
                    });
                }}>New Puzzle</button>
            </nav>
        </main>
    );
}