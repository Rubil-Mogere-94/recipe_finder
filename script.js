document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const backBtn = document.getElementById('back-btn');
    const landingPage = document.getElementById('landing-page');
    const recipeContainer = document.getElementById('recipe-container');
    const searchResults = document.getElementById('search-results');
    
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    backBtn.addEventListener('click', showLandingPage);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Initial fetch of random recipe (potato dumplings as example)
    fetchRandomRecipe();
    
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
                searchResults.classList.remove('hidden');
                landingPage.classList.add('hidden');
                recipeContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }
    
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
        
        searchResults.classList.remove('hidden');
        landingPage.classList.add('hidden');
        recipeContainer.classList.add('hidden');
    }
    
    async function fetchRandomRecipe() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            if (data.meals) {
                // For demo purposes, we'll use the first recipe
                displayRecipe(data.meals[0]);
            }
        } catch (error) {
            console.error('Error fetching random recipe:', error);
        }
    }
    
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
        
        const instructions = meal.strInstructions.split('\r\n').filter(step => step.trim() !== '');
        instructions.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            instructionsList.appendChild(li);
        });
        
        recipeContainer.classList.remove('hidden');
        landingPage.classList.add('hidden');
        searchResults.classList.add('hidden');
    }
    
    function showLandingPage() {
        landingPage.classList.remove('hidden');
        recipeContainer.classList.add('hidden');
        searchResults.classList.add('hidden');
        searchInput.value = '';
    }
});