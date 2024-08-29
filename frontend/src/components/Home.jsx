    import React, { useEffect, useRef, useState } from 'react';
    import Navbar from './Navbar';
    import PostsSection from './PostsSection';
    import AddIcon from '@mui/icons-material/Add';
    import Box from '@mui/material/Box';
    import Modal from '@mui/material/Modal';
    import { styled } from '@mui/material/styles';
    import Button from '@mui/material/Button';
    import CloudUploadIcon from '@mui/icons-material/CloudUpload';
    import { TextField } from '@mui/material';
    import { storage } from '../utils/firebase';
    import { ref, uploadString, getDownloadURL } from 'firebase/storage';
    import toast, { Toaster } from 'react-hot-toast';
    import axios from 'axios';

    const Home = () => {
        const [posts, setPosts] = useState([]);

        useEffect(() => {
            axios.get('https://peerlink-hack-a-throne.vercel.app/viewpost').then((response) => {
                if (response.data.msg === 'Posts fetched successfully') {
                    console.log(response.data.data);
                    setPosts(response.data.data);
                }
            });
        }, []);

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
        const [form, setForm] = useState({});
        const [file, setFile] = useState(null);

        const handleFormChange = (event) => {
            setForm({
                ...form,
                [event.target.name]: event.target.value,
            });
        };

        const handleFormSubmit = async (event) => {
            console.log(file);

            const storageRef = ref(storage, `images/${Date.now()}.png`);
            const uploadResult = await uploadString(storageRef, file, 'data_url');
            const downloadURL = await getDownloadURL(uploadResult.ref);
            console.log(downloadURL);
            console.log(form.description);

            axios.post(`https://peerlink-hack-a-throne.vercel.app/${localStorage.getItem('id')}/addpost`, {
                img: downloadURL.toString(),
                desc: form.description,
            }).then((response) => {
                if (response.data.msg === 'post added successfully') {
                    toast.success('Post added successfully');
                    handleClose();
                }
            });
        };

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
                <div className='h-full bg-gray-100 flex flex-col items-center gap-4'>
                    <Navbar />
                    <div>
                        <button onClick={handleOpen} className='bg-blue-500 px-4 py-2 text-white rounded-md flex items-center gap-2 hover:bg-blue-600'>
                            Add Post <AddIcon />
                        </button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <div className='flex flex-col gap-8'>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
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
                                    <TextField type='text' value={form.description || ''} name='description' required id="outlined-basic" label="Description" variant="outlined" className='w-full' onChange={handleFormChange} />
                                    <Button onClick={handleFormSubmit} type='submit' variant="contained">Add Post</Button>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                    <PostsSection posts={posts} />
                </div>
            </>
        );
    };

    export default Home;
