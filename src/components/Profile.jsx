import NavBar from "./NavBar";
import { Navigate } from "react-router-dom";
import { Card, Grid, CardContent, Avatar, Typography } from "@mui/material";
import { auth, db } from "../firebase/firebase";
import { collection, where, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Items from "./Items";
import UserDetails from "./UserDetails";
function Profile({ dark, setDark, logOut }) {
    const [items, setItems] = useState([]);
    if (!auth.currentUser) {
        return <Navigate to="/" state={{ from: '/profile' }} />
    }
    useEffect(() => {
        const fetchItems = async () => {
            const q = query(collection(db, 'items'), where('owner', '==', auth.currentUser.uid))
            const querySnapshot = await getDocs(q);
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
            <Card sx={{ maxWidth: { xs: 300, md: 600 }, margin: 'auto', mt: 2, mb: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "center" }}>
                            <Avatar
                                src={auth.currentUser.photoURL}
                                sx={{ width: 120, height: 120 }}
                            />
                        </Grid>
                        <Grid item xs={10} sm={8}>
                            <Typography variant="h5" gutterBottom>
                                {auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email.split('@')[0]}
                            </Typography>
                            <UserDetails logOut={logOut} useruid={auth.currentUser.uid} email={auth.currentUser.email} editable={true} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Items items={items} />
        </>
    )
}
export default Profile