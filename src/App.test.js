import { render, screen } from '@testing-library/react';
import App from './App';

test('renders appbar component', () => {
  render(<App />);
  const appbarRender = screen.getByText(/My Favorite Images/i);
  expect(appbarRender).toBeInTheDocument();
});

test('renders images component', () => {
  render(<App />);
  const imagesRender = screen.getByText(/¡Crea tu propio álbum!/i);
  expect(imagesRender).toBeInTheDocument();
});