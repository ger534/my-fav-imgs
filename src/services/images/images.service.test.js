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

/*test("get all images by user", async () => {
    //const db = initializeTestEnvironment({project: 'my-fav-imgs'}).;
    let testEnv = await initializeTestEnvironment({
        projectId: "my-fav-imgs",
        firestore: {},
      });

    const q = query(collection(db, "images"), where("user", "==", "testing_user"));
    //getDocs(q);
    //const test = getDocs(q);
    await firebase.assertSucceeds(getDocs(q))
})*/

/*test('upload an image',  () => {
    const title = "unit testing image";
    const user = "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" // 'nada@nada.com', 'nadada'
    const image = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    let uploaded;
    act(() =>
        imagesService.uploadImage(title, image, user).then(response => {
            uploaded = true
        }))
     waitFor(() => expect(uploaded).toBe(true));
    //await assertSucceeds(testing);
});*/

/*test('upload an image fails', async () => {
    const title = "unit testing image";
    const user = "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" // 'nada@nada.com', 'nadada'
    const image = null
    let error;
    let testing = await imagesService.uploadImage(title, image, user)/*.then(response => {
    }).catch(err => {
        error = true
    })
    //expect(error).toBe(true);
    //await assertSucceeds(testing);
    await assertFails(testing);
});*/