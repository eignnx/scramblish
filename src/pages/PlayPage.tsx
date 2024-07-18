import React from 'react';
import './PlayPage.css';
import { Lang } from '../App';
import Sentence, { WordOrBlank } from './PlayPage/Sentence';
import { PuzzleGenerator, Translation } from '../lib/puzzle';
import { Question } from '../lib/question';
import { Syntax } from '../lib/syntax-tree';

export type WordHighlight = {
    setHighlight: (lang: Lang, word: string) => void;
    clearHighlight: (lang: Lang, word: string) => void;
    clickWord: (lang: Lang, word: string) => void;
};

export type HighlightInteraction = 'marked' | 'hovered';

export type SelectedWordState = {
    hovered: [Lang, string] | null;
    marked: {
        [key in Lang]: { [word: string]: HighlightInteraction; };
    };
};

export type WordCounts = {
    [key in Lang]: { [word: string]: number; };
};

export const SelectedWordsContext = React.createContext<SelectedWordState>({
    hovered: null,
    marked: {
        english: {}, scrambled: {}
    }
});

export const WordCountContext = React.createContext<WordCounts>({
    english: {}, scrambled: {}
});

export default function PlayPage() {
    const [puzzleGen, setPuzzleGen] = React.useState(() => new PuzzleGenerator());
    const [examples, setExamples] = React.useState<Translation<Syntax>[]>(puzzleGen.generateTranslations());
    const [questions, setQuestions] = React.useState<Question[]>(puzzleGen.generateQuestions());
    const [selectedWords, setSelectedWords] = React.useState<SelectedWordState>({
        hovered: null,
        marked: {
            english: {}, scrambled: {}
        }
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
            setSelectedWords({
                hovered: [lang, word],
                marked: {
                    english: { ...selectedWords.marked.english },
                    scrambled: { ...selectedWords.marked.scrambled }
                }
            });
        },

        clickWord(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                hovered: selectedWords.hovered,
                marked: {
                    english: { ...selectedWords.marked.english },
                    scrambled: { ...selectedWords.marked.scrambled }
                }
            };
            const selectedLang = newSelected.marked[lang];
            if (selectedLang[word] && selectedLang[word] === 'marked') {
                delete selectedLang[word];
            } else {
                selectedLang[word] = 'marked';
            }
            setSelectedWords(newSelected);
        },

        clearHighlight(lang: Lang, word: string) {
            setSelectedWords({
                hovered: null,
                marked: {
                    english: { ...selectedWords.marked.english },
                    scrambled: { ...selectedWords.marked.scrambled }
                }
            });
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
                        hovered: null,
                        marked: {
                            english: {},
                            scrambled: {},
                        }
                    });
                }}>New Puzzle</button>
            </nav>
            <WordCountContext.Provider value={wordCounts}>
                <SelectedWordsContext.Provider value={selectedWords}>
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
                                            wordHighlight={wordHighlight}
                                        />
                                    </span>
                                    <span className='example english'>
                                        <Sentence
                                            key={`Sentence-english-${i}`}
                                            lang='english'
                                            words={intoWordsOrBlanks(english)}
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
                                {question.render({ wordHighlight }, i)}
                            </div>
                        ))}
                    </section>
                </SelectedWordsContext.Provider>
            </WordCountContext.Provider>
        </main>
    );
};