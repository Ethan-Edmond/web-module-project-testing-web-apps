import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

const myTest = (string, cb) => {
  return test(string, () => {
    render(<ContactForm/>);
    cb();
  });
};

const firstName = () => {
  return screen.getByLabelText("First Name*");
};

const lastName = () => {
  return screen.getByLabelText("Last Name*");
};

const email = () => {
  return screen.getByLabelText("Email*");
};

const message = () => {
  return screen.getByLabelText("Message");
};

const header = () => {
  return screen.getByText("Contact Form");
};

const errors = () => {
  return screen.findAllByTestId("error");
};

const submit = () => {
  return screen.getByRole("button");
};

const fillOutForm = (messageBool) => {
  userEvent.type(firstName(), "Ethan");
  userEvent.type(lastName(), "Edmond");
  userEvent.type(email(), "eedmond@uccs.edu");
  if (messageBool){
    userEvent.type(message(), "Here's my message to you!");
  }
};

myTest('renders without errors', ()=>{
  // render(<ContactForm/>);
});

myTest('renders the contact form header', ()=> {
  expect(header()).toBeInTheDocument();
});

myTest('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  userEvent.type(firstName(), "asdf");
  expect((await errors()).length).toBe(1);

});

myTest('renders THREE error messages if user enters no values into any fields.', async () => {
  userEvent.click(submit());
  expect((await errors()).length).toBe(3);
});

myTest('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  userEvent.type(firstName(), "Ethan");
  userEvent.type(lastName(), "Edmond");
  userEvent.click(submit());
  expect((await errors()).length).toBe(1);
});

myTest('renders "email must be a valid email address" if an invalid email is entered', async () => {
  userEvent.type(email(), "asdfjlk");
  const emailErrors = await screen.findByText(/email must be a valid email address/);
  expect(emailErrors).toBeInTheDocument();
});

myTest('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  userEvent.click(submit());
  const lastNameError = await screen.findByText(/lastName is a required field/);
  expect(lastNameError).toBeInTheDocument();
});

myTest('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  fillOutForm(false);
  let firstNameDisplay = screen.queryByTestId("firstNameDisplay");
  expect(firstNameDisplay).not.toBeInTheDocument();
  let lastNameDisplay = screen.queryByTestId("lastNameDisplay");
  expect(lastNameDisplay).not.toBeInTheDocument();
  let emailDisplay = screen.queryByTestId("emailDisplay");
  expect(emailDisplay).not.toBeInTheDocument();
  userEvent.click(submit());
  firstNameDisplay = await screen.findByTestId("firstNameDisplay");
  expect(firstNameDisplay).toBeInTheDocument();
  lastNameDisplay = await screen.findByTestId("lastNameDisplay");
  expect(lastNameDisplay).toBeInTheDocument();
  emailDisplay = await screen.findByTestId("emailDisplay");
  expect(emailDisplay).toBeInTheDocument();
});

myTest('renders all fields text when all fields are submitted.', async () => {
  fillOutForm(true);
  let firstNameDisplay = screen.queryByTestId("firstNameDisplay");
  expect(firstNameDisplay).not.toBeInTheDocument();
  let lastNameDisplay = screen.queryByTestId("lastNameDisplay");
  expect(lastNameDisplay).not.toBeInTheDocument();
  let emailDisplay = screen.queryByTestId("emailDisplay");
  expect(emailDisplay).not.toBeInTheDocument();
  let messageDisplay = screen.queryByTestId("messageDisplay");
  expect(messageDisplay).not.toBeInTheDocument();
  userEvent.click(submit());
  firstNameDisplay = await screen.findByTestId("firstNameDisplay");
  expect(firstNameDisplay).toBeInTheDocument();
  lastNameDisplay = await screen.findByTestId("lastNameDisplay");
  expect(lastNameDisplay).toBeInTheDocument();
  emailDisplay = await screen.findByTestId("emailDisplay");
  expect(emailDisplay).toBeInTheDocument();
  messageDisplay = await screen.findByTestId("messageDisplay");
});
