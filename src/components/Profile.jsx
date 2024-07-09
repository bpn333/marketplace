import NavBar from "./NavBar";
import { Navigate } from "react-router-dom";
import { Card, Grid, Box, CardContent, Avatar, Typography, Button } from "@mui/material";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Items from "./Items";
function Profile({ dark, setDark, logOut }) {
    const [items, setItems] = useState([]);
    if (!auth.currentUser) {
        return <Navigate to="/" state={{ from: '/profile' }} />
    }
    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'items'), where('owner', '==', auth.currentUser.uid));
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsData);
        };

        fetchItems();
    }, []);
    return (
        <>
            <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={10} sm={4} display="flex" justifyContent="center">
                            <Avatar
                                src={auth.currentUser.photoURL}
                                sx={{ width: 120, height: 120 }}
                            />
                        </Grid>
                        <Grid item xs={10} sm={8}>
                            <Typography variant="h5" gutterBottom>
                                {auth.currentUser.displayName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {auth.currentUser.email}
                            </Typography>
                            <Box mt={2}>
                                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                                    Edit Profile
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={logOut}>
                                    Logout
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Items items={items} />
        </>
    )
}
export default Profile