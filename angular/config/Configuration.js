import {Config} from "../utils/Decorators"

export class Configuration
{
    @Config
    removeHashtag($locationProvider)
    {
        "ngInject"
        $locationProvider.html5Mode({
            requireBase : false,
            enabled : true
        });
    }
}