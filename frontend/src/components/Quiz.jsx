import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
    const location = useLocation();
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const topic = location.state.topic;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const genAI = new GoogleGenerativeAI('AIzaSyB9o3z_4DhvQX4h0Omh42UqgFLZvVz3_8U'); 
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

                const inputValue = `start you result with only json and end with only json dont write any other single text just give me only json to Generate a quiz on ${topic} in JSON format with the following structure:
        Each quiz question should have a "question" field with the text of the question.
        Each question should have four "options" in an array, labeled A, B, C, and D.
        Include a "correctOption" field that specifies the correct answer, which should be one of the options ('A', 'B', 'C', or 'D'). use the exact structure as shown in the example below:
    "question": "What is the primary language used for Android app development?",
    "options": [
      "A. Swift",
      "B. Java",
      "C. Python",
      "D. C#"
    ],
    "correctOption": "B"
  },`;

                console.log('Input value:', inputValue);

                // Correctly call the API method
                const result = await model.generateContent(inputValue);
                console.log(result.response.text());

                const quizJson = JSON.parse(result.response.text());
                console.log('Fetched quiz data:', quizJson);
                    
                setQuizData(quizJson);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        fetchQuizData();
    }, [topic]);

    const handleSelectChange = (index, value) => {
        setUserAnswers(prevAnswers => {
            const newAnswers = { ...prevAnswers, [index]: value };
            console.log('Updated userAnswers:', newAnswers); 
            return newAnswers;
        });
    };

    const handleSubmit = () => {
        let calculatedScore = 0;
        console.log('User Answers before scoring:', userAnswers); 
        
        quizData.forEach((question, index) => {
            // Debugging logs
            console.log(`Question ${index}:`, question);
            console.log(`User Answer ${index}:`, userAnswers[index]);
            console.log(`Correct Answer ${index}:`, question.correctOption);
            
            if (userAnswers[index] !== undefined && userAnswers[index].charAt(0) === question.correctOption) {
                calculatedScore += 1;
                console.log("Correct answer for question", index);
            }
        });
    
        console.log('Calculated Score:', calculatedScore);
        setScore(calculatedScore);
    
        setTimeout(() => {
            axios.post('https://peerlink-hack-a-throne.vercel.app/quiz', {
                score: calculatedScore,
                topic: topic,
                totalScore: quizData.length,
                id: localStorage.getItem('id')
            }).then((res) => {
                if (res.data.msg === 'successful') {
                    navigate('/home');
                } else {
                    navigate('/home');
                }
            });
        }, 3000);
    };
    
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Quiz on {topic}</h1>
            {quizData.length > 0 ? (
                quizData.map((question, index) => (
                    <div key={index} className="mb-4">
                        <p className="mb-2 font-medium">{question.question}</p>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => handleSelectChange(index, e.target.value)}
                            value={userAnswers[index] || ""}
                        >
                            <option value="" disabled>Select an answer</option>
                            {question.options.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                ))
            ) : (
                <p>Loading quiz...</p>
            )}
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600"
            >
                Submit
            </button>
            {score !== null && (
                <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                    Your score: {score} out of {quizData.length}
                </div>
            )}
        </div>
    );
};

export default Quiz;
