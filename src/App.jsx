import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoute.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

