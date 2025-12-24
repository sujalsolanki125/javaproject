import AppRoutes from './routes/AppRoutes';
import './styles/index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
