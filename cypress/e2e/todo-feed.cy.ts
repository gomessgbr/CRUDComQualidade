const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a anew todo, it must appears in the screen", () => {
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

    // 1 - Abrir a página
    cy.visit(BASE_URL);
    // 2 e 3 - Selecionar o input de criar nova todo e Digitar no input de criar nova todo
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Sei la vei");
    // 4 - Clicar no botão
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();

    // 5 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains("Sei la vei");

    // Criar validações a partir de valores
    expect("texto").to.be.equal("texto");
  });
});
