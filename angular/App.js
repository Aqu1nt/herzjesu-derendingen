import "babel-polyfill"
import "angular"
import "jquery"
import "./AngularModule"

import 'owl.carousel';
import "./plugins/angular-owl-carousel"

import "js/queryloader2.min.js"
import "js/bootstrap.min.js"
import "js/jquery.hoverIntent.min.js"
import "js/jquery.nicescroll.min.js"
import "js/jquery.debouncedresize.js"
import "js/skrollr.min.js"
import "js/jquery.magnific-popup.min.js"
import "js/main.js"

import "moment/locale/de"
import moment from "moment"
moment.locale("de");


/* ==========================================
 *              Controllers
 * ======================================== */
import "./controllers/RootController"
import "./controllers/HomeController"
import "./controllers/WelcomeSectionController"
import "./controllers/EventsSectionController"
import "./controllers/GallerySectionController"
import "./controllers/ContactSectionController"
import "./controllers/PeopleSectionController"
import "./controllers/LinksSectionController"
import "./controllers/HistorySectionController"

/* ==========================================
 *               Services
 * ======================================== */
import "./services/ApiService"
import "./services/HTTPInterceptor"
import "./services/LoginService"
import "./services/AuthenticationService"
import "./services/EventModalService"
import "./services/EventService"
import "./services/InputService"
import "./services/GalleryService"
import "./services/ContactService"
import "./services/PersonModalService"
import "./services/PersonService"

/* ==========================================
 *              Components
 * ======================================== */
import "./components/PageTitleComponent"
import "./components/SpinnerComponent"
import "./components/UniteGalleryComponent"

/* ==========================================
 *               Directives
 * ======================================== */
import "./directives/NgEnterDirective"
import "./directives/BtnFloatDirective"
import "./directives/AdminDirective"

/* ==========================================
 *              Other Stuff
 * ======================================== */
import "./config/Configuration"