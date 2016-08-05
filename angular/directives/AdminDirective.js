import {Directive, Inject} from "../utils/Decorators"

/**
 * Disables an element if the user is not logged in
 */
@Directive("admin")
export class AdminDirective
{

    /**
     * @type {AuthenticationService}
     */
    @Inject AuthenticationService;


    link($scope, $element)
    {
        $scope.$watch(() => this.AuthenticationService.loggedIn, loggedIn => {
            if (loggedIn) $element.show();
            else $element.hide();
        });
    }
}