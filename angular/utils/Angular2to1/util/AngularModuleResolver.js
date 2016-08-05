/**
 * Reference to the angular module used by Angular2to1, this module is either
 * resolved via ng-app or by useAngularModule(...)
 */
let angularModule = null;

/**
 * Attempts to lookup the root angular module of the app by resolving the first
 * ng-app on the DOM
 * As an alternative you can set your module with useAngularModule(), which will
 * then be returned by this function
 */
export function lookupAngularModule()
{
    //Returns the preset module if available
    if (angularModule) {
        return angularModule;
    }

    let ngAppHolder = angular.element("[ng-app]");

    if (!ngAppHolder.length) {
        throw new Error("No element with [ng-app] found and no module set with 'useAngularModule()'");
    }

    let moduleName = ngAppHolder[0].getAttribute('ng-app');
    angularModule = angular.module(moduleName);
    return angularModule;
}

/**
 * Sets the angular module which is used by Angular2to1
 * @param module
 */
export function useAngularModule(module)
{
    angularModule = module;
}

//Attempt to export the module directly
try
{
    lookupAngularModule();
} catch (e) {}

/**
 * Export the module, warning, MAY BE UNDEFINED if the module gets
 * initiated later, to make sure you get the module use lookupAngularModule
 */
export default angularModule;