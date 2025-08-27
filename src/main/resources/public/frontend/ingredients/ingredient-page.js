/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const addIngredientSubmit = document.getElementById("add-ingredient-submit-button");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const deleteIngredientSubmit = document.getElementById("delete-ingredient-submit-button");
const ingredientListContainer = document.getElementById("ingredient-list");


/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmit.addEventListener("click", addIngredient);
deleteIngredientSubmit.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("DOMContentLoaded", async () => {
    await getIngredients();
    refreshIngredientList();
});

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Get the ingredient name
    const ingredientName = addIngredientNameInput.value;

    // Validate input
    if (ingredientName.trim() === "") {
        alert("Cannot add ingredient with empty name");
        return;
    }

    // Build request
    const requestBody = {
        name: ingredientName,
    };
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    // Send the request
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        switch (response.status) {
            case 201:
                await getIngredients();
                refreshIngredientList();
                break;
            default:
                console.log(response);
                alert("Unable to add ingredient");
        }
    }
    catch (e) {
        console.log(e);
        alert("Error adding ingredient: " + e);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    const requestOptions = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "Access-Control-Allow-Headers": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("auto-token")}`
            }
        };

        try {
            // Get list of all recipes
            const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

            // Populate the list of recipes
            ingredients = await response.json();
        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while loading ingredients");
        }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Get values from delete form inputs
    const ingredientName = deleteIngredientNameInput.value;

    // Validate neither field is empty
    if (ingredientName.trim() === "") {
        alert("Update name field cannot be empty");
        return;
    }

    // Fetch current ingredients to locate the ingredient by name
    await getIngredients();
    const ingredient = ingredients.find(ing => ing.name === ingredientName);
    
    // If no such ingredient exists, warn the user
    if (ingredient === undefined) {
        alert("Cannot delete ingredient.  No ingredient with that name exists");
        return;
    }

    // Create the request
    const requestOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };

    try {
        // Add the new recipe
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, requestOptions);

        switch (response.status) {
            case 204:
                // Clear input fields
                deleteIngredientNameInput.value = "";

                // Refresh the list of recipes
                await getIngredients();
                refreshIngredientList();
                
                break;
            default:
                console.log(response);
                alert("Error deleting ingredient.\nRequest returned with status " + response.status);
                break;
        }
    }
    catch (e) {
        console.log(e);
        alert("An unexpected error occurred while deleting ingredient");
    } }


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Clear the ingredients lsit
    ingredientListContainer.innerHTML = "";

    // Create recipes
    for (let ingredient of ingredients) {
        // Create list item
        const listItem = document.createElement("li");

        // Set the item's content
        listItem.innerText = ingredient.name;

        // Add the item to the list
        ingredientListContainer.appendChild(listItem);
    }
}
