import { useParams } from "react-router-dom";
import { Container, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Items from "./Items";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function SearchItem() {
    const [items, setItems] = useState([]);
    const { query: searchQuery } = useParams();
    const [value, setValue] = useState(searchQuery || "");

    useEffect(() => {
        const fetchItems = async () => {
            if (value.trim() === "") {
                setItems([]);
                return;
            }

            const q = query(collection(db, 'items'), where("name", ">=", value.toLowerCase()), where("name", "<=", value.toLowerCase() + "\uf8ff"));

            const querySnapshot = await getDocs(q);
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsData);
        };

        fetchItems();
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
            <Items items={items} />
        </Container>
    );
}

export default SearchItem;
