import React, { useState } from 'react';

/* third party packages */
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

/* icons */
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LanguageIcon from '@mui/icons-material/Language';

/* components */
import Modal from '../modal/modal';

/* routing */
import { useNavigate } from "react-router-dom";

export default function Appbar(props) {

    const contextUser = JSON.parse(sessionStorage.getItem('user'));

    const navigate = useNavigate();

    const matches = useMediaQuery('(min-width:1200px)');

    //WIP language dialog
    const [openLanWIP, setOpenLanWIP] = useState(false);

    //language
    const { i18n } = useTranslation('common');

    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const handleLanguageOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };
    const handleLanguageClose = (lan, event) => {
        if (typeof lan === 'string') {
            if (lan.toString() !== 'es') {
                //open WIP modal here
                setOpenLanWIP(true)
            } else {
                i18n.changeLanguage(lan.toString())
            }
        }
        setLanguageAnchorEl(null);
    };

    return (
        <>
            <Modal
                open={openLanWIP} setOpen={setOpenLanWIP}
                description={<span style={{ fontSize: "30px", fontFamily: "OpenSans", fontWeight: "bold" }}>Contenido en desarrollo</span>}
                //description={<h1>Contenido en desarrollo</h1>}
                actions={<Button onClick={() => { setOpenLanWIP(false) }} color="primary" autoFocus>Ok</Button>} />

            <AppBar position="fixed" style={{ backgroundColor: "#ff4702" }}>
                <Toolbar>

                    {/* logo */}
                    <Typography component="h1" variant="h6" color="inherit" noWrap>
                        My favorite images
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* authentication */}
                    <IconButton color="inherit" onClick={() => { navigate("/login") }}>
                        <Badge color="secondary" >
                            {contextUser ? <PersonIcon /> : <PersonOutlineIcon />}
                        </Badge>
                    </IconButton>

                    {/* language */}
                    <IconButton color="inherit" onClick={handleLanguageOpen}>
                        <Badge color="secondary" >
                            <LanguageIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        id="language-menu"
                        anchorEl={languageAnchorEl}
                        keepMounted
                        open={Boolean(languageAnchorEl)}
                        onClose={handleLanguageClose}
                    >
                        {i18n.languages.map((lan) =>
                            <MenuItem key={lan} onClick={(event) => handleLanguageClose(lan, event)} >{lan}</MenuItem>
                        )}
                    </Menu>

                </Toolbar>
            </AppBar>
        </>
    );
}