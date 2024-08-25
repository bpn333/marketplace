import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Box, Card, CardHeader, CardMedia, CardContent, Typography, Avatar, Button, Container, CircularProgress } from '@mui/material';
import { doc, addDoc, collection, updateDoc, deleteDoc, onSnapshot, deleteField, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import NavBar from "./NavBar";
import UserDetails from "./UserDetails";
import QRCode from "react-qr-code";

function Item({ dark, setDark, logOut }) {
    const { id: itemId } = useParams();
    const [item, setItem] = useState(null);
    const [sold, setSold] = useState(false);
    const [ordering, setOrdering] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isRecentBuyer, setIsRecentBuyer] = useState(false)

    useEffect(() => {
        const docRef = doc(db, 'items', itemId);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setItem(snapshot.data());
            setSold(snapshot.data()?.sold);
            setLoading(false)
        });
        return unsubscribe
    }, []);
    useEffect(() => {
        const verifyAuthenticity = async () => {
            const q = query(collection(db, 'orders'), where('item', '==', itemId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const firstDoc = querySnapshot.docs[0];
                const data = firstDoc.data();
                if (data.buyer === auth.currentUser.uid) {
                    setIsRecentBuyer(true)
                    return
                }
            }
            setIsRecentBuyer(false)
        };
        if (item && sold && ((new Date() - new Date(item.sold_on)) / (1000 * 60 * 60 * 24) < 1)) {
            verifyAuthenticity();
        }
    }, [sold]);

    if (!itemId) {
        window.location.href = '/';
    }
    if (!auth.currentUser) {
        return <Navigate to="/" state={{ from: '/item/' + itemId }} />
    }
    function confirmPlaceOrder() {
        const confirm = window.confirm('Are you sure you want to order ' + item.name + ' for $' + item.price + ' ?');
        if (confirm) {
            setOrdering(true)
        }
    }
    async function placeOrder() {
        const docRef = doc(db, 'items', itemId);
        await updateDoc(docRef, {
            sold: true,
            sold_on: new Date().toISOString()
        }).then(async () => {
            await addDoc(collection(db, 'orders'), {
                item: itemId,
                owner: item.owner,
                buyer: auth.currentUser.uid,
                date: new Date().toISOString()
            });
            setSold(true);
            alert('Order placed sucessfully. Your item will be delivered within 7 days. Our representative will contact your email for further info.')
            setIsRecentBuyer(true)
        }).catch((error) => {
            alert(error.message)
        })
    }
    async function deleteItem() {
        const confirm = window.confirm('Are you sure you want to delete it?')
        if (confirm) {
            await deleteDoc(doc(db, 'items', itemId))
            window.location.href = '/home'
        }
    }
    async function refundItem() {
        const confirm = window.confirm('Are you sure you want to refund it?');
        if (confirm) {
            await updateDoc(doc(db, 'items', itemId), {
                sold: deleteField(),
                sold_on: deleteField()
            }).then(async () => {
                const q = query(collection(db, 'orders'), where('item', '==', itemId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (docSnapshot) => {
                    await deleteDoc(doc(db, 'orders', docSnapshot.id));
                });
                setIsRecentBuyer(false)
                alert("Refund request received. Your money will be returned in 3 business days. Contact to our mail for further support.")
            })
        }
    }

    if (ordering) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography color='primary' sx={{ fontSize: { xs: '40px', md: '70px' } }}>Payment Portal</Typography>
                <Box sx={{ p: 1, border: '3px solid #333' }}>
                    <QRCode value={`upi://pay?pa=bipinlamsal2004@oksbi&am=${item.price}&tr=${itemId}`} onClick={() => window.open(`upi://pay?pa=bipinlamsal2004@oksbi&am=${item.price}&tr=${itemId}`, '_blank')} />
                </Box>
                <Typography> scan the QR ☝️ and complete payment</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 3 }}
                    onClick={() => {
                        setOrdering(false)
                        placeOrder()
                    }}
                >
                    Done
                </Button>
            </Container>
        )
    }
    if (item) {
        return (
            <>
                <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />
                <Grid container spacing={2} sx={{ maxWidth: { xs: '100%', lg: 1300 }, m: '20px auto' }}>
                    <Grid item xs={11} md={7}>
                        <CardMedia
                            component="img"
                            image={item.photo}
                            alt={item.name}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={11} md={4}>
                        <CardContent>
                            <Typography variant="h4" component="h2" sx={{ fontWeight: '1000', textTransform: 'capitalize' }} gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" component="p" sx={{ fontFamily: 'cursive' }}>
                                {item.description}
                            </Typography>
                            <Typography variant="h6" color="lime" component="p" style={{ marginTop: '20px' }}>
                                ${item.price}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '10px', marginRight: '10px', height: '50px', fontFamily: 'fantasy', letterSpacing: '2px' }}
                                onClick={confirmPlaceOrder}
                                disabled={sold || item.owner == auth.currentUser.uid}
                                fullWidth
                            >
                                {sold ?
                                    isRecentBuyer ? "Processing" : "Sold"
                                    :
                                    "Buy Now"}
                            </Button>
                            {auth.currentUser.uid == item.owner && !sold &&
                                <Button
                                    variant="contained"
                                    style={{ marginTop: '10px', marginRight: '10px', height: '50px', backgroundColor: 'red', fontFamily: 'fantasy', letterSpacing: '2px' }}
                                    onClick={deleteItem}
                                    fullWidth
                                >
                                    Delete
                                </Button>
                            }
                            {isRecentBuyer &&
                                <Button
                                    variant="contained"
                                    style={{ marginTop: '10px', marginRight: '10px', height: '50px', backgroundColor: 'red', fontFamily: 'fantasy', letterSpacing: '2px' }}
                                    onClick={refundItem}
                                    fullWidth
                                >
                                    Refund
                                </Button>
                            }
                        </CardContent>
                    </Grid>
                    <Grid item xs={11}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar alt={item.owner_name} src={item.owner_img} />
                                }
                                title={item.owner_name || 'NULL'}
                            />
                            <Box style={{ padding: '16px' }}>
                                <Typography color='secondary'>Uploaded On: {item.date.split('T')[0]} at {item.date.split('T')[1].split('.')[0]}</Typography>
                                {item.sold_on && <Typography color='secondary' sx={{ color: 'red' }}>Sold On: {item.sold_on.split('T')[0]} at {item.sold_on.split('T')[1].split('.')[0]}</Typography>}
                                <Typography variant="h6" color="primary">
                                    Owner Details:
                                </Typography>
                                <UserDetails useruid={item.owner} />
                            </Box>
                        </Card>
                    </Grid>
                </Grid >
            </>
        );
    }

    return (
        <>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                }}
            >
                {loading ? <CircularProgress /> : <Typography color="secondary" sx={{ fontSize: { xs: '40px', md: '70px' } }}> 😔 ITEM NOT FOUND 😔</Typography>}
            </Container>
        </>
    );
}

export default Item;
