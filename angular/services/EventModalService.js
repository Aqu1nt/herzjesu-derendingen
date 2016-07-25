import {Inject, Service} from "../utils/Decorators"

@Service("EventModalService")
export class EventModalService
{

    /**
     * The bootstrap modal service
     */
    @Inject $uibModal;

    /**
     * The current modal instance
     */
    modal = null;
    
    /**
     * Show a modal to create a new event
     */
    createEvent()
    {
        this.modal = this.$uibModal.open({
            templateUrl : "/views/common/event-modal.html",
            controller : EventModalController,
            controllerAs : "modalCtrl",
            resolve : {
                event : () => null
            }
        }); 
        return this.modal.result;
    }

    /**
     * Closes the current modal
     */
    close()
    {
        this.modal.close();
    }
}

/**
 * The controller used for the modal
 */
export class EventModalController
{

    /**
     * The event which must be modified, or
     * null if a new one should be created
     */
    @Inject event;

    constructor()
    {
        console.log(this.event);
    }
}