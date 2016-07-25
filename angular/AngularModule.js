import 'angular-ui-router'
import 'angular-animate'
import 'angular-sanitize'
import 'angular-ui-bootstrap'
import 'angular-toastr'

/* ==========================================
 *               Plugins
 * ======================================== */
const plugins = [];
plugins.push("ui.router");
plugins.push("ngAnimate");
plugins.push("ngSanitize");
plugins.push('ui.bootstrap');
plugins.push('toastr');

/**
 * This is the main Angular Application
 * This file should never be modified in any way, to add
 * new components use the corresponding files at the top!
 */
let App = angular.module("herzjesu", plugins);
export default App;