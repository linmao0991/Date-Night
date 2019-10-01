var yelpApiKey = "oy6hhHsq3Rftgnl-vLTLO0vfP8VKnoGjq4a_AhrqhbfG4Q3Mothi8_PzIv_GmBntG9J0gBmx04lCPmhZi2xn4mJW_CRHtohDxdhGOoUS4GGErey7MesWAQLgAYWBXXYx";
var omdbApiKey = "850f1e7";
var tmsapoApiKey = "gu6dchs6ur8aejc2hd6tms43";
var movieGenre = "";
var foodBudget = [];
var movieRating = ""; 
var foodCategory = "";
var tmsapiData = "";
var foodResults;
var filteredMovies = [];
var zipCode = 0;
var theaters = [];
var selectedMovieTime;
var selectedTheater;
var searchRadius = 16000;

$(window).on("load", function(){
    $("#myModal").modal("show");
 });

 //On click function to get movie genre 
$(".genre").on("click",function(){
    $(".genre").removeClass("btn-danger").addClass("btn-primary");
    movieGenre = $(this).attr("value");
    console.log(movieGenre);
    $(this).removeClass("btn-primary").addClass("btn-danger");
});

//On function to get food budget
$(".budget").on("click", function(){
    var selectedBudget = $(this).attr("value");
    //If selected price value if not in array, push value to array and sort array
    if( foodBudget.indexOf(selectedBudget) == -1){
        foodBudget.push(selectedBudget);
        foodBudget.sort();
        console.log('Food Budget Array');
        console.log(foodBudget);
    //Else remove the selected price from array
    }else{
        foodBudget.splice(foodBudget.indexOf(selectedBudget),1);
        foodBudget.sort();
        console.log('Food Budget Array');
        console.log(foodBudget);
    }
});
//On click function to get movie rating
$(".rating").on("click", function(){
    $(".rating").removeClass("btn-danger").addClass("btn-primary");
    movieRating = $(this).attr("value");
    console.log(movieRating);
    $(this).removeClass("btn-primary").addClass("btn-danger");
});
//On click function to get food category
$(".food").on("click", function(){
    $(".food").removeClass("btn-danger").addClass("btn-primary");
    foodCategory = $(this).attr("value");
    console.log(foodCategory);
    $(this).removeClass("btn-primary").addClass("btn-danger");
});

$(document).on("click", ".showtimeButton", function(){
    $(".showtimeButton").removeClass("btn-danger").addClass("btn-warning");
    selectedMovieTime = $(this).attr("data-time");
    selectedTheater = $(this).attr("data-theater");
    $(this).removeClass("btn-warning").addClass("btn-danger");
});

// Google Places API --Nearby Search: Search nearby specific area. 'coordinates'--
function getTheaterCoord(){
    var searchThis = selectedTheater;
    var latitude = 41.5084;
    var longitude = -81.6076;
    var theaterRadius = 8000;
    var bisType = "movie_theater"
    var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+latitude+","+longitude+"&radius="+theaterRadius+"&keyword="+searchThis+"&type="+bisType+"&key="+googleApiKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log("---------------------------------------");
        console.log("Google Places Nearby Search of :"+searchThis);
        console.log(response);
        console.log("---------------------------------------");
    });
};

//Function for clicking submit on options moda;
$("#submit").on("click", function(){
    zipCode = $("#zip").val();
    //Checks using regex and string legnth for proper zipcode
    if( zipCode.length == 5 && /^[0-9]+$/.test(zipCode)){
        var radius = 10;
        ajaxCallMovie(zipCode, radius);
    }else{
        alert("Invalid zip code, please try again.");
    }
});

//Function ffor tmsapi for movies playing locally
function ajaxCallMovie (zipCode, radius){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var searchDate = yyyy+"-"+mm+"-"+dd;
    var queryURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate="+searchDate+"&zip="+zipCode+"&radius="+radius+"&api_key="+tmsapoApiKey+"";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        tmsapiData = response;
        console.log(response);
        console.log(movieGenre);
        $("#options").html("");
        $("#myModal").modal("hide");
        createMovieCard(radius);
    })
}

