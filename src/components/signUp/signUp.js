import { useState } from "react";

//firebase authentication
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

/* third party packages */
import { Button, Container, Input, useMediaQuery } from '@mui/material';

//routing
import { useNavigate } from "react-router-dom";

/* style */
import './signUp.css'

function SignUp(props) {

    const navigate = useNavigate();

    const matches = useMediaQuery('(min-width:1200px)');

    const auth = getAuth();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("user", user)
                sessionStorage.setItem('user', JSON.stringify(user));
                navigate("/login")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("errorCode", errorCode)
                console.log("errorMessage", errorMessage)
                if (errorCode === "auth/missing-email") {
                    setError("Ingrese una dirección electrónica válida.")
                } else if (errorCode === "auth/internal-error") {
                    setError("La contraseña no es válida.")
                } else if (errorCode === "auth/invalid-email") {
                    setError("La dirección de correo electrónico no es válida.")
                } else {
                    setError("Ha ocurrido un error.")
                }
            });
    }

    return (
        <>
            <br></br>
            <Container style={matches ? { width: "50%" } : { height: "100vh" }}>
                <h1 style={{ textAlign: "center" }}>Registrarse</h1>
                <Input
                    style={{ backgroundColor: "white" }}
                    placeholder="Email"
                    label="Email"
                    id="email"
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    fullWidth
                />
                <Input
                    style={{ backgroundColor: "white" }}
                    placeholder="Password"
                    label="Password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    fullWidth
                />
                <p>{error}</p>
                <Button fullWidth variant="contained" color="primary" onClick={signUp} disabled={!validateEmail(email)}>Registrarse</Button>
            </Container>
        </>
    )
}
export default SignUp;


