var typeTemplates = {
    boolean: function(){return "bool"}, 
    null: function(){return "null"},
    undefined: function(){return "null"},
    number: function(val){

        // TODO: there can be double or long as well
        if(Number.isInteger(val)){
            return "int";
        }

        return "float";
    },
    string: function(){return "string"},
    object:  function(val){
        // this will overriden later. Not sure I like the organization right now
    },
}

function ObjectDeterminationFn(useArraysInsteadOfLists)
{
    return (val) => {
        if(Array.isArray(val)){
            
            let subType = formatType(val[0]) // assume the array is of the same type
            let arrayFormat = `List<${subType}>`

            if(useArraysInsteadOfLists)
            {
                arrayFormat = `${subType}[]`
            }

            return arrayFormat
        }

        return "OtherClass";
    }
}

/**
 * 
 * @param {string[]} param0  
 * @param {string|null} [className=null] 
 * @param {object} [myObject={}] 
 * @returns {string}
 */
function createClass([start,openingBracket,closeBracket], className=null, myObject={} )
{
    // get the class name
    if(className == null)
    {
        className = getClassNameMagic({myObject});
    }

    const keys = Object.keys(myObject);

    //todo: formatting is a bit wierd

    let props = "";
    keys.forEach(key => {
        props += `public ${formatType(myObject[key])} ${key} { get; set; }\n`
    })

    return `${start}${className}${openingBracket}${props}${closeBracket}`
}

function formatType(val)
{
    return typeTemplates[typeof val](val);
}

/**
 * This takes in an object and returns the first key which should be the name of the variable.
 * Got some help here: https://stackoverflow.com/a/42791996
 * @param {object} object 
 * @returns 
 */
function getClassNameMagic(object)
{
    return Object.keys(object)[0];
}

/**
 * 
 * @param {object} objectToConvert 
 * @returns {string}
 */
function ConvertJsonToCsClass(objectToConvert, className="MyClass", useArraysInsteadOfLists=false )
{
    const keys = Object.keys(objectToConvert);

    typeTemplates.object = ObjectDeterminationFn(useArraysInsteadOfLists);

    return createClass`public class ${className}
    {
        ${objectToConvert}
    }`;
}

export {ConvertJsonToCsClass}