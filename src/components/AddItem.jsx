import { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Container, Typography, CircularProgress, Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import NavBar from './NavBar';
const AddItem = ({ dark, setDark, logOut }) => {
    const user = auth.currentUser
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            //below is only for image compression
            let img = new Image();
            const loadImage = (url) => {
                return new Promise((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = url;
                });
            };
            await loadImage(URL.createObjectURL(photo));
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let ratio = 1;
            if (img.width > 720 || img.height > 480) {
                ratio = Math.max(img.width / 720, img.height / 480);
            }
            canvas.width = Math.floor(img.width / ratio);
            canvas.height = Math.floor(img.height / ratio);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedImageData = canvas.toDataURL('image/jpeg', 0.8);
            const base64Response = await fetch(compressedImageData);
            const blob = await base64Response.blob();
            // compression finish

            const storage = getStorage();
            const storageRef = ref(storage, `images/${photo.name}`);
            await uploadBytes(storageRef, blob);

            const photoURL = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, 'items'), {
                name,
                price,
                description,
                owner: user.uid,
                owner_img: user.photoURL,
                owner_name: user.displayName,
                photo: photoURL,
                date: new Date().toISOString(),
            });

            setName('');
            setPrice('');
            setDescription('');
            setPhoto(null);
        } catch (e) {
            console.error('Error adding document: ', e);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };
    if (!user) {
        return <Navigate to="/" state={{ from: '/add-item' }} />
    }
    return (
        <>
            <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />
            <Container sx={{
                p: 3
            }}>
                <Typography variant="h4" gutterBottom>
                    Add New Item
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Price"
                        type='number'
                        value={price}
                        error={!price ? false : price < 0}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        p: 2
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ marginTop: '16px', marginBottom: '16px' }}
                            required
                        />

                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Add Item'}
                        </Button>
                    </Box>
                </form>
            </Container>
        </>
    );
};

export default AddItem;
