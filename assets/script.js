// globally declared variables
var searchInput = document.getElementById("search-button");
var cityInput = document.getElementById("city-input");
var clearBtn = document.getElementById("clear-history");
var nameElement = document.getElementById("city-name");
var currentPic = document.getElementById("current-pic");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity"); 4
var currentWind = document.getElementById("wind-speed");
var currentUV = document.getElementById("UV-index");
var historyElement = document.getElementById("history");
var apiKey = "708187e40b564ddb4865c0cf80887413";
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// function calling open weather map api and using the data retrieved to insert needed information into current weather box
function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var currentDate = new Date(data.dt * 1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            nameElement.innerHTML = data.name + "(" + month + "/" + day + "/" + year + ")";
            let weatherPic = data.weather[0].icon;
            currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPic.setAttribute("alt", data.weather[0].description);
            currentTemp.innerHTML = "Tempurature: " + tempFix(data.main.temp) + " &#176F";
            currentHumidity.innerHTML = "Humidity:" + data.main.humidity + "%";
            currentWind.innerHTML = "Wind Speed:" + data.wind.speed + "mph";
            // grabbing the lattitude and longitude from first api call to be used in second call to obtain UV index
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            // makes the required call and inserts data into empty spots on current city box, also un-hides badge icon used to show current UV index
            let uvQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
            fetch(uvQueryUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    let uvIndex = document.getElementById("uv-index-badge")
                    uvIndex.classList.remove("hidden");
                    uvIndex.innerHTML = data.current.uvi;
                    currentUV.innerHTML = ("UV Index: ")
                });

            // calls a third api to get data required for 5 day forecast
            let cityID = data.name;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityID + "&appid=" + apiKey;
            fetch(forecastQueryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    // grabs all my empty forecast blocks and appends data needed
                    var forecastBlocks = document.querySelectorAll(".forecast");
                    for (let i = 0; i < forecastBlocks.length; i++) {
                        forecastBlocks[i].innerHTML = "";
                        var forecastIndex = i * 8 + 4;
                        var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
                        var forecastDay = forecastDate.getDate();
                        var forecastMonth = forecastDate.getMonth() + 1;
                        var forecastYear = forecastDate.getFullYear();
                        var forecastDateElement = document.createElement("p");
                        forecastDateElement.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateElement.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastBlocks[i].append(forecastDateElement);
                        var forecastWeatherElement = document.createElement("img");
                        forecastWeatherElement.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeatherElement.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecastBlocks[i].append(forecastWeatherElement);
                        var forecastTempElement = document.createElement("p");
                        forecastTempElement.innerHTML = "Temp: " + tempFix(data.list[forecastIndex].main.temp) + " &#176F";
                        forecastBlocks[i].append(forecastTempElement);
                        var forecastHumidityElement = document.createElement("p");
                        forecastHumidityElement.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                        forecastBlocks[i].append(forecastHumidityElement);
                        var forecastWindElement = document.createElement("p");
                        forecastWindElement.innerHTML = "Wind Speed: " + data.list[forecastIndex].wind.speed + "mph";
                        forecastBlocks[i].append(forecastWindElement);
                    }
                })
        });
}

// function used to convert tempurature from kelvin to farenheit
function tempFix(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

// event listener set to clear out local history and empty saved cities inputs
clearBtn.addEventListener("click", function () {
    searchHistory = [];
    window.localStorage.clear();
    historyElement.innerHTML = "";
})

// event listener set to take input of city name and call the getWeather function to obtain all data
searchInput.addEventListener("click", function () {
    var searchTerm = cityInput.value;
    getWeather(searchTerm);
    // pushes searched city into local storage and appends searched city onto the page as a read only input to be used to switch to searched cities in the future
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    var historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", "true");
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchTerm);
    historyElement.append(historyItem);
})

// function set to render local storage saved cities onto the page on load and handle click event to make api call if one is clicked
function renderSearchHistory() {
    history.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        var historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", "true");
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function (event) {
            event.preventDefault()
            getWeather(searchHistory[i]);
        })
        historyElement.append(historyItem);
    }
}

// calling function outside of anything else to make sure searched cities show up on the page when loaded
renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}