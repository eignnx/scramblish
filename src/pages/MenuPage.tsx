import { PuzzleParams } from '../App';
import { orthographies } from '../lib/orthography';
import "./MenuPage.css";

type Props = {
    puzzleParams: PuzzleParams;
    setPuzzleParams: React.Dispatch<React.SetStateAction<PuzzleParams>>;
};

export default function MenuPage({ puzzleParams, setPuzzleParams }: Props) {
    return (
        <main>
            <h1>Menu</h1>
            <section className="options-section">
                <h2>Options</h2>
                <ul>
                    <li className="form-field">
                        <label htmlFor="example-count-opt">Number of examples</label>
                        <input type="number" name="example-count-opt" id="example-count-opt" />
                    </li>
                    <li className="form-field">
                        <label htmlFor="script-pool-checkboxes">Script Pool</label>
                        <div id="script-pool-checkboxes">
                            {orthographies.map((ortho, i) => (
                                <div key={i} className="checkbox-wrapper">
                                    <div className="script-checkbox">
                                        <input type="checkbox" name={ortho.name} id={`checkbox-${ortho.name}`} />
                                    </div>
                                    <div>
                                        <label htmlFor={`checkbox-${ortho.name}`}>{ortho.name}</label>
                                        <p className="script-note">{ortho.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </li>
                </ul>
            </section>
            <a href="/play" id="new-game-link">Start New Game</a>
        </main>
    );
}