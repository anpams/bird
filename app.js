const ipGeolocation_KEY = "12a2009dfbb24e4680299352f74ef232";

async function fetchLocation() { //location API
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeolocation_KEY}`);
        const data = await response.json();
        const lat = data.latitude;
        const lng = data.longitude;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        await recentObservations(lat, lng);
    } catch (error) {

        console.error('Error fetching geolocation:', error);
        document.getElementById('output').innerHTML = "Error fetching geolocation. Try to disable your extensions.";

    }
}

async function recentObservations(lat, lng) { //ebird API
    const myHeaders = new Headers();
    myHeaders.append("x-ebirdapitoken", "t67f2dq8gt9f");
    const requestOptions = {
        method: "GET", headers: myHeaders, redirect: "follow"
    };
    try {
        const url = `https://api.ebird.org/v2/data/obs/geo/recent/notable?lat=${lat}&lng=${lng}`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.length > 0) {
            const sciName = data[0].sciName;
            const comName = data[0].comName;
            console.log(sciName);
            document.getElementById('commonName').innerHTML = `${comName}`;
            document.getElementById('scientificName').innerHTML = `${sciName}`;
            await xenoCanto(sciName);
            await fetchTitle(sciName);
        } else {
            document.getElementById('output').innerHTML = "No notable recent observations found :(";
        }
    } catch (error) {
        console.error("Recent Observations error:", error);
        document.getElementById('output').innerHTML = "Error fetching recent observations.";
    }
}

async function xenoCanto(sciName) { //XenoCanto API
    const requestOptions = {
        method: "GET", headers: {
            "Content-Type": "application/json"
        }, redirect: "follow"
    };

    const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(sciName)}`;
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (data.recordings.length > 0) {
            const audioUrl = data.recordings[0].file;
            const audioElement = document.getElementById('birdAudio');
            audioElement.src = audioUrl;
            audioElement.load();
        } else {
            console.error("No audio recording found.");
            document.getElementById('audioContainer').innerHTML = "No audio recording found.";
        }
    } catch (error) {
        console.error("xenoCanto error", error);
        document.getElementById('audioContainer').innerHTML = "Error fetching audio.";
    }
}

async function fetchTitle(sciName) { //looks for wiki page with scientific name
    let searchUrl = "https://en.wikipedia.org/w/api.php";
    let searchParams = {
        action: "query", list: "search", srsearch: sciName, format: "json"
    };

    searchUrl = searchUrl + "?origin=*";
    Object.keys(searchParams).forEach(function (key) {
        searchUrl += "&" + key + "=" + encodeURIComponent(searchParams[key]);
    });

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const searchResults = data.query.search;
        if (searchResults.length > 0) {
            const pageTitle = searchResults[0].title;
            await fetchImage(pageTitle);
        } else {
            console.log("No search results found for this term.");
            document.getElementById('output').innerHTML += "<br>No image found.";
        }
    } catch (error) {
        console.error("Wiki Title error:", error);
        document.getElementById('output').innerHTML += "<br>Error fetching title.";
    }
}

async function fetchImage(pageTitle) { //grabs img from wikipedia
    let url = "https://en.wikipedia.org/w/api.php";
    const params = {
        action: "query", prop: "pageimages", titles: pageTitle, format: "json", pithumbsize: 500
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) {
        url += "&" + key + "=" + encodeURIComponent(params[key]);
    });

    try {
        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        let found = false;

        for (const pageId in pages) {
            const page = pages[pageId];
            if (page.thumbnail && page.thumbnail.source) {
                document.getElementById('imageContainer').innerHTML = `<img src="${page.thumbnail.source}" alt="${pageTitle}">`;
                found = true;
                hideLoadingShowContent();
                break;

            }
        }

        if (!found) {
            console.log("No thumbnail");
            document.getElementById('imageContainer').innerHTML = "No image found.";
        }
    } catch (error) {
        console.error("Wiki Image error:", error);
        document.getElementById('imageContainer').innerHTML = "Error fetching image.";
    }
}

function hideLoadingShowContent() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'flex';
}

fetchLocation();
