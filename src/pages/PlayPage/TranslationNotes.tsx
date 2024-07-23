import React from 'react';
import { HighlightInteraction, SelectedWordsContext, SelectedWordState, WordHighlight } from '../PlayPage';
import './TranslationNotes.css';
import Word from './Word';

type Props = {
    setSelectedWords: React.Dispatch<React.SetStateAction<SelectedWordState>>;
    wordHighlight: WordHighlight;
};

export default function TranslationNotes({ setSelectedWords, wordHighlight }: Props) {
    const selectedWords = React.useContext(SelectedWordsContext);

    const wordPairs = findWordPairs();

    return (
        <aside>
            <header id="translation-notes-header">
                <h3>Translation Notes</h3>
            </header>
            <div id="translation-notes-scroll-container">
                <table>
                    <thead>
                        <tr>
                            <th>English</th>
                            <th>Scramblish</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {wordPairs.length > 0 ? wordPairs.map(([english, scramblish], i) => (
                            <tr key={i}>
                                <td>{english !== '—' ? <Word word={english} lang='english' wordHighlight={wordHighlight} /> : '—'}</td>
                                <td>{scramblish !== '—' ? <Word word={scramblish} lang='scramblish' wordHighlight={wordHighlight} /> : '—'}</td>
                                <td>
                                    <button
                                        title="Delete this translation pair"
                                        onClick={() => deleteTranslationPair(english, scramblish)}
                                    >🗙</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td className="empty-translation-notes" colSpan={3}>No translation notes yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </aside >
    );

    function findWordPairs(): [string, string][] {
        const enWordPairs: [string, string][] = Object.entries(selectedWords.marked.english)
            .flatMap(([english, highlightInteraction]) => {
                if (typeof highlightInteraction === 'object') {
                    const { linkedTo: scramblish } = highlightInteraction;
                    return [[english, scramblish ?? '—']] as [string, string][];
                }
                return [];
            });

        const scWordPairs: [string, string][] = Object.entries(selectedWords.marked.scramblish)
            .flatMap(([scramblish, highlightInteraction]) => {
                if (typeof highlightInteraction === 'object') {
                    const { linkedTo: english } = highlightInteraction;
                    if (english === null) return [['—', scramblish]] as [string, string][];
                }
                return [];
            });

        return [...enWordPairs, ...scWordPairs];
    }

    function deleteTranslationPair(english: string, scramblish: string) {
        setSelectedWords((prev) => {
            const newSelected = { hovered: prev.hovered, marked: { english: { ...prev.marked.english }, scramblish: { ...prev.marked.scramblish } } };
            delete newSelected.marked.english[english];
            delete newSelected.marked.scramblish[scramblish];
            return newSelected;
        });
    }
}