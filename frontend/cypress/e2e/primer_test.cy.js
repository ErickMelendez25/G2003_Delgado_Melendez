describe('Mi primer test', () => {
  it('verifica que el sitio carga', () => {
    cy.visit('http://localhost:5173'); // cambia a 5173 porque usas Vite
    cy.contains('CampusUC');           
  });
});
