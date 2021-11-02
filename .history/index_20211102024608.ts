import fs from 'fs'
import path from 'path' 
import fastify, {FastifyRequest } from 'fastify'
import { IncomingMessage, Server } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';

const server = fastify({
    logger: {
        level: 'info',
        file: './log/auth.txt',
        prettyPrint: true,
        serializers: {
            req (req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>) {
              return {
                method: req.method,
                url: req.url,
                headers: req.headers,
                hostname: req.hostname,
                remoteAddress: req.ip,
                remotePort: req.socket.remotePort
              }
            }
        }
    },
    https: {
        key: fs.readFileSync(path.join(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    }
});

interface IQuerystring {
    username: string;
    password: string; 
}
interface IHeaders {
    'h-Custom': string; 
}

const stringifyLoginDetails = (username: string, password: string) => {
    return `Authentication Attempt -> user: ${username} | password: ${password}`;
}

server.get('/ping', async (req, res) => {
    req.log.info(`pinging: ${JSON.stringify(req)}`)
    return 'pong'
});

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders,
}>('/auth', {
    preValidation: async (request, reply) => {
        const { username, password } = request.query
        request.log.info(stringifyLoginDetails(username, password))

        return username!=='admin' ? new Error('must be admin') : undefined;
    }
}, async (request, reply) => {
    const customHeader = request.headers['h-Custom'] 
    return `logged in`; 
});

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})