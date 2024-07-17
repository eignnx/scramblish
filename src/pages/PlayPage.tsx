import React from 'react';
import { PuzzleGenerator, Question, Translation } from '../lib/puzzle';
import './PlayPage.css';
import { Lang } from '../App';
import { Syntax } from '../lib/syntax-tree';
import Sentence, { WordOrBlank } from './PlayPage/Sentence';


type Props = {
    wordNote: (lang: Lang, word: string) => string | null;
    setWordNote: (lang: Lang, word: string, note: string) => void;
};

type ColorSeed = number;

export type SelectedWordState = {
    [key in Lang]: { [word: string]: ColorSeed; };
};

export default function PlayPage({ wordNote, setWordNote }: Props) {
    const [puzzleGen, setPuzzleGen] = React.useState(new PuzzleGenerator());
    const [examples, setExamples] = React.useState<Translation<Syntax>[]>(puzzleGen.generateTranslations());
    const [questions, setQuestions] = React.useState<Question[]>(puzzleGen.generateQuestions());

    const [selectedWords, setSelectedWords] = React.useState<SelectedWordState>({
        english: {},
        scrambled: {},
    });

    function clickWord(lang: Lang, word: string) {
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

    function addAnotherExample() {
        const newTranslation = puzzleGen.generateTranslation();
        setExamples([...examples, newTranslation]);
    }

    function intoWordsOrBlanks(sentence: Syntax): WordOrBlank[] {
        return sentence.render().split(" ").map((word) => ({ type: 'word', word }));
    }

    return (
        <main>
            <h1>Play</h1>
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
            <section id="section-examples">

                {examples.map(({ english, scrambled }, i) => (
                    <div className='example-wrapper' key={i}>
                        <h2>Example {i + 1}</h2>
                        <div>
                            <p className='example scrambled'>
                                <Sentence
                                    lang='scrambled'
                                    words={intoWordsOrBlanks(scrambled)}
                                    selectedWords={selectedWords}
                                    clickWord={clickWord}
                                />
                            </p>
                            <p className='example english'>
                                <Sentence
                                    lang='english'
                                    words={intoWordsOrBlanks(english)}
                                    selectedWords={selectedWords}
                                    clickWord={clickWord}
                                />
                            </p>
                        </div>
                    </div>
                ))}
            </section>
            <section id="section-questions">
                {questions.map((question, i) => (
                    <div className="example-wrapper">
                        <h2>Question {i + 1}</h2>
                        {question.render({ selectedWords, clickWord })}
                    </div>
                ))}
            </section>
        </main>
    );
}