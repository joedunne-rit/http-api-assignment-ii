const http = require('http');
const url = require('url');
const query = require('querystring');

const pageHandler = require('./pageResponses.js');
const userHandler = require('./userResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': pageHandler.getIndex,
    '/style.css': pageHandler.getStyle,
    '/getUsers': userHandler.getUsers,
    '/notReal': userHandler.notFound,
  },
  HEAD: {
    '/getUsers': userHandler.getUsersHead,
    '/notReal': userHandler.notFoundHead,
  },
  POST: {
    '/addUser': userHandler.addUser,
  },
};

const handlePost = (request, response, parsedURL) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    urlStruct[request.method][parsedURL.pathname](request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  console.log(parsedURL.pathname);

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD['/notReal'](request, response);
  }

  if (urlStruct[request.method][parsedURL.pathname]) {
    if (request.method === 'POST') {
      return handlePost(request, response, parsedURL);
    }
    return urlStruct[request.method][parsedURL.pathname](request, response);
  }
  return urlStruct[request.method]['/notReal'](request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
