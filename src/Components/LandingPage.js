import React, {useEffect, useState} from "react"

function  LandingPage(props){
    
    return(
        <div className="landing-page">
            <h2>Quizzical</h2>
            <h5>Test Your Knowledge!!</h5>
            <button className="start-quiz" onClick={props.startQuiz}>Start Quiz</button>
        </div>
    )

}

export default LandingPage;

