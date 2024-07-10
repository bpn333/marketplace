import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { auth, db } from '../firebase/firebase';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import Items from './Items';
import NavBar from './NavBar';

const Stats = ({ dark, setDark, logOut }) => {
    const [itemsSold, setItemsSold] = useState([]);
    const [itemsBought, setItemsBought] = useState([]);
    useEffect(() => {
        const fetchItems = async () => {
            const q = query(collection(db, 'orders'));
            const querySnapshot = await getDocs(q);
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            const sold = itemsData?.filter(entry => entry.owner === auth.currentUser.uid);
            const bought = itemsData?.filter(entry => entry.buyer === auth.currentUser.uid);
            const soldItems = await Promise.all(
                sold.map(async (item) => {
                    const docRef = doc(db, 'items', item.item);
                    const snapshot = await getDoc(docRef);
                    return { id: item.item, ...snapshot.data() };
                })
            );

            const boughtItems = await Promise.all(
                bought.map(async (item) => {
                    const docRef = doc(db, 'items', item.item);
                    const snapshot = await getDoc(docRef);
                    return { id: item.item, ...snapshot.data() };
                })
            );
            setItemsSold(soldItems);
            setItemsBought(boughtItems);
        };
        fetchItems();
    }, []);

    return (
        <>
            <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />
            <Container sx={{ mt: 1 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Items Bought
                                </Typography>
                                <Items items={itemsBought} />
                                {itemsBought.length === 0 && (
                                    <Typography variant="body2">No items bought.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Items Sold
                                </Typography>
                                <Items items={itemsSold} />
                                {itemsSold.length === 0 && (
                                    <Typography variant="body2">No items sold.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Stats;
