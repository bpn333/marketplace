import { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
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
    async function userAddressNotSet() {
        const q = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            console.log(querySnapshot.docs[0].data())
            return true;
        }
        return false;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isUserSet = await userAddressNotSet()
        if (!isUserSet) {
            alert('set your address before adding item')
            window.location.href = '/profile'
            return
        }
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
            const targetWidth = 720;
            const targetHeight = 480;
            const targetAspectRatio = targetWidth / targetHeight;
            const imgAspectRatio = img.width / img.height;
            let cropWidth, cropHeight, offsetX, offsetY;
            if (imgAspectRatio > targetAspectRatio) {
                cropHeight = img.height;
                cropWidth = img.height * targetAspectRatio;
                offsetX = (img.width - cropWidth) / 2;
                offsetY = 0;
            } else {
                cropWidth = img.width;
                cropHeight = img.width / targetAspectRatio;
                offsetX = 0;
                offsetY = (img.height - cropHeight) / 2;
            }
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);
            const compressedImageData = canvas.toDataURL('image/jpeg', 0.8);
            const base64Response = await fetch(compressedImageData);
            const blob = await base64Response.blob();
            // compression finish

            const storage = getStorage();
            const storageRef = ref(storage, `images/${photo.name}`);
            await uploadBytes(storageRef, blob);

            const photoURL = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, 'items'), {
                name: name.toLowerCase(),
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
                        multiline
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
