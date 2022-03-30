import { Button, Container, ImageList, ImageListItem, ImageListItemBar, TextField, useMediaQuery } from '@mui/material';
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

import EditModal from './editModal/editModal'
import LoadingHOC from '../loading/LoadingHOC';

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
        setLoading(true)
        const q = query(collection(db, "images"), where("user", "==", props.user.uid));
        getDocs(q).then(snapshot => {
            if (snapshot) {
                let data = []
                snapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() })
                })
                setImages([...data])
                setLoading(false)
            }
        })
    }

    const uploadImage = () => {
        setLoading(true)
        convertToBase64(image).then(img => {
            setDoc(doc(collection(db, "images")), {
                title: title,
                image: img,
                user: props.user.uid
            }).then(() => {
                alert(`Imagen guardada en la DB.`)
                setLoading(false)
                navigate(0)
            }).catch((error) => {
                if (error == "FirebaseError: [code=invalid-argument]: The value of property \"image\" is longer than 1048487 bytes.") {
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
        if (props.user.uid) {
            getAllImagesByUser()
        }
    }, [props.user])

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
            deleteDoc(doc(db, "images", img.id)).then(() => {
                alert(`Imagen borrada de la DB.`)
                getAllImagesByUser()
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

                <Box
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <Box
                        style={{ display: "flex", flexDirection: "row", width: "100%" }}
                    ><TextField onChange={(e) => { setTitle(e.target.value) }} placeholder={"escoge un titulo"} fullWidth></TextField>
                        <label htmlFor="contained-button-file" style={{ display: "flex" }}>
                            <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
                            <Button variant="contained" component="span" style={{ backgroundColor: "#ffdacc", color: "#ff4702" }}>
                                <PhotoCameraIcon />
                                {/*matches ? <><PhotoCameraIcon /> Escoge una imagen</> : <PhotoCameraIcon />*/}
                            </Button>
                        </label></Box>
                    {image && <div style={{ textAlign: "center" }}><p>Vista previa: </p><img src={preview} srcSet={preview} alt={"preview"} loading="lazy" width={"50%"} /></div>}
                    <Button variant="contained" onClick={uploadImage} style={{ backgroundColor: "#ff4702", fontWeight: "bold" }} disabled={title === "" || !preview || !props.user.uid}>
                        Guardar entrada</Button>

                </Box>
                {images.length === 1 ? <p>Tu álbum tiene <strong>{images.length}</strong> imagen.</p> : <p>Tu álbum tiene <strong>{images.length}</strong> imágenes.</p>}

                {props.user.uid ? <ImageList>
                    {images.map((item) => (
                        <ImageListItem key={item.id}>
                            <img
                                src={item.image}
                                srcSet={item.image}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar style={{ textAlign: "left" }}
                                title={item.title}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        aria-label={`info about ${item.title}`}
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


