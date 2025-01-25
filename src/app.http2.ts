import fs from 'node:fs';
import http2 from 'node:http2';

const server = http2.createSecureServer({
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt')
},(req, res) => {

    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/plain');
    //res.end('Hello World\n');

    //   res.writeHead(200, { 'Content-Type': 'text/html' });
    //   res.write('<h1>Hello, World!</h1>');
    //   res.end();

    // const data = { name: 'John Doe', age: 30 };
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(data))

    if (req.url === '/') {

        const htmlFile = fs.readFileSync('./public/index.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlFile);
        return;
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }

    if(req.url?.endsWith('.js')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
    } else if(req.url?.endsWith('.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
    }

    try {
        const responseContent = fs.readFileSync(`./public${req.url}`, 'utf8');
        res.end(responseContent);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }

});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});