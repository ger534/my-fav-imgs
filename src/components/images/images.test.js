import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { initializeApp } from "firebase/app";
import app from "../../firebase";
import Images from './images';

jest.mock("./../../services/images/images.service", () => {
    let db = [{ id: "id0", data: () => { return { title: "title0", image: "image0", user: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" } } },
    { id: "id", data: () => { return { title: "title", image: "image", user: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" } } }];
    return {
        async getAllImagesByUser(user) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve(db);
                }, 250);
            });
        },
        async removeImage(id) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    db = db.filter(x => x.id !== id)
                    resolve({});
                }, 250);
            });
        },
        async uploadImage(title, img, user) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve(db.push({ id: "id2", data: () => { return { title: "title2", image: "image2", user: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" } } }));
                }, 250);
            });
        }
    };
});


test('Images Renders', () => {
    initializeApp(app);
    const user = { uid: "fake_user" }
    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    expect(screen.getByText(/¡Crea tu propio álbum!/i)).toBeInTheDocument()
});


test('Images no usuario', () => {
    const user = null;
    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    expect(screen.getByText(/Para usar esta aplicación/i)).toBeInTheDocument()
});


test('Images botón de guardado desactivado', () => {
    initializeApp(app);
    const user = { uid: "fake_user" }
    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    const button = screen.getByText(/Guardar entrada/i);

    expect(button).toBeDisabled();
});


test('Images botón de guardado', async () => {
    initializeApp(app);
    const user = { uid: "fake_user" }
    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    const title = screen.getByPlaceholderText(/escoge un titulo/i);

    await act(async () => {
        await waitFor(() => {
            fireEvent.change(title, { target: { value: 'título' } });
        });
    });

    const image = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = screen.getByPlaceholderText("image");

    global.URL.createObjectURL = jest.fn(x => "fake url");
    global.URL.revokeObjectURL = jest.fn();

    await act(async () => {
        await waitFor(() => {
            userEvent.upload(input, image);
        });
    });

    const button = screen.getByText(/Guardar entrada/i);

    await waitFor(() => expect(button.disabled).toBe(false));
});

test('Images álbum carga imágenes', async () => {
    initializeApp(app);
    const user = { uid: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" }

    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    await waitFor(() => expect(screen.getAllByTestId("ClearIcon")[0]).toBeInTheDocument());
});

test('Images subir imagen', async () => {
    initializeApp(app);
    const user = { uid: "fake_user" }
    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    const title = screen.getByPlaceholderText(/escoge un titulo/i);

    await act(async () => {
        await waitFor(() => {
            fireEvent.change(title, { target: { value: 'título' } });
        });
    });

    const image = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = screen.getByPlaceholderText("image");

    global.URL.createObjectURL = jest.fn(x => "fake url");
    global.URL.revokeObjectURL = jest.fn();

    await act(async () => {
        await waitFor(() => {
            userEvent.upload(input, image);
        });
    });

    const button = screen.getByText(/Guardar entrada/i);

    await act(async () => {
        await waitFor(() => {
            userEvent.click(button);
        });
    });

    await waitFor(() => expect(screen.getByText(/imágenes./i)).toBeInTheDocument());
});

window.confirm = () => { return true }
window.alert = () => { return "Imagen borrada de la DB." }
test('Images borrar imagen', async () => {
    initializeApp(app);
    const user = { uid: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" }

    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    await waitFor(() => expect(screen.getAllByTestId("ClearIcon")[0]).toBeInTheDocument());
    const buttons = screen.getAllByTestId("ClearIcon")

    act(() => userEvent.click(buttons[0]));

    await waitFor(() => expect(screen.getAllByTestId("ClearIcon").length).toBeLessThan(buttons.length));
});

test('Images editar imagen', async () => {
    initializeApp(app);
    const user = { uid: "fjc9LW3epwSvtBHOQQj0qOyzmlQ2" }

    render(<MemoryRouter><Images user={user} /></MemoryRouter>);

    await waitFor(() => expect(screen.getAllByTestId("EditIcon")[0]).toBeInTheDocument());
    const button = screen.getAllByTestId("EditIcon")[0];

    act(() => userEvent.click(button));

    await waitFor(() => expect(screen.getByPlaceholderText("edita el título")).toBeInTheDocument());
});



