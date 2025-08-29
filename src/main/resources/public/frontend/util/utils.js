const BASE_URL = "http://localhost:8081"; // backend URL

/*
Params:
* path - path of the uri after the base url (i.e. "endpoint/a" for "http://url:port/endpoint/a")
* method - http method
* authToken - string authentication token or undefined
* body - body of the http request or undefined
* errorContext - undefined or string to include in the alert error defining where the error occurred.
                 Error message is "There was an error [errorContext]"
Returns: result of fetch or logs and alerts of an error if something goes wrong
*/
export function httpRequest(path, method, authToken, body, errorContext) {
    let requestOptions = {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };
    if (body !== undefined) { requestOptions.body = body; }
    if (authToken !== undefined) { requestOptions.headers["Authorization"] = `Bearer ${auth-token}`; }

    try {
        return fetch(`${BASE_URL}/${path}`, requestOptions);
    }
    catch (error) {
        alert(`There was an error${errorContext === undefined ? "" : ` ${errorContext}`}: ${error}`);
    }
}

/// INPUT VALIDATION ///

/*
Params:
* string - the string the validate
* what - description of what the string is to be included in the alert.
         Alert string is "[what] cannot be empty (or consist of only whitespace)"
Returns: whether the input string is empty and alerts if not
*/
function validateNonEmptyString(string, what) {
    // Returns whether the string is emtpy and alerts the user if not
    return  (string !== undefined && string !== null && string.trim().length !== 0) ||
            alert(`${what} cannot be empty (or consist of only whitespace)`) !== undefined;
}

function validateStringsMatch(string1, string2, what) {
    return string1 === string2 ||
           alert(`${what} must match`);
}

export function validateEmail(email) {
    return validateNonEmptyString(email, "Email field");
}

export function validateUsername(username) {
    return validateNonEmptyString(username, "Username field");
}

export function validatePassword(password) {
    return validateNonEmptyString(password, "Password field")
}

export function validateRegistrationPassword(password, confirmPassword) {
    return validatePassword(password) &&
           validateStringsMatch(password, confirmPassword, "Passwords");
}
