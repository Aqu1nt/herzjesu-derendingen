import "./ES6PromiseHook"
import App from "../AngularModule"
import es6enabler from "../utils/ES6Directive"

//We need the Injector in some decorators
let $injector = null;
let $parse = null;
App.run(["$injector", "$parse", (i, p) => {
    $injector = i;
    $parse = p;
}]);

/**
 * Exposes all services of a single module
 * @param module
 */
let exposeModule = module => {
    let $rootScope = $injector.get("$rootScope");
    module._invokeQueue.forEach(item => {
        let def = item[2];
        if ($injector.has(def[0])) {
            let service = $injector.get(def[0]);
            callAnnotations(service, $rootScope);
        }
    });
};
App.run(() => exposeModule(App));

/**
 * @decorator
 * @param {string | function} arg
 * @returns {Function}
 * @exports
 */
export function Service(arg) {
    arg = fetch(arg);
    if (arg instanceof Function) App.service(arg.name, arg);
    else return (target) => {
        App.service(arg, target);
        return target;
    };
    return arg;
}

/**
 * @decorator
 * @param {string | function} arg
 * @returns {Function}
 * @exports
 */
export function Controller(arg) {
    arg = fetch(arg);
    if (arg instanceof Function) App.controller(arg.name, arg);
    else return (target) => {
        App.controller(arg, target);
        return target;
    };
    return arg;
}

/**
 * @decorator
 * @param {string | function} arg
 * @param {string} [name]
 * @returns {Function}
 * @exports
 */
export function Directive(arg, name) {
    arg = fetch(arg);

    if (arg.constructor != String)
    {
        if (arg instanceof Function) App.directive(arg.name, es6enabler(arg));
        else App.directive(name, es6enabler(arg[name]));
    }
    else return (target, n) => {
        if (target instanceof Function) App.directive(arg, es6enabler(target));
        else App.directive(n, es6enabler(target[n]));
        return target;
    };
    return arg;
}

/**
 * @decorator
 * @param {string | function} target
 * @param {string} [name]
 * @returns {Function}
 * @exports
 */
export function Config(target, name) {
    target = fetch(target);
    if (target instanceof Function) App.config(target);
    else App.config(target[name]);
    return target;
}

/**
 * @decorator
 * @param {string | function} target
 * @param {string} [name]
 * @returns {Function}
 * @exports
 */
export function Run(target, name) {
    target = fetch(target);
    if (target instanceof Function) App.run(target);
    else App.run(target[name]);
    return target;
}

/**
 * @decorator
 * @param {string | function} arg
 * @param {string} [name]
 * @returns {Function}
 * @exports
 */
export function Filter(arg, name)
{
    arg = fetch(arg);
    if (arg.constructor != String)
    {
        if (arg instanceof Function) App.filter(arg.name, arg);
        else App.filter(name, arg[name]);
    }
    else return (target, n) => {
        if (target instanceof Function) App.filter(arg, target);
        else App.filter(n, target[n]);
        return target;
    };
    return arg;
}

/**
 * Sets the view of an @Component or a @State can either be
 * a template or a templateUrl
 * @param view
 * @returns {function(): *}
 * @Decorator
 */
export function View(view)
{
    return (target) => {
        target.$$view = view;
        return target;
    }
}

/**
 * Decorates the view to the configuration
 * @param clazz
 * @param conf
 */
function decorateView(clazz, conf)
{
    let view = clazz.$$view;
    if (!view) return;
    let urlRegex = /[^<>]+\.[A-Za-z]{2,5}$/;
    if (urlRegex.test(view)) { //url
        conf.templateUrl = view;
    } else {
        conf.template = view;
    }
}

/**
 * Sets the alias for a controller, can only be used together with @State
 * and @Component
 * @decorator
 */
export function Alias(alias)
{
    return (target, name, desc) => {
        (target[name] || target).$$alias = alias;
        return target;
    }
}

/**
 * If the argument is an array (inject) this method
 * will return only the function with the $inject property
 * set
 * @param arg
 * @returns {Function}
 */
function fetch(arg)
{
    if (arg.constructor == Array)
    {
        let arr = arg;
        arg = arr.splice(arr.length - 1, 1)[0];
        arg.$inject = arr;
    }
    return arg;
}


/**
 * The decorator may be used on classes or methods
 * ```
 * @Self
 * class FullBound {}
 *
 * class PartBound {
 *   @Self
 *   method () {}
 * }
 * ```
 *
 * @decorator
 */
