import { useState, useEffect } from 'react';
import "./flag.css";

function Flag(){
    const [countries, setCountries] = useState([]);
    const [score, setScore] = useState(0);
    const [index, setIndex] = useState(0);
    const [showHints, setShowHints] = useState(false);  //Dodaj 3 imena za hints
    const [options, setOptions] = useState([]);         //generisi ih kad i trenutni flag
    const [feedback, setFeedback] = useState("");

    function shuffleCountries(array){
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const getCountries = async () => {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
            const data = await response.json();
            const shuffled = shuffleCountries(data);
            setCountries(shuffled);
        };
        getCountries();
    }, []);

    if (countries.length === 0) return <p>Loading flag...</p>;

    if(index >= countries.length) return <p>Final score: {score}</p>

    const onSubmit = (event) => {
        event.preventDefault();

        const userGuess = event.target.elements.guess.value.trim().toLowerCase();
        const answer = countries[index].name.common.toLowerCase();

        if(userGuess === answer) {
            setScore(score + 1);
            setFeedback("Correct answer");
        }else{
            setFeedback(<>
                Wrong answer, the flag was <strong>{countries[index].name.common}</strong>
            </>);
        }
        setIndex(prev => prev + 1);

        event.target.reset();
    }

    return(
        <>
            <div className="game">
                <h1>Guess the Flag!</h1>
                <img src={countries[index].flags.png}/>
                <form className="form" onSubmit={onSubmit}>
                    <input type="text" placeholder="Guess the country" autoComplete="off" name="guess"/>
                    <input type="submit" />
                </form>

            {/*    <button className="hint" onClick={showHints}>
                    Show hints
                </button> */}

                <div className="feedback">
                    {feedback && <p>{feedback}</p>}
                </div>

                <div className="score">
                    <h2>Score: {score}/250</h2>

                </div>
            </div>  
        </>
    )
};

export default Flag;