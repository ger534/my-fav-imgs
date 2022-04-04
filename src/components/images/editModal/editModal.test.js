import { fireEvent, render, screen, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { initializeApp } from "firebase/app";
import app from "../../../firebase";
import EditModal from './editModal';

test('EditModal Renders', async () => {
    const selectedImage = { title: "fake_title", image: 'fake_image', user: "fake_user", id: "fake_id" }
    const editionFlag = true
    const setEditionFlag = () => { return !editionFlag }
    const user = "fake_user"
    render(<MemoryRouter><EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={user} /></MemoryRouter>);
});


test('EditModal imagen guardada en database', async () => {
    initializeApp(app);
    const selectedImage = { title: "fake_title", image: 'fake_image', user: "fake_user", id: "fake_id" }
    const editionFlag = true
    const setEditionFlag = () => { return !editionFlag }
    const user = { uid: "fake_user" };

    const jsdomAlert = window.alert;  // remember the jsdom alert
    window.alert = jest.fn();  // provide an empty implementation for window.alert

    render(<MemoryRouter><EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={user} /></MemoryRouter>);

    const button = screen.getByRole("button", { name: "Guardar cambios" })

    act(() => userEvent.click(button))

    await waitFor(() => expect(window.alert).toHaveBeenCalledTimes(1))

    window.alert = jsdomAlert;  // restore the jsdom alert
});


test('EditModal nuevo título', async () => {
    initializeApp(app);
    const selectedImage = { title: "fake_title", image: 'fake_image', user: "fake_user", id: "fake_id" }
    const editionFlag = true
    const setEditionFlag = () => { return !editionFlag }
    const user = { uid: "fake_user" };

    const jsdomAlert = window.alert;  // remember the jsdom alert
    window.alert = jest.fn(); // provide an empty implementation for window.alert

    render(<MemoryRouter><EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={user} /></MemoryRouter>);

    const input = screen.getByPlaceholderText("edita el título");

    await act(async () => {
        await waitFor(() => {
            fireEvent.change(input, { target: { value: 'nuevo título' } });
        });
    });

    const button = screen.getByRole("button", { name: "Guardar cambios" })

    await act(async () => {
        await waitFor(() => {
            userEvent.click(button);
        });
    });

    await waitForElementToBeRemoved(screen.getByRole("heading", { name: "Cargando..." }))
    window.alert = jsdomAlert;  // restore the jsdom alert
});

test('EditModal nueva imagen', async () => {
    initializeApp(app);
    const selectedImage = { title: "fake_title", image: 'fake_image', user: "fake_user", id: "fake_id" }
    const editionFlag = true
    const setEditionFlag = () => { return !editionFlag }
    const user = { uid: "fake_user" };

    render(<MemoryRouter><EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={user} /></MemoryRouter>);

    const newImage = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = screen.getByPlaceholderText("image");

    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    await act(async () => {
        await waitFor(() => {
            userEvent.upload(input, newImage);
        });
    });

    expect(input.files[0]).toStrictEqual(newImage);
});


test('EditModal subir nueva imagen', async () => {
    initializeApp(app);
    const selectedImage = { title: "fake_title", image: 'fake_image', user: "fake_user", id: "fake_id" }
    const editionFlag = true
    const setEditionFlag = () => { return !editionFlag }
    const user = "fake_user"

    const jsdomAlert = window.alert;  // remember the jsdom alert
    window.alert = jest.fn(); // provide an empty implementation for window.alert

    render(<MemoryRouter><EditModal selectedImage={selectedImage} editionFlag={editionFlag} setEditionFlag={setEditionFlag} user={user} /></MemoryRouter>);

    const newImage = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = screen.getByPlaceholderText("image");

    global.URL.createObjectURL = jest.fn(x => "fake url");
    global.URL.revokeObjectURL = jest.fn();

    await act(async () => {
        await waitFor(() => {
            userEvent.upload(input, newImage);
        });
    });

    const button = screen.getByRole("button", { name: "Guardar cambios" })

    await act(async () => {
        await waitFor(() => {
            userEvent.click(button);
        });
    });

    await waitFor(() => expect(global.alert).toHaveBeenCalledTimes(1))
    window.alert = jsdomAlert;  // restore the jsdom alert
});