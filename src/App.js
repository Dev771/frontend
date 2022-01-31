import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './code/Home';
import NavBar from './components/NavBar/NavBar';
import Form from './components/Form/Form';
import Profile from './components/Profile/Profile';

const App = () => {
    return (
        <BrowserRouter>
        <NavBar />
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/Form' exact element={<Form />} />
                <Route path='/Profile' exact element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
