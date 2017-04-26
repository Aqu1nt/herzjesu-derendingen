import {Config} from "ng-next"
import UAParser from "ua-parser-js"

export class Configuration
{
    @Config
    disableTooltipOnMobiles($uibTooltipProvider)
    {
        let parser = new UAParser();
        let result = parser.getResult();
        let touch = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');
        
        if ( touch ){
            $uibTooltipProvider.options({trigger: 'dontTrigger'});
        } else {
            $uibTooltipProvider.options({trigger: 'mouseenter'});
        }
    }

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