import React, { useState, useEffect, createElement } from "react";
import ReactDOMClient, { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";
import uniqid from "uniqid";
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
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [charSelectionLoc, setCharSelectionLoc] = useState(0);
  const [charSelectionBool, setCharSelectionBool] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(0);
  const [root, setRoot] = useState(0);
  const [subbmitedScore, setSubmittedScore] = useState(false);
  const [charFound, setCharFound] = useState(false);

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
          fetchedCharacters.push(doc.data());
        });
        shuffle(fetchedCharacters);
        let newChars = [
          fetchedCharacters[0],
          fetchedCharacters[1],
          fetchedCharacters[2],
        ];
        setCharacters(newChars);
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

    let presentChar = false;
    if (foundCharacters) {
      foundCharacters.map((item) => {
        if (item === e.target.innerText) {
          presentChar = true;
        }
      });
    }
    if (presentChar) {
      renderMissOrHit("Found");
      setCharSelectionBool(false);
      return;
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Get the database data
    const db = getFirestore(app);

    const querySnapshot = await getDocs(
      collection(db, `playstation${currentLevel.level}-level`)
    );
    let miss = true;
    querySnapshot.forEach((doc) => {
      if (x > doc.data().xCord1 && x < doc.data().xCord2) {
        if (y > doc.data().yCord1 && y < doc.data().yCord2) {
          if (e.target.innerText === doc.data().name) {
            console.log(`You Found ${doc.data().name}!`);
            miss = false;
            renderMissOrHit(doc.data().name);
            let newChars = characters.map((item) => {
              if (item.name !== doc.data().name) return item;
              else {
                item.status = "found";
                return item;
              }
            });
            console.log("newChars", newChars);
            setCharacters(newChars);
            return;
          }
        }
      }
    });
    if (miss) renderMissOrHit("Miss");
    setCharSelectionBool(false);
  }

  function renderMissOrHit(name) {
    let element = document.querySelector(".game-hit-or-miss");
    element.classList.remove("game-hit-or-miss-off");
    element.classList.add("game-hit-or-miss-on");
    setTimeout(() => {
      element.classList.add("game-hit-or-miss-off");
      element.classList.remove("game-hit-or-miss-on");
    }, 1000);
    console.log("foundCharacters", foundCharacters.length);

    if (name === "Miss") element.innerText = "Miss!";
    if (name === "Found") element.innerText = "Character already found";
    if (name !== "Miss" && name !== "Found") {
      if (foundCharacters) {
        let charHolder = foundCharacters;
        console.log("charHolder", charHolder);
        charHolder.push(name);
        console.log("charHolder", charHolder);

        element.innerText = `${name} Found!`;
        setFoundCharacters(charHolder);
        setCharFound(!charFound);
      } else {
        element.innerText = `${name} Found!`;
        setFoundCharacters([name]);
        setCharFound(!charFound);
      }
    }
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
    if (foundCharacters.length > 2) {
      setRoot(createRoot(document.querySelector(".game-image-holder")));
      setCharacters([]);
      setTimerRunning(false);
      getLeaderboardData();
    }
    console.log("App Rerender: foundCharacters updated");
  }, [charFound]);

  useEffect(() => {
    if (foundCharacters.length > 2) {
      root.render(
        <div className="victory-container">
          <button className="back-button" onClick={resetGame}>
            BACK TO LEVEL SELECTION
          </button>
          <div className="victory-title">You found all the Characters!</div>
          <div className="victory-player-info-container">
            <div className="leaderboard-time">
              <span>Time: {Math.floor(time / 60000)}:</span>
              <span>{(" 0" + Math.floor((time / 1000) % 60)).slice(-2)} </span>
            </div>
            <div className="leaderboard-text">
              <div>Congratulations!</div>
              <div>Place yourself on the global leaderboard if you wish!</div>
            </div>
            {subbmitedScore ? (
              <div className="leaderboard-submitted">Score Submitted!</div>
            ) : (
              <>
                <form className="leaderboard-player-input-container">
                  <div className="leaderboard-player-input-name">
                    <div>Name:</div>
                    <input
                      type="text"
                      placeholder="Name..."
                      name="name"
                      required={true}
                    />
                  </div>
                  <div className="leaderboard-player-input-name">
                    <div>Comment:</div>
                    <textarea
                      rows={"3"}
                      cols={"40"}
                      type="text"
                      placeholder="Comment..."
                      name="comment"
                      required={true}
                    />
                  </div>
                </form>
                <button
                  className="leaderboard-submit-button"
                  onClick={toogleSubmit}
                  disabled={subbmitedScore}
                >
                  SUBMIT
                </button>
              </>
            )}
          </div>
          <div className="global-leaderboard-title">{`Playstation ${currentLevel.level}`} Global Leaderboard</div>
          <div className="leaderboard-results-container">
            <div className="leaderboard-result-holder" key={uniqid()}>
              <div className="leaderboard-result-item result-header-item">
                Rank
              </div>
              <div className="leaderboard-result-item result-header-item">
                Name
              </div>
              <div className="leaderboard-result-item result-header-item">
                Comment
              </div>
              <div className="leaderboard-result-item result-header-item">
                Time
              </div>
              <div className="leaderboard-result-item result-header-item">
                Date
              </div>
            </div>

            {leaderboardData ? (
              leaderboardData.map((item) => (
                <div className="leaderboard-result-holder" key={uniqid()}>
                  <div className="leaderboard-result-item">{item.rank}</div>
                  <div className="leaderboard-result-item result-item-name">
                    {item.name}
                  </div>
                  <div className="leaderboard-result-item result-item-comment">
                    {item.comment}
                  </div>
                  <div className="leaderboard-result-item result-item-time">
                    {item.time}
                  </div>
                  <div className="leaderboard-result-item">
                    {item.date
                      ? new Date(item.date).getDate() +
                        "." +
                        new Date(item.date).getMonth() +
                        "." +
                        new Date(item.date).getFullYear()
                      : null}
                  </div>
                </div>
              ))
            ) : (
              <div>Loading Leaderboard...</div>
            )}
          </div>
        </div>
      );
    }
    window.scrollTo(0, 0);
    console.log("App Rerender: LeaderBoard Updated.");
  }, [leaderboardData]);

  const getLeaderboardData = async () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Get the database data
    const db = getFirestore(app);

    const querySnapshot = await getDocs(
      query(
        collection(getFirestore(), `leaderboard-playstation${currentLevel.level}`),
        orderBy("timestamp", "asc"),
        limit(50)
      )
    );
    let leaderboardData = [];
    querySnapshot.forEach((doc) => {
      leaderboardData.push(doc.data());
    });
    leaderboardData.sort();
    console.log("leaderboardData[i]", leaderboardData, leaderboardData[0]);
    for (let i = 0; i < leaderboardData.length; i++) {
      leaderboardData[i].rank = i + 1;
    }
    setLeaderboardData(leaderboardData);
  };

  function toogleSubmit() {
    setSubmittedScore(true);
  }

  useEffect(() => {
    submitScoreToLeaderboard();
  }, [subbmitedScore]);

  async function submitScoreToLeaderboard() {
    let formElement = document.querySelector(
      ".leaderboard-player-input-container"
    );

    console.log(formElement);
    console.log("formElement['name']", formElement["name"].value);
    console.log("formElement['comment']", formElement["comment"].value);
    if (formElement["name"].value === "") formElement["name"].value = "Anonymous";
    if (formElement["comment"].value === "")
      formElement["comment"].value = "No Comment Provided.";

    try {
      await addDoc(collection(getFirestore(), `leaderboard-playstation${currentLevel.level}`), {
        name: formElement["name"].value,
        comment: formElement["comment"].value,
        timestamp: time,
        time:
          Math.floor(time / 60000) +
          ":" +
          ("0" + Math.floor((time / 1000) % 60)).slice(-2),
        date: Date.now(),
      });
    } catch (error) {
      console.error("Error writing new message to Firebase Database", error);
    }
    getLeaderboardData();
  }

  function resetGame() {
    setCurrentLevel({ level: 0 });
    setCharacters([]);
    setFoundCharacters(0);
    setCharSelectionLoc([]);
    setSubmittedScore(false);
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
                    {characters[0].status ? "" : characters[0].name}
                  </div>
                  <div
                    className="game-selection-choice"
                    onClick={getCoordinates}
                  >
                    {characters[1].status ? "" : characters[1].name}
                  </div>
                  <div
                    className="game-selection-choice"
                    onClick={getCoordinates}
                  >
                    {characters[2].status ? "" : characters[2].name}
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
            <div className="game-hit-or-miss-off game-hit-or-miss">Miss!</div>
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
