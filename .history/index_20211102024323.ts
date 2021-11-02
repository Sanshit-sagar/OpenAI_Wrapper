import fs from 'fs'
import path from 'path' 
import pino from 'pino'
import fastify, {FastifyRequest } from 'fastify'

const server = fastify({
    logger: {
        level: 'info',
        file: './log/auth.txt',
        prettyPrint: true,
        redact: ['req.headers.authorization'],
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
    http2: true,
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
    return 'pong'
})

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders,
}>('/auth', {
    preValidation: async (request, reply) => {
        const { username, password } = request.query
        server.log.info(stringifyLoginDetails(username, password))

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