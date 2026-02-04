import { useState } from "react";
import nevah from "./assets/nevah.jpg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <main>
        <div className="image-container">
          <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">
            <img src={nevah} className="nevah" alt="Never Gonna Give You Up" />
          </a>
        </div>
        <div className="card">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="count-btn"
          >
            count is {count}
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
