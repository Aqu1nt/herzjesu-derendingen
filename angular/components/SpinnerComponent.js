import {Bind, Component, View} from "ng-next"

@Component("spinner")
@View("<i class='fa fa-spinner' ng-show='$ctrl.trigger' ng-class='{\"fa-spin\" : $ctrl.trigger}'></i>")
export class SpinnerComponent
{
    /**
     * Trigger which activates the spinner
     */
    @Bind("=") trigger;
}
