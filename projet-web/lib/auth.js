export async function login(username, password) {

    const res = await fetch('/api/auth/connexion', {
  
      method: 'POST',
  
      headers: { 'Content-Type': 'application/json' },
  
      body: JSON.stringify({ userName: username, motDePasse: password }),
  
    });
   
    if (!res.ok) throw new Error('Identifiants incorrects');
   
    const token = await res.json();
  
    localStorage.setItem('token', token);
  
    return token;
  
  }
   