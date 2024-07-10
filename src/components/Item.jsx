import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Box, CardHeader, CardMedia, CardContent, Typography, Avatar, Button } from '@mui/material';
import { getDoc, doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import NavBar from "./NavBar";
import UserDetails from "./UserDetails"

function Item({ dark, setDark, logOut }) {
    const { id: itemId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            const docRef = doc(db, 'items', itemId);
            const snapshot = await getDoc(docRef);
            setItem(snapshot.data());
        };
        fetchItem();
    }, [itemId]);

    if (!itemId) {
        window.location.href = '/';
    }
    async function placeOrder() {
        if (item.owner == auth.currentUser.uid) {
            alert('cant place order for own item')
            return
        }
        if (item.sold) {
            alert('item already sold')
            return
        }
        const docRef = doc(db, 'items', itemId);
        await updateDoc(docRef, {
            sold: true
        })
        await addDoc(collection(db, 'orders'), {
            item: itemId,
            owner: item.owner,
            buyer: auth.currentUser.uid,
            date: new Date().toISOString()
        });
    }
    if (item) {
        return (
            <>
                <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />

                <Grid container spacing={2} style={{ maxWidth: 1200, margin: '20px auto' }}>
                    <Grid item xs={12} md={8}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={item.photo}
                            alt={item.name}
                            style={{ objectFit: 'contain', borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" component="p">
                                {item.description}
                            </Typography>
                            <Typography variant="h6" color="lime" component="p" style={{ marginTop: '20px' }}>
                                Price: {item.price} /-
                            </Typography>
                            <Button variant="contained" color="primary" style={{ marginTop: '20px', backgroundColor: item.sold ? 'grey' : 'inherit' }} onClick={placeOrder}>
                                Buy Now
                            </Button>
                        </CardContent>
                    </Grid>
                    <Grid item xs={12}>
                        <CardHeader
                            avatar={
                                <Avatar alt={item.owner_name} src={item.owner_img} />
                            }
                            title={item.owner_name || 'NULL'}
                        />
                        <Box sx={{ ml: 3 }}>
                            <Typography color='pink'>Owner Details:</Typography>
                            <UserDetails useruid={item.owner} />
                        </Box>
                    </Grid>
                </Grid>
            </>
        );
    }

    return null;
}

export default Item;