function initPage() {
    var searchInput = document.getElementById("search-button");
    var cityInput = document.getElementById("city-input");
    var clearBtn = document.getElementById("clear-history");
    var nameElement = document.getElementById("city-name");
    var currentPic = document.getElementById("current-pic");
    var currentTemp = document.getElementById("temperature");
    var currentHumidity = document.getElementById("humidity"); 4
    var currentWind = document.getElementById("wind-speed");
    var currentUV = document.getElementById("UV-index");
    var history = document.getElementById("history");
    var apiKey = "708187e40b564ddb4865c0cf80887413";
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];



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
            })
    }














    searchInput.addEventListener("click", function () {
        var searchTerm = cityInput.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
    })
}
initPage()