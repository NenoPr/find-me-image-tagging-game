import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./styles/level-select.css";

const LevelSelect = (appProps) => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const renderLevels = async () => {
      // Initialize Firebase
      const app = initializeApp(appProps.state.firebaseConfig);
      // Get the database data
      const db = getFirestore(app);

      let fetchedLevels = [];

      const querySnapshot = await getDocs(collection(db, "levels"));
      querySnapshot.forEach((doc) => {
        fetchedLevels.push({
          level: doc.data().level,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description,
          id: doc.data().id,
        });
      });
      console.log("Levels", fetchedLevels);
      setLevels(fetchedLevels);
    };
    renderLevels();
    console.log("Props in Level Select:", appProps.state);
    console.log("LevelSelect: Component Mounted");
  }, []);

  function selectLevel(e) {
    let selectedLevel = Number(e.currentTarget.getAttribute("level-data"));
    let newLevel = {};
    levels.map((item) => {
      if (item.level === selectedLevel) {
        newLevel = {
          level: item.level,
          imageUrl: item.imageUrl,
        };
      }
    });
    appProps.state.setCurrentLevel(newLevel);
    appProps.state.setTimerRunning(true);
  }

  return (
    <>
      <div className="level-select-container">
        {levels ? (
          levels.map((item) => (
            <div
              className="level-container"
              level-data={item.level}
              onClick={selectLevel}
              key={item.id}
            >
              <div className="level-title">
                Level {item.level}
              </div>
              <img
                className="level-image"
                src={item.imageUrl}
                alt={`level ${item.level} ${item.name}`}
              />
              <div className="level-name">{item.name}</div>
              <div className="level-description">{item.description}</div>
            </div>
          ))
        ) : (
          <div>Loading Content...</div>
        )}
      </div>
    </>
  );
};

export default LevelSelect;
