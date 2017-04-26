import {Controller, Inject} from "ng-next"

@Controller("ContactSectionController")
export class ContactSectionController
{
    form = {
        prename : "",
        surname : "",
        email : "",
        concern : "",
        message : ""
    };

    /**
     * Angular scope
     */
    @Inject $scope;

    /**
     * @type {ContactService}
     */
    @Inject ContactService;

    /**
     * SweetAlert notifications
     */
    @Inject SweetAlert;

    /**
     * True when the form was submitted successfully
     * @type {boolean}
     */
    formSubmitted = false;

    /**
     * true while the form is being submitted
     * @type {boolean}
     */
    formSubmitting = false;

    /**
     * Submits the form to the server if valid
     */
    async submit()
    {
        if (this.$scope.form.$invalid) return;
        try {
            this.formSubmitting = true;
            await this.ContactService.sendContactForm(this.form);
            this.SweetAlert.success("Danke, wir werden Sie bald per Email kontaktieren");
            for (let key of Object.keys(this.form)) this.form[key] = "";
            this.formSubmitted = true;
        } catch (e) {
             this.SweetAlert.error("Sorry, die Kontaktaufnahme hat nicht funktioniert!");
        } finally {
            this.formSubmitting = false;
        }
    }
}