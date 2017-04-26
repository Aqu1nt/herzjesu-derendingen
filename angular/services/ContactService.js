import {Service, Inject} from "ng-next";

@Service("ContactService")
export class ContactService
{

    /**
     * @type {ApiService}
     */
    @Inject ApiService;

    /**
     * @param form
     */
    sendContactForm(form)
    {
        return this.ApiService.post("/contact", form);
    }
}