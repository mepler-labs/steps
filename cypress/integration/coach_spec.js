const { API_URL } = Cypress.env();
let user, org, coach, task;

const taskTitle = 'The ultra awesome task';
const COACH_EMAIL = 'connor+steps-cypress-coach@8thlight.com';
const COACH_AUTH0_ID = '5b3307d352e65360e5e0e13b';

Cypress.Commands.add('setUser', u => {
  cy.visit('http://localhost:3000')
    .window()
    .should(win => {
      win.localStorage.setItem('USER', JSON.stringify(u));
      win.localStorage.setItem('AUTHENTICATED', 'true');
    });

  cy.visit('http://localhost:3000');
});

Cypress.Commands.add('cleanCoach', () => {
  cy.request('DELETE', `${API_URL}/coaches/${coach.id}`);
  cy.request('DELETE', `${API_URL}/orgs/${org.id}`);
});

Cypress.Commands.add('clearJohnDoe', () => {
  cy.log('Clean up test data');

  cy.request('GET', `${API_URL}/clients`).then(({ body: clients }) => {
    const johns = clients.filter(
      c => c.first_name === 'John' && c.last_name === 'Doe',
    );
    johns.forEach(j =>
      cy
        .request('GET', `${API_URL}/clients/${j.id}/tasks`)
        .then(({ body: tasks }) => {
          tasks.forEach(t => {
            cy.request('DELETE', `${API_URL}/tasks/${t.id}`);
          });
          cy.request('DELETE', `${API_URL}/clients/${j.id}`);
        }),
    );
  });
});

Cypress.Commands.add('logIn', email => {
  cy.visit('http://localhost:3000?auth0');

  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type('password1!@');
  cy.contains('button', 'Log In')
    .trigger('click')
    .click();
});

describe('Auth', () => {
  it('can see the login page', () => {
    cy.visit('http://localhost:3000?auth0');
    cy.contains('Log In');
  });

  it('can see the admin signup page', () => {
    cy.visit('http://localhost:3000/signup');
    cy.contains('Sign Up');
  });

  it('can see the coach signup page', () => {
    cy.visit('http://localhost:3000/signup/1');
    cy.contains('Sign Up');
  });
});

describe('Coach', () => {
  before(() => {
    cy.request('POST', `${API_URL}/orgs`, {
      name: 'My Org',
      sms_number: '1234567890',
    }).then(resp => {
      org = resp.body.id;
      cy.request('POST', `${API_URL}/coaches`, {
        first_name: 'Coach',
        last_name: 'Bob',
        email: COACH_EMAIL,
        org_id: org.id,
        color: 'red',
        goals: [],
        status: 'AWAITING_HELP',
        checkin_times: [],
        auth0_id: COACH_AUTH0_ID,
      }).then(r => {
        coach = r.body.id;
      });
    });

    cy.request('POST', `${API_URL}/tasks`, {
      title: taskTitle,
      category: 'category',
      user_id: null,
      status: 'ACTIVE',
      date_created: new Date(),
    }).then(r => {
      task = r.body.id;
    });

    cy.clearLocalStorage();
    cy.clearJohnDoe();
  });

  after(() => {
    cy.clearJohnDoe();
    cy.cleanCoach();
  });

  it('Logs in as a coach', () => {
    cy.logIn(COACH_EMAIL);

    cy.url().should('equal', 'http://localhost:3000/');

    cy.contains('My Clients');
    cy.contains('New Client');
  });

  it('Creates a new client', () => {
    cy.logIn(COACH_EMAIL);

    cy.contains('New Client').click();
    cy.contains('Add New Client');

    cy.get('input[name=first_name]').type('John');
    cy.get('input[name=last_name]').type('Doe');
    cy.get('input[name=email]').type('john@doe.com');
    cy.get('input[name=phone]').type('1234567890');
    cy.contains('Save').click();
    cy.contains('Text START to (646) 798-8004 to get started.');
  });

  it('Adds a new task for a client', () => {
    cy.logIn(COACH_EMAIL);

    cy.contains('My Clients').click();
    cy.get('div[title="John Doe"]').click();
    cy.contains('Next').click();
    cy.contains('Add New Task').click();
    cy.contains(taskTitle).click();
    cy.contains('SAVE TO WORKPLAN').click();
    cy.contains(taskTitle);

    cy.contains('View Steps');
    cy.contains('Add New Task');
  });

  it('Edit task content', () => {
    cy.logIn(COACH_EMAIL);

    cy.contains('My Clients').click();
    cy.get('div[title="John Doe"]').click();
    cy.contains('View Steps').click();
    cy.get('div.content')
      .contains('Edit')
      .click();
    cy.get('input[name=title]')
      .clear()
      .type('This is an awesome task');
    cy.get('input[name=description]')
      .clear()
      .type('And it has an awesome description');
    cy.contains('SAVE TO WORKPLAN').click();

    cy.contains('Edit');
    cy.contains('Delete');
    cy.contains('This is an awesome task');
    cy.contains('And it has an awesome description');
  });

  it('Adds a new task step', () => {
    cy.logIn(COACH_EMAIL);

    cy.contains('My Clients').click();
    cy.get('div[title="John Doe"]').click();
    cy.contains('View Steps').click();
    cy.get('div.content')
      .contains('Edit')
      .click();
    cy.get('.add-step-link').click();
    cy.get('textarea[name="steps[0].text"]')
      .clear()
      .type('My first step');
    cy.contains('SAVE TO WORKPLAN').click();

    cy.contains('Edit');
    cy.contains('Delete');
    cy.contains('My first step');
  });

  it('Edit task steps', () => {
    cy.logIn(COACH_EMAIL);

    cy.contains('My Clients').click();
    cy.get('div[title="John Doe"]').click();
    cy.contains('View Steps').click();
    cy.get('div.content')
      .contains('Edit')
      .click();
    cy.get('textarea[name="steps[0].text"]')
      .clear()
      .type('My first step (edited)');
    cy.contains('SAVE TO WORKPLAN').click();

    cy.contains('Edit');
    cy.contains('Delete');
    cy.contains('My first step (edited)');
  });
});
