import { useEffect, useState } from "react";

/* third party packages */
import { Button, Container, Input, useMediaQuery } from '@mui/material';

/* routing */
import { useNavigate } from "react-router-dom";

/* styling */
import './login.css'

/* auth service */
import authenticationService from "../../services/authentication/authentication.service";

function Login(props) {

    const matches = useMediaQuery('(min-width:1200px)');

    const navigate = useNavigate();

    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const logout = () => {
        authenticationService.signOut(email, password);
        props.onUserChange(null);
        navigate(0)
    }

    const login = () => {
        authenticationService.signIn(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                props.onUserChange(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/user-not-found") {
                    setError("Este email no ha sido registrado.")
                } else if (errorCode === "auth/internal-error") {
                    setError("La contraseña no es válida.")
                } else if (errorCode === "auth/invalid-email") {
                    setError("La dirección de correo electrónico no es válida.")
                } else {
                    setError("Ha ocurrido un error " + errorMessage)
                }

            });

    }

    return (
        <>
            <br></br>
            {user ? <>
                <Container style={matches ? { width: "50%" } : { height: "100vh" }}>
                    <h1 id="title">Actualmente en sesión con el correo: {props.user.email}</h1>
                    <Button fullWidth variant="contained" id="main-option-button" onClick={() => navigate('/')}>Administrar mis imágenes</Button>
                    <Button fullWidth variant="contained" id="second-option-button" onClick={logout}>Cerrar sesión</Button>
                </Container>
            </> : <>
                <Container style={matches ? { width: "50%" } : { height: "100vh" }}>
                    <h1 id="title">Iniciar Sesión</h1>
                    <Input
                        id="email-input"
                        placeholder="Email"
                        label="Email"
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        value={email}
                        fullWidth
                    />
                    <br />
                    <Input
                        id="password-input"
                        placeholder="Password"
                        label="Password"
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        value={password}
                        fullWidth
                    />
                    <p>{error}</p>
                    <p>¿No tienes cuenta? <span id="register" onClick={() => { navigate("/signup") }}>regístrate</span></p>
                    <Button fullWidth variant="contained" id="main-option-button"  onClick={login}>Iniciar sesión</Button>
                    <Button fullWidth variant="contained" id="second-option-button" onClick={() => navigate('/')}>Volver</Button>
                </Container>
            </>}
        </>
    )
}
export default Login;


