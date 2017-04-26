import {Directive} from "ng-next"

@Directive("btnRight")
export class BtnRightDirective
{

    restrict = "AC";

    link($scope, $element)
    {
        $scope.$watch(() => $element.css("margin-left", `-${$element[0].offsetWidth}px`));
    }
}

@Directive("btnLeft")
export class BtnLeftDirective
{
    restrict = "AC";

    link($scope, $element)
    {
        $scope.$watch(() => $element.css("margin-right", `-${$element[0].offsetWidth}px`));
    }
}