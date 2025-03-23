
import { createServer }      from 'node:http';
import { handleFileRequest } from "./fileRequestHandler.js";

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => listeners.push(callback),
        getValue: ()       => value,
        setValue: val      => {
            if (value === val) return;
            value = val;
            listeners.forEach(notify => notify(val));
        }
    }
};

const hostname  = '127.0.0.1';
const port      = 3000;
const baseURL   = `http://${hostname}:${port}`

const textObservable = Observable("");

let eventId = 1;

const server = createServer( (req, res) => {
  console.dir(req.method, req.url);
  if ( req.url === "/sharedText") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    const lastEventId = req.headers['last-event-id'];
    if (lastEventId) {
      console.info("got a last event id: " + lastEventId);
    }
    const sendText = text => {
      eventId++;
      res.write('id:'     + eventId   + '\n');
      res.write('event:'  + "sharedText" +'\n');
      res.write('data:'   + JSON.stringify({text}) +'\n\n');
    }
    textObservable.onChange( sendText );
    sendText(textObservable.getValue());
    return;
  }
  if ( req.url.startsWith("/updateText?") ) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const text = new URL(baseURL+req.url).searchParams.get('text');
    textObservable.setValue(text);
    res.end("ok");
    return;
  }
  handleFileRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at ${baseURL}`);
});
