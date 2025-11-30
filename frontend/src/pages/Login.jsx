import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; // 👈 Importa el CSS

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const user = await login(values.email, values.password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err?.response?.data?.error || 'Error al iniciar sesión');
    }
  };


  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <input placeholder="Email" {...register('email')} />
        {errors.email && <small className="error">{errors.email.message}</small>}

        <input type="password" placeholder="Contraseña" {...register('password')} autoComplete="current-password" />

        {errors.password && <small className="error">{errors.password.message}</small>}

        <button disabled={isSubmitting}>Entrar</button>
      </form>

      <p className="register-link">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
