const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it.only("when create a anew todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todd: {
            id: "050a43bc-6424-4096-8923-b9995d22a50d",
            content: "Test todo",
            date: "2023-11-18T14:53:45.702Z",
            done: false,
          },
        },
      });
    }).as("createTodo");
    cy.visit(BASE_URL);
    const $inputAddTodo = cy.get("input[name='add-todo']");
    $inputAddTodo.type("Test todo");
    const $btnAddTodo = cy.get("[aria-label='Adicionar novo item']");
    $btnAddTodo.click();

    cy.get("table > tbody").contains("Test todo");
  });
});
