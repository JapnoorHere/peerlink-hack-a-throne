import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import PostsSection from './PostsSection';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TextField } from '@mui/material';
import { storage } from '../utils/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({});

    const handleFormChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

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
    const fileInputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [file, setFile] = useState(null);


    const onSignUp = (form) => {
        const { name, email, reg, passingYear, stream, password, confirmPassword } = form;
       
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const storageRef = ref(storage, `images/${Date.now()}.png`);
            const uploadResult = await uploadString(storageRef, file, 'data_url');
            const downloadURL = await getDownloadURL(uploadResult.ref);
            console.log(downloadURL);
            console.log(form.description);

        const { name, email, reg, passingYear, stream, password, confirmPassword } = form;

        console.log(name, email, password, confirmPassword, reg, passingYear, stream,);

        if (password !== confirmPassword) {
            toast.error('Password does not match')

        }
        else if (password.length < 6) {
            toast.error('Password length should be more than 6');
        }
        else {
            axios.post('https://peerlink-hack-a-throne.vercel.app/signup', {
                name: name,
                email: email,
                password: password,
                reg: reg,
                passingYear: passingYear,
                stream: stream,
                img: downloadURL.toString()
            }).then(response => {
                if (response.data.msg === 'User registered successfully') {
    
                    toast.success('User registered successfully');
                    console.log(response.data);
                    navigate('/');
                }
                else if (response.data.msg === 'User exists') {
                    toast.error('Email Id already exists')
                }
            }).catch(error => {
                console.log(error);
            })
        }

    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const targetWidth = 277 * 300 / 25.4; 
                    const targetHeight = 207 * 300 / 25.4;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    const resizedImage = canvas.toDataURL('image/png');
                    console.log(resizedImage);
                    setFile(resizedImage); 
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
            console.log(reader);
        }
    };

    return (
        <>
            <div><Toaster /></div>

            <div className='h-screen w-screen bg-gradient-to-r from-indigo-400 to-cyan-400'>
                <div className='flex flex-col max-w-[600px] p-4 m-auto h-screen justify-center'>
                    <form onSubmit={handleFormSubmit} className='bg-white p-6 rounded-lg flex flex-col gap-6 items-center w-full'>
                        <h1 className='text-4xl font-semibold'>Sign Up</h1>
                        <div className='flex gap-2 w-full'>
                            <TextField type='text' name='name' value={form.name} id="outlined-basic" label="Name" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />
                            <TextField type='email' name='email' value={form.email} required id="outlined-basic" label="Email" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />
                        </div>
                        <div className='flex gap-2 w-full'>
                            <TextField type='text' name='reg' value={form.reg} id="outlined-basic" variant="outlined" label='Registration Number' required className='w-full' onChange={(e) => handleFormChange(e)} />
                            <TextField type='text' name='passingYear' value={form.passingYear} required id="outlined-basic" label="Passing Year" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />
                        </div>

                        <TextField type='text' name='stream' value={form.stream} required id="outlined-basic" label="Stream" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />

                        <TextField type='password' name='password' value={form.password} required id="outlined-basic" label="Password" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />

                        <TextField type='password' name='confirmPassword' value={form.confirmPassword} required id="outlined-basic" label="Confirm Password" variant="outlined" className='w-full' onChange={(e) => handleFormChange(e)} />


                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            className='w-full'
                        >
                            Upload files
                            <VisuallyHiddenInput
                                name='image'
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                        <Button type='submit' variant="contained">Sign Up</Button>
                        <div className=' w-full self-start flex justify-between gap-4'>
                            <Link className='text-blue-500 text-decoration-line: underline' to={'/'}>Login</Link>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup
