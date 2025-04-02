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
    const categoryFilter = document.getElementById('category-filter');

    // Initialize favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentPage = 1;
    const resultsPerPage = 6;

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    showFavoritesBtn.addEventListener('click', showFavorites);
    backFromFavoritesBtn.addEventListener('click', showLandingPage);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Initial setup
    fetchRandomRecipe();
    loadCategories();
    displayCategoryBrowser();

    // Main search function
    async function handleSearch() {
        const query = searchInput.value.trim();
        const category = categoryFilter.value;
        
        try {
            // Add loading state
            searchBtn.disabled = true;
            searchBtn.textContent = 'Searching...';
            searchResults.innerHTML = '<div class="loading-spinner"></div>';
            showView(searchResults);
            
            let url;
            if (category && !query) {
                url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
            } else {
                url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Reset button state
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
            
            if (data.meals) {
                displaySearchResults(data.meals);
            } else {
                searchResults.innerHTML = '<p class="no-results">No recipes found. Try another search.</p>';
                showView(searchResults);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            searchResults.innerHTML = `
                <div class="error-message">
                    <p>Failed to fetch recipes. Please check your connection and try again.</p>
                    <button onclick="handleSearch()">Retry</button>
                </div>
            `;
            showView(searchResults);
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
        }
    }

    // Display search results
    function displaySearchResults(meals) {
        searchResults.innerHTML = '';
        currentPage = 1; // Reset to first page
        
        const start = (currentPage - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const paginatedMeals = meals.slice(start, end);
        
        paginatedMeals.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            `;
            recipeCard.addEventListener('click', () => displayRecipe(meal));
            searchResults.appendChild(recipeCard);
        });
        
        // Add pagination controls if needed
        if (meals.length > resultsPerPage) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination';
            
            if (currentPage > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.textContent = 'Previous';
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    displaySearchResults(meals);
                });
                pagination.appendChild(prevBtn);
            }
            
            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(meals.length / resultsPerPage)}`;
            pagination.appendChild(pageInfo);
            
            if (end < meals.length) {
                const nextBtn = document.createElement('button');
                nextBtn.textContent = 'Next';
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    displaySearchResults(meals);
                });
                pagination.appendChild(nextBtn);
            }
            
            searchResults.appendChild(pagination);
        }
        
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
        if (!meal) {
            showLandingPage();
            return;
        }

        document.getElementById('recipe-title').textContent = meal.strMeal;
        document.getElementById('recipe-img').src = meal.strMealThumb;
        document.getElementById('recipe-img').alt = meal.strMeal;
        
        // Add tags and area information
        const tagsArea = document.createElement('div');
        tagsArea.className = 'tags-area';
        
        if (meal.strArea) {
            const areaBadge = document.createElement('span');
            areaBadge.className = 'area-badge';
            areaBadge.textContent = meal.strArea;
            tagsArea.appendChild(areaBadge);
        }
        
        if (meal.strTags) {
            const tags = meal.strTags.split(',');
            tags.forEach(tag => {
                const tagBadge = document.createElement('span');
                tagBadge.className = 'tag-badge';
                tagBadge.textContent = tag.trim();
                tagsArea.appendChild(tagBadge);
            });
        }
        
        // Clear previous tags if any
        const existingTags = document.querySelector('.tags-area');
        if (existingTags) existingTags.remove();
        document.getElementById('recipe-title').insertAdjacentElement('afterend', tagsArea);
        
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
        
        const instructions = meal.strInstructions
            .split('\n')
            .filter(step => step.trim() !== '')
            .map(step => step.replace(/^\d+\.\s*/, ''));
        
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
        
        // Add source link if available
        if (meal.strSource) {
            const sourceLink = document.createElement('a');
            sourceLink.href = meal.strSource;
            sourceLink.textContent = 'View Original Recipe';
            sourceLink.className = 'source-link';
            sourceLink.target = '_blank';
            recipeActions.appendChild(sourceLink);
        }
        
        // Add share button
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        shareBtn.textContent = 'Share Recipe';
        shareBtn.addEventListener('click', () => shareRecipe(meal));
        recipeActions.appendChild(shareBtn);
        
        // Add print button
        const printBtn = document.createElement('button');
        printBtn.id = 'print-btn';
        printBtn.textContent = 'Print Recipe';
        printBtn.addEventListener('click', () => window.print());
        recipeActions.appendChild(printBtn);
        
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

    // Share recipe
    function shareRecipe(meal) {
        if (navigator.share) {
            navigator.share({
                title: meal.strMeal,
                text: `Check out this delicious ${meal.strMeal} recipe!`,
                url: meal.strSource || window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                fallbackShare(meal);
            });
        } else {
            fallbackShare(meal);
        }
    }

    function fallbackShare(meal) {
        const shareText = `Check out this ${meal.strMeal} recipe!`;
        const shareUrl = meal.strSource || window.location.href;
        prompt('Copy this link to share:', `${shareText} ${shareUrl}`);
    }

    // Load categories for filter
    async function loadCategories() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
            const data = await response.json();
            
            if (data.categories) {
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.strCategory;
                    option.textContent = category.strCategory;
                    categoryFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Display category browser on landing page
    async function displayCategoryBrowser() {
        const categoryBrowser = document.getElementById('category-browser');
        if (!categoryBrowser) return;
        
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
            const data = await response.json();
            
            if (data.categories) {
                categoryBrowser.innerHTML = '<h3>Browse by Category</h3><div class="category-grid"></div>';
                const grid = categoryBrowser.querySelector('.category-grid');
                
                data.categories.forEach(category => {
                    const categoryCard = document.createElement('div');
                    categoryCard.className = 'category-card';
                    categoryCard.innerHTML = `
                        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                        <h4>${category.strCategory}</h4>
                    `;
                    categoryCard.addEventListener('click', () => {
                        categoryFilter.value = category.strCategory;
                        handleSearch();
                    });
                    grid.appendChild(categoryCard);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Show landing page
    function showLandingPage() {
        landingPage.classList.remove('hidden');
        recipeContainer.classList.add('hidden');
        searchResults.classList.add('hidden');
        favoritesContainer.classList.add('hidden');
        searchInput.value = '';
        currentPage = 1;
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