export function Self(...args) {
    if (args.length === 1) {
        return boundClass(...args);
    } else {
        return boundMethod(...args);
    }
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
function boundClass(target) {
    // (Using reflect to get all keys including symbols)
    let keys;
    // Use Reflect if exists
    if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
        keys = Reflect.ownKeys(target.prototype);
    } else {
        keys = Object.getOwnPropertyNames(target.prototype);
        // use symbols if support is provided
        if (typeof Object.getOwnPropertySymbols === 'function') {
            keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
        }
    }

    keys.forEach(key => {
        // Ignore special case target method
        if (key === 'constructor') {
            return;
        }

        let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        // Only methods need binding
        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
        }
    });
    return target;
}

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
function boundMethod(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
        throw new Error(`@Self decorator can only be applied to methods not: ${typeof fn}`);
    }

    return {
        configurable: true,
        get : function() {
            let self = this;
            return (...params) => fn.call(self, ...params);
        }
    };
}

/**
 * @decorator
 * @param conf
 * @returns {Function}
 * @exports
 */
export function State(conf)
{
    return target => {
        target.$$state = conf;
        Controller(target);
        return target;
    }
}

/**
 * @decorator
 * @param conf
 * @returns {Function}
 * @exports
 */
export function Component(conf = {})
{
    if (conf.constructor == String) {
        conf = { selector : conf };
    }
    conf.controllerAs = conf.as || conf.controllerAs;
    conf.restrict = conf.restrict || "E";
    if (conf.bind == false) conf.bind = false;
    else conf.bind = conf.bind || {};


    conf.template = conf.view || conf.template;
    conf.selector = conf.name || conf.selector;

    return target => {
        conf.controller = target;
        App.directive(conf.selector, () => {

            //Merge @Bind properties
            if (conf.bind !== false) {
                conf.bind = Object.assign(conf.bind || {}, target.$$bind || {});
            }

            conf.controllerAs = target.$$alias || conf.controllerAs || "$ctrl";
            conf.bindToController = conf.bind;

            decorateView(target, conf);

            return conf;
        });
        return target;
    }
}

/**
 * Binds the class variable to the component scope,
 * to can be: = & @
 * @param to
 * @param attributeName
 * @returns {function()}
 * @decorator
 */
export function Bind(to, attributeName)
{
    return (target, name, desc) => {

        if (attributeName) {
            console.error(`@Bind with alternative attribute name not longer supported: ${target.constructor.name} - ${name}`);
            return;
        }

        //Add the bind property to the type
        let type = target.constructor;
        type.$$bind = type.$$bind || {};
        type.$$bind[name] = to;

        return {
            writable : true,
            value : desc.value
        };
    }
}

/**
 * Replaces the async function with a wrapper which
 * will call this.$scope.$digest() each time the method
 * gets completed
 *
 * @decorator
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 * @exports
 */
export function Async(target, name, descriptor)
{
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
        throw new Error(`@Async decorator can only be applied to methods not: ${typeof fn}`);
    }

    let $rootScope;

    return {
        configurable: true,
        value : async function (...params) {
            let result = fn.call(this, ...params);
            await result;

            let $scope = this.$$scope;

            if (!$scope) {
                if (!$rootScope)
                {
                    $rootScope = $injector.get("$rootScope");
                }
                $rootScope.$digest();
            } else {
                $scope.$digest();
            }
            return result;
        }
    };
}

/**
 * CARE!! Not working on @Directive / @Component yet
 *
 * Inject one of the following into the object:
 *      - services
 *      - $scope
 *      - every $scope variable
 *
 * the variable: usage =>
 * class foo {
 *      @Inject $timeout;
 *      @Inject("$timeout") tmout;
 *      @Inject fooCtrl
 *      @Inject scopeVar
 *      @Inject $scope
 *
 *      constructor()
 *      {
 *          console.log(this.$timeout, this.tmout);
 *      }
 * }
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {function}
 * @exports
 * @decorator
 */
