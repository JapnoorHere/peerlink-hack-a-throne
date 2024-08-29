import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Quiz from './components/Quiz'
const App = () => {
  return (
    <BrowserRouter>
        <Routes>  
          <Route index path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
