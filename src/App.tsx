import "./App.css";
import bunny1 from "./assets/bunny1.png";
import bunny2 from "./assets/bunny2.png";

function App() {
  return (
    <>
    <div className="container">

      <h1>Timer</h1>
      <div className="bunnyAnim">
        <div className="bunny1">
          <img src={bunny1} alt="" />
        </div>
        <div className="bunny2">
          <img src={bunny2} alt="" />
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
