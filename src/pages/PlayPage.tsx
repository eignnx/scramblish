import React from 'react';
import './PlayPage.css';
import { Lang } from '../App';
import Sentence, { WordOrBlank } from './PlayPage/Sentence';
import { PuzzleGenerator, Translation } from '../lib/puzzle';
import { Question } from '../lib/question';
import { Syntax } from '../lib/syntax-tree';


type Props = {
    wordNote: (lang: Lang, word: string) => string | null;
    setWordNote: (lang: Lang, word: string, note: string) => void;
};

export type HighlightInteraction = 'select' | 'hover';

export type WordHighlight = {
    setHighlight: (lang: Lang, word: string) => void;
    clearHighlight: (lang: Lang, word: string) => void;
    clickWord: (lang: Lang, word: string) => void;
};

export class HighlightColor {
    seed: number;
    constructor(public reason: HighlightInteraction) {
        this.seed = Math.random();
    }
}

export type SelectedWordState = {
    [key in Lang]: { [word: string]: HighlightColor; };
};

export type WordCounts = {
    [key in Lang]: { [word: string]: number; };
};

export const WordCountContext = React.createContext<WordCounts>({
    english: {}, scrambled: {}
});

export default function PlayPage({ wordNote, setWordNote }: Props) {
    const [puzzleGen, setPuzzleGen] = React.useState(() => new PuzzleGenerator());
    const [examples, setExamples] = React.useState<Translation<Syntax>[]>(puzzleGen.generateTranslations());
    const [questions, setQuestions] = React.useState<Question[]>(puzzleGen.generateQuestions());
    const [selectedWords, setSelectedWords] = React.useState<SelectedWordState>({
        english: {},
        scrambled: {},
    });

    const wordCounts: WordCounts = {
        english: {},
        scrambled: {},
    };

    for (const { english, scrambled } of examples) {
        english.countWords('english', wordCounts);
        scrambled.countWords('scrambled', wordCounts);
    }

    for (const question of questions) {
        question.countWords(wordCounts);
    }

    const wordHighlight: WordHighlight = {
        setHighlight(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                english: selectedWords['english'],
                scrambled: selectedWords['scrambled']
            };
            for (const w in newSelected[lang]) {
                if (newSelected[lang][w] && newSelected[lang][w].reason === 'hover') {
                    delete newSelected[lang][w];
                }
            }
            if (!newSelected[lang][word]) newSelected[lang][word] = new HighlightColor('hover');
            setSelectedWords(newSelected);
        },

        clickWord(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                english: selectedWords['english'],
                scrambled: selectedWords['scrambled']
            };
            if (newSelected[lang][word] && newSelected[lang][word].reason === 'select') {
                delete newSelected[lang][word];
            } else if (newSelected[lang][word] && newSelected[lang][word].reason === 'hover') {
                newSelected[lang][word].reason = 'select';
            } else {
                newSelected[lang][word] = new HighlightColor('select');
            }
            setSelectedWords(newSelected);
        },

        clearHighlight(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                english: selectedWords['english'],
                scrambled: selectedWords['scrambled']
            };
            for (const w in newSelected[lang]) {
                if (newSelected[lang][w] && newSelected[lang][w].reason === 'hover') {
                    delete newSelected[lang][w];
                }
            }
            setSelectedWords(newSelected);
        }
    };

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
            <WordCountContext.Provider value={wordCounts}>
                <section id="section-examples">
                    {examples.map(({ english, scrambled }, i) => (
                        <div className='example-wrapper' key={`examples-div-${i}`}>
                            <h2>Example {i + 1}</h2>
                            <div>
                                <span className='example scrambled'>
                                    <Sentence
                                        key={`Sentence-scrambled-${i}`}
                                        lang='scrambled'
                                        words={intoWordsOrBlanks(scrambled)}
                                        selectedWords={selectedWords}
                                        wordHighlight={wordHighlight}
                                    />
                                </span>
                                <span className='example english'>
                                    <Sentence
                                        key={`Sentence-english-${i}`}
                                        lang='english'
                                        words={intoWordsOrBlanks(english)}
                                        selectedWords={selectedWords}
                                        wordHighlight={wordHighlight}
                                    />
                                </span>
                            </div>
                        </div>
                    ))}
                </section>
                <section id="section-questions">
                    {questions.map((question, i) => (
                        <div className="example-wrapper" key={`questions-div-${i}`}>
                            <h2>Question {i + 1}</h2>
                            {question.render({ selectedWords, wordHighlight }, i)}
                        </div>
                    ))}
                </section>
            </WordCountContext.Provider>
        </main>
    );
};