const users = {};

const getUsers = (request, response) => {
  // Return user list as json object
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(users));
  response.end();
};

const getUsersHead = (request, response) => {
  response.writeHead(200, users);
  response.end();
};

// Function for returning addUser response
const addUserResponse = (request, response, status, message) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(message));
  response.end();
};

const addUser = (request, response, newUser) => {
  // If missing fields, return error
  const responseMessage = {
    message: 'Name and age required',
  };
  if (!newUser.name || !newUser.age) {
    responseMessage.id = 'missingParams';
    addUserResponse(request, response, 400, responseMessage);
    return;
  }
  // Check list of current users
  // If current user already exists, update their age
  if (users[newUser.name]) {
    users[newUser.name].age = newUser.age;
    responseMessage.message = 'User age updated';
    addUserResponse(request, response, 204, responseMessage);
    return;
  }
  // If user does not exist, create new user
  users[newUser.name] = {
    name: newUser.name,
    age: newUser.age,
  };
  responseMessage.message = 'New user created';
  addUserResponse(request, response, 201, responseMessage);
};

// returns error message if page is not found
const notFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  const errorMessage = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  response.write(JSON.stringify(errorMessage));
  response.end();
};

// returns error message meta data if page is not found
const notFoundHead = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end();
};

module.exports.getUsers = getUsers;
module.exports.getUsersHead = getUsersHead;
module.exports.addUser = addUser;
module.exports.notFound = notFound;
module.exports.notFoundHead = notFoundHead;
