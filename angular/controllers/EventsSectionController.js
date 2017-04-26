import {Init} from "ng-next"
import {Inject, Controller} from "ng-next"
import moment from "moment"


@Controller("EventsSectionController")
export class EventsSectionController
{
    /**
     * The service in order to create the modal
     * @type {EventModalService}
     */
    @Inject EventModalService;

    /**
     * @type {EventService}
     */
    @Inject EventService;

    /**
     * Angular scope
     */
    @Inject $scope;

    /**
     * Error when loading events
     * @type {null}
     */
    error = null;

    /**
     * All curent events
     * @type {Array}
     */
    events = [];

    /**
     * The next event
     * @type {Array | undefined}
     */
    event = undefined;

    /**
     * The element on which the owl carousel is located onto
     * @type {null}
     */
    $element = null;

    /**
     * Indicator if events are loading
     * @type {boolean}
     */
    loadingEvents = true;

    /**
     * Shows the modal to create a new event
     */
    async newEvent()
    {
        let result = await this.EventModalService.createEvent();
        if (result)
        {
            await this.reloadEvents();
            return result;
        }
    }

    /**
     * Shows the modal to edit the event
     * @param event
     */
    async editEvent(event)
    {
        event = Object.assign({}, event);
        delete event._date;
        delete event._start;
        delete event._end;
        delete event.distance;
        delete event.dayOfWeek;
        let result = await this.EventModalService.editEvent(event);
        if (result) {
            await this.reloadEvents();
        }
        return result;
    }

    async reloadEvents()
    {
        this.$element.trigger('destroy.owl.carousel');
        this.$element.find('.owl-stage-outer').children().unwrap();
        await this.loadEvents();
    }

    /**
     * Loads all events an populates the owl carousel
     */
    @Init async loadEvents()
    {
        try
        {
            //Fetch events from the server
            this.loadingEvents = true;
            this.error = null;
            await this.fetchEvents();
        }
        catch (e)
        {
            console.error(e);
            this.error = e;
        }
        finally
        {
            this.loadingEvents = false;
        }

        //Set the element
        if (!this.$element) {
            this.$element = $('.owl-carousel.events-slider');
        }

        //Helper to create some nice animations
        function addDelay(ele, delay)
        {
            delay += "s";
            $(ele).css("animation-delay", delay);
        }

        this.$element.find(".initialized").remove();

        /**
         * Events owl-carousel
         */
        this.$element.owlCarousel(
            {
                loop : false,
                responsiveClass : true,
                nav : true,
                navText : [ '<i class="fa fa-angle-left">',
                    '<i class="fa fa-angle-right">' ],
                autoplay : false,
                responsive : {
                    0 : {
                        items : 1
                    },
                    480 : {
                        items : 2
                    },
                    768 : {
                        items : 3
                    }
                }
            });

        /**
         * Events animation Delay
         */
        $('.event').each(function(i){
            addDelay(this, i * 0.25);
            $(this).addClass("initialized", true);
            $(this).removeClass("hidden");
        });
    }

    /**
     * Fetches all future events from the server
     */
    async fetchEvents()
    {
        //Fetch the events
        this.events = await this.EventService.get();
        for (let event of this.events) {
            event.distance = moment.duration(event.start - new Date().getTime()).humanize(true);
            event.dayOfWeek = moment(parseInt(event.date)).format("dddd");
            event.date = new Date(parseInt(event.date));
            event.start = new Date(parseInt(event.start));
            event.end = parseInt(event.end);
            event._date = moment(event.date).format("DD.MM.YYYY");
            event._start = moment(event.start).format("HH:mm");
            event._end = moment(event.end).format("HH:mm");
        }
        this.event = this.events[0];
    }
}

