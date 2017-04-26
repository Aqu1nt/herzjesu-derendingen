import {Inject, Service} from "ng-next"

@Service("EventService")
export class EventService
{
    /**
     * @type {ApiService}
     */
    @Inject ApiService;

    /**
     * @return all future events
     */
    get()
    {
        return this.ApiService.get("/events");
    }

    /**
     * @param event the event which must be stored
     * @param update
     */
    store(event, update = false)
    {
        delete event.flyer;
        delete event.img;
        if (update) return this.update(event);
        return this.ApiService.post("/events", event);
    }

    /**
     * Updates the given event
     * @param event
     * @return {*}
     */
    update(event)
    {
        return this.ApiService.put(`/events/${event.id}`, event);
    }

    /**
     * Deletes the given event
     * @param event
     */
    delete(event)
    {
        return this.ApiService.delete(`/events/${event.id}`);
    }

    /**
     * @return all used locations to autofill
     */
    locations()
    {
        return this.ApiService.get("/events/locations");
    }
}