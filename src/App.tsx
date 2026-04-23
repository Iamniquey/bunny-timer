import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import bunny1 from "./assets/bunny1.png";
import bunny2 from "./assets/bunny2.png";
import carrot1 from "./assets/carrot1.png";
import carrot2 from "./assets/carrot2.png";

function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [time, setTime] = useState(0);
  const [startTimer, setStartTimer] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setValue(Number(e.target.value));
  };

  const handleStart = () => {
    const total_time = (minutes * 60 + seconds) * 100; // tens of milliseconds
    setTime(total_time);
    setTotalTime(total_time);
    setStartTimer(true);
  };

  const handleReset = () => {
    setTotalTime(0);
    setStartTimer(false);
    setTime(0);
  };

  const handlePauseResume = () =>{
    if(startTimer){
      return setStartTimer(false);
    }
    return setStartTimer(true);
  }

  const formatTime = (): string => {
    const totSeconds = time / 100;
    const minutes = Math.floor(totSeconds / 60);
    const seconds = Math.floor(totSeconds % 60);
    console.log(seconds);
    if (seconds > 9) {
      return `${minutes}:${seconds}`;
    }
    if (seconds > 0) {
      return `${minutes}:0${seconds}`;
    }
    return `${minutes}:00`;
  };

  const getState = (): string => {
    //unstarted
    if(!startTimer && time <= 0 && totalTime <= 0){
      return "unstarted";
    }
    //running
    else if (startTimer && time > 0 && totalTime > 0){
      return "running";
    }
    //paused
    else if (!startTimer && time > 0 && totalTime > 0){
      return "paused";
    }
    //finished
    else if (!startTimer && time <= 0 && totalTime > 0){
      return "finished";
    }

    return "unknown";
  }

  useEffect(() => {
    if (startTimer && totalTime > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            setStartTimer(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 10);

      return () => {
        clearInterval(timer);
      };
    }
  }, [totalTime, startTimer]);

  return (
    <>
      <div className="container">
        <h1>Bunny Timer</h1>
        {/* UNSTARTED */}
        {getState() === "unstarted" && (
          <div className="bunnyAnim">
            <div className="bunny">
              <img src={bunny1} alt="bunny" />
            </div>
            <div className="carrot1">
              <img src={carrot1} alt="carrot" />
            </div>
          </div>
        )}

        {/* RUNNING */}
        {getState() === "running" || getState() === "paused"? (
          <div className="bunny-line-area">
            <div
              className="bunnyAnim"
              style={{
                left: `calc((100% - 150px) * (1 - ${time / totalTime}))`,
              }}
            >
              <div className="bunny1">
                <img src={bunny1} alt="bunny 1" />
              </div>
              <div className="bunny2">
                <img src={bunny2} alt="bunny 2" />
              </div>
            </div>
            <div className="carrot1">
              <img src={carrot1} alt="carrot" />
            </div>
            <div
              className="timeline"
              style={{
                width: `calc((100% - 130px) * (1 - ${time / totalTime}))`,
              }}
            ></div>
          </div>
        ) : (
          ""
        )}

        {/* FINISHED */}
        {getState() === "finished" ? (
          <div className="bunny-line-area">
            <div className="bunnyAnim" style={{ left: `calc((100% - 150px))` }}>
              <div className="bunny">
                <img src={bunny1} alt="bunny" />
              </div>
            </div>
            <div className="carrot2">
              <img src={carrot2} alt="carrot" />
            </div>
            <div className="timeline"></div>
          </div>
        ) : (
          ""
        )}
        <form className="form-area">
          <button
            className="btn"
            type="button"
            onClick={handleStart}
            disabled={getState() === "running" || getState() === "paused"}
          >
            Start
          </button>
          {getState() === "running" || getState() === "paused" ? (
            <button className="btn" type="button" onClick={handlePauseResume}>
              {getState() === "paused" ? "Resume" : "Pause"}
            </button>
          ) : ""}
          {getState() !== "running" && getState() !== "paused"?
            <>
              <input
                className="form-inp"
                type="number"
                value={minutes}
                onChange={(e) => handleChange(e, setMinutes)}
              />
              min
              <input
                className="form-inp"
                type="number"
                max={59}
                value={seconds}
                onChange={(e) => handleChange(e, setSeconds)}
              />
              sec
            </> : ""
          }
          <button className="btn" type="button" onClick={handleReset}>
            Reset
          </button>
          {getState() === "running"  || getState() === "paused"? (<div>{formatTime()}</div>) : ""}
        </form>
      </div>
    </>
  );
}

export default App;
