import {Controller, Inject} from "../utils/Decorators"

@Controller("EventsSectionController")
export class EventsSectionController
{

    /**
     * The service in order to create the modal
     * @type {EventModalService}
     */
    @Inject EventModalService;
    
    newEvent()
    {
        this.EventModalService.createEvent();
    }
}