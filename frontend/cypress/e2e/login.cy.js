import 'cypress-file-upload';

describe('Login y análisis de documentos', () => {
  const URL = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(URL);
  });

  // ---------------- LOGIN ----------------
  it('login real con usuario válido y redirige al dashboard', () => {
    cy.get('input[placeholder="Email"]').type('amadorvc80@gmail.com');
    cy.get('input[placeholder="Contraseña"]').type('123456789');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Hola,').should('exist');
  });

  // ---------------- SUBIDA DE ARCHIVO Y ANÁLISIS ----------------
  it('sube un documento y muestra el análisis anotado y corregido', () => {
    cy.get('input[placeholder="Email"]').type('amadorvc80@gmail.com');
    cy.get('input[placeholder="Contraseña"]').type('123456789');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/dashboard');

    // Subir archivo
    cy.get('input[data-testid="file-input"]').attachFile('ejemplo.txt');
    cy.contains('button', 'Subir y analizar').click(); // <-- adaptado

    // Esperar a que cargue el análisis
    cy.get('.analysis-fixed', { timeout: 20000 }).should('be.visible');

    cy.contains('🔍 Anotado').should('exist');
    cy.contains('✅ Corregido').click();
    cy.get('.corrected-text').should('exist');
    cy.get('.download-btn').should('exist');
  });

  // ---------------- HISTORIAL ----------------
// ---------------- HISTORIAL ----------------
it('abre el historial y visualiza un análisis', () => {
  cy.get('input[placeholder="Email"]').type('amadorvc80@gmail.com');
  cy.get('input[placeholder="Contraseña"]').type('123456789');
  cy.contains('button', 'Entrar').click();

  cy.contains('📂 Historial').click();
  cy.url().should('include', '/history');

  cy.get('.history-table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);

  // Mock de la API
  cy.intercept('GET', '/api/history/*', {
    statusCode: 200,
    body: {
      id: 28,
      originalText: 'Este es un texto de prueba.',
      correctedText: 'Este es un texto de prueba corregido.',
      annotations: [
        { original: 'texto', type: 'spelling', note: 'Error ortográfico', suggestion: 'Texto' }
      ]
    }
  }).as('getHistory');

  cy.get('.history-table tbody tr').first().within(() => {
    cy.get('.view-btn').click();
  });

  cy.wait('@getHistory');

  cy.get('.history-detail-wrapper', { timeout: 10000 }).should('be.visible');
  cy.get('.annotation', { timeout: 10000 }).should('have.length.greaterThan', 0);

  cy.contains('✅ Corregido').click();
  cy.get('.corrected-text', { timeout: 10000 }).should('exist');
});

});
