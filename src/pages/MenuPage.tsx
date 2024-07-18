import "./MenuPage.css";

export default function MenuPage() {
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
                        <label htmlFor="question-count-opt">Number of questions</label>
                        <input type="number" name="question-count-opt" id="question-count-opt" />
                    </li>
                </ul>
            </section>
            <a href="/play" id="new-game-link">Start New Game</a>
        </main>
    );
}