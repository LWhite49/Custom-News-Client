/* This website utilizes News API to let uses search for recent articles with a given keyword. Using local storage, users can save custom keywords that will stay on the header as a saved search.
   This means that we have to save pinned custom keywords using localStorage, putting them into an array using || and a default value into an array, then generate the inner HTML for the website header */

/* Pull HTML elements */
const headerElem = document.querySelector(".website-header");
/* Pull from localStorage to create an array of custom keywords to generate headerHTML */

const customKeywordArray = [
    localStorage.getItem("ck1") || "Science",
    localStorage.getItem("ck1") || "Culture",
    localStorage.getItem("ck3") || "Health",
    localStorage.getItem("ck4") || "Sports",
    localStorage.getItem("ck5") || "Activism" ];

/* Iterate items in customKeywordArray, using their values to generate html code that is added to putString, which is then mapped to headerElem */
let putString = `<span class="image-wrap-margin"><img class="title" src="./images/CustomNewsClientLogo.PNG"/></span>`;

customKeywordArray.forEach( (keyword, index) => {
    putString += `<button class="topic${index} pinned-topic" data-keyword="${keyword}">${keyword}</button>`;
});
headerElem.innerHTML = putString;

/* Create a function that accepts a keyword and returns an array of articles from newsAPI */