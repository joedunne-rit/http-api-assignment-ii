const http = require('http');
const url = require('url');

const pageHandler = require('./pageResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': pageHandler.getIndex,
    '/style.css': pageHandler.getStyle,
    '/getUsers': '',
    //'/notReal': '',
  },
  HEAD: {
    '/getUsers': '',
    //'/notReal': '',
  },
  POST: {
    //'/AddUser': '',
  },
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (!urlStruct[request.method][parsedURL.pathname]) {
    //return urlStruct[request.method]['/notReal'](request, response);
  }

  if (urlStruct[request.method][parsedURL.pathname]) {
    return urlStruct[request.method][parsedURL.pathname](request, response);
  }
  //return urlStruct[request.method]['/notReal'](request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