//Function for clicking movie cards
$(document).on("click", ".movieCard", function(){
    var showtimes = 0;
    console.log(showtimes);
    $('#movieShowtimes').html("");
    var tmsapiIndex = $(this).attr("data-arrayIndex");
    var posterImg = $(this).find("img").attr("src");
    var movieTitle = tmsapiData[tmsapiIndex].title;
    var moviePlot = tmsapiData[tmsapiIndex].longDescription;
    var mpaaRating;
    //If Mpaa rating is undefined, set mpaaRating to "No Mpaa Rating"
    if(typeof tmsapiData[tmsapiIndex].ratings === 'undefined'){
        mpaaRating = "No Mpaa Rating";
    }else{
        mpaaRating = tmsapiData[tmsapiIndex].ratings[0].code;
    }
    var movieScore = $(this).attr("data-score");
//-------This section will create a new array with obejects-------------//
    //Sets showtimes variable to all the array showtimes in the tmsapi Data
    showtimes = tmsapiData[tmsapiIndex].showtimes;
    //Creates a emtpy array showtimeByTheater for storing our showtimes grouped by theater
    var showtimeByTheater = [];
    //For loop that loops through all the showtimes in the tmsapi showtimes
    for ( var i = 0; i < showtimes.length; i++){
        //Sets the current index theater to currentTheater
        var currentTheater = showtimes[i].theatre.name;
        //Sets the current index showtime time to currentShowtime
        var currentShowtime = showtimes[i].dateTime.slice(11);
        //If currentTheater is not in the array add object to showtimeByTheater array
        if( showtimeByTheater.findIndex(findObjectIndex) == -1){
            showtimeByTheater.push({theatre: currentTheater, showtimes: [currentShowtime]})
        //Else find the index of currentTheater and add currentShowtime to object key showtimes, then sort.
        }else{
            var index = showtimeByTheater.findIndex(findObjectIndex)
            showtimeByTheater[index].showtimes.push(currentShowtime);
            showtimeByTheater[index].showtimes.sort();
        }
        //Functions returns if any index of the array equals currentTheater
        function findObjectIndex(theaterIndex){
            return theaterIndex.theatre == currentTheater;
        }
    };
//-------------------------------------------------------------------//
    console.log('------------New showtimesbyTheater Array--------');
    console.log(showtimeByTheater);
    console.log('------------New showtimesbyTheater Array--------');
    $("#movieModalImg").attr("src", posterImg);
    $('#movieModalTitle').html(movieTitle);
    $('#movieModalPlot').html(moviePlot);
    $('#movieModalRating').html(movieScore);
    $('#movieModalMpaaRating').html(mpaaRating);
    //For loops loops through each index of showtimeByTheater array.
    for (var i = 0; i < showtimeByTheater.length; i++){
        theaterName = showtimeByTheater[i].theatre;
        var theaterDiv = $("<div>").addClass('border rounded');
        theaterDiv.attr("data-theater", theaterName)
        var theaterDivTitle = $("<h4>").text(theaterName);
        theaterDiv.append(theaterDivTitle);
        var theaterShowtimes = showtimeByTheater[i].showtimes;
        //Loops through each array index of showtimesByTheater[current index].showtimes.
        for (var i = 0 ; i < theaterShowtimes.length; i++){
            var standardtime = timeConvertor(theaterShowtimes[i]);
            var button = $("<button>").addClass("showtimeButton btn btn-warning m-1");
            button.attr("data-theater", theaterName);
            button.attr("data-time", standardtime);
            button.text(standardtime);
            $(theaterDiv).append(button);
        }
        $('#movieShowtimes').append(theaterDiv);
    };
    $("#movieModal").modal("show");
 });

 //Function to convert miliatry time to standard time
 function timeConvertor(time) {
    var convertThis = time.split(':');
    var hours = convertThis[0];
    var minute = convertThis[1];
    var converted;
    if( hours > 0 && hours <= 12){
        converted = "" + hours; 
    } else if ( hours > 12) {
        converted = "" + ( hours - 12);
    } else if ( hours == 0) {
        converted = "12";
    }
    converted += ":" + minute;
    converted += (hours >= 12) ? " P.M." : " A.M.";
    return converted;
}

