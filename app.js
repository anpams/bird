
const date = new Date();

let day = date.getDay();
let month = date.getMonth();
let year = date.getFullYear();

console.log(date.toLocaleDateString("en-US"));

const recentObservations = async () => {
    const myHeaders = new Headers();
    myHeaders.append("x-ebirdapitoken", "t67f2dq8gt9f");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://api.ebird.org/v2/data/obs/BE/recent/notable", requestOptions);
        //change to lat and long for more accurate location. Or city
        const data = await response.json();
        const sciName = data[0].sciName;
        console.log(sciName);
        //fawait xenoCanto(sciName);
        await fetchTitle(sciName);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const xenoCanto = async (sciName) => {
    const requestOptions = {
        method: "GET",
        headers: xenoCanto,
        redirect: "follow"
    };

    const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(sciName)}`;
    try {
        const response = await fetch(url, requestOptions);
        const result = await response.text();
        //just grab sound
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

function fetchTitle(sciName) { //gets title of wiki page
    var searchUrl = "https://en.wikipedia.org/w/api.php";

    var searchParams = {
        action: "query",
        list: "search",
        srsearch: sciName,
        format: "json"
    };

    searchUrl = searchUrl + "?origin=*";
    Object.keys(searchParams).forEach(function(key) {
        searchUrl += "&" + key + "=" + searchParams[key];
    });

    fetch(searchUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var searchResults = response.query.search;
            if (searchResults.length > 0) {
                var pageTitle = searchResults[0].title;
                fetchImage(pageTitle);
            } else {
                console.log("No search results found for this term.");
            }
        })
        .catch(function(error) {
            console.log("Error fetching search results: ", error);
        });
}

function fetchImage(pageTitle) { //gets image from wikipage
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        prop: "pageimages",
        titles: pageTitle,
        format: "json",
        pithumbsize: 500
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + params[key];
    });

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var pages = response.query.pages;
            for (var pageId in pages) {
                var page = pages[pageId];
                if (page.thumbnail && page.thumbnail.source) {
                    console.log(page.thumbnail.source);
                    return page.thumbnail.source;
                } else {
                    console.log("No thumbnail");
                    return null;
                }
            }
        })
        .catch(function(error) {
            console.log("Error fetching the data: ", error);
        });
}

recentObservations();


