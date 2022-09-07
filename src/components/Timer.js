import React, { useState, useEffect } from "react";

const Timer = (appProps) => {
    useEffect(() => {
      let interval;
      if (appProps.props.timerRunning) {
        interval = setInterval(() => {
            appProps.props.setTime((prevTime) => prevTime + 10);
        }, 10);
      } else if (!appProps.props.timerRunning) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [appProps.props.timerRunning]);
    return (
      <div className="stopwatch">
        <div className="numbers">
          <span>{(Math.floor((appProps.props.time / 60000)))}:</span>
          <span>{("0" + Math.floor((appProps.props.time / 1000) % 60)).slice(-2)}</span>
        </div>
        <div className="buttons">
          <button onClick={() => appProps.props.setTimerRunning(true)}>Start</button>
          <button onClick={() => appProps.props.setTimerRunning(false)}>Stop</button>
          <button onClick={() => appProps.props.setTime(0)}>Reset</button>       
        </div>
      </div>
    );
  };

  export default Timer;