'use strict';

const serverFailedToRespondMessage = 'The server failed to respond.',
      invalidUsernameMessage = 'Usernames must consist of groups of at least two and no more than sixteen numbers or lowercase letters, separated by dashes.',
      invalidPasswordMessage = 'Passwords must consist of at least eight letters, numbers or common punctuation symbols.',
      invalidEmailAddressMessage = 'The email address does not appear to be a valid one.',
      invalidConfirmationCodeMessage = 'Confirmation codes consist of eight alphabetical characters.',
      passwordsDoNoMatchMessage = 'The passwords do not match.',
      failedToLoginMessage = 'Failed to login. The message from the server is:',
      failedToRegisterMessage = 'Failed to register. The message from the server is:'

const messages = {
  serverFailedToRespondMessage: serverFailedToRespondMessage, 
  invalidUsernameMessage: invalidUsernameMessage,
  invalidPasswordMessage: invalidPasswordMessage,
  invalidEmailAddressMessage: invalidEmailAddressMessage,
  invalidConfirmationCodeMessage: invalidConfirmationCodeMessage,
  passwordsDoNoMatchMessage: passwordsDoNoMatchMessage,
  failedToLoginMessage: failedToLoginMessage,
  failedToRegisterMessage: failedToRegisterMessage
};

module.exports = messages;
