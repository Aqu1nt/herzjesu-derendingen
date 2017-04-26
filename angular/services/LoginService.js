import {Inject, Service} from "ng-next"


@Service("LoginService")
export class LoginService
{

    /**
     * @type{ApiService}
     */
    @Inject ApiService;

    /**
     * The uib modal to show the login window
     */
    @Inject $uibModal;

    /**
     * The modal instance
     * @type {{ dismiss : fn, close : fn , result : Promise} | null}
     */
    modal = null;

    /**
     * Shows the login user modal
     * @return Promise
     */
    login()
    {
        this.modal = this.$uibModal.open({
            templateUrl : "/views/common/login-modal.html",
            controllerAs : "modalCtrl",
            controller : LoginModalController
        });
        return this.modal.result;
    }
}

class LoginModalController
{
    /**
     * Duration of the animation when a login was unsuccesful
     * @type {number}
     */
    static SHAKE_DURATION = 500;

    /**
     * @type {string}
     */
    password = "";

    /**
     * Indicator if the modal should be shaking
     * @type {boolean}
     */
    shake = false;

    /**
     * Indicator if a login is in progress
     * @type {boolean}
     */
    loggingIn = false;

    /**
     * Timeout to shake for a certain amount of time
     */
    @Inject $timeout;

    /**
     * Scopes
     */
    @Inject $scope;

    /**
     * @type {AuthenticationService}
     */
    @Inject AuthenticationService;

    async submit()
    {
        this.loggingIn = true;
        if (await this.AuthenticationService.login(this.password))
        {
            this.$scope.$close()
        } else {
            this.reject();
        }
        this.loggingIn = false;
    }

    reject()
    {
        this.shake = true;
        this.password = "";
        this.$timeout(() => this.shake = false, LoginModalController.SHAKE_DURATION);
    }
}