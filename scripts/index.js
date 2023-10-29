/* This website utilizes News API to let uses search for recent articles with a given keyword. Using local storage, users can save custom keywords that will stay on the header as a saved search.
   This means that we have to save pinned custom keywords using localStorage, putting them into an array using || and a default value into an array, then generate the inner HTML for the website header */

/* Pull HTML elements */
const headerElem = document.querySelector(".website-header");
const sortbyElem = document.querySelector(".sortby-select");
const errorOutputElem = document.querySelector(".search-error-output");
const articleFeedOutputElem = document.querySelector(".article-output-wrap");
const generateArticleButtonElem = document.querySelector(".generate-articles-button");
const keywordInputElem = document.querySelector(".search-input");
const englishOnlyInputElem = document.getElementById("language-toggle");


/* CREATE THE HEADER BUTTONS BY PULLING FROM LOCAL STORAGE AND USING HTML GENERATION, THEN ADD ONCLICK LISTENERS TO GENERATE ARTICLES FOR EACH. 
   DONE BY CREATING FOUR FUNCTIONS THAT CALL KEYWORDS FROM LOCAL STORAGE INTO AN ARRAY, ONE THAT UPDATES HEADER HTML USING THAT ARRAY,
   ONE THAT STORES EACH BUTTON ELEMENT INTO AN ARRAY, AND ONE THAT USES THAT ARRAY TO ADD ONCLICK LISTENERS. CALL ALL FOUR.  */


/* Function that pulls from localStorage to create an array of custom keywords to generate headerHTML, Call it*/
let customKeywordArray;
const updateCustomKeywordArray = () => {
    customKeywordArray = [
        localStorage.getItem("ck1") || "Science",
        localStorage.getItem("ck1") || "Culture",
        localStorage.getItem("ck3") || "Health",
        localStorage.getItem("ck4") || "Sports",
        localStorage.getItem("ck5") || "Activism" ];
}

updateCustomKeywordArray();


/* Function that iterate items in customKeywordArray, using their values to generate html code that is added to putString, which is then mapped to headerElem, Call it */
let putString;
const updateHeaderHTML = (customKeywordArray) => {
    putString = `<span class="image-wrap-margin"><img class="title" src="./images/CustomNewsClientLogo.PNG"/></span>`;
    customKeywordArray.forEach( (keyword, index) => {
        putString += `<button class="topic${index} pinned-topic" data-keyword="${keyword.substring(0,1).toLowerCase() + keyword.substring(1)}">${keyword}</button>`;
        /* Paste the generated HTML onto the header flexbox */
    });
    headerElem.innerHTML = putString;
}

updateHeaderHTML(customKeywordArray);


/* Create a function that creates an array of header button elements */
let headerButtonElemArray;
const updateHeaderButtonElemArray = () => {
    headerButtonElemArray = [
        document.querySelector(".topic0"),
        document.querySelector(".topic1"),
        document.querySelector(".topic2"),
        document.querySelector(".topic3"),
        document.querySelector(".topic4")
    ];
}

updateHeaderButtonElemArray();



/* Create a function that accepts headerButtonElemArray, and adds onclick listeners for each that render article feed */
const updateHeaderButtonOnclicks = (headerButtonElemArray) => {
    headerButtonElemArray.forEach((button, index) => {
        button.addEventListener("click", () => {           
            renderArticleFeed(`${button.dataset.keyword.substring(0,1).toLowerCase() + button.dataset.keyword.substring(1)}`, sortbyElem.value);
        });
    });
}

updateHeaderButtonOnclicks(headerButtonElemArray);


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

    /* Move date one day more recent */
    if (date > 27) {
        date = 0;
        if (month == 11) {month = 0}
        else (month += 1)
    }
    else { date += 1 }

    /* Move month one month earlier */
    if (month < 1) {
        if (month == 0) { month = 11; }
        year -= 1;
    }
    else {month -= 1;}

    /* Create dateString and format URL for fetching API */
    let dateString;
    if (month < 9) { dateString = `${year}-0${month+1}-${date}`; }
    else {dateString = `${year}-${month+1}-0${date}`; }

    let URL;
    /* Check to see if request should only search for english articles */
    if (englishOnlyInputElem.value == "on") { URL = `https://newsapi.org/v2/everything?q=${keyword}&from=${dateString}&sortBy=${sortby}&language=en&apikey=7ff368666b8e492e9e48f660c629b39e`;
        console.log("English");
    console.log(englishOnlyInputElem.value)}
    else { URL = `https://newsapi.org/v2/everything?q=${keyword}&from=${dateString}&sortBy=${sortby}&apikey=7ff368666b8e492e9e48f660c629b39e`; }
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
                            <p class="article-display-title">${article.title}</p>
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
                <a class="image-anchor-tag" href="${article.url}" target="_blank">
                        <img class="article-display-image" src="${article.urlToImage}"/>
                    </a>
                </div>
            </div>`;

            /* Check image source and title to validate the article */
            if (article.urlToImage == null || article.title == "[Removed]") { temp = ``;}
            
            /* Add temp (which contains nothing if the above branch is taken) to assemblyString */
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

/* Add keydown listener to generate articles if "Enter" is pressed */
keywordInputElem.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        renderArticleFeed(keywordInputElem.value.substring(0,1).toLowerCase() + keywordInputElem.value.substring(1), sortbyElem.value);
    }
});

/* Set checkbox value to unchecked */
englishOnlyInputElem.checked = false;

/* Add event listener to checkbox that updates the value of checked each time */
englishOnlyInputElem.addEventListener("click", () => {
    if (englishOnlyInputElem.value=="off") {
        englishOnlyInputElem.value="on";
        console.log(englishOnlyInputElem.value);
    }
    else {
        englishOnlyInputElem.value="off";
        console.log(englishOnlyInputElem.value);
    }
});

/* Add click listener to generate articles button that generates articles for the user inputted keyword and sort method */
generateArticleButtonElem.addEventListener("click", () => {
    renderArticleFeed(keywordInputElem.value.substring(0,1).toLowerCase() + keywordInputElem.value.substring(1), sortbyElem.value);
});

console.log(englishOnlyInputElem.value);

