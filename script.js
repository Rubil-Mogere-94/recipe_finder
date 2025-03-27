document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const showFavoritesBtn = document.getElementById('show-favorites-btn');
    const landingPage = document.getElementById('landing-page');
    const recipeContainer = document.getElementById('recipe-container');
    const searchResults = document.getElementById('search-results');
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritesList = document.getElementById('favorites-list');
    const backFromFavoritesBtn = document.getElementById('back-from-favorites-btn');

    // Initialize favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    showFavoritesBtn.addEventListener('click', showFavorites);
    backFromFavoritesBtn.addEventListener('click', showLandingPage);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Initial fetch of random recipe
    fetchRandomRecipe();

    // Main search function
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            
            if (data.meals) {
                displaySearchResults(data.meals);
            } else {
                searchResults.innerHTML = '<p>No recipes found. Try another search.</p>';
                showView(searchResults);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            alert('Failed to fetch recipes. Please try again later.');
        }
    }

    // Display search results
    function displaySearchResults(meals) {
        searchResults.innerHTML = '';
        
        meals.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            `;
            recipeCard.addEventListener('click', () => displayRecipe(meal));
            searchResults.appendChild(recipeCard);
        });
        
        showView(searchResults);
    }

    // Fetch random recipe
    async function fetchRandomRecipe() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            if (data.meals) {
                displayRecipe(data.meals[0]);
            }
        } catch (error) {
            console.error('Error fetching random recipe:', error);
        }
    }

    // Display single recipe
    function displayRecipe(meal) {
        document.getElementById('recipe-title').textContent = meal.strMeal;
        document.getElementById('recipe-img').src = meal.strMealThumb;
        document.getElementById('recipe-img').alt = meal.strMeal;
        
        // Populate ingredients
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = `${measure} ${ingredient}`;
                ingredientsList.appendChild(li);
            }
        }
        
        // Populate instructions
        const instructionsList = document.getElementById('instructions-list');
        instructionsList.innerHTML = '';
        
        // Handle different instruction formats
        const instructions = meal.strInstructions
            .split('\n')
            .filter(step => step.trim() !== '')
            .map(step => step.replace(/^\d+\.\s*/, '')); // Remove numbering if present
        
        instructions.forEach((step, index) => {
            const li = document.createElement('li');
            li.textContent = `Step ${index + 1}: ${step}`;
            instructionsList.appendChild(li);
        });
        
        // Add action buttons
        const recipeActions = document.createElement('div');
        recipeActions.className = 'recipe-actions';
        
        // Check if already in favorites
        const isFavorite = favorites.some(fav => fav.idMeal === meal.idMeal);
        
        recipeActions.innerHTML = `
            <button id="${isFavorite ? 'remove-from-favorites' : 'add-to-favorites'}-btn">
                ${isFavorite ? '❤️ Remove from Favorites' : '♡ Add to Favorites'}
            </button>
            <button id="back-btn">Back to Search</button>
        `;
        
        // Clear previous actions if any
        const existingActions = document.querySelector('.recipe-actions');
        if (existingActions) existingActions.remove();
        
        document.querySelector('.recipe-details').appendChild(recipeActions);
        
        // Add event listeners for the new buttons
        if (isFavorite) {
            document.getElementById('remove-from-favorites-btn').addEventListener('click', () => removeFromFavorites(meal.idMeal));
        } else {
            document.getElementById('add-to-favorites-btn').addEventListener('click', () => addToFavorites(meal));
        }
        
        document.getElementById('back-btn').addEventListener('click', () => {
            if (favoritesContainer.classList.contains('hidden')) {
                showLandingPage();
            } else {
                showFavorites();
            }
        });
        
        showView(recipeContainer);
    }

    // Show favorites view
    function showFavorites() {
        favoritesList.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>You have no favorite recipes yet.</p>';
        } else {
            favorites.forEach(meal => {
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'recipe-card favorite-recipe-card';
                favoriteCard.innerHTML = `
                    <button class="remove-favorite" data-id="${meal.idMeal}">×</button>
                    <h3>${meal.strMeal}</h3>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                `;
                favoriteCard.addEventListener('click', () => displayRecipe(meal));
                favoritesList.appendChild(favoriteCard);
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-favorite').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromFavorites(e.target.dataset.id);
                });
            });
        }
        
        showView(favoritesContainer);
    }

    // Add to favorites
    function addToFavorites(meal) {
        if (!favorites.some(fav => fav.idMeal === meal.idMeal)) {
            favorites.push(meal);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${meal.strMeal} has been added to your favorites!`);
            displayRecipe(meal); // Refresh to update the button
        }
    }

    // Remove from favorites
    function removeFromFavorites(mealId) {
        const mealName = favorites.find(fav => fav.idMeal === mealId)?.strMeal || 'This recipe';
        favorites = favorites.filter(meal => meal.idMeal !== mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        if (favoritesContainer.classList.contains('hidden')) {
            // If viewing a favorite recipe, go back to favorites list
            displayRecipe(favorites[0] || null);
            if (favorites.length === 0) showLandingPage();
        } else {
            // If in favorites view, refresh the list
            showFavorites();
        }
        
        alert(`${mealName} has been removed from your favorites.`);
    }

    // Show landing page
    function showLandingPage() {
        landingPage.classList.remove('hidden');
        recipeContainer.classList.add('hidden');
        searchResults.classList.add('hidden');
        favoritesContainer.classList.add('hidden');
        searchInput.value = '';
    }

    // Helper function to show specific view
    function showView(view) {
        landingPage.classList.add('hidden');
        recipeContainer.classList.add('hidden');
        searchResults.classList.add('hidden');
        favoritesContainer.classList.add('hidden');
        
        view.classList.remove('hidden');
    }
});