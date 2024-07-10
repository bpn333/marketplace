import NavBar from "./NavBar";
import { auth, db } from "../firebase/firebase";
import { Navigate } from "react-router-dom";
import Items from "./Items";
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from "react";
function Home({ dark, setDark, logOut }) {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchItems = async () => {
            const q = query(collection(db, 'items'), orderBy('date', 'desc'), limit(15))
            const querySnapshot = await getDocs(q);
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            const filteredItems = itemsData.filter(item =>
                !(item.owner == auth.currentUser.uid || item.sold)
            );
            setItems(filteredItems);
        };

        fetchItems();
    }, []);
    if (!auth.currentUser) {
        return <Navigate to="/" state={{ from: '/home' }} />
    }
    return (
        <>
            <NavBar dark={dark} setDark={setDark} user={auth.currentUser} logOut={logOut} />
            <Items items={items} />
        </>
    )
}
export default Home