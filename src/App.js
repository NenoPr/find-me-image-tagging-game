import Header from './components/Header';
import './App.css';

const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="app-game-container">
        <div>Game Content</div>
        <img src="/where-s-waldo-photo-tagging-app/levels/level-2-egor.jpg" alt="Level 1" />
      </div>
      <footer className="app-footer">
        Footer Content
      </footer>
    </div>
  );
}

export default App;
