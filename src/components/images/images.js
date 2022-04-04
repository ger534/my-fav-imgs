import { useCallback, useEffect, useRef, useState } from 'react';

/* icons */
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';

/* components */
import EditModal from './editModal/editModal'
import LoadingHOC from '../loading/LoadingHOC';

/* routing */
import { useNavigate } from 'react-router-dom';

/* styling */
import './images.css'
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Button, Container, ImageList, ImageListItem, ImageListItemBar, TextField, useMediaQuery } from '@mui/material';

/* images service */
import imagesService from '../../services/images/images.service';


const Input = styled('input')({
    display: 'none',
});

function Images(props) {

    const [image, setImage] = useState("");
    const [preview, setPreview] = useState()

    const [images, setImages] = useState([]);

    const [title, setTitle] = useState("");

    const { setLoading } = props;

    const matches = useMediaQuery('(min-width:700px)');

    const navigate = useNavigate();

    const mountedRef = useRef(true)

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

    const getAllImagesByUser = useCallback((user) => {
        setLoading(true)
        imagesService.getAllImagesByUser(user).then(response => {
            if (response) {
                let data = []
                response.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() })
                })
                if (!mountedRef.current) return null;
                setImages([...data])
                setLoading(false)
            }
        })
    }, [setLoading, mountedRef])

    const uploadImage = () => {
        setLoading(true)
        convertToBase64(image).then(img => {
            imagesService.uploadImage(title, img, props.user.uid).then(() => {
                alert(`Imagen guardada en la DB.`)
                if (!mountedRef.current) return null;
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
    }

    useEffect(() => {
        if (props.user) {
            getAllImagesByUser(props.user.uid)
        }
        return () => {
            mountedRef.current = false;   // clean up function
        };
    }, [props.user, getAllImagesByUser])

    useEffect(() => {
        if (!image) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(image)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])

    const removeImage = (img) => {
        if (window.confirm('¿desea borrar esta imagen?')) {
            setLoading(true)
            imagesService.removeImage(img.id).then(() => {
                alert(`Imagen borrada de la DB.`)
                if (!mountedRef.current) return null;
                getAllImagesByUser(props.user.uid)
                setLoading(false)
            });
        } else {
            return null
        }
    }

    //edition modal
    const [editionFlag, setEditionFlag] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openEditionModal = (image) => {
        setSelectedImage(image)
        setEditionFlag(true)
    }

    return (
        <>
            <Container style={matches ? { textAlign: "center", width: "70%" } : { textAlign: "center", height: "100vh" }}>

                {editionFlag && <EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={props.user}></EditModal>}

                <h1>¡Crea tu propio álbum!</h1>

                <Box id="upload-form">
                    <Box id="upload-image">
                        <TextField onChange={(e) => { setTitle(e.target.value) }} placeholder={"escoge un titulo"} fullWidth></TextField>
                        <label htmlFor="contained-button-file" id="upload-image-button">
                            <Input accept="image/*" id="contained-button-file" type="file" placeholder='image' onChange={(e) => { setImage(e.target.files[0]) }} />
                            <Button variant="contained" component="span" id="upload-image-button-color">
                                <PhotoCameraIcon />
                            </Button>
                        </label>
                    </Box>
                    {image && <Box id="preview">
                        <p>Vista previa: </p>
                        <img src={preview} srcSet={preview} alt={"preview"} loading="lazy" width={"50%"} />
                    </Box>}
                    <Button id="submit-button" variant="contained" onClick={uploadImage} disabled={title === "" || !preview || !props.user.uid} fullWidth>
                        Guardar entrada</Button>
                </Box>
                {images.length === 1 ? <p>Tu álbum tiene <strong>{images.length}</strong> imagen.</p> : <p>Tu álbum tiene <strong>{images.length}</strong> imágenes.</p>}

                {props.user ? <ImageList>
                    {images.map((item) => (
                        <ImageListItem key={item.id}>
                            <img
                                src={item.image}
                                srcSet={item.image}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar id="image-title"
                                title={item.title}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        aria-label={`edit ${item.title}`}
                                        onClick={() => openEditionModal(item)}
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
                                position="top"
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        onClick={() => removeImage(item)}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                }
                                actionPosition="right"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                    : <><h1>Para usar esta aplicación debes <a href="/login">iniciar sesión</a>.</h1></>}
            </Container>
        </>
    )
}
export default LoadingHOC(Images);


