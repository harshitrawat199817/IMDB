
const searchInput = document.getElementById("search");
const searchResult = document.getElementById("searchResult");

const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");

const movieImageContainer = document.getElementById("movie-image-container");
const movieDetailsContainer = document.getElementById("movie-details-container");

searchInput.addEventListener("input", async () => {

    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&s=${searchInput.value}`);
    const data = await response.json();
    if (data.Response === "True") {
        data.Search.forEach((movie) => {
            const divElement = document.createElement("div");
            divElement.classList.add("card");

            const a = document.createElement("a");
            a.classList.add("card-text");
            a.onclick = () => {
                movieDetails(movie);
            }
            a.textContent = movie.Title + " - " + movie.Year;
            divElement.appendChild(a);

            const img = document.createElement("img");
            img.src = movie.Poster;
            img.classList.add("card-img-top");
            a.appendChild(img);

            // `
            // <div class="card">
            // <a class="card-text" onclick="movieDetails('${movie}')""><img src="${movie.Poster}" class="card-img-top" alt="...">  ${movie.Title} - ${movie.Year}</a>  
            // </div>
            // `;
            searchResult.appendChild(divElement);
            
        });
         
    }
    else {
        searchResult.innerHTML = "No movies found.";
    }
});

// const searchForm = document.getElementById("search-form");
// const movieList = document.getElementById("movie-list");



async function movieListFn(value = "Avengers") {
    movieImageContainer.innerHTML = "";
    movieDetailsContainer.innerHTML = "";
    searchResult.innerHTML = "";
    movieList.innerHTML = "";
    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&s=${value}`);
    const data = await response.json();
    console.log(data.Search);
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

        // Append the flexDiv to an existing container in the DOM
        // For example, if movieList is the container:
        listItem.appendChild(flexDiv);
        movieList.appendChild(listItem);
    })
}
movieListFn();
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    movieListFn(searchInput.value)
}
);

// --- displays the list of favorite movies ---
function showFavorites() {
    movieImageContainer.innerHTML = "";
    movieDetailsContainer.innerHTML = "";
    const favourites = JSON.parse(localStorage.getItem("favorites"))||[];
    console.log(favourites);
    movieList.innerHTML = "";
    if (favourites.length) {
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

            // Append the flexDiv to an existing container in the DOM
            // For example, if movieList is the container:
            listItem.appendChild(flexDiv);
            movieList.appendChild(listItem);
        })
    } else{
        movieList.innerHTML = "<h2 class='text-center'>No movies found in favourites</h2>";
    }
}
// --- adding favourites ---
function addFavourite(movie) {
    console.log("adding to favourites", movie.Title);

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.find(moviein=>moviein.imdbID==movie.imdbID)===undefined) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        // displayFavorites();
    }

}
// --- removing favourites ---
function removeFavourite(movie) {
    console.log("removing from favourites", movie.Title);
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => {
        console.log(favorite, movie);
        return favorite.imdbID !== movie.imdbID;});
    console.log(favorites.length);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();

}
async function movieDetails(movie) {
    console.log(movie);
    const response = await fetch(`https://www.omdbapi.com/?apikey=63705e87&i=${movie.imdbID}&plot=full`);
    const data = await response.json();
    
    movieImageContainer.innerHTML = "";
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

    movieList.innerHTML = '';


}