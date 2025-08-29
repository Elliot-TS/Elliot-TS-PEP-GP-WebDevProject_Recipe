import { httpRequest, validatePassword, validateUsername, validateEmail } from "../util/utils.js";

/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
//const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
// let usernameInput = document.getElementById("login-input");
// let passwordInput = document.getElementById("password-input");
// let loginButton = document.getElementById("login-button");

const loginForm = document.getElementById("login-form");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
//loginButton.addEventListener("click", processLogin);
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processLogin();
})


/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    const formData = new FormData(loginForm)
    if (!validateLoginFormInputs(formData)) { return; }
    
    const response = await httpRequest(
        "login", 
        "POST",  
        undefined,
        JSON.stringify(Object.fromEntries(formData.entries())),
        "logging in"
    );
    
    switch (response.status) {
        case 200:
            const [token, isAdmin] = (await response.text()).split(" ");
                sessionStorage.setItem("auth-token", token);
                sessionStorage.setItem("is-admin", isAdmin);
            setTimeout(() => window.location.href = "../recipe/recipe-page.html", 500);
            break;
        case 401:
                alert("Invalid username or password");
                break;
        default:
            alert("Login failed due to an unknown issue");
            break;
    }
}



function validateLoginFormInputs(formData) {
    return  validateUsername(formData.get("username")) &&
            validatePassword(formData.get("password"), formData.get("confirm-password"));
}