import React, { Component } from "react"
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from "@mui/material/Dialog"

import "./loading.css"

class Loading extends Component {
    render() {
        return (<>
            <Dialog id="dialogLoading" open={true} color="secondary" aria-labelledby="dialog" fullWidth maxWidth="sm" style={{zIndex: 999999999 }} >
                <h1>Cargando...</h1>
                <CircularProgress size={60} disableShrink />
            </Dialog>
        </>)
    }
}

export default Loading;