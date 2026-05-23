import "./App.css";
import { useState } from "react";

const initialPlayer = {
  name: "Hero",
  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  stats: {
    strength: 10,
    defense: 8,
    speed: 7,
    magic: 5,
  },
  gold: 0,
  experience: 0,
  expToNextLevel: 100,
};

function App() {
    const [player, setPlayer] = useState(initialPlayer);
  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>RPG</h1>
        <p>
          Test colors, typography, spacing, buttons, cards, forms,
          tables, and more.
        </p>

        <div className="button-group">
          <button>Primary Button</button>
          <button className="secondary">Secondary</button>
          <button className="danger">Danger</button>
        </div>
      </header>

      {/* TYPOGRAPHY */}
      <section className="section">
        <h2>Typography</h2>

        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>

        <p>
          Regular paragraph text. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </p>

        <p>
          <strong>Bold text</strong>, <em>italic text</em>, and{" "}
          <a href="/">links</a>.
        </p>

        <blockquote>
          "This is a blockquote example."
        </blockquote>

        <code>const hello = "world";</code>
      </section>

      {/* CARDS */}
      <section className="section">
        <h2>Cards</h2>

        <div className="card-grid">
          <div className="card">
            <h3>Card One</h3>
            <p>Simple card content.</p>
            <button>Action</button>
          </div>

          <div className="card">
            <h3>Card Two</h3>
            <p>Another example card.</p>
            <button>Action</button>
          </div>

          <div className="card">
            <h3>Card Three</h3>
            <p>Perfect for testing shadows.</p>
            <button>Action</button>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="section">
        <h2>Form Elements</h2>

        <form className="form">
          <input type="text" placeholder="Text input" />

          <input type="email" placeholder="Email input" />

          <select>
            <option>Select option</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>

          <textarea placeholder="Textarea"></textarea>

          <label className="checkbox">
            <input type="checkbox" />
            Checkbox
          </label>

          <button type="submit">Submit</button>
        </form>
      </section>

      {/* TABLE */}
      <section className="section">
        <h2>Table</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Level</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Alex</td>
              <td>Online</td>
              <td>42</td>
            </tr>

            <tr>
              <td>Maria</td>
              <td>Offline</td>
              <td>18</td>
            </tr>

            <tr>
              <td>John</td>
              <td>Busy</td>
              <td>76</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* LISTS */}
      <section className="section">
        <h2>Lists</h2>

        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>

        <ol>
          <li>Number one</li>
          <li>Number two</li>
          <li>Number three</li>
        </ol>
      </section>

      {/* ALERTS */}
      <section className="section">
        <h2>Alerts</h2>

        <div className="alert success">
          Success message
        </div>

        <div className="alert warning">
          Warning message
        </div>

        <div className="alert error">
          Error message
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Footer Area</p>
      </footer>
    </div>
  );
}

export default App;