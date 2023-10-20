/* This website utilizes News API to let uses search for recent articles with a given keyword. Using local storage, users can save custom keywords that will stay on the header as a saved search.
   This means that we have to save pinned custom keywords using localStorage, putting them into an array using || and a default value into an array, then generate the inner HTML for the website header */

/* Pull HTML elements */
const headerElem = document.querySelector(".website-header");
const sortbyElem = document.querySelector(".sortby-select");
const errorOutputElem = document.querySelector(".search-error-output");
const articleFeedOutputElem = document.querySelector(".article-output-wrap");
/* CREATE THE HEADER BUTTONS BY PULLING FROM LOCAL STORAGE AND USING HTML GENERATION, THEN ADD ONCLICK LISTENERS TO GENERATE ARTICLES FOR EACH */


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
/* Paste the generated HTML onto the header flexbox */
headerElem.innerHTML = putString;

// /* Create a function that accepts customKeywordArray, and adds event clickers to each header button that runs renderArticleFeed with the dataset keyword */
// const addHeaderOnclicks = (customKeywordArray) => {
//     customKeywordArray.forEach((badKeyword, index) => {
//         const tempButtonElem = document.querySelector(`.topic${index}`);
//         tempButtonElem.addEventListener("onclick", (keyword) => {
//             renderArticleFeed(`${tempButtonElem.dataset.keyword}`, sortbyElem.value);
//         })
//     })
// }


/* CREATE A FUNCTION THAT WILL ACCEPT A KEYWORD AND SORTBY PREFERENCE, FETCH DATA FROM NEWSAPI USING THOSE PARAMETERS
   AS WELL AS API KEY AND DATE. IF THE DATA DOES NOT RETURN PROPERLY OR THERE ARE NO ARTICLES FOR THE GIVEN KEYWORD, OUTOUT AN ERROR.
   IF THE DATA RETURNED CORRECTLY, ITERATE RESULT.ARTICLES TO SOURCE TITLE, DATE, AUTHOR, SOURCE, AND LINK FOR EACH ARTICLE,
   ADDING EACH TO AN ASSEMBLY STRING, GENERATING HTML */

/* Create a function that accepts a keyword and returns an array of articles from newsAPI */
const renderArticleFeed = (keyword, sortby) => {
    /* Figure out the date ONE months ago using getTimes */
    const d = new Date();
    let date = d.getDate();
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
    fetch(URL).then(response => response.json()).then(result => {
      /* If result.status is not okay, throw error saying the request failed */
      if (result.status === "ok") {
        /* If results are empty, output error saying keyword had no articles */
        if (result.articles.length === 0) {
          errorOutputElem.innerHTML = `Oops! No articles found for ${keyword}.`
          throw new Error("No Articles for Keyword");
        }
        /* Start generating HTML for article output wrap */
        let assemblyString = ``;
        let temp;
        /* Iterate each article adding the temp string to assemblyString */
        result.articles.forEach( (article, index) => {
            temp = ``;
            /* Add up to article title */
            temp += `
            <div class="article-display">
                <div class="article-display-left">
                    <div class="article-display-first-textline">
                        <div class="article-display-title-wrap">
                            <p class="article-display-title">${article.title}</p>;
                        </div>`;
            /* Parse date output to store correct format in dateVal */
            let dateVal = `${article.publishedAt.substring(5,7)}-${article.publishedAt.substring(8, 10)}-${article.publishedAt.substring(0, 4)}`;
            /* Add up to article date */
            temp += `
            <div class="article-display-date-wrap">
                            <p class="article-display-date">${dateVal}</p>
                        </div>
                    </div>`;
            /* Add up to article author */
            temp += `
            <div class="article-display-second-textline">
                <div class="article-display-author-wrap">
                    <p class="article-display-author">${article.author}</p>
                </div>`;
            /* Add up to article source */
            temp += `
            <div class="article-display-source-wrap">
                <p class="article-display-source">${article.source.name}</p>
            </div>
            </div>`;
            /* Add up to article link and close left side of article output */
            temp += `
            <div class="article-display-third-textline">
                    <div class="article-display-link-wrap">
                        <a class="article-display-link" target="_blank" href="${article.url}">${article.url}</a>
                    </div>
                </div>
            </div>`;
            /* Add the article image and right side of article output, finishing temp HTML generation */
            temp += `
            <div class="article-display-right">
                    <img class="article-display-image" src="${article.urlToImage}"/>
                </div>
            </div>`;
            /* Add temp to assemblyString */
            assemblyString += temp;
        });
        /* Paste generated HTML inside assemblyString onto the article output wrap element */
        articleFeedOutputElem.innerHTML = assemblyString;
      } else {
        /* Update error output field */
        errorOutputElem.innerHTML = `Opps! Request to server was unsuccessful.`
        throw new Error(`Error Code ${result.code}: ${result.message}`);
      }
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
  }