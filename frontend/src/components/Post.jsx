import React from 'react';
import profile from './assets/user.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';

const Post = ({ post, user, img }) => {
    const navigate = useNavigate();
    const onProfileClick = () => {
        navigate('/profile', { state: { user } });
    };

    return (
        <div className='w-[90%] rounded-lg flex flex-col bg-white p-6 gap-6 shadow-md hover:shadow-lg mb-6 transition-shadow duration-300 border border-gray-200'>
            <div className='flex items-center gap-4'>
                <img onClick={onProfileClick} className='h-12 w-12 rounded-full cursor-pointer hover:opacity-90 transition-opacity duration-200' src={img} alt="User Profile" />
                <p className='font-semibold text-lg text-[#14171A] hover:underline cursor-pointer' onClick={onProfileClick}>{user.name}</p>
            </div>
            <p className='text-gray-700'>
                {post.desc}
            </p>
            {post.img && (
                <img className='w-full max-h-[400px] object-cover rounded-lg' src={post.img} alt="Post" />
            )}
            <div className='flex gap-8 mt-4'>
                <div className='flex items-center gap-2 text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-200'>
                    <FavoriteBorderIcon />
                    <p>20</p>
                </div>
                <div className='flex items-center gap-2 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-200'>
                    <CommentIcon />
                    <p>20</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
