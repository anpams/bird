async function recentObservations(lat, lng) {
    const myHeaders = new Headers();
    myHeaders.append("x-ebirdapitoken", "t67f2dq8gt9f");
    const requestOptions = {
        method: "GET", headers: myHeaders, redirect: "follow"
    };
    try {
        const url = "https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lng}";
//todo: fetch latlong
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        const sciName = data[0].sciName;
        console.log(sciName);
        // await xenoCanto(sciName);
        await fetchTitle(sciName);
    } catch (error) {
        console.error("recent Observations error:", error);
    }
}


async function xenoCanto(sciName) {
    const requestOptions = {
        method: "GET", headers: {
            "Content-Type": "application/json"
        }, redirect: "follow"
    };

    const url = "https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(sciName)}";
    try {
        const response = await fetch(url, requestOptions);
        const result = await response.text();
        // just grab sound
        console.log(result);
    } catch (error) {
        console.error("xenoCanto error", error);
    }
}


function fetchTitle(sciName) { //gets title of wiki page
    var searchUrl = "https://en.wikipedia.org/w/api.php";

    var searchParams = {
        action: "query", list: "search", srsearch: sciName, format: "json"
    };

    searchUrl = searchUrl + "?origin=*";
    Object.keys(searchParams).forEach(function (key) {
        searchUrl += "&" + key + "=" + searchParams[key];
    });

    fetch(searchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var searchResults = response.query.search;
            if (searchResults.length > 0) {
                var pageTitle = searchResults[0].title;
                fetchImage(pageTitle);
            } else {
                console.log("No search results found for this term.");
            }
        })
        .catch(function (error) {
            console.log("wikiTitle error: ", error);
        });
}

function fetchImage(pageTitle) { //gets image from wikipage
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query", prop: "pageimages", titles: pageTitle, format: "json", pithumbsize: 500
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + params[key];
    });
    //todo: clean this up probably
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
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
        .catch(function (error) {
            console.log("Wiki image error: ", error);
        });
}

recentObservations();


