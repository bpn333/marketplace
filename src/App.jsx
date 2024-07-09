import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./components/Home";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignIn from "./SignIn";
import Profile from "./components/Profile";
import AddItem from "./components/AddItem";
import { auth } from "./firebase/firebase";
import SearchItem from "./components/SearchItem";

function logOut() {
  auth.signOut();
  window.location.href = '/'
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
function getDarkModeValue() {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cok_val = cookies[i].split('=');
    if (cok_val[0] === 'color') {
      return cok_val[1] === 'dark';
    }
  }
  return false;
}
function App() {
  const [dark, setDark] = useState(getDarkModeValue())
  return (
    <>
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/home' element={<Home dark={dark} setDark={setDark} logOut={logOut} />} />
            <Route path='/profile' element={<Profile dark={dark} setDark={setDark} logOut={logOut} />} />
            <Route path='/add-item' element={<AddItem dark={dark} setDark={setDark} logOut={logOut} />} />
            <Route path='/search/:query' element={<SearchItem />} />
            <Route path='/search/' element={<SearchItem />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
export default App;