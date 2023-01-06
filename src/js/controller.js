import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';

import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return console.log('nie ma id');
    recipeView.renderSpinner();
    // 1 Loading recipe

    // update results view to mark selected search result
    resultView.update(model.getSearchResultPage());
    // update bookmakrs
    bookmarksView.update(model.state.bookmarks);

    //  ładujemy przepis
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResult(query);
    // Render results
    // resultView.render(model.state.search.results);
    // Render result with pagination
    resultView.render(model.getSearchResultPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultView.render(model.getSearchResultPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// amount servings dish
const controlServings = function (newServings) {
  // update the recipe servings(in state)
  model.updateServings(newServings);

  // rendering recipe with new serving
  // recipeView.render(model.state.recipe);
  // we're update only this value, those are chanage, only change text and attribuites in DOM
  recipeView.update(model.state.recipe);
  // update the recipe view
};

const controlAddBookmark = function () {
  // add/romove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner show
    addRecipeView.renderSpinner();
    // upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // display succes massage
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in URL without reload page in 3 parametr we add URL[id] our recipe
    window.history.pushState(null, '',`#${model.state.recipe.id}` );
    // bookmarksView.update(model.state.bookmarks);
    bookmarksView.update(model.state.bookmarks);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeatture = function(){
  console.log(
    'hello Im testing functiongit'
  );
}
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  newFeatture()
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
