import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './signUp';
import userEvent from '@testing-library/user-event';
import { initializeApp } from "firebase/app";
import app from "../../firebase";

test('renders signUp component', () => {
  render(<MemoryRouter><SignUp /></MemoryRouter>);
  const componentTitle = screen.queryAllByText(/Registrarse/i);
  //title
  expect(componentTitle[0]).toBeInTheDocument();
  expect(componentTitle[1]).toBeInTheDocument();
});

test('register button disabled', () => {
  render(<MemoryRouter><SignUp /></MemoryRouter>);
  const button = screen.getByRole('button', { name: 'Registrarse' });
  expect(button.disabled).toBe(true);
});

test('register button no disabled', () => {
  render(<MemoryRouter><SignUp /></MemoryRouter>);
  const button = screen.getByRole('button', { name: 'Registrarse' });
  const emailInput = screen.getByPlaceholderText("Email")
  const passwordInput = screen.getByPlaceholderText("Password")

  fireEvent.change(emailInput, { target: { value: 'nada@nada.com' } })
  fireEvent.change(passwordInput, { target: { value: 'nadada' } })

  expect(button.disabled).toBe(false);
});

test('register button error email-already-in-use', async () => {
  initializeApp(app);
  render(<MemoryRouter><SignUp /></MemoryRouter>);

  const button = screen.getByRole('button', { name: 'Registrarse' });
  const emailInput = screen.getByPlaceholderText("Email")
  const passwordInput = screen.getByPlaceholderText("Password")

  fireEvent.change(emailInput, { target: { value: 'nada@nada.com' } })
  fireEvent.change(passwordInput, { target: { value: 'nadada' } })

  act(() => userEvent.click(button))

  //"Firebase: Error (auth/email-already-in-use)."
  await waitFor(() => expect(screen.getByText(/Firebase: Error/i)).toBeInTheDocument())
});