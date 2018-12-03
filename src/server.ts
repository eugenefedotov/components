import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from '@tsed/common';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as methodOverride from 'method-override';
import {createConnection} from 'typeorm';
import '@tsed/servestatic';
import * as Path from 'path';
import {API_CONTROLLERS} from './server/controllers/api';
import './server/middlewares/global-error-handler.middleware';

@ServerSettings({
    rootDir: Path.resolve(__dirname, 'server'),
    mount: {
        '/api': API_CONTROLLERS
    },
    serveStatic: {
        '/': '${rootDir}/static'
    },
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

    public $afterRoutesInit() {
        // this.use(NotFoundMiddleware);
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}

new Server().start();