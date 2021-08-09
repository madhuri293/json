import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

    private config: Object;
    private env: Object;

    constructor(private http: HttpClient) {
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/config/env.json').subscribe((envResponse: any) => {
                this.env = envResponse;
                let request: any = null;

                switch (envResponse.env) {
                    case 'production': {
                        request = this.http.get('./assets/config/config.production.json');
                    } break;

                    case 'development': {
                        request = this.http.get('./assets/config/config.development.json');
                    } break;

                    case 'default': {
                        console.error('Environment file is not set or invalid');
                        resolve(true);
                    } break;
                }

                if (request) {
                    request
                        .subscribe((responseData) => {
                            this.config = responseData;
                            resolve(true);
                        });
                } else {
                    resolve(true);
                }
            });

        });
    }

    public readPathConfig() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/path.json').subscribe((pathResponse: any) => {
                localStorage.setItem('path', JSON.stringify(pathResponse));

                resolve(true);
            }, (error) => {
                resolve(true);
            });
        });
    }
}
