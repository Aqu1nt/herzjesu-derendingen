import {Inject, Service} from "ng-next"

@Service("InputService")
export class InputService
{
    /**
     * Bootstrap modal service
     */
    @Inject $uibModal;

    /**
     * The modal instance
     */
    instance = null;

    /**
     * Opens a new input window
     * @return {*}
     */
    input(config = {})
    {
        config = Object.assign({
            title : "Eingabe benötigt",
            text : null,
            value : null,
            placeholder : "Ihre Eingabe...",
            button : "Ok",
            cancel : null
        }, config);

        this.instance = this.$uibModal.open({
            controller : InputModalController,
            controllerAs : "inputCtrl",
            templateUrl : "/views/common/input-modal.html",
            resolve : {
                title : () => config.title,
                text : () => config.text,
                value : () => config.value,
                placeholder : () => config.placeholder,
                button : () => config.button,
                cancel : () => config.cancel
            }
        });
        return this.instance.result;
    }
}


/**
 * Controller for the input modal
 */
export class InputModalController
{

    /**
     * Scope of the modal
     */
    @Inject $scope;

    /**
     * The title of the modal
     * @type {string}
     */
    @Inject title;

    /**
     * Some additional which can be displayed
     */
    @Inject text;

    /**
     *  the value of this input
     * @type {string}
     */
    @Inject value;

    /**
     * The placeholder of the input field
     */
    @Inject placeholder;

    /**
     * The text of the button
     */
    @Inject button;

    /**
     * Cancel button text, null if no cancel button
     */
    @Inject cancel;

    /**
     * Submits the input modal
     */
    submit()
    {
        this.close(this.value);
    }

    /**
     * Closes the modal and returns a possible result
     * @param result
     */
    close(result)
    {
        this.$scope.$close(result);
    }

    /**
     * Dismisses the modal
     * @param reason
     */
    dismiss(reason)
    {
        console.log(this.$scope);
        this.$scope.$dismiss(reason);
    }

}