export function Inject(target, name, descriptor)
{
    let fieldName;
    let injector = (target, name, descriptor) =>
    {
        if (descriptor.value instanceof Function) {
            throw new Error("Can't use @Inject on a method");
        }

        return {
            set : function(value) {
                Object.defineProperty(this, fieldName, {value, writable : true});
            },
            get : function() {
                // if (cache) return cache;

                let obj = null;
                let injected = false;

                let locals = this.$$locals || currentLocals;

                //Locale
                if (locals && (locals.hasOwnProperty(name) || locals[name])){
                    obj = locals[name];
                    injected = true;
                }

                //Service
                else if ($injector.has(name)) {
                    obj = $injector.get(name);
                    injected = true;
                }

                //$scope or parent scope property
                else if (locals && locals.$scope && (Reflect.hasOwnProperty(locals.$scope, name) || locals.$scope[name])){
                    obj = locals.$scope[name];
                    injected = true;
                }

                if (!injected) {
                    console.error(`Wasn't able to @Inject ${name} as ${fieldName} into ${target.constructor.name}`);
                    return;
                }

                Object.defineProperty(this, fieldName, {value : obj, writable : true});
                return obj;
            }
        };
    };

    if (descriptor) {
        fieldName = name;
        return injector(target, name, descriptor);
    }
    else {
        let nameReplacement = target;
        return function(target, name, descriptor) {
            fieldName = name;
            return injector(target, nameReplacement, descriptor);
        };
    }
}


let currentLocals = undefined;
App.config(function($provide){
    $provide.decorator("$controller", function($delegate){
        return function(expression, locals, later, ident){

            //For usage in constructor
            currentLocals = locals;

            //Create the controller
            let controller = $delegate(expression, locals, later, ident);

            //Reset the locals
            currentLocals = undefined;

            //Check if its an object
            if (!later){
                controller.$$locals = locals;
                controller.$$scope = locals.$scope;
                callAnnotations(controller, locals.$scope);
                return controller;
            }
            else {
                return function(){
                    currentLocals = locals;
                    let c = controller();
                    currentLocals = undefined;
                    c.$$locals = locals;
                    c.$$scope = locals.$scope;
                    callAnnotations(c, locals.$scope);
                    return c;
                }
            }
        };
    })
});

/**
 * Tries to configure the state from the $$state var on
 * the all controllers
 * @param clazz
 */
App.config(function($stateProvider, $urlRouterProvider){
    "ngInject";

    let registeredControllers = [];
    let states = [];
    App._invokeQueue.forEach(item => {
        let constructor = item[2][1];
        if (registeredControllers.find((t) => t.type == constructor)) return;
        if (constructor.$$state) {
            constructor.$$state.clazz = constructor;
            states.push(constructor.$$state);
            registeredControllers.push({type : constructor});
        }
    });

    for (let conf of states) {
        let clazz = conf.clazz;

        /*
         * Default state
         */
        if (conf.default) {
            $urlRouterProvider.otherwise(function ($injector) {
                $injector.invoke(['$state', function ($state) {
                    $state.go(conf.name, {}, {location: "replace"});
                }]);
            });
        }

        /*
         * Set Controller
         */
        conf.controller = clazz;
        conf.controllerAs = conf.as || conf.controllerAs || clazz.$$alias;

        /**
         * Set view
         */
        decorateView(clazz, conf);

        /*
         * Set data
         */
        conf.data = Object.assign(conf.data || {}, {
            requireLogin: conf.login || false,
            pageTitle: conf.title,
            specialClass: conf.specialClass,
            navtopClass: conf.navtop
        });

        /*
         * Set the state
         */
        $stateProvider.state(conf);
    }
});


/**
 * Executes all Methods annotated with this annotation after
 * the object has been created
 * @param target
 * @param name
 * @param descriptor
 * @exports
 * @decorator
 */
export function Init(target, name, descriptor){
    if (!descriptor) {
        throw new Error("@Init can only be used on class methods");
    }
    target.$$init = target.$$init || new Set();
    target.$$init.add(name);
}

/**
 * Executes all Methods annotated with this annotation after
 * the object has been created
 * @param target
 * @param name
 * @exports
 * @decorator
 */
export function Destroy(target, name){
    target.$$destroy = target.$$destroy || new Set();
    target.$$destroy.add(name);
}

/**
 * @param [property]
 * @param {boolean} deep
 * @exports
 * @decorator
 */
export function Watch(property, deep = false){

    return (target, name) => {
        target.$$watch = target.$$watch || new Set();
        target.$$watch.add({property, name, deep, collection : false});
    };
}

/**
 * @param [property]
 * @param {boolean} deep
 * @exports
 * @decorator
 */
