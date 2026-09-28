import React, { useState } from 'react';
import Header from './components/Header';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordValidator from './components/PasswordValidator';
import './App.css';

function App() {
  const [passwordToValidate, setPasswordToValidate] = useState('');

  const handleSelectForValidation = (password) => {
    setPasswordToValidate(password);
    const validatorElement = document.getElementById('validador');
    if (validatorElement) {
      validatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      <main className="content-container">
        <Header />

        <div className="sections-stack">
          {/* Sección 1: Generador minimalista */}
          <PasswordGenerator onSelectForValidation={handleSelectForValidation} />

          {/* Sección 2: Validador con barra de progreso minimalista */}
          <PasswordValidator
            currentPassword={passwordToValidate}
            onPasswordChange={setPasswordToValidate}
          />
        </div>

        <footer className="app-footer">
          <p>
            Validador de Contraseñas &middot; Basado en las pautas del <strong>Manual Contraseñas S3guR4$_</strong> de Hacker Mentor.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