//Function to create a card for each movie that passes the filter
function createMovieCard(radius){
    console.log('--------------------------------');
    console.log('createMovieCard radius: '+radius);
    console.log('--------------------------------');
    //Checks if there are results from the api call and if radius is less than 30.
    if( tmsapiData.length == 0  && radius < 40){
        console.log('Increase theater radius');
        //Call the tmsapi agian and increase radius by 5 miles
        radius += 5;
        ajaxCallMovie(zipCode, radius);
    //Checks if radius is at max and no results
    }else if ( tmsapiData.length == 0 && radius >= 40){
        alert("There are no movies playing within "+radius+" miles of zip code "+zipCode+"! Please Try a different zip code.");
    }else{
        var moviesSelected =[];
        var moviePosterID= [];
        for ( var i = 0; i < tmsapiData.length; i++){
            //if movie title is undefined, skip movie
            if( typeof tmsapiData[i].title !== 'undefined'){
                var currentGenres = tmsapiData[i].genres;
                console.log("Movie: "+tmsapiData[i].title);
                console.log("Genres"+currentGenres);
                console.log(currentGenres);
                console.log(movieGenre);
                //if movie genres is undefined, skip movie
                if( typeof currentGenres === 'undefined'){
                    console.log("-----------------------------------------");
                    console.log(tmsapiData[i].title+" : HAS NO GENRES!!!!");
                    console.log("----Skipping this movie------------------");
                    console.log("-----------------------------------------");
                    //Do nothing
                //If statement for filtering movies from the api data or displaying all the results.
                }else if( movieGenre == "All" || currentGenres.indexOf(movieGenre) != -1){
                    //Create Card 
                    var card = $("<div>").addClass("movieCard card bg-light border-dark");
                    card.attr("data-arrayIndex",i);
                    //Card Image div
                    var cardImg = $("<img>").addClass("card-img-top");
                    cardImg.attr("src","");
                    console.log(tmsapiData[i].preferredImage.uri)
                    cardImg.attr("alt",tmsapiData[i].title);
                    cardImg.attr("id",tmsapiData[i].rootId);
                    card.append(cardImg);
                    //Card Body div
                    var cardBody = $("<div>").addClass("card-body");
                    var cardBodyTitle = $("<h5>").addClass("card-title");
                    cardBodyTitle.text(tmsapiData[i].title);
                    cardBody.append(cardBodyTitle);
                    //Append All Data
                    card.append(cardBody);
                    //Append to html
                    $("#options").append(card);
                    moviesSelected.push(tmsapiData[i].title);
                    moviePosterID.push(tmsapiData[i].rootId);
                };
            };
        };
        if( moviesSelected.length == 0){
            movieGenre = "All";
            createMovieCard()
        };
        getMoviePoster(moviesSelected, moviePosterID);
    };
};

//Function to get poster for each movie card
function getMoviePoster(moviesSelected, moviePosterID){
    var movieSelArray = moviesSelected;
    console.log(movieSelArray);
    console.log(movieSelArray.length);
    for ( var i = 0; i < movieSelArray.length; i++){
        var movieTitle = movieSelArray[i];
        var movieID = moviePosterID[i];
        var omdbQueryURL = "https://omdbapi.com/?t="+encodeURIComponent(movieTitle)+"&y="+tmsapiData[i].releaseYear+"&apikey="+omdbApiKey;
        console.log(movieTitle);
        console.log(omdbQueryURL);
        ajaxCallPoster(omdbQueryURL, movieID);
    }
};

