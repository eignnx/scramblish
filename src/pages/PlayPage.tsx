import React from 'react';
import './PlayPage.css';
import { Lang, PuzzleParams } from '../App';
import Sentence, { WordOrBlank } from './PlayPage/Sentence';
import { PuzzleGenerator, Translation } from '../lib/puzzle';
import { Question } from '../lib/question';
import { Syntax } from '../lib/syntax-tree';
import { orthographies, Orthography } from '../lib/orthography';
import { Random } from '../lib/Random';

export type WordHighlight = {
    setHighlight: (lang: Lang, word: string) => void;
    clearHighlight: (lang: Lang, word: string) => void;
    clickWord: (lang: Lang, word: string) => void;
    linkWord: (lang: Lang, word: string) => void;
};

export type HighlightInteraction = 'marked' | { linkedTo: string | null; };

export type LangWord = `${Lang}:${string}`; // e.g. 'english:aardvaark' or 'scramblish:blarg'

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
        english: {}, scramblish: {}
    }
});

export const WordCountContext = React.createContext<WordCounts>({
    english: {}, scramblish: {}
});

type Props = {
    puzzleParams: PuzzleParams;
};

export default function PlayPage({ puzzleParams }: Props) {
    const [ortho, setOrtho] = React.useState(() => Random.choice([...puzzleParams.scriptPool.values()]));
    const [puzzleGen, setPuzzleGen] = React.useState(() => new PuzzleGenerator(ortho, puzzleParams.initialExampleCount));
    const [examples, setExamples] = React.useState<Translation<Syntax>[]>(puzzleGen.generateTranslations());
    const [questions, setQuestions] = React.useState<Question[]>(puzzleGen.generateQuestions());
    const [selectedWords, setSelectedWords] = React.useState<SelectedWordState>({
        hovered: null,
        marked: {
            english: {}, scramblish: {}
        }
    });

    const wordCounts: WordCounts = {
        english: {},
        scramblish: {},
    };

    for (const { english, scramblish } of examples) {
        english.countWords('english', wordCounts);
        scramblish.countWords('scramblish', wordCounts);
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
                    scramblish: { ...selectedWords.marked.scramblish }
                }
            });
        },

        clickWord(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                hovered: selectedWords.hovered,
                marked: {
                    english: { ...selectedWords.marked.english },
                    scramblish: { ...selectedWords.marked.scramblish },
                }
            };
            const selectedLang = newSelected.marked[lang];
            const highlightInteraction = selectedLang[word];
            if (highlightInteraction === 'marked') {
                delete selectedLang[word];
            } else if (highlightInteraction === undefined) {
                selectedLang[word] = 'marked';
            }
            setSelectedWords(newSelected);
        },

        clearHighlight(lang: Lang, word: string) {
            setSelectedWords({
                hovered: null,
                marked: {
                    english: { ...selectedWords.marked.english },
                    scramblish: { ...selectedWords.marked.scramblish }
                }
            });
        },

        linkWord(lang: Lang, word: string) {
            const newSelected: SelectedWordState = {
                hovered: selectedWords.hovered,
                marked: {
                    english: { ...selectedWords.marked.english },
                    scramblish: { ...selectedWords.marked.scramblish },
                }
            };

            const selectedLang = newSelected.marked[lang];
            const otherLang = newSelected.marked[lang === 'english' ? 'scramblish' : 'english'];

            const otherLinkWord = Object.keys(otherLang).find(w => {
                const thing = otherLang[w];
                return thing instanceof Object && thing.linkedTo === null;
            });

            if (otherLinkWord) {
                otherLang[otherLinkWord] = { linkedTo: word };
                selectedLang[word] = { linkedTo: otherLinkWord };
            } else {
                // First word in link-selected
                selectedLang[word] = { linkedTo: null };
            }

            console.log(word, selectedLang[word], otherLinkWord);

            setSelectedWords(newSelected);
        },
    };

    function addAnotherExample() {
        const newTranslation = puzzleGen.generateTranslation();
        setExamples([...examples, newTranslation]);
    }

    function intoWordsOrBlanks(sentence: Syntax): WordOrBlank[] {
        return sentence.render().split(" ").map((word) => ({ type: 'word', word }));
    }

    function regeneratePuzzle() {
        setOrtho(Random.choice(orthographies));
        // setPuzzleGen(new PuzzleGenerator());
        setExamples(puzzleGen.generateTranslations());
        setSelectedWords({
            hovered: null,
            marked: {
                english: {},
                scramblish: {},
            }
        });
    }

    return (
        <main>
            <h1>Play</h1>
            <section id="play-page-controls">
                <button onClick={addAnotherExample}>Add Another Example</button>
                <button onClick={regeneratePuzzle}>Regenerate Puzzle</button>
            </section>
            <WordCountContext.Provider value={wordCounts}>
                <SelectedWordsContext.Provider value={selectedWords}>
                    <section id="section-examples">
                        {examples.map(({ english, scramblish }, i) => (
                            <div className='example-wrapper' key={`examples-div-${i}`}>
                                <h2>Example {i + 1}</h2>
                                <div>
                                    <span className='example scramblish'>
                                        <Sentence
                                            key={`Sentence-scramblish-${i}`}
                                            lang='scramblish'
                                            words={intoWordsOrBlanks(scramblish)}
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