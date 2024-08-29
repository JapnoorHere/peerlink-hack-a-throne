import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ScoreChart from './ScoreChart';

const Profile = () => {
    const location = useLocation();
    const user = location.state.user;
    const [userData, setUserData] = useState({});
    const [studentData, setStudentData] = useState([]);
    
    useEffect(() => {
        console.log(user._id);
        axios.get(`https://peerlink-hack-a-throne.vercel.app/${user._id}/profile/`).then((res) => {
            setUserData(res.data.data);
        });
    }, [user._id]);

    const handleRequestForMentor = () => {
        axios.post('https://peerlink-hack-a-throne.vercel.app/', { reqid: user._id, userid: localStorage.getItem('id') }).then((res) => {
            console.log(res);
        });
    };

    useEffect(()=>{
        axios.post(`https://peerlink-hack-a-throne.vercel.app/showquiz`,{
            id: user._id
        }).then((res)=>{
            console.log(res.data.data.quiz);
            setStudentData(res.data.data.quiz);
        })
    },[])

    return (
        <div className='flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen'>
            <img className='w-[300px] h-[300px] rounded-full shadow-lg' src="https://firebasestorage.googleapis.com/v0/b/hack-a-throne-education-4d558.appspot.com/o/images%2F1724883228842.png?alt=media&token=db4f53fa-534c-4729-91f0-8dc64d699f29" alt="Profile" />
            <div className='w-full max-w-md flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg'>
                {user.role === 'senior' && user.id !== localStorage.getItem('id') && (
                    <Button type='submit' onClick={handleRequestForMentor} variant="contained" color="primary" className='mb-4'>
                        Request for mentorship
                    </Button>
                )}
                <TextField disabled required value={userData.name || ''} className='w-full text-black' />
                <TextField disabled required value={userData.email || ''} className='w-full' />
                <TextField disabled required value={userData.stream || ''} className='w-full' />
                <TextField disabled required value={userData.reg || ''} className='w-full' />
                <TextField disabled required value={userData.passingYear || ''} className='w-full' />
            </div>

            <ScoreChart data={studentData} />

        </div>
    );
};

export default Profile;
