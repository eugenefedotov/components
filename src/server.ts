import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from '@tsed/common';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as methodOverride from 'method-override';
import {createConnection} from 'typeorm';

@ServerSettings({
    rootDir: './src/server',
    mount: {
        '/api': '${rootDir}/controllers/api/**/*.ts'
    },
    componentsScan: [
        '${rootDir}/middlewares/**/*.ts',
        '${rootDir}/services/**/*.ts',
        '${rootDir}/converters/**/*.ts'
    ],
    acceptMimes: ['application/json'],
    httpPort: 8081
})
class Server extends ServerLoader {
    async $onInit() {
        await createConnection();
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void | Promise<any> {
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady() {
        console.log('Server started...');
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}

new Server().start();