#!/usr/bin/env node
import http from 'http';
import app from '../app';

const port = Number(process.env.PORT || '5000');;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => { console.log(`Listening on port ${port}`); });
