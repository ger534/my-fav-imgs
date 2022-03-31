import { useState } from "react";

/* components */
import Login from "./components/login/login";
import SignUp from "./components/signUp/signUp";
import Appbar from './components/appbar/appbar';
import Images from './components/images/images';

/* firebase */
import { initializeApp } from "firebase/app";
import app from './helpers/firebase/firebase';

/* routing */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* styling */
import './App.css';
import { Container } from "@mui/material";

function App() {

  //firebase
  initializeApp(app)

  /* authentication */
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {});

  const onUserChange = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(JSON.parse(localStorage.getItem('user')))
  };

  return (
    <>
      <Container id="app-container">
        <Router>
          <Appbar />


          <Routes>
            {/* auth paths */}
            <Route path="/login" element={<Login onUserChange={onUserChange} />} />
            <Route path="/signup" element={<SignUp onUserChange={onUserChange} />} />
            <Route path="/" element={<Images user={user} />} />
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
