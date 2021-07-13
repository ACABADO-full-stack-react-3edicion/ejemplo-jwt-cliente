import { useState } from "react";

function App() {
  const [error, setError] = useState(false);
  const [logueado, setLogueado] = useState(false);
  const [datos, setDatos] = useState([]);
  const loguearse = async () => {
    const credenciales = {
      usuario: "mariogl",
      password: "mariogl",
    };
    const resp = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });
    if (resp.ok) {
      setError(false);
      const { token } = await resp.json();
      localStorage.setItem("token", token);
      setLogueado(true);
    } else {
      setError(true);
      setLogueado(false);
    }
  };

  const cargarDatos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const resp = await fetch("http://localhost:4000/datos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const datos = await resp.json();
    setDatos(datos.datos);
  };

  const desloguearse = () => {
    localStorage.removeItem("token");
    setLogueado(false);
  };

  return (
    <>
      {!logueado && <button onClick={loguearse}>Login</button>}
      {error && <p>Error de autentificación</p>}
      {logueado && <button onClick={desloguearse}>Logout</button>}
      {logueado && (
        <>
          <button onClick={cargarDatos}>Cargar datos</button>
          <ul>
            {datos.map((dato) => (
              <li key={dato}>{dato}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default App;
