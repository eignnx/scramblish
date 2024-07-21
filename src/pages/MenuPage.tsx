import { Link } from 'react-router-dom';
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
                <ul className="option-fields">
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
                                        <div>
                                            <label htmlFor={`checkbox-${ortho.name}`}>{ortho.name}</label>
                                            <span className="ortho-sample">{ortho.sample}</span>
                                        </div>
                                        <p className="script-note">{ortho.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </li>
                </ul>
            </section>
            <div id="new-game-link-wrapper">
                <Link to="/play" id="new-game-link">Start Game</Link>
            </div>
        </main>
    );
}