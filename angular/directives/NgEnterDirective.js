import {Directive} from "ng-next"

@Directive("ngEnter")
export class NgEnter
{
    
    scope = { ngEnter : "&" };

    link($scope, $element, $attrs)
    {
        $element.on("keypress", e => e.which == 13 ? $scope.ngEnter() : null);
    }
}