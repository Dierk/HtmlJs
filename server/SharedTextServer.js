
import { createServer }      from 'node:http';
import { handleFileRequest } from "./fileRequestHandler.js";

// small inline Observable that will most likely suffer from memory leaks
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
const port      = 8080;
const baseURL   = `http://${hostname}:${port}`

const textObservable = Observable("");

let eventId = 1;

function handleSSEstart(res, req) {
    console.log("client accepts", req.headers['accept']); // should contain "text/event-stream"
    const lastEventId = req.headers['last-event-id'];
    if (lastEventId) {
        // we can resurrect the state of an old connection
        console.info("got a last event id: " + lastEventId);
    } else {
        // we have a new connection
        req.on('close', ()  => console.log("connection closed"));
        req.on('error', err => {
            if("aborted" === err.message) return; // socket closed => connection closed
            console.log(err.stack);
        });
        console.log("new SSE connection");
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    const sendText = text => {
        eventId++;
        res.write('id:'    + eventId + '\n');
        res.write('event:' + "sharedText" + '\n');
        res.write('data:'  + JSON.stringify({text}) + '\n\n');
    };
    textObservable.onChange(sendText);
    sendText(textObservable.getValue());
}

function handleTextUpdate(res, req) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const text = new URL(baseURL + req.url).searchParams.get('text');
    textObservable.setValue(text);
    res.end("ok");
}

const server = createServer( (req, res) => {
  console.log(req.method, req.url);
  if ( req.url === "/sharedText") {
      handleSSEstart(res, req);
      return;
  }
  if ( req.url.startsWith("/updateText?") ) {
      handleTextUpdate(res, req);
      return;
  }
  handleFileRequest(req, res);
});

server.listen(port, () => {
  console.log(`Server running at ${baseURL}`);
});
