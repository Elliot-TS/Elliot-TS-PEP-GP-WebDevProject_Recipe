/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchForm = {
        name: document.getElementById("search-input"),
        submit: document.getElementById("search-button"),
        resultList: document.getElementById("recipe-list")
    };
    const addRecipeForm = {
        name: document.getElementById("add-recipe-name-input"),
        instructions: document.getElementById("add-recipe-instructions-input"),
        submit: document.getElementById("add-recipe-submit-input")
    };
    const updateRecipeForm = {
        name: document.getElementById("update-recipe-name-input"),
        instructions: document.getElementById("update-recipe-instructions-input"),
        submit: document.getElementById("update-recipe-submit-input")
    };
    const deleteRecipeForm = {
        name: document.getElementById("delete-recipe-name-input"),
        submit: document.getElementById("delete-recipe-submit-input")
    };

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.display = "block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin")) {
        adminLink.display = "block";
    } 

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeForm.submit.addEventListener("click", addRecipe);
    updateRecipeForm.submit.addEventListener("click", updateRecipe);
    deleteRecipeForm.submit.addEventListener("click", deleteRecipe);
    searchForm.submit.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("clicl", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    //getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Get the recipe name
        const recipeName = searchForm.name.value;
        
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
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            // Filter list by search name
            let recipes = await response.json();
            recipes.filter(recipe => recipe.name.search(recipeName) != -1);

            // Update the list of recipes
            refreshRecipeList(recipes);

        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while loading recipes");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Get the recipe name and instructions
        const recipeName = addRecipeForm.name.value;
        const recipeInstructions = addRecipeForm.instructions.innerText;
        
        // Validate inputs are non-empty
        if (recipeName.trim() === "") {
            alert("Recipe name cannot be empty");
            return;
        }
        else if (recipeInstructions.trimEnd() === "") {
            alert("Recipe instructions cannot be empty");
            return;
        }
        
        // Create the request
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("auto-token")}`
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try {
            // Add the new recipe
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            // Filter list by search name
            let recipes = await response.json();
            recipes.filter(recipe => recipe.name.search(recipeName) != -1);

            // Update the list of recipes
            refreshRecipeList(recipes);

        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while loading recipes");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipes) {
        // Clear the recipe lsit
        searchForm.resultList.innerHTML = "";

        // Create recipes
        for (let recipe of recipes) {
            // Create list item
            const listItem = document.createElement("li");

            // Set the item's content
            listItem.innerText = `${recipe.name}: ${recipe.instructions}`;

            // Add the item to the list
            searchForm.resultList.appendChildd(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

});
