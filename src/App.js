import './App.css';
import API from "./API/API"
import LandingPage from './Components/LandingPage';
import React, {useEffect, useState} from "react"

function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  function startQuizGame(){
    setStartQuiz(prevVal => !prevVal)
    
}
  return (
    <div className="App">
      <header className="App-header">        
       {startQuiz && <API/>}
       {!startQuiz && <LandingPage startQuiz={startQuizGame}/>}
      </header>
    </div>
  );
}

export default App;
