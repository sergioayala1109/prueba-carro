import { useAuth } from '../../store/auth';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import './Admin.css';

/**
 * Pantalla de administración: muestra el acceso si no hay sesión y el panel
 * si ya se inició sesión.
 */
export default function Admin() {
  const { autenticado } = useAuth();
  return autenticado ? <AdminPanel /> : <AdminLogin />;
}
