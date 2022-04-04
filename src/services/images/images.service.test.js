import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { initializeApp } from "firebase/app";
import app from "../../firebase";
import imagesService from "./images.service";

initializeApp(app);

test("get all images by user", async () => {
    imagesService.getAllImagesByUser("fjc9LW3epwSvtBHOQQj0qOyzmlQ2")
})

test("remove image", async () => {
    imagesService.removeImage("fake_id")
})

test("edit image", async () => {
    imagesService.editImage("unit testing image edited", "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", "fjc9LW3epwSvtBHOQQj0qOyzmlQ2", "fake_id")
})

test("upload image", async () => {
    imagesService.uploadImage("unit testing image edited", "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", "fjc9LW3epwSvtBHOQQj0qOyzmlQ2", "fake_id")
})