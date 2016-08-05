import {Inject} from "../utils/Decorators"
import {Service} from "../utils/Angular2to1/Angular2to1"

/**
 * Class which is responsible for every interaction with
 * the WebServer! You should never ever use $http or $resource
 * directly.
 */
@Service
export class ApiService
{
    /**
     * Set the host of the api, takes
     * the current host if not set
     * @type {undefined | string}
     */
    static HOST = undefined;

    /**
     * Set the port of the api, takes the
     * current port if not set
     * @type {undefined | number }
     */
    static PORT = undefined;

    /**
     * The base url for each request
     * @type {string}
     */
    static BASE_URL = "/api/v1";

    /**
     * The header name for the authentication token
     * added to each request
     * @type {string}
     */
    static AUTH_TOKEN_HEADER_NAME = "Authorization";

    /**
     * Angular $http service
     * @type { { get:function, post:function, put:function, delete:function, defaults : {} } }
     */
    @Inject $http;

    /**
     * Angular location service used to build the correct url
     * @type {*}
     */
    @Inject $location;

    /**
     * Does a GET Request and returns the data of the
     * response
     * @param {string} url
     * @param { * } [config]
     */
    get(url, config)
    {
        return this.$http.get(this.apiURL(url), config).then(r => r.data);
    }

    /**
     * Does a POST Request and returns the data of the
     * response
     * @param {string} url
     * @param {object} [data]
     * @param { * } [config]
     */
    post(url, data, config)
    {
        return this.$http.post(this.apiURL(url), data, config).then(r => r.data);
    }

    /**
     * Does a PUT Request and returns the data of the
     * response
     * @param {string} url
     * @param {object} data
     * @param { * } [config]
     */
    put(url, data, config)
    {
        return this.$http.put(this.apiURL(url), data, config).then(r => r.data);
    }

    /**
     * Does a DELETE Request and returns the data of the
     * response
     * @param {string} url
     * @param { * } [config]
     */
    delete(url, config)
    {
        return this.$http.delete(this.apiURL(url), config).then(r => r.data);
    }

    /**
     * Returns an url with injected ApiService.HOST and ApiService.BASE_URL
     * @param {string} url
     * @return {string}
     */
    apiURL(url)
    {
        let host = ApiService.HOST || this.$location.host();
        let port = ApiService.PORT || this.$location.port();
        return this.$location.protocol() + "://" + host + ":" + port + ApiService.BASE_URL + url;
    }

    /**
     * Instructs the ApiService to authenticate itself with the given token
     * on each request
     * @param {string} token
     */
    authenticateWith(token)
    {
        this.$http.defaults.headers.common[ApiService.AUTH_TOKEN_HEADER_NAME] = "Bearer " + token;
    }

    /**
     * Instruct the ApiService to stop authenticating itself
     */
    dontAuthenticate()
    {
        delete this.$http.defaults.headers.common[ApiService.AUTH_TOKEN_HEADER_NAME];
    }

    /**
     * Performs a full text search
     * @param text the text to search
     * @param [options]
     */
    search(text, options)
    {
        return this.get(`/search?q=${text}`, options);
    }
}