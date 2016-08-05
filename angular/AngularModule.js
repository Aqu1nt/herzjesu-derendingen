import 'angular-ui-router'
import 'angular-animate'
import 'angular-sanitize'
import 'angular-ui-bootstrap'
import 'angular-toastr'
import 'angularjs-datepicker'
import 'angular-sweetalert'
import 'sweetalert'
import 'ng-file-upload'

/* ==========================================
 *               Plugins
 * ======================================== */
const plugins = [];
plugins.push("ui.router");
plugins.push("ngAnimate");
plugins.push("ngSanitize");
plugins.push('ui.bootstrap');
plugins.push('toastr');
plugins.push('720kb.datepicker');
plugins.push('oitozero.ngSweetAlert');
plugins.push('ngFileUpload');

/**
 * This is the main Angular Application
 * This file should never be modified in any way, to add
 * new components use the corresponding files at the top!
 */
let App = angular.module("herzjesu", plugins);
export default App;