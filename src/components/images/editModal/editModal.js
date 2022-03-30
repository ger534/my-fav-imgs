import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, ImageListItemBar, TextField, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';


import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

//firestore
import { collection, deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import LoadingHOC from '../../loading/LoadingHOC';

const Input = styled('input')({
    display: 'none',
});

function EditModal({ selectedImage, editionFlag, setEditionFlag, ...props }) {

    const [newImage, setNewImage] = useState("");
    const [newImagePreview, setNewImagePreview] = useState(undefined)

    const [title, setTitle] = useState("");

    const { loading, setLoading } = props;

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

    const uploadImage = () => {
        convertToBase64(newImage).then(img => {
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
        if (!newImage) {
            setNewImagePreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(newImage)
        setNewImagePreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [newImage])

    useEffect(() => {
        setTitle(selectedImage.title)
    }, [selectedImage])

    const editImage = () => {

        if(newImagePreview){
            setLoading(true)
            convertToBase64(newImage).then(img => {
                setDoc(doc(db, "images", selectedImage.id), {
                    title: title,
                    image: img,
                    user: props.user.uid
                }).then(() => {
                    alert(`Imagen guardada en la DB.`)
                    setLoading(false)
                    navigate(0)
                }).catch((error)=>{
                    if(error == "FirebaseError: [code=invalid-argument]: The value of property \"image\" is longer than 1048487 bytes."){
                        alert(`La imagen es demasiado grande, por favor seleccione otra.`)
                        setLoading(false)
                    }else{
                        alert(`${error}`)
                        setLoading(false)
                    }
                })
            })
        }else{
            setLoading(true)
            setDoc(doc(db, "images", selectedImage.id), {
                title: title,
                image: selectedImage.image,
                user: props.user.uid
            }).then(() => {
                alert(`Imagen editada en la DB.`)
                setLoading(false)
                navigate(0)
            })
        }
    }

    return (
        <>
            <br></br>

            {selectedImage && <Dialog
                open={editionFlag}
                onClose={setEditionFlag}
            >
                <DialogContent>
                    <Box style={{ textAlign: "center"}}
                    >
                        <TextField value={title} onChange={(e) => { setTitle(e.target.value) }} fullWidth></TextField> <br></br>
                        {!newImagePreview ? <img
                            src={selectedImage.image}
                            srcSet={selectedImage.image}
                            alt={selectedImage.title}
                            loading="lazy"
                            width={"100%"}
                        /> : <img src={newImagePreview} width={"100%"} />} <br></br>
                        <label htmlFor="contained-button-file-edition">
                            <Input accept="image/*" id="contained-button-file-edition" type="file" onChange={(e) => { setNewImage(e.target.files[0]) }} />
                            <Button variant="contained" component="span" style={{ backgroundColor: "#ffdacc", color: "#ff4702" }}>
                                <PhotoCameraIcon /> Cambiar imagen
                            </Button>
                        </label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={editImage} style={{ backgroundColor: "#ff4702" }}>Guardar cambio</Button>
                    <Button onClick={() => { setEditionFlag(false) }} color="error" autoFocus>Cancelar</Button>
                </DialogActions>
            </Dialog>}

        </>
    )
}
export default LoadingHOC(EditModal);