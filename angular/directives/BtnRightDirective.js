import {Directive, Inject} from "../utils/Decorators"

@Directive("btnRight")
export class BtnRightDirective
{

    restrict = "AC";

    link($scope, $element)
    {
        $scope.$watch(() => $element.css("margin-left", `-${$element[0].offsetWidth}px`));
    }
}