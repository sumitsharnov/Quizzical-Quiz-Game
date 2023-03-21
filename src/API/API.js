import React, { useState, useEffect, useRef} from 'react'
import AnimatedNumbers from "react-animated-numbers";
import { nanoid } from 'nanoid'


function API() {
  let countlen = 0
  let count = 0
  let rerender = true
  const [scoreChanged, setScoreChanged] = useState(false)

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectAnswer, setSelectedAnswer] = useState([])
  const [score, setScore] = useState(0)



  function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }

  let oldScore = usePrevious(score)
  useEffect(() => { 
    async function getData() {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple")
        const result = await res.json()
        setIsLoaded(true);
        setItems(result);
        
      } catch (e) {
        setError(e)
      }
    }
    getData()
    

  }, [])


    items.results !== undefined && items.results.map(e => {
    const temp = []
    selectAnswer.length < 10 && temp.push({
      answer: e.correct_answer,
      id: nanoid(),
      class: "unselected",
      quesnum: count,
      isDisabled:false
    })
    selectAnswer.length < 10 && e.incorrect_answers.map(incorrect_answer => temp.push({
      answer: incorrect_answer,
      id: nanoid(),
      class: "unselected",
      quesnum: count,
      isDisabled:false
    }))
    temp.length !==0 && selectAnswer.push(temp)
    count += 1
    return selectAnswer
  })
    

  let mainIndex = selectAnswer.length,  randomIndex;
  
  // While there remain elements to shuffle.
  useEffect(()=>{
    let anArray = []
    for(let i=0; i<mainIndex; i++) {
      let currentIndex =selectAnswer[i].length
      let a = selectAnswer[i]
  
      while(currentIndex !==0){
        randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [a[currentIndex], a[randomIndex]] = [
        a[randomIndex], a[currentIndex]];
      
      }
      anArray.push(a)
     
    }
   setSelectedAnswer(anArray)

  }, [items])
  




  const r = selectAnswer && selectAnswer.map(e => e)


function checkCorrectAnswer(countval, correctAnswer, clickedId)
   {

    setSelectedAnswer(prevValue => {
      return(
        prevValue.map(s => {
         
          return s.map(w => {
            if(w.answer === correctAnswer && clickedId===w.id){
             
              setScore(prevValue=>prevValue+1)
              setScoreChanged(true)
              //setScoreChanged(tr)
              return {...w, class:"selected correctanswer disabled", isDisabled:true}
            }
            if(w.answer === correctAnswer){
              setScoreChanged(false)
              return {...w, class:"selected correctanswer disabled", isDisabled:true} 
            }else if(w.id === clickedId && w.answer !== correctAnswer){
              setScoreChanged(false)
              return {...w, class:"selected wronganswer disabled", isDisabled:true}
            }else if(w.quesnum === countval){
              setScoreChanged(false)
              return {...w, isDisabled:true}
            }else return w
          })
        })
      )
    })
      
    }


  

  function questions() {
    const ques = items.results !== undefined && items.results.map(e => {


      return (

        <div className="container" key={nanoid()}>
          <div className="questions" key={nanoid()}>{e.question}</div>

          {
              r[countlen++].map(ele => {
              
                return (
                <button disabled={ele.isDisabled} className={`answers ${ele.class}`} key={nanoid()} id={ele.id} value={ele.answer} onClick={() => checkCorrectAnswer(ele.quesnum, e.correct_answer, ele.id)}>{ele.answer}</button>
      
            )})
           
          
        }
          
          <div className="bottom-line"></div>
        </div>
        

      )


    })


    return ques
  }


  async function  Reset(){

    rerender = 1
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple")
        const result = await res.json()
        setIsLoaded(true);
        setItems(result);
        setSelectedAnswer([]);
        setScore(0)        
      } catch (e) {
        setError(e)
      }
    }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  } else {
    return (
      <div>
        <button className="reset" onClick={Reset}>Reset</button>
        <div className="bottom-line"></div>
        <span className="ques-ans-container" key={nanoid()}>{questions()}
        {/* <input readOnly className="score" value={score}></input> */}
        {
         
          <div  className="footer">
            <span className="score-tag">Score:</span>
            { 
              oldScore!==score ?  <AnimatedNumbers
              includeComma
              animateToNumber={score}
              fontStyle={{ fontSize: 40 }}
              locale="en-US"
              configs={[
                { mass: 1, tension: 220, friction: 100 },
                { mass: 1, tension: 180, friction: 130 },
                { mass: 1, tension: 280, friction: 90 },
                { mass: 1, tension: 180, friction: 135 },
                { mass: 1, tension: 260, friction: 100 },
                { mass: 1, tension: 210, friction: 180 },
              ]}
            
            > </AnimatedNumbers>: <span className="old-score">{oldScore}</span>
          }
          <span className="outOf">/10</span>
     </div>
      
  }
    </span>
      </div>
    
      
    );
  }
}



export default API;