//Ajax call to omdb for movie poster url
function ajaxCallPoster(omdbQueryURL, movieID){
    $.ajax({
        url: omdbQueryURL,
        method: "GET",
    }).then(function(response){
        console.log(response.Poster);
        if (typeof response.Poster === 'undefined'){
            $("#"+movieID+"").attr("src","./assets/images/stockPoster.jpg");
            $("#"+movieID+"").parent().attr("data-score", response.imdbRating)
        }else{
            $("#"+movieID+"").attr("src",response.Poster);
            $("#"+movieID+"").parent().attr("data-score", response.imdbRating)
        }
    });
}

//Function for food modal
$(document).on("click", ".foodCard", function(){
    $("#foodModal").modal("show");
    var foodArrayIndex = $(this).attr("data-arrayIndex");
    var foodImage= $(this).find("img").attr("src");
    $("#foodModalImg").attr("src",foodImage);
    //Add food information to food modal
    $("#foodModalTitle").html(foodResults.businesses[foodArrayIndex].name);
    $("#foodModalAddress").html(foodResults.businesses[foodArrayIndex].location.display_address[0]+" ,"+foodResults.businesses[foodArrayIndex].location.display_address[1]);
    $("#foodModalPrice").html(foodResults.businesses[foodArrayIndex].price);
    $("#foodModalPhone").html(foodResults.businesses[foodArrayIndex].phone);
    $("#foodModalYelp").html("<a href='"+foodResults.businesses[foodArrayIndex].url+"' target='_blank'>View Yelp Reviews</a>");
 });

//Function for clicking the sumbut movie button
$("#submitMovie").on("click", function(){
    var movieTitle = $('#movieModalTitle').text()
    var moviePoster = $('#movieModalImg').attr("src");
    var card = $('<div>').addClass('selectedMovie card bg-light border-success');
    var poster = $('<img>').addClass('card-img-top');
    poster.attr("src", moviePoster);
    poster.attr('alt', movieTitle);
    card.append(poster);
    var cardBody = $('<div>').addClass('card-body');
    var cardBodyTitle = $('<h5>').text(movieTitle);
    var cardBodyTheater = $('<p>').text(selectedTheater);
    var cardBodyShowTime = $('<p>').text(selectedMovieTime);
    cardBody.append(cardBodyTitle, cardBodyTheater, cardBodyShowTime)
    card.append( poster, cardBody);
    $('#selection').append(card);
    $("#movieModal").modal("hide");
    $("#options").html("");
    foodAjaxCall();
});

//On click function when pressing the submitFood button.
$('#submitFood').on('click', function(){
    var restaurantName = $('#foodModalTitle').text();
    var imageUrl = $('#foodModalImg').attr("src");
    var address = $('#foodModalAddress').text();
    var link = $('#foodModalYelp').find('a').attr("href");
    var price = $('#foodModalPrice').text();
    var card = $('<div>').addClass('selectedFood card bg-light border-success');
    var poster = $('<img>').addClass('card-img-top');
    poster.attr("src", imageUrl);
    poster.attr('alt', restaurantName);
    card.append(poster);
    var cardBody = $('<div>').addClass('card-body');
    var cardBodyTitle = $('<h5>').text(restaurantName);
    var cardBodyTheater = $('<p>').text(address);
    var cardBodyShowTime = $('<p>').text(price);
    var cardBodyLink = $('<p>').html('<a href="'+link+'" target="_blank">Yelp Page</a>');
    cardBody.append(cardBodyTitle, cardBodyTheater, cardBodyShowTime, cardBodyLink)
    card.append( poster, cardBody);
    $('#selection').append(card);
    $("#foodModal").modal("hide");
    //removes the options card column
    $("#optionsCardColumn").remove();
    //makes the selection card column full width
    $('#selectionCardColumn').addClass('col-lg-12').removeClass('col-lg-4')
});

