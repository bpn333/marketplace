import { CircularProgress, Typography, Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { where, collection, getDocs, addDoc, query, doc, setDoc } from "firebase/firestore";
function UserDetails({ useruid, logOut, email, editable }) {
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    //
    const [add, setAdd] = useState(false)
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [documentId, setDocumentId] = useState('')
    const addressAddingForm =
        <>
            <TextField
                label="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                fullWidth
                required
            />
            <Button variant="contained" color="primary" sx={{ mr: 2, mt: 1 }} onClick={submitDetail}>
                {documentId ? 'Set Address' : 'Add Address'}
            </Button>
        </>
    //
    useEffect(() => {
        const fetchItems = async () => {
            const q = query(collection(db, 'users'), where('uid', '==', useruid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setDocumentId(querySnapshot.docs[0].id)
                setDetails(querySnapshot.docs[0].data())
            }
            setLoading(false)
        };

        fetchItems();
    }, []);
    if (loading) {
        return <CircularProgress />
    }
    async function submitDetail() {
        const newData = {
            uid: useruid,
            email: email,
            street: street,
            city: city,
            state: state,
            country: country
        }
        if (!documentId) {
            await addDoc(collection(db, 'users'), newData);
        }
        if (documentId) {
            const docRef = doc(db, 'users', documentId)
            setDoc(docRef, newData)
        }
        setDetails(newData)
        setAdd(false)
    }
    function addUserDetails() {
        setAdd(true)
    }
    if (!details) {
        return (
            <>
                {add
                    ?
                    addressAddingForm
                    :
                    <>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            {email}
                        </Typography>
                        <Typography variant="body1" color="red" gutterBottom >
                            NO ADDRESS SET
                        </Typography>
                        {editable &&
                            <Box mt={2}>
                                <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={addUserDetails}>
                                    Add Address
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={logOut}>
                                    Logout
                                </Button>
                            </Box>
                        }

                    </>
                }
            </>
        )
    }
    return (
        <>
            {add ?
                addressAddingForm
                :
                <>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        {details.email}
                    </Typography>
                    <Typography color="orange">
                        Address:
                    </Typography>
                    <Typography color="text.secondary">
                        {details.street}
                    </Typography>
                    <Typography color="text.secondary">
                        {details.city}
                    </Typography>
                    <Typography color="text.secondary">
                        {details.state}
                    </Typography>
                    <Typography color="text.secondary">
                        {details.country}
                    </Typography>
                    {editable &&
                        <Box mt={2}>
                            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={addUserDetails}>
                                Edit Address
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={logOut}>
                                Logout
                            </Button>
                        </Box>
                    }
                </>
            }

        </>
    )
}

export default UserDetails