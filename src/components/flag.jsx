import { useState, useEffect, useMemo, useRef } from 'react';
import "./flag.css";

function Flag(){
    const [countries, setCountries] = useState([]);
    const [score, setScore] = useState(0);
    const [index, setIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const autocompleteRef = useRef(null);

    function shuffleCountries(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    useEffect(() => {
        const getCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
                const data = await response.json();
                setCountries(shuffleCountries(data));
            } catch(err){
                console.error("Error fetching countries:", err);
            }
        };
        getCountries();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const suggestions = useMemo(() => {
        if (inputValue.trim().length === 0) return [];
        
        return countries
            .filter(c => c.name.common.toLowerCase().startsWith(inputValue.toLowerCase()))
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .slice(0, 5);
    }, [inputValue, countries]);

    if (countries.length === 0) return <p>Loading flag...</p>;
    if(index >= countries.length) return <p>Final score: {score}</p>

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setActiveSuggestion(-1);
        setShowSuggestions(true);
        if (feedback) setFeedback("");
    };

    const selectSuggestion = (name) => {
        setInputValue(name);
        setActiveSuggestion(-1);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion((prev) => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter") {
            if (activeSuggestion >= 0) {
                e.preventDefault(); 
                setInputValue(suggestions[activeSuggestion].name.common);
                setActiveSuggestion(-1);
                setShowSuggestions(false);
            }
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const userGuess = inputValue.trim().toLowerCase();
        const answer = countries[index].name.common.toLowerCase();

        if(userGuess === answer) {
            setScore(prev => prev + 1);
            setFeedback("Correct answer");
        }else{
            setFeedback(<>
                Wrong answer, the flag was <strong>{countries[index].name.common}</strong>
            </>);
        }
        setIndex(prev => prev + 1);
        setInputValue("");
        setActiveSuggestion(-1);
        setShowSuggestions(false);
    }

    return(
        <>
            <div className="game">
                <h1>Guess the Flag!</h1>
                <img src={countries[index].flags.png}/>
                <form className="form" onSubmit={onSubmit}>
                    <div className="textInput" ref={autocompleteRef}>
                        <input
                            type="text" 
                            placeholder="Guess the flag" 
                            autoComplete="off" 
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            required
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <li key={i} onClick={() => selectSuggestion(s.name.common)}
                                    className={i === activeSuggestion ? "suggestion-active" : ""}>
                                        {s.name.common}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    

                    <input type="submit" />
                </form>

                <div className="feedback">
                    {feedback && <p>{feedback}</p>}
                </div>

                <div className="score">
                    <h2>Score: {score}/{countries.length}</h2>

                </div>
            </div>  
        </>
    )
};

export default Flag;