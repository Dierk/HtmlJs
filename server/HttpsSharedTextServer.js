
import https                 from 'node:https';
import fs                    from 'node:fs';
import { handleFileRequest } from "./fileRequestHandler.js";

import { channelName, updateActionName, updateActionParam } from "./sharedConstants.js";

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

const hostname  = 'localhost';
const port      = 443;
const baseURL   = `https://${hostname}:${port}`

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
        req.on('close', ()  => {
            console.log("connection closed");
            // todo: remove from observable listeners
            res.end(); // not really needed. Just to be clean.
        });
        req.on('error', err => {
            if("aborted" === err.message) return; // socket closed => connection closed
            console.log(err.stack);
            // todo: remove from observable listeners
            res.end(); // not really needed. Just to be clean.
        });
        console.log("new SSE connection");
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    const sendText = text => {
        eventId++;
        res.write('id:'    + eventId + '\n');
        res.write('event:' + channelName + '\n');
        res.write('data:'  + JSON.stringify( { [updateActionParam]: text } ) + '\n\n');
    };
    textObservable.onChange(sendText);
    sendText(textObservable.getValue());
}

function handleTextUpdate(res, req) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const text = new URL(baseURL + req.url).searchParams.get(updateActionParam);
    textObservable.setValue(text);
    res.end("ok");
}

const options = {
  key:  fs.readFileSync('./private-key.pem'),
  cert: fs.readFileSync('./certificate.pem')
};

const server = https.createServer( options, (req, res) => {
  console.log(req.method, req.url);
  if ( req.url === "/"+channelName) {
      handleSSEstart(res, req);
      return;
  }
  if ( req.url.startsWith("/"+updateActionName+"?") ) {
      handleTextUpdate(res, req);
      return;
  }
  handleFileRequest(req, res);
});

server.listen(port, () => {
  console.log(`Server running at ${baseURL}`);
});


/*
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.cert')
};

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);
* */
