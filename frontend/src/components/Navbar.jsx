import React, { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import profile from './assets/user.png';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const quiz = useRef(null)
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [secondOpen, setSecondOpen] = useState(false);
    const handleSecondOpen = () => setSecondOpen(true);
    const handleSecondClose = () => setSecondOpen(false);

    const [thirdOpen, setThirdOpen] = useState(false);
    const handleThirdOpen = () => setThirdOpen(true);
    const handleThirdClose = () => setThirdOpen(false);

    const [fouthOpen, setFourthOpen] = useState(false);
    const handleFourthOpen = () => setFourthOpen(true);
    const handleFourthClose = () => setFourthOpen(false);

    const [fifthOpen, setFifthOpen] = useState(false);
    const handleFifthOpen = () => setFifthOpen(true);
    const handleFifthClose = () => setFifthOpen(false);

    const [userData, setUserData] = useState({});
    const [requestsData, setRequestsData] = useState();

    const [mentorList, setMentorList] = useState();

    useEffect(() => {
        axios.get(`https://peerlink-hack-a-throne.vercel.app/${localStorage.getItem('id')}/profile/`).then((res) => {
            setUserData(res.data.data);
            console.log(res.data.data);
        });
    }, []);

    useEffect(() => {
        if (userData.request?.length > 0) {
            Promise.all(userData.request.map(requestId =>
                axios.get(`https://peerlink-hack-a-throne.vercel.app/${requestId}/profile/`)
            )).then(responses => {
                const names = responses.map(item => item.data.data.name);
                setRequestsData(names);
            }).catch(error => {
                console.error('Error fetching request data:', error);
            });
        }
    }, [userData]);


    useEffect(() => {
        axios.get('https://peerlink-hack-a-throne.vercel.app/mentorlist').then((res) => {
            setMentorList(res.data.data);
        });

        return () => {

        }
    }, [])


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleMentorAccept = () => {
        axios.post('https://peerlink-hack-a-throne.vercel.app/accept', {
            acceptid: userData.request[0],
            userid: localStorage.getItem('id')
        }).then((res) => {
            if (res.data.msg === 'Request accepted successfully') {
                console.log(res.data.data);
                setUserData(res.data.data);
            }
        });
    }

    const chooseMentorButton = (mentorId) => {
        axios.post('https://peerlink-hack-a-throne.vercel.app/request/', { reqid: mentorId, userid: localStorage.getItem('id') }).then((res) => {
            console.log(res);
        });
    }

    const startQuiz = () => {
        console.log(quiz.current.value);

        navigate('/quiz', { state: { topic: quiz.current.value } });
    }

    return (
        <nav className="bg-gradient-to-r bg-blue-500 p-6 shadow-lg w-full">
            <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <h1 className="font-bold text-2xl">PeerLink</h1>
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center px-3 py-2 rounded text-white hover:text-gray-300"
                    >
                        {isOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
                <div
                    className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
                >
                    <div className="text-sm lg:flex-grow">
                        {localStorage.getItem('role') !== 'junior' && <a href="#" onClick={handleOpen} className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-4">
                            Show Requests
                        </a>}
                        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box className='flex flex-col gap-4' sx={{ ...style, width: 400 }}>
                                <h1 className='text-3xl font-bold'>Requests for mentorship</h1>
                                {requestsData && requestsData.length > 0 ? (
                                    requestsData.map((name, index) => (
                                        <div className='flex justify-between' key={index}>
                                            <p className='text-xl'>{name}</p>
                                            <button onClick={handleMentorAccept} className='bg-blue-500 px-4 py-3 text-white rounded-md'>Accept the request</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No requests found.</p>
                                )}
                            </Box>
                        </Modal>

                        <a href="#" onClick={handleSecondOpen} className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-4">
                            My Mentor
                        </a>
                        <Modal open={secondOpen} onClose={handleSecondClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box className='flex flex-col gap-4' sx={{ ...style, width: 400 }}>
                                <h1 className='text-3xl font-bold'>Your Mentor</h1>
                                <img src={profile} alt="Mentor" />
                                <h1 className='text-2xl text-center'>
                                    {localStorage.getItem('user').mentor ?
                                        localStorage.getItem('user').mentor :
                                        "Not appointed"}
                                </h1>

                            </Box>
                        </Modal>
                        <a href="#" onClick={handleThirdOpen} className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-4">
                            Mentors
                        </a>
                        <Modal open={thirdOpen} onClose={handleThirdClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box className='flex flex-col gap-4' sx={{ ...style, width: 400 }}>
                                <h1 className='text-3xl font-medium'>Choose your Mentor</h1>
                                {mentorList && mentorList.map((mentor) => (
                                    <div className='flex justify-between' key={mentor._id}>
                                        <p>{mentor.name}</p>
                                        <button onClick={() => chooseMentorButton(mentor._id)} className='bg-blue-500 px-4 py-3 text-white rounded-md'>Choose</button>
                                    </div>
                                ))}
                            </Box>
                        </Modal>

                        <a href="#" onClick={handleFifthOpen} className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-4">
                            Quiz
                        </a>
                        <Modal open={fifthOpen} onClose={handleFifthClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box className='flex flex-col gap-4' sx={{ ...style, width: 400 }}>
                                <input className='w-full border px-4 py-4' placeholder='Topic' label='Topic' ref={quiz} />
                                <Button variant='contained' color='primary' onClick={startQuiz}>Start Quiz</Button>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
