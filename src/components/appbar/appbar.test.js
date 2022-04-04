import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Appbar from './appbar';
import { initializeApp } from "firebase/app";
import app from "../../firebase";

test('Appbar login button exists', async () => {
    initializeApp(app);
    render(<MemoryRouter><Appbar user={null}/></MemoryRouter>);
    
    await waitFor(() => expect(screen.getByTestId("PersonOutlineIcon")).toBeInTheDocument())
  });