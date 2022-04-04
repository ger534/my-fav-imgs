import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './login';
import userEvent from '@testing-library/user-event';
import { initializeApp } from "firebase/app";
import app from "../../firebase";

test('login dirección de correo electrónico no es válida', async () => {
  initializeApp(app);
  render(<MemoryRouter><Login user={null}/></MemoryRouter>);
  const button = screen.getByRole('button', { name: 'Iniciar sesión' });

  act(() => userEvent.click(button));
  
  await waitFor(() => expect(screen.getByText(/La dirección de correo electrónico no es válida./i)).toBeInTheDocument())
});


test('login email no ha sido registrado', async () => {
    initializeApp(app);
    render(<MemoryRouter><Login /></MemoryRouter>);
  
    const button = screen.getByRole('button', { name: 'Iniciar sesión' });
    const emailInput = screen.getByPlaceholderText("Email")
    const passwordInput = screen.getByPlaceholderText("Password")
  
    fireEvent.change(emailInput, { target: { value: 'nada@1nada1.com' } })
    fireEvent.change(passwordInput, { target: { value: 'nadada' } })
  
    act(() => userEvent.click(button))
    
    await waitFor(() => expect(screen.getByText(/Este email no ha sido registrado./i)).toBeInTheDocument())
  });
  
  

  test('sign out', async () => {
    initializeApp(app);
    let testUser = {uid:"fake_user", email: "fake@email.com"}
    const onUserChange = (user) => { testUser = user }
    render(<MemoryRouter><Login user={testUser} onUserChange={onUserChange}/></MemoryRouter>);
  
    const button = screen.getByRole('button', { name: 'Cerrar sesión' });
  
    act(() => userEvent.click(button))
    
    await waitFor(() => expect(testUser).toBe(null));
  });