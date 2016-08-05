import {State, Inject, Debounce, Init, Alias, View} from "../utils/Decorators"

@State({
    name : "home",
    url : "/home",
    default : true
})
@Alias("homeCtrl")
@View("/views/home.html")
export class HomeController
{

    /**
     * All sections of the home page
     * @type {*[]}
     */
    sections = [
        { id : "welcome", name : null },
        { id : "events", name : "Anlässe" },
        { id : "gallery", name : "Gallerie" },
        { id : "contact", name : "Kontakt" },
        { id : "people", name : "Personen" },
        { id : "history", name : "Geschichte" },
        { id : "links", name : "Links" }
    ];

    /**
     * @type {LoginService}
     */
    @Inject LoginService;

    /**
     * @type {AuthenticationService}
     */
    @Inject AuthenticationService;

    /**
     * Toastr notifications
     */
    @Inject toastr;

    /**
     * Angular scope
     */
    @Inject $scope;

    /**
     * Indicator if a logout is in progess
     * @type {boolean}
     */
    loggingOut = false;

    /**
     * Initializes the boss template
     */
    @Init @Debounce(500) initBOSS()
     {
         Boss.init();
     }
    
    async login()
    {
        await this.LoginService.login();
        this.toastr.success("Sie können nun Inhalte bearbeiten!", "Login");
    }

    async logout()
    {
        this.loggingOut = true;
        await this.AuthenticationService.logout();
        this.loggingOut = false;
        this.toastr.success("Logout erfolgreich!", "Logout");
    }


    get loggedIn()
    {
        return this.AuthenticationService.loggedIn;
    }
}