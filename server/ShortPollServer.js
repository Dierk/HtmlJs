
import { createServer }      from 'node:http';
import { handleFileRequest } from "./fileRequestHandler.js";

const hostname  = '127.0.0.1';
const port      = 3000;

let counter = 0;

const server = createServer( (req, res) => {
  console.dir(req.method, req.url);
  if ( req.url === "/counter") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('Hello World: '+ (counter++) ));
    return;
  }
  handleFileRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
