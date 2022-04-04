import { useState } from "react";

/* components */
import Login from "./components/login/login";
import SignUp from "./components/signUp/signUp";
import Appbar from './components/appbar/appbar';
import Images from './components/images/images';

/* firebase */
import { initializeApp } from "firebase/app";
import app from './firebase';

/* routing */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* styling */
import './App.css';
import { Container } from "@mui/material";

function App() {

  //firebase
  initializeApp(app)

  /* authentication */
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : null);

  const onUserChange = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  };

  return (
    <>
      <Container id="app-container">
        <Router>
          <Appbar user={user}/>
          <Routes>
            {/* auth paths */}
            <Route path="/login" element={<Login user={user} onUserChange={onUserChange} />} />
            <Route path="/signup" element={<SignUp user={user} onUserChange={onUserChange} />} />
            <Route path="/" element={<Images user={user} />} />
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
