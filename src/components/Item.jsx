import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Box, Card, CardHeader, CardMedia, CardContent, Typography, Avatar, Button } from '@mui/material';
import { getDoc, doc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import NavBar from "./NavBar";
import UserDetails from "./UserDetails";

function Item({ dark, setDark, logOut }) {
    const { id: itemId } = useParams();
    const [item, setItem] = useState(null);
    const [sold, setSold] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            const docRef = doc(db, 'items', itemId);
            const snapshot = await getDoc(docRef);
            setItem(snapshot.data());
            setSold(snapshot.data()?.sold);
        };
        fetchItem();
    }, [itemId]);

    if (!itemId) {
        window.location.href = '/';
    }

    async function placeOrder() {
        const docRef = doc(db, 'items', itemId);
        await updateDoc(docRef, {
            sold: true
        });
        setSold(true);
        await addDoc(collection(db, 'orders'), {
            item: itemId,
            owner: item.owner,
            buyer: auth.currentUser.uid,
            date: new Date().toISOString()
        });
    }
    async function deleteItem() {
        const confirm = window.confirm('Are you sure you want to delete it?')
        console.log(confirm)
        if (confirm) {
            await deleteDoc(doc(db, 'items', itemId))
            window.location.href = '/home'
        }
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
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ margin: '20px', width: '300px', height: '50px' }}
                                onClick={placeOrder}
                                disabled={sold || item.owner == auth.currentUser.uid}
                            >
                                {sold ? "Sold" : "Buy Now"}
                            </Button>
                            {auth.currentUser.uid == item.owner && !sold &&
                                <Button
                                    variant="contained"
                                    style={{ margin: '20px', width: '300px', height: '50px', backgroundColor: 'red' }}
                                    onClick={deleteItem}
                                >
                                    Delete
                                </Button>
                            }
                        </CardContent>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar alt={item.owner_name} src={item.owner_img} />
                                }
                                title={item.owner_name || 'NULL'}
                            />
                            <Box style={{ padding: '16px' }}>
                                <Typography color='secondary'>uploaded on: {item.date.split('T')[0]} at {item.date.split('T')[1].split('.')[0]}</Typography>
                                <Typography variant="h6" color="primary">
                                    Owner Details:
                                </Typography>
                                <UserDetails useruid={item.owner} />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </>
        );
    }

    return null;
}

export default Item;
