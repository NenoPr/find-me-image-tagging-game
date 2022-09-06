import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Header from "./components/Header";
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

  async function getCoordinates(e) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Get the database data
    const db = getFirestore(app);

    // Get the target
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("X", x);
    console.log("Y", y);

    const querySnapshot = await getDocs(collection(db, "playstation2-level"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      // console.log(Object.keys(doc.data()));
      if (x > doc.data().xCord1 && x < doc.data().xCord2) {
        if (y > doc.data().yCord1 && y < doc.data().yCord2) {
          alert(`You Found ${doc.data().name}!`);
        }
      }

      // if (xCord > 505 && xCord < 550) {
      //   if (yCord > 405 && yCord < 490) {
      //     console.log("You Found Raiden!");
      //   }
      // }

      // if (xCord > 480 && xCord < 545) {
      //   if (yCord > 765 && yCord < 835) {
      //     console.log("You Found Ratchet!");
      //   }
      // }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="app-game-container">
        <img
          src="/where-s-waldo-photo-tagging-app/levels/playstation-2-level.jpg"
          alt="Level 1"
          onClick={getCoordinates}
        />
      </div>
      <footer className="app-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default App;
