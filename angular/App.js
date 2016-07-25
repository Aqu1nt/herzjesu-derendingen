import "angular"
import "babel-polyfill"

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

/* ==========================================
 *              Components
 * ======================================== */
import "./components/PageTitleComponent"

/* ==========================================
 *               Directives
 * ======================================== */
import "./directives/NgEnterDirective"
import "./directives/BtnRightDirective"


/* ==========================================
 *              Other Stuff
 * ======================================== */
import "./config/Configuration"