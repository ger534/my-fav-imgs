/* firebase */
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";

/**
 * Service to handle all actions related to authentication
 */
const authenticationService = {

    async signIn(email, password) {
        return signInWithEmailAndPassword(getAuth(), email, password);
    },

    async signOut() {
        return signOut(getAuth());
    },

    async signUp(email, password) {
        return createUserWithEmailAndPassword(getAuth(), email, password);
    }
}

export default authenticationService;