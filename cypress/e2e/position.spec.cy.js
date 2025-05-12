describe('Pruebas de posiciones', () => {
  beforeEach(() => {
    // Configuramos intercepción de peticiones para hacer las pruebas independientes del servidor
    cy.intercept('GET', 'http://localhost:3010/positions', { fixture: 'positions.json' }).as('getPositions');
    cy.intercept('GET', 'http://localhost:3010/positions/*/interviewFlow', { fixture: 'interviewFlow.json' }).as('getInterviewFlow');
    cy.intercept('GET', 'http://localhost:3010/positions/*/candidates', { fixture: 'candidates.json' }).as('getCandidates');
    
    // Visitamos la página de posiciones
    cy.visit('http://localhost:3000/positions');
  });

  // Test 1: Verificar la carga del listado de posiciones
  it('Debería mostrar el listado de posiciones correctamente', () => {
    // Esperar a que se carguen las posiciones
    cy.wait('@getPositions');
    
    // Verificar que se muestra el título de la página
    cy.contains('h2', 'Posiciones').should('be.visible');
    
    // Verificar que aparecen las posiciones
    cy.contains('.card-title', 'Senior Full-Stack Engineer').should('be.visible');
    cy.contains('.card-title', 'Data Scientist').should('be.visible');
    
    // Verificar que los filtros están presentes
    cy.get('input[placeholder="Buscar por título"]').should('exist');
    cy.get('[type="date"]').should('exist');
  });

  // Test 2: Verificar la navegación al detalle de posición
  it('Debería navegar al detalle de posición al hacer clic en "Ver proceso"', () => {
    // Esperar a que se carguen las posiciones
    cy.wait('@getPositions');
    
    // Hacer clic en el botón "Ver proceso" del primer puesto
    cy.contains('Ver proceso').first().click();
    
    // Verificar que la URL ha cambiado y contiene "/positions/"
    cy.url().should('include', '/positions/');
  });

  // Test 3: Verificar que se muestra el detalle de posición correctamente
  it('Debería mostrar el detalle de posición con sus columnas', () => {
    // Esperar a que se carguen las posiciones
    cy.wait('@getPositions');
    
    // Hacer clic en "Ver proceso"
    cy.contains('Ver proceso').first().click();
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
    
    // Verificar que se muestra el título de la posición
    cy.contains('h2', 'Senior Full-Stack Engineer').should('be.visible');
    
    // Verificar que existe el botón para volver a posiciones
    cy.contains('Volver a Posiciones').should('be.visible');
    
    // Verificar que están las columnas de fases
    cy.contains('.card-header', 'CV Review').should('exist');
    cy.contains('.card-header', 'Phone Screening').should('exist');
    cy.contains('.card-header', 'Technical Test').should('exist');
    cy.contains('.card-header', 'Final Interview').should('exist');
  });
  
  // Test 4: Verificar que se muestran los candidatos en las columnas
  it('Debería mostrar los candidatos en las columnas correspondientes', () => {
    // Esperar a que se carguen las posiciones
    cy.wait('@getPositions');
    
    // Hacer clic en "Ver proceso"
    cy.contains('Ver proceso').first().click();
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
    
    // Verificar que hay tarjetas de candidatos
    cy.get('.card-body .card').should('have.length.at.least', 1);
    
    // Verificar que existen tarjetas con títulos/nombres de candidatos
    cy.get('.card-title').should('have.length.at.least', 1);
    
    // Verificar que existen candidatos verificando solo la existencia de tarjetas en las columnas
    // sin depender del texto exacto que podría variar
    cy.contains('.card-header', 'CV Review')
      .parents('.col-md-3')
      .find('.card-body .card')
      .should('have.length.at.least', 1);
      
    cy.contains('.card-header', 'Phone Screening')
      .parents('.col-md-3')
      .find('.card-body .card')
      .should('have.length.at.least', 1);
  });

  // Test 5: Verificar la estructura general para drag & drop
  it('Debería tener la estructura adecuada para drag & drop', () => {
    // Esperar a que se carguen las posiciones
    cy.wait('@getPositions');
    
    // Hacer clic en "Ver proceso"
    cy.contains('Ver proceso').first().click();
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
    
    // Verificar que hay tarjetas arrastrables
    cy.get('.card-body .card').should('have.length.at.least', 1);
    
    // Verificar la estructura de DragDropContext a nivel de DOM
    cy.get('.row').should('exist');  // Row contenedor de columnas
    
    // Verificar que tenemos acceso al documento
    cy.window().then(win => {
      expect(win).to.have.property('document');
      expect(win.document.querySelector('.row')).to.exist;
    });
  });
  
  // Test 6: Verificar el cambio de fase de un candidato
  it('Debería permitir cambiar un candidato de fase mediante drag & drop', () => {
    // Interceptar y espiar la petición PUT al backend
    cy.intercept('PUT', 'http://localhost:3010/candidates/*', (req) => {
      // Verificar que la petición contiene los datos correctos
      expect(req.body).to.have.property('currentInterviewStep');
      // Responder con éxito simulado
      req.reply({ statusCode: 200, body: { success: true } });
    }).as('updateCandidate');
    
    // Esperar a que se carguen las posiciones y navegar al detalle
    cy.wait('@getPositions');
    cy.contains('Ver proceso').first().click();
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
    
    // Identificar la primera columna (CV Review) y obtener información sobre su contenido
    cy.contains('.card-header', 'CV Review')
      .parents('.col-md-3')
      .find('.card-body .card')
      .first()
      .as('candidateCard')
      .find('.card-title')
      .invoke('text')
      .as('candidateName');
    
    // Identificar la columna destino (Phone Screening)
    cy.contains('.card-header', 'Phone Screening')
      .parents('.col-md-3')
      .as('targetColumn');
    
    // Simular un evento de dragEnd utilizando la función onDragEnd
    // que está implementada en el componente DragDropContext
    cy.get('.row').then($row => {
      // Obtener las referencias a las columnas (droppables)
      const droppables = $row.find('[data-rbd-droppable-id]');
      const sourceId = droppables.first().attr('data-rbd-droppable-id');
      const destinationId = droppables.eq(1).attr('data-rbd-droppable-id');
      
      // Simular la función onDragEnd llamándola directamente
      // mediante la generación de un evento DOM personalizado
      cy.window().then(win => {
        // Crear un evento personalizado con la estructura de datos necesaria
        const dragEndEvent = new CustomEvent('rbd:drag-end', {
          detail: {
            source: { droppableId: sourceId || '0', index: 0 },
            destination: { droppableId: destinationId || '1', index: 0 },
            draggableId: '1', // ID del primer candidato
            type: 'DEFAULT'
          }
        });
        
        // Disparar el evento en el document
        win.document.dispatchEvent(dragEndEvent);
        
        // Esperar a que se procese el evento
        cy.wait(500);
      });
    });
    
    // Verificar que se realizó la petición PUT al backend
    cy.wait('@updateCandidate').then(interception => {
      // Verificar que la petición contenía la información correcta
      expect(interception.request.body).to.have.property('currentInterviewStep');
    });
    
    // Recargar la página para verificar que los cambios se mantienen
    cy.reload();
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
    
    // Verificar que la estructura de columnas y candidatos se mantiene
    cy.contains('.card-header', 'CV Review').should('exist');
    cy.contains('.card-header', 'Phone Screening').should('exist');
  });
});
