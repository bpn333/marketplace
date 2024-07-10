import { useState, useEffect } from "react";
import { auth } from "./firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import GoogleButton from "react-google-button";
import { Navigate, useLocation } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Checkbox, FormControlLabel } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
function SignIn() {
    const [newUser, setNewUser] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [cpass, setCPass] = useState('')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const from = location?.state?.from ? location.state.from : '/home';
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            console.log(user);
        });
        return () => unsubscribe();
    }, []);
    function signGoogle() {
        const googleAuthProvider = new GoogleAuthProvider()
        signInWithPopup(auth, googleAuthProvider);
    }
    const signEmail = (e) => {
        e.preventDefault()
        if (newUser) {
            createUserWithEmailAndPassword(auth, email, pass)
                .catch((error) => {
                    console.error('Error signing in with email:', error.code, error.message);
                });
        }
        else if (!newUser) {
            signInWithEmailAndPassword(auth, email, pass)
                .catch((error) => {
                    console.error('Error signing in with email:', error.code, error.message);
                });
        }
    };
    if (user) {
        return <Navigate to={from} />
    }
    function validate() {
        if (newUser) {
            return !(cpass == pass && cpass.length >= 6 && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))
        }
        else if (!newUser) {
            return !(pass.length >= 6 && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))
        }
    }
    return (
        <>
            <>
                {loading ? <Box sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}><img src="./loading.svg" /></Box> :
                    <form onSubmit={signEmail}>
                        <Container sx={{
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h1" color='secondary' sx={{ mb: 2 }}>Marketplace</Typography>

                            <TextField
                                label="email"
                                value={email}
                                error={!email ? false : !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ m: 1, minWidth: 300 }}
                            />
                            <TextField
                                label="password"
                                type="password"
                                value={pass}
                                error={!pass ? false : pass.length < 6}
                                onChange={(e) => setPass(e.target.value)}
                                sx={{ m: 1, minWidth: 300 }}
                                autoComplete="on"
                            />
                            {newUser && <TextField
                                label="confirm password"
                                type="password"
                                value={cpass}
                                error={!cpass ? false : cpass != pass}
                                onChange={(e) => setCPass(e.target.value)}
                                sx={{ m: 1, minWidth: 300 }}
                                autoComplete="on"
                            />}
                            <FormControlLabel control={<Checkbox checked={newUser} onClick={() => setNewUser(!newUser)} />} label='New User' />
                            <Button type="submit" variant="outlined" disabled={validate()}
                                sx={{
                                    m: 2, p: 1
                                }}
                            >
                                <EmailIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">{newUser ? <>Sign up with email</> : <>Sign in with email</>}</Typography>
                            </Button>
                            <GoogleButton onClick={signGoogle} />
                        </Container>
                    </form>
                }
            </>
        </>
    )
}
export default SignIn;