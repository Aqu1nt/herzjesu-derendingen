import {Watch, On, Inject, Component} from "ng-next"


/**
 * Allows you to set the page title either with $rootScope.pageTitle = "..."
 * or @State({ pageTitle : "..." })
 */
@Component({
    restrict : "A",
    selector : "pageTitle"
})
export class PageTitleComponent
{
    /**
     * The default title used when $rootScope.pageTitle isn't set
     * @type {string}
     */
    static DEFAULT_PAGE_TITLE = "Index";

    /**
     * Needed to set the content
     */
    @Inject $element;

    /**
     * The title is always stored
     * in $rootScope.pageTitle
     */
    @Inject $rootScope;


    /**
     * Watch for changes on the pageTitle and
     * update the DOM-Element
     * @param title
     */
    @Watch("$rootScope.pageTitle")
    titleChanged(title)
    {
        this.$element.text(title || PageTitleComponent.DEFAULT_PAGE_TITLE);
    }

    /**
     * Listen to state changes and set the <title></title>
     * according to the property set on the state
     * @param event
     * @param $state
     */
    @On("$stateChangeSuccess")
    stateChanged(event, $state)
    {
        if ($state.pageTitle)
        {
            this.$rootScope.pageTitle = `${PageTitleComponent.DEFAULT_PAGE_TITLE} | ${$state.pageTitle}`;
        }
    }
}