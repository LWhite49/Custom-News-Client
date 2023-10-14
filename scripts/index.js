/* This website utilizes News API to let uses search for recent articles with a given keyword. Using local storage, users can save custom keywords that will stay on the header as a saved search.
   This means that we have to save pinned custom keywords using localStorage, putting them into an array using || and a default value into an array, then generate the inner HTML for the website header */

/* Pull HTML elements */
const headerElem = document.querySelector(".website-header");
const sortbyElem = document.querySelector(".sortby-select");
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

const returnArticleArray = (keyword, sortby) => {
    /* Figure out the date ONE months ago using getTimes */
    const d = new Date();
    let date = d.getDate;
    let month = d.getMonth();
    let year = d.getFullYear();
    if (month < 1) {
        if (month == 0) { month = 11; }
        year -= 1;
    }
    else {month -= 1;}

    /* Create dateString and format URL for fetching API */
    let dateString;
    if (month < 9) { dateString = `${year}-0${month+1}-${date}`; }
    else {dateString = `${year}-${month+1}-0${date}`; }
    const URL = `https://newsapi.org/v2/everything?q=${keyword}&from=${dateString}&sortBy=${sortby}&apikey=7ff368666b8e492e9e48f660c629b39e`;
    /* Make request for given Keyword */
    // fetch(URL).then(response => response.json()).then(result => {
    //   if (result.status === "ok") {
    //     if (result.articles.length === 0) {
    //       throw new Error("No Articles for Keyword");
    //     }
    //     console.log(result);
    //   } else {
    //     throw new Error(`Error Code ${result.code}: ${result.message}`);
    //   }
    // })
    // .catch(error => {
    //   console.log(`Error: ${error}`);
    // });
  }
returnArticleArray("Hockey", sortbyElem.value);