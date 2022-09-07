import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Header from "./components/Header";
import LevelSelect from "./components/LevelSelect";
import Footer from "./components/Footer";
import "./App.css";

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
    // Get the target
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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
      // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      // console.log(Object.keys(doc.data()));
      if (x > doc.data().xCord1 && x < doc.data().xCord2) {
        if (y > doc.data().yCord1 && y < doc.data().yCord2) {
          alert(`You Found ${doc.data().name}!`);
          setFoundCharacters(foundCharacters + 1);
        }
      }
    });
  }

  useEffect(() => {
    if (foundCharacters >= 3) resetGame();
  }, [foundCharacters]);

  function resetGame() {
    setCurrentLevel({ level: 0 });
    setCharacters([]);
    setFoundCharacters(0);
    setTimerRunning(false);
    setTime(0);
  }

  console.log("currentLevel.imageUrl", currentLevel.imageUrl);

  return (
    <div className="App">
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
            <button className="back-button" onClick={resetGame}>
              BACK TO LEVEL SELECTION
            </button>
            <img
              src={currentLevel.imageUrl}
              alt="Level 1"
              onClick={getCoordinates}
              className="game-image"
            />
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
