
const searchInput = document.getElementById("search");
const searchResult = document.getElementById("searchResult");

const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");

const movieImageContainer = document.getElementById("movie-image-container");
const movieDetailsContainer = document.getElementById("movie-details-container");

// --- search movie ---
searchInput.addEventListener("input", async () => {

    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&s=${searchInput.value}`);
    const data = await response.json();
    if (data.Response === "True" && data.Search.length > 0) {
        searchResult.innerHTML = ""; // clear previous search results
        data.Search.forEach((movie) => {
            const divElement = document.createElement("div");

            divElement.classList.add("card");
            const img = document.createElement("img");
            img.src = movie.Poster;
            img.classList.add("card-img-top");
            
            
            
            

            const a = document.createElement("a");
            a.classList.add("card-text");
            
            a.textContent = movie.Title + " - " + movie.Year;
            a.appendChild(img);
            divElement.appendChild(a);
            a.onclick = () => {
                movieDetails(movie);
                searchResult.innerHTML = "";
            }
            
            
            
            

            

            


            searchResult.appendChild(divElement);

        });

    }
    else {
        searchResult.innerHTML = "No movies found."; // if no movies found
    }
});

// --- display movie details ---
async function movieListFn(value = "Avengers") {
    movieImageContainer.innerHTML = ""; // clear previous images
    movieDetailsContainer.innerHTML = ""; // clear previous details
    searchResult.innerHTML = ""; // clear previous search results
    movieList.innerHTML = "";   // clear previous movie list
    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&s=${value}`); 
    const data = await response.json();

    // console.log(data.Search);

    if (data.Response === "True" && data.Search.length > 0) {
         
        data.Search.forEach((movie) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");

            const flexDiv = document.createElement("div");
            flexDiv.classList.add("flex");

            const imageContainerDiv = document.createElement("div");
            imageContainerDiv.classList.add("image-container");

            const imageElement = document.createElement("img");
            imageElement.src = movie.Poster;
            imageElement.classList.add("card-img-list");

            imageContainerDiv.appendChild(imageElement);

            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("details");

            const titleParagraph = document.createElement("p");
            titleParagraph.onclick = () => movieDetails(movie);
            titleParagraph.textContent = `${movie.Title} - ${movie.Year}`;

            const typeParagraph = document.createElement("p");
            typeParagraph.textContent = movie.Type;

            const addButton = document.createElement("button");
            addButton.textContent = "Add to favorite";
            addButton.classList.add("btn", "btn-primary");
            addButton.onclick = () => addFavourite(movie);

            detailsDiv.appendChild(titleParagraph);
            detailsDiv.appendChild(typeParagraph);
            detailsDiv.appendChild(addButton);

            flexDiv.appendChild(imageContainerDiv);
            flexDiv.appendChild(detailsDiv);

            listItem.appendChild(flexDiv);
            movieList.appendChild(listItem);
        })
    }
    else {
        movieList.innerHTML = "<h2 class='text-center'>No movies found. Please try again</h2>";
    }
}

movieListFn();

// --- search button click ---
// on submit shows displayed movie list  
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    movieListFn(searchInput.value)
    searchInput.value = ""; // clear search input
}
);

// --- displays the list of favorite movies ---
function showFavorites() {
    movieImageContainer.innerHTML = ""; // clear the image container
    movieDetailsContainer.innerHTML = ""; // clear the details container
    const favourites = JSON.parse(localStorage.getItem("favorites")) || [];

    // console.log(favourites);

    movieList.innerHTML = "";
    if (favourites.length>0) { 
        favourites.forEach((movie) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");

            const flexDiv = document.createElement("div");
            flexDiv.classList.add("flex");

            const imageContainerDiv = document.createElement("div");
            imageContainerDiv.classList.add("image-container");

            const imageElement = document.createElement("img");
            imageElement.src = movie.Poster;
            imageElement.classList.add("card-img-list");

            imageContainerDiv.appendChild(imageElement);

            const detailsDiv = document.createElement("div");

            detailsDiv.classList.add("details");

            const titleParagraph = document.createElement("p");
            titleParagraph.onclick = () => movieDetails(movie);
            titleParagraph.textContent = `${movie.Title} - ${movie.Year}`;

            const typeParagraph = document.createElement("p");
            typeParagraph.textContent = movie.Type;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove from favorite";
            removeButton.classList.add("btn", "btn-primary");
            removeButton.onclick = () => removeFavourite(movie);

            detailsDiv.appendChild(titleParagraph);
            detailsDiv.appendChild(typeParagraph);
            detailsDiv.appendChild(removeButton);

            flexDiv.appendChild(imageContainerDiv);
            flexDiv.appendChild(detailsDiv);

            listItem.appendChild(flexDiv);
            movieList.appendChild(listItem);
        })
    } else {
        movieList.innerHTML = "<h2 class='text-center'>No movies found in favourites</h2>";
    }
}
// --- adding favourite movie ---
function addFavourite(movie) {

    // console.log("adding to favourites", movie.Title);

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.find(moviein => moviein.imdbID == movie.imdbID) === undefined) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

}
// --- removing favourite movie ---
function removeFavourite(movie) {

    // console.log("removing from favourites", movie.Title);

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => {
        console.log(favorite, movie);
        return favorite.imdbID !== movie.imdbID;
    });

    // console.log(favorites.length);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();

}

// --- display movie details ---
async function movieDetails(movie) {

    // console.log(movie);

    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&i=${movie.imdbID}&plot=full`);
    const data = await response.json();

    movieImageContainer.innerHTML = ""; // clear the image container
    const movieImage = document.createElement('img');
    movieImage.src = data.Poster;
    movieImageContainer.appendChild(movieImage);


    const h2 = document.createElement('h2');
    h2.textContent = data.Title;

    const p1 = document.createElement('p');
    p1.textContent = data.Plot;

    const p2 = document.createElement('p');
    p2.textContent = `Rating: ${data.imdbRating}`;

    const p3 = document.createElement('p');
    p3.textContent = `Runtime: ${data.Runtime}`;

    const p4 = document.createElement('p');
    p4.textContent = `Genre: ${data.Genre}`;

    const p5 = document.createElement('p');
    p5.textContent = `Director: ${data.Director}`;

    const p6 = document.createElement('p');
    p6.textContent = `Actors: ${data.Actors}`;

    const p7 = document.createElement('p');
    p7.textContent = `Language: ${data.Language}`;

    const p8 = document.createElement('p');
    p8.textContent = `Country: ${data.Country}`;

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add("btn", "btn-primary");
    favoriteButton.textContent = "Add to Favourites";
    favoriteButton.onclick = () => addFavourite(data);

    movieDetailsContainer.innerHTML = ''; // Clear existing content
    movieDetailsContainer.append(h2, p1, p2, p3, p4, p5, p6, p7, p8, favoriteButton);

    movieList.innerHTML = ''; // Clear previous search results

}