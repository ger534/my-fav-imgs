import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

/* routing */
import { useNavigate } from 'react-router-dom';

//HOC
import LoadingHOC from '../../loading/LoadingHOC';

/* styling */
import './editModal.css'

/* images service */
import imagesService from '../../../services/images/images.service';

const Input = styled('input')({
    display: 'none',
});

function EditModal({ selectedImage, editionFlag, setEditionFlag, ...props }) {

    const [newImage, setNewImage] = useState("");
    const [newImagePreview, setNewImagePreview] = useState(undefined)

    const [title, setTitle] = useState("");

    const { setLoading } = props;

    const navigate = useNavigate();

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
        if (newImagePreview) {
            setLoading(true)
            convertToBase64(newImage).then(img => {
                imagesService.editImage(title, img, props.user.uid, selectedImage.id).then(() => {
                    alert(`Imagen guardada en la DB.`)
                    setLoading(false)
                    navigate(0)
                }).catch((error) => {
                    if (String(error).indexOf("image") !== -1 && String(error).indexOf("longer than 1048487 byte") !== -1) {
                        alert(`La imagen es demasiado grande, por favor seleccione otra.`)
                        setLoading(false)
                    } else {
                        alert(`${error}`)
                        setLoading(false)
                    }
                })
            })
        } else {
            setLoading(true)
            imagesService.editImage(title, selectedImage.image, props.user.uid, selectedImage.id).then(() => {
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
                    <Box id="upload-form">
                        <TextField value={title} onChange={(e) => { setTitle(e.target.value) }} fullWidth placeholder='edita el título'></TextField> <br></br>
                        {!newImagePreview ? <img
                            src={selectedImage.image}
                            srcSet={selectedImage.image}
                            alt={selectedImage.title}
                            loading="lazy"
                            width={"100%"}
                        /> : <img
                            src={newImagePreview}
                            srcSet={newImagePreview}
                            alt={"edit-preview"}
                            loading="lazy"
                            width={"100%"} />} <br></br>
                        <label htmlFor="contained-button-file-edition">
                            <Input placeholder="image" accept="image/*" id="contained-button-file-edition" type="file" onChange={(e) => { setNewImage(e.target.files[0]) }} />
                            <Button variant="contained" component="span" id="upload-image-button-color">
                                <PhotoCameraIcon /> Cambiar imagen
                            </Button>
                        </label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={editImage} id="submit-button" disabled={title === ""}>Guardar cambios</Button>
                    <Button onClick={() => { setEditionFlag(false) }} color="error" autoFocus>Cancelar</Button>
                </DialogActions>
            </Dialog>}

        </>
    )
}
export default LoadingHOC(EditModal);