//Function for Ajax call to yelp API based on filters.
function foodAjaxCall(){
    console.log('Ajax Call');
    console.log(foodBudget);
    var price = "";
    //Checks for food budget array, if lenght is 0 set to all prices else convert to string
    if( foodBudget.length == 0){
        price = "1,2,3,4";
    }else{
        price = foodBudget.toString();
    }
    console.log(foodBudget);
    console.log('if statement complete');
    console.log(price);
    //The term to earch for
    var searchThis = "restaurants";
    var latitude = 41.5084;
    var longitude = -81.6076;
    //Location to search based on the zipcode provided by the user/
    var location = zipCode;
    //Offset number incase we want to make a *next group of results* button
    var offsetBy = 0;
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.yelp.com/v3/businesses/search?term="+searchThis+"&location="+location+"&radius="+searchRadius+"&price="+price+"&categories="+foodCategory+"&sort_by=distance&limit=20&locale=en_US";
    $.ajax({
        url: queryURL,
        headers: {
            "Authorization": "Bearer "+yelpApiKey+"",
        },
        method: "GET",
        dataType: "json",
    }).then(function(response){
        foodResults = response;
        console.log("Food Results");
        console.log(foodResults);
        createFoodCard();
    });
}

function getTheaterCoordinates(){
    console.log('ajax call for movie coordinates');
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location="+zipCode+"&radius=40000&categories=movietheaters";
    $.ajax({
        url: queryURL,
        headers: {
            "Authorization": "Bearer "+yelpApiKey+"",
        },
        method: "GET",
        dataType: "json",
    }).then(function(response){
        theaterResults = response;
        console.log("Theater Results");
        console.log(theaterResults)
    });
}

//Function to create a card for each restaurant
function createFoodCard(){
    //Array to check for duplcate restaurants (mainly chain resturants).
    var repeatRestaurant = [];
    //If there are no results for restaurants
    if(foodResults.businesses.length == 0){
        //If there are still no results for restaurant at maximum radius, change category to all.
        if( searchRadius >= 40000){
            alert("No results for "+foodCategory+". Close this window to show all food results.")
            searchRadius = 16000;
            foodCategory = "restaurant";
            foodBudget = [1,2,3,4];
            foodAjaxCall();
        }else{
        // Add a mile to the search radius then call the api again
        searchRadius += 8000;
            if( searchRadius > 40000){
                searchRadius = 40000;
            }
        foodAjaxCall();
        }
    }else{
        //For loop to create a card for each restaurant result
        for ( var i = 0; i < foodResults.businesses.length; i++){
            //If the result is not in the array of repeatRestaurant array, checking for duplicates
            if(repeatRestaurant.indexOf(foodResults.businesses[i].name) === -1){
                var card = $("<div>").addClass("foodCard card bg-light border-dark");
                card.attr("data-arrayIndex",i);
                //Card Image div
                var cardImg = $("<img>").addClass("card-img-top");
                cardImg.attr("src",foodResults.businesses[i].image_url);
                cardImg.attr("alt",foodResults.businesses[i].name);
                card.append(cardImg);
                //Card Body div
                var cardBody = $("<div>").addClass("card-body");
                var cardBodyTitle = $("<h5>").addClass("card-title");
                cardBodyTitle.text(foodResults.businesses[i].name);
                cardBody.append(cardBodyTitle);
                //Rating
                var cardBodyText = $("<p>").addClass("card-text");
                cardBodyText.html("Rating: <b>"+foodResults.businesses[i].rating+"/5</b>");
                cardBody.append(cardBodyText);
                //Theatre
                // var cardBodyText = $("<p>").addClass("card-text");
                // cardBodyText.html("The above image is rated: <b>"+tmsapiData[i].showtimes[0].theatre.name+"</b>");
                // cardBody.append(cardBodyText);
                //Append All Data
                card.append(cardBody);
                //Append to html
                $("#options").append(card);
                //Pushes the restaurant name into array to check preceding results for duplicates (mostly chain restuarants in the same area).
                repeatRestaurant.push(foodResults.businesses[i].name);
            }
        }
    }   
}
