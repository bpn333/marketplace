import { useState } from "react";
import {
    IconButton, Drawer, List,
    ListItemButton,
    ListItemText, ListItemIcon,
    ListItem, Typography, TextField,
    AppBar, Toolbar, Avatar, Menu, MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from '@mui/icons-material/GitHub';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PublishIcon from '@mui/icons-material/Publish';

function Drawer_menu({ dark, setDark }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [query, setQuery] = useState('')
    function toggleDrawer() {
        setDrawerOpen(!drawerOpen);
    };
    function handleClose() {
        setDrawerOpen(false);
    };
    function lightModeOn() {
        setDark(false);
        document.cookie = "color=light;max-age=100000";
        handleClose();
    }
    function darkModeOn() {
        setDark(true);
        document.cookie = "color=dark;max-age=100000";
        handleClose();
    }
    return (
        <>
            <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon sx={{ height: '50', width: '50' }} />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={handleClose}>
                <List sx={{ width: 250 }}>

                    <ListItemButton onClick={() => {
                        handleClose();
                        window.location.href = "/";
                    }}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>

                    <ListItem>
                        <TextField variant='standard' value={query} onChange={(e) => setQuery(e.target.value)} />
                        <ListItemButton onClick={() => window.location.href = '/search/' + query} disabled={!query}><SearchIcon /></ListItemButton>
                    </ListItem>

                    <ListItemButton onClick={dark ? lightModeOn : darkModeOn}>
                        <ListItemIcon>{dark ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
                        <ListItemText primary={dark ? "Light Mode" : "Dark Mode"} />
                    </ListItemButton>

                    <ListItemButton onClick={() => {
                        window.open('https://github.com/bpn333');
                        handleClose()
                    }}>
                        <ListItemIcon>
                            <GitHubIcon />
                        </ListItemIcon>
                        <ListItemText primary="@bpn333" />
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    )
}

function UserIcon({ user, logOut }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userLogout = () => {
        handleClose();
        logOut();
    }
    return (
        <>
            <Avatar src={user.photoURL} onClick={handleClick} sx={{
                cursor: 'pointer',
                height: 50,
                width: 50
            }} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    window.location.href = '/search'
                }}>
                    <SearchIcon sx={{ mr: 3 }} /><Typography variant="h6">Search</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    window.location.href = '/add-item'
                }}>
                    <PublishIcon sx={{ mr: 3 }} /><Typography variant="h6">Sell</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    window.location.href = '/profile'
                }}>
                    <AccountCircleIcon sx={{ mr: 3 }} /><Typography variant="h6">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={userLogout}>
                    <LogoutIcon sx={{ mr: 3 }} /><Typography variant="h6">Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

function NavBar({ dark, setDark, user, logOut }) {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Drawer_menu dark={dark} setDark={setDark} />
                <Typography variant="h3" sx={{ userSelect: 'none' }}>Marketplace</Typography>
                <UserIcon user={user} logOut={logOut} />
            </Toolbar>
        </AppBar>
    )
}

export default NavBar