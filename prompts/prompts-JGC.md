# Descripción del ejercicio:
Crear pruebas E2E con Cypress para verificar los siguientes escenarios:

## Carga de la Página de Position:
 - Verifica que el título de la posición se muestra correctamente.
 - Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación.
 - Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual.

## Cambio de Fase de un Candidato:
 - Simula el arrastre de una tarjeta de candidato de una columna a otra.
 - Verifica que la tarjeta del candidato se mueve a la nueva columna.
 - Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id.

# Ejecución de pruebas
Para ejecutar las pruebas, ejecutar el siguiente comando:
```
npx cypress open
```
# Prompts
## Prompt 1 (claude-3.7-sonnet)
Eres un experto desarrollador de software y tester QA especializado en tests end to end con Cypress.

Necesito realizar un test E2E que verifiquen el siguiente escenario: Carga de la página de detalle de una posición (position). 

Para ello, se debe comprobar que partiendo de la vista del listado de posiciones abiertas (imagen adjunta), cuando se pulsa en el botón "Ver proceso", se dirige al usuario al detalle de dicho proceso (proceso significa lo mismo que posición), donde se puede visualizar:
 - el título de la posición
 - las columnas correspondientes a cada fase del proceso de contratación
 - las tarjetas de los candidatos mostradas en la columna correcta según su fase actual

Genera los tests en el fichero @position.spec.js 
___
## Prompt 2 (claude-3.7-sonnet)
Ahora quiero realizar otro test E2E que verifiquen el siguiente escenario: Cambio de Fase de un Candidato en el detalle de una posición (position). 

Para ello, se debe comprobar desde el detalle del proceso de una posición que:
 - se permite arrastrar (drag & drop) una tarjeta de un candidato de una columna (fase) a otra
 - la tarjeta del candidato se mueve a la nueva columna
 - la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id

Añade los nuevos tests en el mismo fichero @position.spec.cy.js 
___
## Prompt 3 (claude-3.7-sonnet)
Los últimos tests me generan los siguientes errores:

Error 1:
Timed out retrying after 4000ms: Expected to find element: .card-title, but never found it. Queried from:

> cy.get(@candidateCard)

Error 2:
Timed out retrying after 5000ms: cy.wait() timed out waiting 5000ms for the 1st request to the route: updateCandidateRequest. No request ever occurred.

Corrige los tests
___
## Prompt 4 (claude-3.7-sonnet)

