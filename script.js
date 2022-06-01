//local ga saqlash
let bookmarkedMovies = JSON.parse(localStorage.getItem("local-bookmarks")) || [];

//document dagi elementlarni olib kelish
const elForm = document.querySelector(".js-search-form");
const elName = document.querySelector(".js-search-form__title-input");
const elRating = document.querySelector(".js-search-form__rating-input");
const elSelect = document.querySelector(".js-search-form__genre-select");
const elSorting = document.querySelector(".js-searching-form_sort-select");

const elResult = document.querySelector(".search-result");
const elBookmarkMovies = document.querySelector(".bookmark_movies");

const elMovieInfoModal = document.querySelector("#movie-info-modal");

const elTemplate = document.querySelector("#movies-template").content;
const elItem = document.querySelector(".movies-template__item");

//aray larni saralavolish
const normolizedList = movies.map((movie, i) => {
    return {
        id: i + 1,
        title: movie.Title.toString(),
        fulltitle: movie.fulltitle,
        year: movie.movie_year,
        categories: movie.Categories.split("|").join(", "),
        summary: movie.summary,
        imdbRating: movie.imdb_rating,
        imdbId: movie.imdb_id,
        runtime: movie.runtime,
        language: movie.language,
        trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
        smallPoster: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
        bigPoster: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
    }
})

//categoriesni 50taasini olib kelib uni bosh array ga solib qoyish
let createGenreSelectOptions = (() => {
    let movieCatigories = [];

    normolizedList.splice(50).forEach((movie) => {
        movie.categories.split(", ").forEach((category) => {
            if (movieCatigories.includes(category)) {
                movieCatigories.push(category)
            }
        })
    })


    movieCatigories.sort();

    let elOptionFragment = document.createDocumentFragment();

    movieCatigories.forEach((category) => {
        let elCategorieOption = document.createElement("option");
        elCategorieOption.textContent = category
        elCategorieOption.value = category;

        elOptionFragment.appendChild(elCategorieOption);
        elSelect.appendChild(elOptionFragment);
    })

})

createGenreSelectOptions();
//har kelgan textContent ni render qilish
let renderMovies = ((searchResults) => {
    
    elResult.innerHTML = "";
    let elResultFragment = document.createDocumentFragment();

    searchResults.forEach((movie) => {
        let elMovie = elTemplate.cloneNode(true);

        $("movies-template__item", elMovie).dataset.imdbId = movie.imdbId;
        $("movie__title", elMovie).textContent = movie.title; 
        $("movie__poster", elMovie).src = movie.smallPoster;
        $("movie-year", elMovie).textContent = movie.year;
        $("movie-rating", elMovie).textContent = movie.imdbRating;
        $("movie__trailer", elMovie).href = movie.trailer;

        elResultFragment.appendChild(elMovie);
    })
    elResult.appendChild(elResultFragment);
})


let sortObjectAZ = ((array) => {
    return array.sort((a, b) => {
        if(a.title > b.title) {
            return 1;
        } else if (a.title < b.title) {
            return -1;
        } else {
            return 0;
        }
    })
})


let sortObjectHeightToLowerRating = ((arry) => {
    return arry.sort((a, b) => {
        return b.imdbRating - a.imdbRating;
    })
})

let sortObjectHeightNewToOld = ((array) => {
    return array.sort((a, b) => {
        return b.year - a.year;
    })
})

let sortSearchResult = ((result, sortType) => {
    if (sortType === "az") {
        return sortObjectAZ(result);
    }else if (sortType === "za") {
        return sortObjectAZ(result).reverse();
    }else if (sortType === "rating_desc") {
        return sortObjectHeightToLowerRating(result);
    }else if (sortType ==="rating_asc") {
        return sortObjectHeightToLowerRating(result).reverse();
    }else if (sortType ==="year_desc") {
        return sortObjectHeightNewToOld(result);
    }else if (sortType === "year_asc") {
        return sortObjectHeightNewToOld(result).reverse();
    }
})

let findMovies = ((title, minrating, genre) => {
    return normolizedList.filter((movie) => {
        let doesMatchCategory = genre ==="All" || movie.categories.includes(genre);
        
        return movie.title.match(title) && movie.imdbRating >= minrating && doesMatchCategory;
    })
})

elForm.addEventListener ("submit", (evt) => {
    evt.preventDefault();

    let searchTitle = elName.value.trim();
    let movieTitleRegex = new RegExp(searchTitle, "gi")

    let minimumRating = Number(elRating.value);
    let genre = elSelect.value;
    let sorting = elSorting.value;

    let sortResults = findMovies(movieTitleRegex, minimumRating, genre); 
    sortSearchResult(sortResults, sorting);
    renderMovies(searchResults);
    
});

let renderBookmarkMovies = (() => {
    elBookmarkMovies.innerHTML = "";

    elBookmarkMoviesFragment = document.createDocumentFragment();

    bookmarkedMovies.forEach((movie) => {
        let elBookmarkMovie = elBookmarkMovieTemplate.cloneNode(true);

        $("bookmarked-movie__title", elBookmarkMovie).textContent = movie.title;
        $("remove-bookmarked-movie-button", elBookmarkMovie).textContent = movie.imdbId;

        elBookmarkMoviesFragment.appendChild(elBookmarkMovie);
    })

    elBookmarkMovies.appendChild(elBookmarkMoviesFragment);
})

renderBookmarkMovies();

let updateLocalBookmarks = (() => {
    localStorage.setItem("local-bookmarks", JSON.stringify(bookmarkMovies));
})

let bookmarkMovie = ((movie) => {
    bookmarkMovies.push(movie);
    updateLocalBookmarks();
    renderBookmarkMovies();
})

elBookmarkMovies.addEventListener("click", (evt) => {
    if(evt.target.matches(".remove-bookmarked-movie-button")) {
        let movieImdbId = evt.target.closest(".movies-template__item").dataset.imdbId;

        let foundMovie = normolizedList.find((movie) => {
            return movie.imdbId === movieImdbId;
        })

        let isBookmark = bookmarkMovies.find((movie) => {
            return movie.imdbId === imdbId;
        })

        if(!isBookmark) {
            bookmarkMovie(foundMovie);
        }
        renderBookmarkMovies();
    }
})


let upDateMovieModalContent = ((movie) => {
    $(".movie-info-modal__title", elMovieInfoModal).textContent = movie.title;
    $(".modal-body", elMovieInfoModal).textContent = movie.summary;
})


elResult.addEventListener("click", ((evt) => {
    if(evt.target.matches(".js-movie-modal-opener")) {
        let movieImdbId = evt.target.closest(".movies-template__item").dataset.imdbId;

        let foundMovie = normolizedList.find((movie) => {
            return movie.imdbId === movieImdbId
        })
        updateLocalBookmarks();
        upDateMovieModalContent(foundMovie);
    }
}))
