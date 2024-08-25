import { useParams } from "react-router-dom";
import { Container, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Items from "./Items";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function SearchItem() {
    const [items, setItems] = useState([]);
    const { query: searchQuery } = useParams();
    const [value, setValue] = useState(searchQuery || "");

    useEffect(() => {
        const q = query(collection(db, 'items'), where("name", ">=", value.toLowerCase()), where("name", "<=", value.toLowerCase() + "\uf8ff"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (value.trim() === "") {
                setItems([]);
                return;
            }
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsData);
        })

        return unsubscribe
    }, [value]);

    const searchWithQuery = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
    };

    return (
        <Container>
            <TextField
                variant="standard"
                fullWidth
                sx={{ mt: 10 }}
                inputProps={{ style: { textAlign: 'center', fontSize: '30px' } }}
                value={value}
                onChange={searchWithQuery}
            />
            {items.length ? <Items items={items} /> :
                value && <Typography sx={{ fontSize: '30px', color: 'red', textAlign: 'center' }}>No Item Found</Typography>
            }

        </Container>
    );
}

export default SearchItem;
