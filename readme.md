
Here's an updated README.md file that better reflects the current state of your Recipe Finder app with all its features:

```markdown
# Recipe Finder App

## About the Project
The **Recipe Finder App** is a comprehensive web application that helps users discover, explore, and manage recipes from around the world. With a clean interface and powerful features, users can search for recipes, view detailed instructions, save favorites, and even get recipe recommendations.

## Key Features
- 🔍 **Advanced Recipe Search**: Search by name or filter by category
- 📋 **Detailed Recipe View**: Complete ingredients list and step-by-step instructions
- ❤️ **Favorites Management**: Save and organize your favorite recipes
- 🌓 **Dark/Light Mode**: Toggle between color schemes for comfortable viewing
- 🔄 **Recent Searches**: Quick access to your recent search queries
- 🍽️ **Category Browser**: Explore recipes by food categories
- 🤝 **Similar Recipes**: Discover related recipes based on current selection
- 📱 **Responsive Design**: Works perfectly on all device sizes
- 📤 **Sharing & Printing**: Share recipes with friends or print them
- ⚡ **Offline Support**: Basic functionality works without internet (PWA-ready)

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables for theming
- **API**: [TheMealDB](https://www.themealdb.com/)
- **Storage**: localStorage for persisting user preferences
- **PWA Features**: Web Manifest, Service Worker (ready for implementation)

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone git@github.com:Rubil-Mogere-94/recipe_finder.git
   ```
2. Navigate to the project directory:
   ```bash
   cd recipe-finder-app
   ```
3. Open the app:
   - For simple testing, open `index.html` directly in your browser
   - For best experience, use a local server (e.g., VS Code Live Server, Python http.server)

## How to Use
1. **Searching Recipes**:
   - Enter keywords in the search bar (e.g., "pasta", "chicken")
   - Optional: Filter by category using the dropdown
   - Press Enter or click Search

2. **Exploring Recipes**:
   - Browse search results or popular categories
   - Click any recipe to view details
   - View ingredients, measurements, and cooking instructions

3. **Managing Favorites**:
   - Click the heart icon to save recipes
   - Access favorites anytime via "My Favorites" button
   - Remove favorites with the × button

4. **Additional Features**:
   - Toggle dark/light mode using the 🌓 button
   - Share recipes via the Share button
   - Print recipes with the Print button
   - View similar recipe suggestions at the bottom of each recipe

## Live Demo
Experience the app live: [Recipe Finder Demo](https://recipe-finder-wheat-two.vercel.app/)

## Future Enhancements
- [ ] Implement user accounts for cloud-synced favorites
- [ ] Add meal planning functionality
- [ ] Include nutritional information
- [ ] Add cooking timer/step-by-step mode
- [ ] Implement more advanced filtering (by ingredients, cooking time, etc.)

## Author
**Rubil Mogere**  
📧 Email: [mogererubil@gmail.com](mailto:mogererubil@gmail.com)  
💻 GitHub: [Rubil-Mogere-94](https://github.com/Rubil-Mogere-94)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- TheMealDB for their excellent free recipe API
- All open source contributors whose work inspired this project
