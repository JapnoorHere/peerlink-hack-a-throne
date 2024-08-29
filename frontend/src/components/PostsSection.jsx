import React from 'react';
import Post from './Post';

const PostsSection = ({ posts }) => {
    return (
        <div className='flex flex-col items-center bg-gray-100 py-8'>
            {posts.map((user) => (
               user._id !== localStorage.getItem('id') &&  user.post?.map((post) => (
                   <Post key={post._id} img={user.img} post={post} user={user} />
                ))
            ))}
        </div>
    );
};

export default PostsSection;
