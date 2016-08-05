/**
 * If the argument is an array (inject) this method
 * will return only the function with the $inject property
 * set
 * @param arg
 * @returns {Function}
 */
export function fetch(arg)
{
    if (arg.constructor == Array)
    {
        let arr = arg;
        arg = arr.splice(arr.length - 1, 1)[0];
        arg.$inject = arr;
    }
    return arg;
}