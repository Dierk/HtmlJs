
import { createServer }      from 'node:http';
import { handleFileRequest } from "./fileRequestHandler.js";

const hostname  = '127.0.0.1';
const port      = 3000;

let counter = 0;
let eventId = 1;

const server = createServer( (req, res) => {
  console.dir(req.method, req.url);
  if ( req.url === "/counter") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    const lastEventId = req.headers['last-event-id'];
    if (lastEventId) {
      console.info("got a last event id: " + lastEventId);
    }

    setInterval( () => {
      counter++;
      eventId++;
      res.write('id:'     + eventId   + '\n');
      res.write('event:'  + "counter" +'\n');
      res.write('data:'   + JSON.stringify({counter}) +'\n\n');
    }, 1000);

    return;
  }
  handleFileRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
