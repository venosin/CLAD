const HTMLPasswordResetMail = (verificationCode) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
      <h2 style="color: #4a90e2;">Bienvenido/a a CLAD</h2>
      <p>Gracias por registrarte en nuestra plataforma.</p>
      <p>Para verificar tu cuenta, utiliza el siguiente código:</p>
      <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 15px 0;">
        ${verificationCode}
      </div>
      <p>Este código expirará en 2 horas.</p>
      <p>Si no has solicitado este registro, por favor ignora este correo.</p>
      <p>Saludos,<br>El equipo de CLAD</p>
    </div>
  `;
};

export default HTMLPasswordResetMail;
