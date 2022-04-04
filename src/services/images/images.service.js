/* firestore */
import { doc, setDoc, collection, deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore";

/**
 * Service to handle all actions related to images in DB
 */
const imagesService = {

    async getAllImagesByUser(user) {
        const q = query(collection(getFirestore(), "images"), where("user", "==", user));
        return getDocs(q);
    },

    async uploadImage(title, image, user) {
        return setDoc(doc(collection(getFirestore(), "images")), {
            title: title,
            image: image,
            user: user
        })
    },

    async removeImage(id) {
        return deleteDoc(doc(getFirestore(), "images", id));
    },

    async editImage(title, image, user, id) {
        return setDoc(doc(getFirestore(), "images", id), {
            title: title,
            image: image,
            user: user
        })
    },
}
export default imagesService;