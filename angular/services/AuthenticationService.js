import {Service, Inject, Init} from "../utils/Decorators"

@Service("AuthenticationService")
export class AuthenticationService
{

    /**
     * @type {ApiService}
     */
    @Inject ApiService;

    /**
     * Indicator if the user is currently logged in
     * @type {boolean | null}
     */
    loggedIn = null;

    constructor() { this.fetchIsLoggedIn(); }

    /**
     * Fetches the loggedin status from the server
     * @returns {boolean}
     */
    async fetchIsLoggedIn()
    {
        let response = await this.ApiService.get('/auth/isLoggedIn');
        return this.loggedIn = response.loggedIn;
    }

    /**
     * Attempts to perform a general login with the provided
     * password, returns true if the login was successful and
     * false otherwise
     * @async
     * @param password
     * @returns {boolean}
     */
    async login(password)
    {
        try
        {
            let success = await this.ApiService.post('/auth/login', {
                email : 'admin@herzjesu-derendingen.ch',
                password : password
            });

            if (!!success) {
                this.loggedIn = true;
            }

            return !!success;
        } catch (e)
        {
            return false;
        }
    }

    async logout()
    {
        await this.ApiService.post('/auth/logout');
        this.loggedIn = false;
    }
}