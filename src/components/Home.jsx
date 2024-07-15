import NavBar from "./NavBar";
import { auth, db } from "../firebase/firebase";
import { Navigate } from "react-router-dom";
import Items from "./Items";
import { collection, limit, orderBy, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
function Home({ dark, setDark, logOut }) {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const q = query(collection(db, 'items'), orderBy('date', 'desc'), limit(15))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const itemsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            const filteredItems = itemsData.filter(item =>
                !(item.owner == auth.currentUser.uid || item.sold)
            );
            setItems(filteredItems);
        })
        return unsubscribe
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