export function WatchCollection(property, deep = false){

    return (target, name) => {
        target.$$watch = target.$$watch || new Set();
        target.$$watch.add({property, name, deep, collection : true});
    };
}

export function Schedule(interval)
{
    return (target, name, desc) => {
        target.$$schedule = target.$$schedule || new Set();
        target.$$schedule.add({interval, name})
    }
}

export function On(event)
{
    return (target, name, desc) => {
        target.$$on = target.$$on || new Set();
        target.$$on.add({event, name})
    }
}

/**
 * Calls @Init and @Destroy on the CONTROLLER
 * @param controller
 * @param $scope
 */
function callAnnotations(controller, $scope)
{
    //Async wrapper
    let asyncWrapper = function (result) {
        if (result instanceof Promise) {
            result.then(::$scope.$digest);
        }
    };

    //Call init methods
    let inited = [];
    for (let initializer of controller.$$init || [])
    {
        if (!inited.includes(initializer)) {
            asyncWrapper(controller[initializer]());
        }
        inited.push(initializer);
    }

    //Bind watches
    let watched = [];
    for (let watcher of controller.$$watch || []) {
        if (!watched.includes(watcher)) {

            //Parse the angular expression
            let parse = $parse(watcher.property);
            let getter = () => parse(controller);

            let action = function(...params){
                controller[watcher.name](...params);
            }.bind(controller);

            if (!watcher.collection) $scope.$watch(getter, action, !!watcher.deep);
            else $scope.$watchCollection(getter, action, !!watcher.deep);
        }
        watched.push(watcher);
    }


    //Bind events
    let evented = [];
    for (let on of controller.$$on || []) {
        if (! evented.includes(on)) {
            $scope.$on(on.event, function(...params){
                asyncWrapper(controller[on.name](...params));
            }).bind(controller);
        }
        evented.push(on);
    }

    //Scheduled methods
    let $interval = $injector.get("$interval");
    let scheduled = [];
    for (let schedule of controller.$$schedule || []) {
        if (!scheduled.includes(schedule)){
            let id = $interval(function(){
                asyncWrapper(controller[schedule.name]());
            }.bind(controller), schedule.interval);
            $scope.$on("$destroy", () => $interval.cancel(id));
        }
    }

    //Call destroy methods
    $scope.$on("$destroy", function(){
        let destroyed = [];
        for (let destroyer of controller.$$destroy || [])
        {
            if (!destroyed.includes(destroyer)) controller[destroyer]();
            destroyed.push(destroyer);
        }
    });
}

/**
 * Turns the variable into a function which either sets
 * the variable and returns itself or returns the
 * value of the var
 *
 * The temporary value is being stored into _[varname] but not
 * initialized until you call [varname](..) the first time!
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {{configurable: boolean, get: get}}
 * @constructor
 */
export function Chainable(target, name, descriptor)
{
    return {
        configurable : true,
        get : function(){

            let key = "_"+name;

            let fn = function(val){
                if (val === undefined) return this[key];

                this[key] = val;
                return this;
            };


            Object.defineProperty(target, name, {
                value : fn
            });

            let value = descriptor.value;
            if (value == undefined && descriptor.initializer) {
                value = descriptor.initializer();
            }

            Object.defineProperty(target, key, {
                writable : true,
                value
            });

            return fn
        }
    }
}



/**
 * Debounces the method so it will only get executed after it hasn't been called
 * for n millis
 *
 * @param millis
 * @param {boolean} [angularTimeout=true] - if false the window timeout will get used
 * @returns {Function}
 * @decorator
 */
export function Debounce(millis, angularTimeout = true)
{
    return (target, name, desc) => {
        let timeout;
        let fn = desc.value;
        desc.value = function(...args){

            //Setup
            let context = this;
            let timeoutFn = function(){
                fn.apply(context,args);
            };

            //Use angular $timeout ($apply cycle)
            if (angularTimeout)
            {
                let $timeout = $injector.get("$timeout");
                $timeout.cancel(timeout);
                timeout = $timeout(timeoutFn, millis);
            }
            //Use window timeout
            else
            {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFn, millis);
            }
        }
    }
}

/**
 * Marks a method as abstract, this means the method will get replaced
 * with one that throws an error when called saying the method
 * is not implemented
 * @param target
 * @param name
 * @param desc
 * @decorator
 */
export function Abstract(target, name, desc)
{
    desc.value = function(){
        throw new Error(`${target.name}@${name} is not implemented (Abstract)`);
    };
}