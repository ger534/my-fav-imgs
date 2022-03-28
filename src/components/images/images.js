import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, ImageListItemBar, TextField, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';

import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

//firestore
import { collection, deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import Modal from '../modal/modal';
import { useNavigate } from 'react-router-dom';

function Images(props) {

    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    const [images, setImages] = useState([]);

    const [title, setTitle] = useState("");

    const matches = useMediaQuery('(min-width:700px)');

    const navigate = useNavigate();

    const db = getFirestore();

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const getAllImagesByUser = () => {
        const q = query(collection(db, "images"), where("user", "==", props.user.uid));
        getDocs(q).then(snapshot => {
            if (snapshot) {
                let data = []
                console.log("snapshot: ", snapshot);
                //console.log("images: ", snapshot.data());
                snapshot.forEach((doc) => {
                    console.log("doc.id", doc.id)
                    data.push({ id: doc.id, ...doc.data() })
                })
                setImages([...data])
            }
        })
    }

    const uploadImage = () => {
        console.log("image, ", image)
        convertToBase64(image).then(img => {
            setDoc(doc(collection(db, "images")), {
                title: title,
                image: img,
                user: props.user.uid
            }).then(() => {
                alert(`Imagen guardada en la DB.`)
                navigate(0)
            })
        })
    }

    useEffect(() => {

        console.log("props.user", props)
        if (props.user) {
            getAllImagesByUser()
        }
    }, [props.user])

    const removeImage = (img) => {
        if (window.confirm('¿desea borrar esta imagen?')) {
            console.log("remove", img)
            deleteDoc(doc(db, "images", img.id)).then(() => {
                alert(`Imagen borrada de la DB.`)
                getAllImagesByUser()
            });
        } else {
            return null
        }
    }

    //edition modal
    const [editionFlag, setEditionFlag] = useState(false);
    const editImage = (img) => {
        console.log("edit", img)
        deleteDoc(doc(db, "images", img.id)).then(() => alert(`Imagen editada en la DB.`));
    }

    return (
        <>
            <br></br>

            <Dialog
                open={editionFlag}
                onClose={setEditionFlag}
            >
                <DialogTitle>Title</DialogTitle>
                <DialogContent>
                    <Box
                        //display="flex"
                        //bgcolor="lightgreen"
                        alignItems="center"
                        justifyContent="center"
                    >
                        Title: <TextField onChange={(e) => { setTitle(e.target.value) }}></TextField> <br></br>
                        Image: <TextField type="file" onChange={(e) => { console.log(e.target.files[0]); setImage(e.target.files[0]) }}></TextField><br></br>
                    </Box>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={editImage} style={{ backgroundColor: "#ff4702" }}>Edit</Button>
                <Button onClick={() => { setEditionFlag(false) }} color="error" autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>

            <h1>Upload an image!</h1>

            <Box
                //display="flex"
                //bgcolor="lightgreen"
                alignItems="center"
                justifyContent="center"
            >
                Title: <TextField onChange={(e) => { setTitle(e.target.value) }}></TextField> <br></br>
                Image: <TextField type="file" onChange={(e) => { console.log(e.target.files[0]); setImage(e.target.files[0]) }}></TextField><br></br>
                <Button variant="contained" onClick={uploadImage} style={{ backgroundColor: "#ff4702" }}>Upload</Button>
            </Box>
            <p>Your current album has {images.length} pictures</p>

            {images.map((item) => (
                <ImageListItem key={item.img}>
                    <img
                        src={item.image}
                        srcSet={item.image}
                        alt={item.title}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={item.title}
                        actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                                onClick={() => setEditionFlag(true)}
                            >
                                <EditIcon />
                            </IconButton>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        title={item.title}
                        position="top"
                        actionIcon={
                            <IconButton
                                sx={{ color: 'white' }}
                                aria-label={`star ${item.title}`}
                                onClick={() => removeImage(item)}
                            >
                                <ClearIcon />
                            </IconButton>
                        }
                        actionPosition="right"
                    />
                </ImageListItem>
            ))}
        </>
    )
}
export default Images;


