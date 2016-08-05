import {lookupAngularModule} from "../util/AngularModuleResolver"
import {fetch} from "../util/AngularUtils"
const App = lookupAngularModule();

/**
 * Defines a class as Service, if no name is provided aka the decorator is
 * used as @Service then the class name is used as controller name, you can
 * specify the name by using the decorator like @Service("ServiceName") to
 * make the decorator minify safe
 *
 * @decorator
 * @param {string | function} [clazz]
 */
export function Service(clazz) {
    clazz = fetch(clazz);

    //Function to add the controller
    let addService = (name, clazz) => App.service(name, clazz);

    if (clazz instanceof Function) {
        addService(clazz.name, clazz);
    }
    else return (target) => {
        addService(clazz, target);
    };
}