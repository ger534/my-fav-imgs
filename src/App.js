import './App.css';

import { useState } from "react";

/* third party packages */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* components */
import Login from "./components/login/login";
import SignUp from "./components/signUp/signUp";
import Appbar from './components/appbar/appbar';
import Images from './components/images/images';

function App() {

  /* authentication */
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {});

  const onUserChange = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(JSON.parse(localStorage.getItem('user')))
  };
  
  console.log("app, ", user)

  return (
    <>
    <br></br><br></br><br></br>
        <Router>
          <Appbar/>


          <Routes>
            {/* auth paths */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/" element={<Images user={user}/>} />
          </Routes>
        </Router>
    </>
  );
}

export default App;
