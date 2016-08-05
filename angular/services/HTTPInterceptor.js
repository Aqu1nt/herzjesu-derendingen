import {Inject, Config, Self} from "../utils/Decorators"
import {Service} from "../utils/Angular2to1/Angular2to1"

/**
 * This is the Interceptor used to intercept each
 * HTTP call done by the $http service
 * see https://docs.angularjs.org/api/ng/service/$http/#interceptors for usage
 */
@Service
export class HTTPInterceptor
{

    /**
     * We need the $q service to reject errors up
     * the chain
     */
    @Inject $q;

    /**
     * Register the Interceptor
     * @param $httpProvider
     */
    @Config
    register($httpProvider)
    {
        "ngInject";

        $httpProvider.interceptors.push(HTTPInterceptor.name);
    }

    @Self
    request(request)
    {
        //Do something with the request here
        return request;
    }

    @Self
    requestError(rejection)
    {
        //Do something with the rejection here
        return this.$q.reject(rejection);
    }

    @Self
    response(response)
    {
        //Do something with the request here
        return response;
    }

    @Self
    responseError(rejection)
    {
        //Do something with the rejection here
        return this.$q.reject(rejection);
    }
}