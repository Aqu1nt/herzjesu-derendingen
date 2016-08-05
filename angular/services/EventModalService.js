import {Inject, Init} from "../utils/Decorators"
import {Service} from "../utils/Angular2to1/Angular2to1"
import moment from "moment"

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
        return this.editEvent(null);
    }

    editEvent(event)
    {
        this.modal = this.$uibModal.open({
            templateUrl : "/views/common/event-modal.html",
            controller : EventModalController,
            controllerAs : "modalCtrl",
            resolve : {
                event : () => event
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

    /**
     * The scope used to close the modal
     */
    @Inject $scope;

    /**
     * @type {EventService}
     */
    @Inject EventService;

    /**
     * The toastr service to inform the user about
     * the store operation
     */
    @Inject toastr;

    /**
     * The format of the datepicker
     */
    FORMAT = "dd.MM.yyyy";

    /**
     * Indicator if the event is getting created or modified
     * @type {boolean}
     */
    create = false;

    TODAY = moment().startOf('day');
    TOMORROW = this.TODAY.add(1, 'days');

    /**
     * The default event which is used if no event was given
     * @type {{date: *, start: Date, end: Date}}
     */
    DEFAULT_EVENT = {
        date : this.TOMORROW.format(this.FORMAT.toUpperCase()),
        start : moment(this.TOMORROW).add(12, 'hours').toDate(),
        end : moment(this.TOMORROW).add(17, 'hours').toDate(),
        title : "",
        desc : "",
        location : ""
    };

    /**
     * Indicator if an event is being created
     * @type {boolean}
     */
    creatingEvent = false;

    /**
     * Indicator if an event is being deleted
     * @type {boolean}
     */
    deletingEvent = false;

    /**
     * Array with all known locations
     * @type {Array}
     */
    locations = [];


    constructor()
    {
        if (!this.event) {
            this.event = this.DEFAULT_EVENT;
            this.create = true;
        }
        else {
            this.event.date = moment(this.event.date).format(this.FORMAT.toUpperCase());
            this.event.start = new Date(this.event.start);
            this.event.end = new Date(this.event.end);
            this.create = false;
        }
    }

    @Init async loadLocations()
    {
        this.locations = await this.EventService.locations();
    }

    /**
     * Deletes the current event
     */
    async delete()
    {
        //Impossible call
        if (this.create) {
            return;
        }

        this.deletingEvent = true;
        try
        {
            await this.EventService.delete(this.event);
            this.toastr.success(`Der Anlass ${this.event.title} wurde erfolgreich gelöscht`, "Löschen");
            this.$scope.$close(true);
        } catch (e)
        {
            this.toastr.error(`Der Anlass ${this.event.title} konnte nicht gelöscht werden`, "Fehler");
        } finally
        {
            this.deletingEvent = false;
        }
    }

    /**
     * Submits the event, triggers either a save or an update
     */
    async submit()
    {
        let event = Object.assign({}, this.event);
        event.start = event.start.getTime();
        event.end = event.end.getTime();
        event.date = moment(event.date, this.FORMAT.toUpperCase()).valueOf();
        this.applyDateToEvent(event);

        if (!this.locations.includes(event.location)) {
            this.locations.push(event.location);
        }

        try
        {
            this.creatingEvent = true;
            let result = await this.EventService.store(event, !this.create);
            this.$scope.$close(result);
            this.toastr.success(`Der Anlass wurde erfolgreich ${this.create ? 'erstellt' : 'gespeichert'}!`, `${event.title} - ${moment(event.date).format(this.FORMAT.toUpperCase())}`);
        }
        catch (e)
        {
            this.toastr.error("Es ist ein Fehler aufgetreten, der Anlass konnte nicht gespeichert werden!", "Fehler");
        }
        finally
        {
            this.creatingEvent = false;
        }

    }

    applyDateToEvent(event)
    {
        if (!event.date) return;

        let date = moment(event.date);
        let start = moment(event.start);
        let end = moment(event.end);

        let merge = (date, time) => {
           return moment(date).add(time.hours(), 'hours').add(time.minutes(), 'minutes').add(time.seconds(), 'seconds');
        };

        event.start = merge(date, start).valueOf();
        event.end = merge(date, end).valueOf();
    }
}

