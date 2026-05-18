'use client';
import './login.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '../interfacesPages';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('utilisateur');
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [erreur, setErreur] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    try {
      const res = await fetch('/api/auth/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomUtilisateur: form.username,
          motDePasse: form.password,
        }),
      });

      if (!res.ok) throw new Error('Identifiants incorrects');

      const data = await res.json();
      console.log('Data complète du backend:', data);

      const tokenString = data.token;

      // Utilise le rôle du backend si disponible, sinon celui du bouton
      const roleReel = data.role ?? data.user?.role ?? data.nomRole ?? role;

      localStorage.setItem('token', tokenString);
      localStorage.setItem('user', JSON.stringify({
        username: form.username,
        role: roleReel  // ← rôle réel du backend
      }));

      document.cookie = `token=${tokenString}; path=/; max-age=86400`;
      document.cookie = `role=${roleReel}; path=/; max-age=86400`;

      window.dispatchEvent(new Event('user-changed'));

      if (roleReel === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : 'Erreur de connexion');
      setLoading(false);
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h2>Connexion</h2>
          <p>Accède à ton compte MonShop</p>
        </div>

        {/* Sélecteur de rôle */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'utilisateur' ? 'active' : ''}`}
            onClick={() => setRole('utilisateur')}
          >
            👤 Utilisateur
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            🛠️ Administrateur
          </button>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="Ton nom d'utilisateur"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {erreur && <div className="error-box">{erreur}</div>}

          <button type="submit" className="btn-gradient mt-2" disabled={loading}>
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}