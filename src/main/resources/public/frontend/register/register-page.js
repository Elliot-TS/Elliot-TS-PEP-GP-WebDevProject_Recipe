/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration)


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    try {
        // Get form input
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        // Validate inputs are non-empty and passwords match
        if (username === "") { alert("Username field must not be empty"); }
        else if (email === "") { alert("Email field must not be empty"); }
        else if (password === "") { alert("Password field must not be empty"); }
        else if (password !== repeatPassword) { alert("Password fields must match"); }
        else {
            // Create the request body
            const registerBody = {
                username: username,
                email: email,
                password: password
            };

            // Create the full request
            const requestOptions = {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(registerBody)
            };

            // Submit the data
            const request = await fetch(`${BASE_URL}/register`, requestOptions);

            // Check the status of the request
            switch (request.status) {
                case 201:
                    window.location.replace("../login/login-page.html");
                    break;
                case 409:
                    alert("An account already exists for this username or email");
                    break;
                default:
                    alert("Something went wrong creating your account");
                    break;
            }
        }
    } catch (error) {
        console.error(error);
        alert("There was an error: " + error);
    }
}
