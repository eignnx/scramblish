import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PuzzleParams } from '../App';
import { orthographies, Orthography } from '../lib/orthography';
import "./MenuPage.css";

type Props = {
    puzzleParams: PuzzleParams;
    setPuzzleParams: React.Dispatch<React.SetStateAction<PuzzleParams>>;
};

export default function MenuPage({ puzzleParams, setPuzzleParams }: Props) {


    const navTo = useNavigate();

    return (
        <div id="App">
            <nav>
                <NavLink to="/">Scramblish</NavLink>
            </nav>
            <main>
                <h1>Menu</h1>
                <form
                    className="options-section"
                    onSubmit={e => submitForm(e)}
                    method="dialog"
                >
                    <h2>Options</h2>
                    <ul className="option-fields">
                        <li className="form-field">
                            <label htmlFor="script-pool-checkboxes">Scripts</label>
                            <div id="script-pool-checkboxes">
                                {orthographies.map((ortho, i) => (
                                    <div key={i} className="checkbox-wrapper">
                                        <div className="script-checkbox">
                                            <input
                                                type="checkbox"
                                                name={ortho.name}
                                                id={`checkbox-${ortho.name}`}
                                                checked={puzzleParams.scriptPool.has(ortho)}
                                                onChange={() => {
                                                    setPuzzleParams((prev) => {
                                                        const newPool = new Set(prev.scriptPool);
                                                        if (newPool.has(ortho)) newPool.delete(ortho);
                                                        else newPool.add(ortho);
                                                        return new PuzzleParams(prev.initialExampleCount, newPool);
                                                    });
                                                }}
                                            />
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
                        <li className="form-field">
                            <label htmlFor="example-count-opt">Number of examples</label>
                            <input
                                type="number"
                                required
                                name="example-count-opt"
                                id="example-count-opt"
                                min="1"
                                max="64"
                                step="1"
                                value={puzzleParams.initialExampleCount}
                                onInput={(e) => {
                                    const val = parseInt((e.target as HTMLInputElement).value);
                                    setPuzzleParams((prev) => new PuzzleParams(val, prev.scriptPool));
                                }}
                            />
                        </li>
                    </ul>
                    <div id="new-game-link-wrapper">
                        <input
                            type="submit"
                            id="new-game-link"
                            value="Start Game"
                            disabled={puzzleParams.scriptPool.size === 0}
                            onClick={submitForm}
                        />
                    </div>
                </form>
            </main>
            <footer></footer>
        </div>
    );

    function submitForm(e: React.FormEvent<any>) {
        // Push to browser history to go to the play page
        e.preventDefault();
        navTo("/play");
    }
}