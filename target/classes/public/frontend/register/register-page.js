import { httpRequest, validatePassword, validateUsername, validateEmail } from "../util/utils.js";

/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
const registrationForm = document.getElementById("registration-form");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
// registerButton.addEventListener("click", processRegistrationOld)
registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processRegistration();
});


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * Cannot use import statement outside a module
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
    const formData = new FormData(registrationForm)
    if (!validateRegistrationFormInputs(formData)) { return; }
    
    const response = await httpRequest(
        "register", 
        "POST", 
        undefined,
        JSON.stringify(Object.fromEntries(formData.entries())),
        "registering account"
    );
    
    switch (response.status) {
        case 201:
            window.location.href = "../login/login-page.html";
            break;
        case 409:
            alert("An account already exists for this username or email");
            break;
        default:
            alert("Something went wrong creating your account");
            break;
    }
}



function validateRegistrationFormInputs(formData) {
    return  validateUsername(formData.get("username")) &&
            validateEmail(formData.get("email")) &&
            validatePassword(formData.get("password"), formData.get("confirm-password"));
}