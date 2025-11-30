describe('Login - pruebas completas', () => {
  const URL = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(URL);
  });

  it('muestra el formulario de login correctamente', () => {
    cy.contains('Iniciar sesión');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Contraseña"]').should('be.visible');
    cy.contains('button', 'Entrar').should('be.visible');
    cy.contains('Regístrate aquí').should('exist');
  });

  it('muestra error por email inválido', () => {
    cy.get('input[placeholder="Email"]').type('texto-no-correo');
    cy.get('input[placeholder="Contraseña"]').type('12345678');
    cy.contains('button', 'Entrar').click();
    cy.contains('Email inválido').should('exist');
  });

  it('muestra error por contraseña demasiado corta', () => {
    cy.get('input[placeholder="Email"]').type('usuario@test.com');
    cy.get('input[placeholder="Contraseña"]').type('123');
    cy.contains('button', 'Entrar').click();
    cy.contains('Mínimo 8 caracteres').should('exist');
  });

  it('no envía el formulario si está vacío y muestra validaciones', () => {
    cy.contains('button', 'Entrar').click();
    cy.contains('Email inválido').should('exist');
    cy.contains('Mínimo 8 caracteres').should('exist');
  });

  it('muestra error si las credenciales no son correctas', () => {
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Error al iniciar sesión');
    });

    cy.get('input[placeholder="Email"]').type('noexiste@test.com');
    cy.get('input[placeholder="Contraseña"]').type('12345678');
    cy.contains('button', 'Entrar').click();
  });



  // ------------- LOGIN EXITOSO ADMIN ----------------
  it('redirige al admin si role=admin', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        user: { role: 'admin' },
        token: 'fake-token'
      }
    });

    cy.get('input[placeholder="Email"]').type('admin@campus.com');
    cy.get('input[placeholder="Contraseña"]').type('admin123');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/admin');
  });

  // ------------- LOGIN REAL ----------------
  it('login real con usuario válido y redirige al dashboard', () => {
    cy.get('input[placeholder="Email"]').type('amadorvc80@gmail.com');
    cy.get('input[placeholder="Contraseña"]').type('123456789');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/dashboard');
  });

});
