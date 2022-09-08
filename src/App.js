import React, { useState, useEffect, createElement } from "react";
import ReactDOMClient, { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Header from "./components/Header";
import LevelSelect from "./components/LevelSelect";
import Footer from "./components/Footer";
import "./App.css";
import Timer from "./components/Timer";

const App = () => {
  // Your web app's Firebase configuration
  const [firebaseConfig, setFireBaseConfig] = useState({
    apiKey: "AIzaSyBVETGk9oCDCPfN0PKS2TwZ7edO7Gk-JpM",
    authDomain: "find-me-game.firebaseapp.com",
    projectId: "find-me-game",
    storageBucket: "find-me-game.appspot.com",
    messagingSenderId: "377712079556",
    appId: "1:377712079556:web:31749189ed71465716cf91",
  });
  const [currentLevel, setCurrentLevel] = useState({ level: 0 });
  const [characters, setCharacters] = useState([]);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [foundCharacters, setFoundCharacters] = useState(0);
  const [charSelectionLoc, setCharSelectionLoc] = useState(0);
  const [charSelectionBool, setCharSelectionBool] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(0);

  useEffect(() => {
    const getCharacters = async () => {
      if (currentLevel.level !== 0) {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        // Get the database data
        const db = getFirestore(app);

        const querySnapshot = await getDocs(
          collection(db, `playstation${currentLevel.level}-level`)
        );
        let fetchedCharacters = [];
        querySnapshot.forEach((doc) => {
          fetchedCharacters.push(doc.data().name);
        });
        shuffle(fetchedCharacters);
        setCharacters(fetchedCharacters);
      }
    };
    getCharacters();
    console.log("App Rerender: currentLevel updated");
  }, [currentLevel]);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function getCoordinates(e) {
    const x = charSelectionLoc.x;
    const y = charSelectionLoc.y;
    console.log("X", x);
    console.log("Y", y);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Get the database data
    const db = getFirestore(app);

    const querySnapshot = await getDocs(
      collection(db, `playstation${currentLevel.level}-level`)
    );
    querySnapshot.forEach((doc) => {
      if (x > doc.data().xCord1 && x < doc.data().xCord2) {
        if (y > doc.data().yCord1 && y < doc.data().yCord2) {
          if (e.target.innerText === doc.data().name) {
            alert(`You Found ${doc.data().name}!`);
            console.log(`You Found ${doc.data().name}!`);
            setFoundCharacters(foundCharacters + 1);
          } else alert(`That's a miss!`);
        }
      }
    });
    setCharSelectionBool(false);
  }

  function dropDownSelection(e) {
    // Get the target
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("X", x);
    console.log("Y", y);

    setCharSelectionLoc({ x: x, y: y });

    if (charSelectionBool) setCharSelectionBool(false);
    else setCharSelectionBool(true);
  }

  useEffect(() => {
    if (foundCharacters >= 3) {
      setTimerRunning(false);
      const getLeaderboardData = async () => {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        // Get the database data
        const db = getFirestore(app);

        const querySnapshot = await getDocs(collection(db, `leaderboard`));
        let leaderboardData = [];
        querySnapshot.forEach((doc) => {
          leaderboardData.push(doc.data());
        });
        setLeaderboardData(leaderboardData);
      };
      getLeaderboardData();
    }
    console.log("App Rerender: foundCharacters updated");
  }, [foundCharacters]);

  useEffect(() => {
    if (foundCharacters >= 3) {
      createRoot(document.querySelector(".game-image-holder")).render(
        <div className="victory-container">
          <div className="victory-title">You found all the Characters!</div>
          <div className="victory-player-info-container">
            <div className="leaderboard-time">
              <span>{Math.floor(time / 60000)}:</span>
              <span>{(" 0" + Math.floor((time / 1000) % 60)).slice(-2)} </span>
            </div>
            <div className="leaderboard-text">
              <div>Congratulations! You beat the top 50!</div>
              <div>
                You have earned yourself a place on the global leaderboard!
              </div>
            </div>
            <div className="leaderboard-player-input-container">
              <div className="leaderboard-player-input-name">
                <div>Name:</div>
                <input type="text" placeholder="Name..." />
              </div>
              <div className="leaderboard-player-input-name">
                <div>Comment:</div>
                <textarea
                  rows={"3"}
                  cols={"40"}
                  type="text"
                  placeholder="Comment..."
                />
              </div>
            </div>
            <button className="leaderboard-submit-button">SUBMIT</button>
          </div>
          <div className="global-leaderboard-title">Global Leaderboard</div>
          <div className="leaderboard-results-container">
            {leaderboardData ? (
              leaderboardData.map((item) => (
                <div className="leaderboard-result-holder">
                  <div className="leaderboard-result-item">{item.name}</div>
                  <div className="leaderboard-result-item">{item.comment}</div>
                  <div className="leaderboard-result-item">{item.time}</div>
                </div>
              ))
            ) : (
              <div>Loading Leaderboard...</div>
            )}
          </div>
          <button className="back-button" onClick={resetGame}>
            BACK TO LEVEL SELECTION
          </button>
        </div>
      );
    }
    console.log("App Rerender: LeaderBoard Updated.");
  }, [leaderboardData]);

  function resetGame() {
    setCurrentLevel({ level: 0 });
    setCharacters([]);
    setFoundCharacters(0);
    setCharSelectionLoc([]);
    setCharSelectionBool(false);
    setTimerRunning(false);
    setTime(0);
  }

  return (
    <div className="App" id="App-id">
      <header className="App-header">
        <Header
          props={{
            currentLevel,
            characters,
            timerRunning,
            setTimerRunning,
            time,
            setTime,
          }}
        />
      </header>
      <div className="app-game-container">
        {currentLevel.level === 0 ? (
          <LevelSelect
            state={{ firebaseConfig, setCurrentLevel, setTimerRunning }}
          />
        ) : (
          <>
            <div className="game-image-holder">
              <button className="back-button" onClick={resetGame}>
                BACK TO LEVEL SELECTION
              </button>
              {charSelectionBool ? (
                <div
                  className="game-selection-list"
                  style={{ left: charSelectionLoc.x, top: charSelectionLoc.y }}
                >
                  <div
                    className="game-selection-choice"
                    onClick={getCoordinates}
                  >
                    {characters[0]}
                  </div>
                  <div
                    className="game-selection-choice"
                    onClick={getCoordinates}
                  >
                    {characters[1]}
                  </div>
                  <div
                    className="game-selection-choice"
                    onClick={getCoordinates}
                  >
                    {characters[2]}
                  </div>
                </div>
              ) : (
                <div className="game-selection-list" style={{ opacity: "0" }}>
                  <div className="game-selection-choice"></div>
                  <div className="game-selection-choice"></div>
                  <div className="game-selection-choice"></div>
                </div>
              )}
              <img
                src={currentLevel.imageUrl}
                alt="Level 1"
                onClick={dropDownSelection}
                className="game-image"
              />
            </div>
          </>
        )}
      </div>
      <footer className="app-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default App;
