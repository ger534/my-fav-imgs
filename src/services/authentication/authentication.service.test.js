import { initializeApp } from "firebase/app";
import app from "../../firebase";
import authenticationService from "./authentication.service";

beforeAll(async () => {
    jest.setTimeout(10000);
    await initializeApp(app);
})

beforeEach(async () => {
    await authenticationService.signOut();
})

test('signInWithEmailAndPassword should login with correct credential', async () => {

    const user = await authenticationService.signIn(
        'nada@nada.com',
        'nadada'
    );
    expect(user.user).toBeTruthy();
});


test('signInWithEmailAndPassword should throw error with wrong credential', async () => {
    let error = "";
    try {
        await authenticationService.signIn('unit-testing@gmail.com', '1');
    } catch (err) {
        error = String(err);
    }

    expect(error).toEqual(
        `FirebaseError: Firebase: Error (auth/user-not-found).`
    );
});

test('createUserWithEmailAndPassword should throw error with short password', async () => {
    let error = "";
    try {
        await authenticationService.signUp('unit-testing@gmail.com', '1');
    } catch (err) {
        error = String(err);
    }

    expect(error).toEqual(
        `FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).`
    );
});

