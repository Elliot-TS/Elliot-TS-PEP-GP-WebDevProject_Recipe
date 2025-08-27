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
    console.log("oops");
    getRecipes();


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

        // Get the recipe name
        await getRecipes(false);

        // Filter list by search name
        recipes = recipes.filter(recipe => recipe.name.search(recipeName) != -1);
            
        // Update the list of recipes
        refreshRecipeList();
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
        const recipeInstructions = addRecipeForm.instructions.value;
        
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
        const requestBody = {
            name: recipeName,
            instructions: recipeInstructions
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

        try {
            // Add the new recipe
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);

            switch (response.status) {
                case 201:
                    // Clear input fields
                    addRecipeForm.name.value = "";
                    addRecipeForm.instructions.value = "";

                    // Refresh the list of recipes
                    searchRecipes();
                    
                    break;
                default:
                    console.log(response);
                    alert("Error adding new recipe.\nRequest returned with status " + response.status);
                    break;
            }
        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while adding recipes");
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
        // Get values from update form inputs
        const recipeName = updateRecipeForm.name.value;
        const recipeInstructions = updateRecipeForm.instructions.value;

        // Validate neither field is empty
        if (recipeName.trim() === "") {
            alert("Update name field cannot be empty");
            return;
        }
        else if (recipeInstructions.trim() === "") {
            alert("Update instructions field cannot be emtpy");
            return;
        }

        // Fetch current recipes to locate the recipe by name
        await getRecipes();
        const recipe = recipes.find(r => r.name === recipeName);

        // If no such recipe exists, warn the user
        if (recipe === undefined) {
            alert("Cannot update recipe.  No recipe with that name exists");
            return;
        }

        // Create the request
        const requestBody = {
            id: recipe.id,
            instructions: recipeInstructions
        };
        const requestOptions = {
            method: "PUT",
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

        try {
            // Add the new recipe
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, requestOptions);

            switch (response.status) {
                case 200:
                    // Clear input fields
                    updateRecipeForm.name.value = "";
                    updateRecipeForm.instructions.value = "";

                    // Refresh the list of recipes
                    searchRecipes();
                    
                    break;
                default:
                    console.log(response);
                    alert("Error updating recipe.\nRequest returned with status " + response.status);
                    break;
            }
        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while updating recipes");
        }        
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Get values from delete form inputs
        const recipeName = deleteRecipeForm.name.value;

        // Validate neither field is empty
        if (recipeName.trim() === "") {
            alert("Update name field cannot be empty");
            return;
        }

        // Fetch current recipes to locate the recipe by name
        /*await getRecipes();
        const recipe = recipes.find(r => r.name === recipeName);
        console.log(recipe);
        // If no such recipe exists, warn the user
        if (recipe === undefined) {
            alert("Cannot delete recipe.  No recipe with that name exists");
            return;
        }*/

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
            const response = await fetch(`${BASE_URL}/recipes/${6}`, requestOptions);

            switch (response.status) {
                case 200:
                    // Clear input fields
                    deleteRecipeForm.name.value = "";

                    // Refresh the list of recipes
                    searchRecipes();
                    
                    break;
                default:
                    console.log(response);
                    alert("Error deleting recipe.\nRequest returned with status " + response.status);
                    break;
            }
        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while deleting recipes");
        } 
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes(refresh) {
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

            // Populate the list of recipes
            recipes = await response.json();
            
            // Update the list of recipes
            if (refresh) refreshRecipeList();
        }
        catch (e) {
            console.log(e);
            alert("An unexpected error occurred while loading recipes");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Clear the recipe lsit
        searchForm.resultList.innerHTML = "";

        // Create recipes
        for (let recipe of recipes) {
            // Create list item
            const listItem = document.createElement("li");

            // Set the item's content
            listItem.innerText = `${recipe.name}: ${recipe.instructions}`;

            // Add the item to the list
            searchForm.resultList.appendChild(listItem);
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
