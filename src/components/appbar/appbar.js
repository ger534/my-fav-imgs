import React, { } from 'react';

/* third party packages */
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

/* icons */
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

/* routing */
import { useNavigate } from "react-router-dom";

/* styling */
import "./appbar.css"

export default function Appbar(props) {

    const contextUser = JSON.parse(sessionStorage.getItem('user'));

    const navigate = useNavigate();

    return (
        <>
            <AppBar position="fixed" id="appbar">
                <Toolbar>

                    {/* logo */}
                    <Typography component="h1" variant="h6" color="inherit" noWrap>
                        My Favorite Images
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* authentication */}
                    <IconButton color="inherit" onClick={() => { navigate("/login") }}>
                        <Badge color="secondary" >
                            {contextUser ? <PersonIcon /> : <PersonOutlineIcon />}
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
}