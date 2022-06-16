import React from "react";
import './App.css';

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const[breakAudio, setBreakAudio] = React.useState(
    new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav")
    );

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    // let seconds = time % 60;
    return (
      (minutes < 10 ? minutes : minutes) 
      //   +":" +
      // (seconds < 10 ? "0" + seconds : seconds)
    );
  };
  const formatTime2 = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) 
        +":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime(prev => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if(!timerOn){
      let interval = setInterval(()=> {
        date = new Date().getTime();
        if(date > nextDate){
          setDisplayTime((prev) => {
            if (prev<=0 && !onBreakVariable){
              playBreakSound();
              onBreakVariable=true;
              setOnBreak(true);
              return breakTime;
            } else if(prev <=0 && onBreakVariable){
              playBreakSound();
              onBreakVariable=false;
              setOnBreak(false)
              return sessionTime;
            }
            return prev - 1;
          })
          nextDate += second;
        }
      }, 60);
      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    }
    if(timerOn){
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
  };

  return (
    <div className="center-align">
      <h1>Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          title={"Break Length"}
          id={"break-label"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"Session Length"}
          id={"session-label"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
        <h2 id="time-left">{formatTime2(displayTime)}</h2>
        <button id="start_stop" className="btn-large #ffc400 amber accent-3" onClick={controlTime}>
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button id="reset" className="btn-large #ffc400 amber accent-3" onClick={resetTime}>
          <i className="material-icons">autorenew</i>
        </button>
    </div>
  );
}

function Length({ title, id, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3 id={id}>{title}</h3>
      <div className='time-sets'>
        <button id={type+"-decrement"} className='btn-small #ffab00 amber accent-4'
          onClick={() => changeTime(-60, type)}
        >
          <i className='material-icons'>arrow_downward</i>
        </button>
        <h4 id={type+"-length"}>{formatTime(time)}</h4>
        <button id={type+"-increment"} className='btn-small #ffab00 amber accent-4'
          onClick={() => changeTime(60, type)}
        >
          <i className='material-icons'>arrow_upward</i>
        </button>
        
      </div>
    </div>
  );
}


export default App;
