var shareApp, changeStatusBarColor, routeTo, prepareIntAd, showInterstitialAd, showBottomBannerAd, copyAddress;
// Dom7
var $$ = Dom7;


// Init App
var app = new Framework7({
  name : 'Quick Blockchain',
  id: 'com.codegreenie.quickblockchain',
  root: '#app',
  theme: 'auto',
  language: 'en',
  routes: routes
});

var mainView = app.views.create('.view-main', {
  url : './index.html',
  name : 'main',
  iosSwipeBack : true,
  router : true
});

toastMe = function(toastMessage){

    var toastMe = app.toast.create({
    text: toastMessage,
    position: 'center',
    closeTimeout: 2000,
  });

    toastMe.open();

}




       

document.addEventListener("deviceready", deviceIsReady, false);



function deviceIsReady(){


  StatusBar.styleLightContent();
  StatusBar.backgroundColorByHexString("#000000");

  
      changeStatusBarColor = function(suppliedColor){
        StatusBar.backgroundColorByHexString(suppliedColor);
      }

  /*var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  // Set your iOS Settings
  var iosSettings = {};
  iosSettings["kOSSettingsKeyAutoPrompt"] = false;
  iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

   window.plugins.OneSignal
    .startInit("5bb0517e-54d7-407b-94da-21fb6b9c03cc")
    .handleNotificationOpened(notificationOpenedCallback)
    .iOSSettings(iosSettings)
    .inFocusDisplaying("none")
    .endInit();
*/

shareApp = function(){

// this is the complete list of currently supported params you can pass to the plugin (all optional)
var options = {

  message: 'Fastest access to Bitcoin & altcoin data. Download Quick Blockchain app', 
  subject: 'Quick Blockchain', // fi. for email
  files: [], // an array of filenames either locally or remotely
  url: 'https://play.google.com/store/apps/details?id=com.codegreenie.quickblockchain',
  chooserTitle: 'Share via'
};

var onSuccess = function(result) {
  //console.log("Share was successful");
};

var onError = function(msg) {
  //console.log("Sharing Failed!");
};

window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

}


 




                //Google Admob Monetization here :)

                var admobid = {};
                if(app.theme == "md"){
                  admobid = {
                    banner: 'ca-app-pub-8716485588609849/9399825217',
                    interstitial: 'ca-app-pub-8716485588609849/5899547992'
                  };
                }else{
                  admobid = {
                    banner: 'ca-app-pub-8716485588609849/1215664542',
                    interstitial: 'ca-app-pub-8716485588609849/3270487402'
                  };

                }


                var interstitialReady = false;


                // update the state when ad preloaded
                document.addEventListener('onAdLoaded', function(e){
                    if(e.adType == 'interstitial') {
                        interstitialReady = true;
                    }
                });

                // when dismissed, preload one for next show
                document.addEventListener('onAdDismiss', function(e){
                    if(e.adType == 'interstitial') {
                        interstitialReady = false;
                        prepareIntAd();
                    }
                });

                // if Interstitial failes to laod, request another immediately
                document.addEventListener('onAdFailLoad', function(e){
                    if(e.adType == 'interstitial') {
                        interstitialReady = false;
                        window.setTimeout(function(){
                          prepareIntAd();
                        }, 1000);
                        
                    }
                });




                prepareIntAd = function(){

                  if(window.AdMob) AdMob.prepareInterstitial({
                      adId:admobid.interstitial, 
                      autoShow:false,
                      isTesting:true
                  });

              }


             



              showInterstitialAd = function(){
                if(interstitialReady == true) AdMob.showInterstitial();
              }


              showBottomBannerAd = function(){
                    if(window.AdMob) AdMob.createBanner({
                    adId:admobid.banner,  
                    position:AdMob.AD_POSITION.BOTTOM_CENTER,
                    overlap: true,
                    autoShow: false,
                    isTesting : true,
                    success : function(){
                      console.log("Yay! Banner ad is active");
                    },
                    error : function(){
                      console.log("oops! Banner didn't load. retrying");
                      window.setTimeout(function(){
                        showBottomBannerAd();
                      }, 1500);
                    }
                  });
              }


              
              setTimeout(function(){
                  prepareIntAd();
              }, 300);

              setTimeout(function(){
                  showBottomBannerAd();
              }, 500);




        

  

  document.addEventListener("backbutton", function (){
    
    var currentPage = mainView.router.currentRoute.name;
    
    //Re-route to Dashboard
    if(currentPage == "dashboard"){

        navigator.app.exitApp();
    }
    else{
      
    
      showInterstitialAd();

      mainView.router.back({
        ignoreCache : true,
        force : true
      });

    }

}, false);



}




$$(document).on('page:init', function(e){

var pageName = e.detail.name;
    
      if (pageName != "main"){
        setTimeout(function(){
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
         }, 500);
      }

});



$$(document).on('page:beforeout', function (e) {
  // hide before exiting to keep it clean
  AdMob.hideBanner();
});




$$(document).on('page:init', '.page[data-name="about"]', function (e){

  $$(".left .link").click(function(){
      showInterstitialAd();
  });


  $$(".share-btn").click(function(){
    shareApp();
  });


});







$$(document).on('page:init', '.page[data-name="privacy"]', function (e){

  $$(".left .link").click(function(){
     showInterstitialAd();
  }); 


  $$(".share-btn").click(function(){
    shareApp();
  });


});








  
$$(document).on('page:init', '.page[data-name="dashboard"]', function (e){

/*  $$("#favorites").on("tab:show", function(){
   app.dialog.alert("Yoga");
  });
*/


 var ptrMarket = $$('.ptr-content');
  ptrMarket.on("ptr:refresh", function(){
    loadMarket();
    setTimeout(function(){
      app.ptr.done();
    }, 5000);
  });




 function  thousands_separators(num) {
    var num = parseFloat(num).toFixed(3);
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}


  // Loading flag
var allowInfinite = true;

// Last loaded index
var lastItemIndex = null;

// Max items to load
var maxItems = 250;

// Append items per load
var itemsPerLoad = 20;

var bigData = null;



 function loadMarket(){



       app.request({
        url : 'https://api.coincap.io/v2/assets', 
        timeout : '0',
        method: 'GET',
        data: {
          limit : '200'
        },
        success : function (lokey) {
            bigData = JSON.parse(lokey);
            console.log("Big data is", bigData);
            
            var lokey = JSON.parse(lokey);
            var data = lokey["data"];
            var coinStack = "";


            

           

          for(q = 0; q <= 19; q++){

               var coinID = data[q]["id"];
              var coinName = data[q]["name"];
              var coinMarketCap = thousands_separators(data[q]["marketCapUsd"]);
              var coinVolume = thousands_separators(data[q]["volumeUsd24Hr"]);
              var coinPrice = thousands_separators(data[q]["priceUsd"]);
              var coinSymbol = data[q]["symbol"];
              coinSymbolLC = coinSymbol.toLowerCase();
              var coinRank = data[q]["rank"];
              var changePercent = parseFloat(data[q]["changePercent24Hr"]).toFixed(2) + "%";

              var changeColor = 'text-color-green';
              if (changePercent.includes("-")) {
              	changeColor = 'text-color-red';
              }
              else{
              	changeColor = 'text-color-green';
              }


           

          

             
             
              
              var coinImage = "https://icons.bitbot.tools/api/" + coinSymbolLC + "/32x32";

              coinStack += "<li onclick=routeTo('" + coinID + "')><a href='#' class='item-link item-content'><div class='lazy item-media' style='border:solid 2px #ededed;border-radius:50%; width:40px;height:40px;background:url(" + coinImage + "); background-size:cover; background-repeat:no-repeat;'><small style='margin: -60px auto 0px;'>" + coinRank + "</small></div><div class='item-inner'><div class='item-title text-color-white'><div class='item-header'>Market Cap: $" + coinMarketCap + "</div>" + coinName + " (" + coinSymbol + ")<div class='item-footer text-color-white'><span>Volume 24H: $" + coinVolume + "</span><br><small class=" + changeColor +" id='changePercentSpan" + q + "'>1D " + changePercent + "</small> &nbsp; </div> </div> <div class='item-after text-color-white'>$" + coinPrice +"</div> </div> </a> </li>"; 


                 
                }

                
                $$("#coin-stack-list").html(coinStack);
                app.preloader.hide();
                lastItemIndex = $$('.coin-stack-list li').length;
                
                setTimeout(function() {
                    loadFavoritesCoins();
                 }, 500);
                
                
                

                
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });

     }




// Attach 'infinite' event handler
$$('.infinite-scroll-content').on('infinite', function () {

  // Exit, if loading in progress
  if (!allowInfinite) return;

  // Set loading flag
  allowInfinite = false;

  // Emulate 1s loading
  setTimeout(function () {
    // Reset loading flag
    allowInfinite = true;

    if (lastItemIndex >= maxItems) {
      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
      //app.infiniteScroll.destroy('.infinite-scroll-content');
      // Remove preloader
      //$$('.infinite-scroll-preloader').remove();
      return;
    }

    // Generate new items HTML
    var html = '';
    for (var i = lastItemIndex; i < lastItemIndex + itemsPerLoad; i++) {

      var coinImage = "https://icons.bitbot.tools/api/" + bigData["data"][i]["symbol"].toLowerCase() + "/32x32";
      var changePercent = parseFloat(bigData["data"][i]["changePercent24Hr"]).toFixed(2) + "%";

      var changeColor = 'text-color-green';
              if (changePercent.includes("-")) {
              	changeColor = 'text-color-red';
              }
              else{
              	changeColor = 'text-color-green';
              }

      html += "<li onclick=routeTo('" + bigData["data"][i]["id"] + "')><a href='#' class='item-link item-content'><div class='lazy item-media' style='border:solid 2px #ededed;border-radius:50%; width:40px;height:40px;background:url(" + coinImage + "); background-size:cover; background-repeat:no-repeat;'><small style='margin: -60px auto 0px;'>" + bigData["data"][i]["rank"] + "</small></div><div class='item-inner'><div class='item-title text-color-white'><div class='item-header'>Market Cap: $" + thousands_separators(bigData["data"][i]["marketCapUsd"]) + "</div>" + bigData["data"][i]["name"] + " (" + bigData["data"][i]["symbol"] + ")<div class='item-footer text-color-white'><span>Volume 24H: $" + thousands_separators(bigData["data"][i]["volumeUsd24Hr"]) + "</span><br><small class=" + changeColor + ">1D " + changePercent + "</small> &nbsp;</div> </div> <div class='item-after text-color-white'>$" + thousands_separators(bigData["data"][i]["priceUsd"]) +"</div> </div> </a> </li>";  
    }

    // Append new items
    $$('.coin-stack-list ul').append(html);

    // Update last loaded index
    lastItemIndex = $$('.coin-stack-list li').length;

    setTimeout(function() {
      loadFavoritesCoins();
    }, 500);
    
  }, 1000);
});





     setTimeout(function() {
        loadMarket();
     }, 1000);



  app.preloader.show("blue");
  
  



   




  if (!window.localStorage.getItem("my_coins")) {
    
    var emptyCoinsArray = [];
    var emptyBankDetails = {
      "coin_symbol" : "",
      "coin_name" : ""
    }
    emptyCoinsArray.push(emptyBankDetails);
    window.localStorage.setItem("my_coins", JSON.stringify(emptyCoinsArray));

  }












  // now look for my coins

  var myCoins = window.localStorage.getItem("my_coins");
  myCoins = JSON.parse(myCoins);

  function loadFavoritesCoins(){

  if (myCoins.length != 1) {
    for(q = 1; q < myCoins.length; q++){

        var coinName = myCoins[q]["coin_name"];
        var coinSymbol = myCoins[q]["coin_symbol"];
        

        app.request({
        url : 'https://api.coincap.io/v2/assets/' + coinSymbol, 
        timeout : '0',
        method: 'GET',
        success : function (lokey) {
              console.log(JSON.parse(lokey));
              app.preloader.hide();

            
            var lokey = JSON.parse(lokey);
            var data = lokey["data"];
            var coinStack = "";

              var coinID = data["id"];
              coinName = data["name"];
              var coinMarketCap = thousands_separators(data["marketCapUsd"]);
              var coinVolume = thousands_separators(data["volumeUsd24Hr"]);
              var coinPrice = thousands_separators(data["priceUsd"]);
              var coinSymbol = data["symbol"];
              coinSymbolLC = coinSymbol.toLowerCase();
              var coinRank = data["rank"];
              var changePercent = parseFloat(data["changePercent24Hr"]).toFixed(2) + "%";


              var changeColor = 'text-color-green';
              if (changePercent.includes("-")) {
                changeColor = 'text-color-red';
              }
              else{
                changeColor = 'text-color-green';
              }



              var coinImage = "https://icons.bitbot.tools/api/" + coinSymbolLC + "/32x32";

               $$('.favorite-coin-stack-list ul').append("<li onclick=routeTo('" + coinID + "')><a href='#' class='item-link item-content'><div class='lazy item-media' style='border:solid 2px #ededed;border-radius:50%; width:40px;height:40px;background:url(" + coinImage + "); background-size:cover; background-repeat:no-repeat;'><small style='margin: -60px auto 0px;'>" + coinRank + "</small></div><div class='item-inner'><div class='item-title text-color-white'><div class='item-header'>Market Cap: $" + coinMarketCap + "</div>" + coinName + " (" + coinSymbol + ")<div class='item-footer text-color-white'><span>Volume 24H: $" + coinVolume + "</span><br><small class=" + changeColor +" id='changePercentSpan" + q + "'>1D " + changePercent + "</small> &nbsp; </div> </div> <div class='item-after text-color-white'>$" + coinPrice +"</div> </div> </a> </li>"); 


                 
                

                
               

              
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });

        
    }

    app.preloader.hide();

    
  }
  else{

    app.preloader.hide();
    app.dialog.alert("No favorite coin yet.");

  }

}






  routeTo = function(coinID){


    window.localStorage.setItem("coinToParse", coinID)

    mainView.router.navigate("/coindetails/");
  }


  

  
      var searchbar = app.searchbar.create({
        el: '.searchbar',
        searchContainer : '.search-list',
        searchIn : '.item-title, .item-after'
      });

      $$(".share-btn").click(function(){
        shareApp();
      });



    function returnShareGuess(){
      var guessNo = Math.floor(Math.random() * 50) + 1;
      return guessNo;  
    }
    var luckyShareNumber = returnShareGuess();
    if (luckyShareNumber == 7) {

     
      app.dialog.confirm("Like Quick Blockchain app? <br> Share with Friends!", function(){
          $$("a.share-btn").trigger("click");
      }, function(){});
      
    }








    

});




















$$(document).on('page:init', '.page[data-name="coindetails"]', function (e){

   $$(".left .link").click(function(){
     showInterstitialAd();
  }); 

  app.preloader.show("blue");

  var coinToParse = window.localStorage.getItem("coinToParse");
  var coinName;


    function  thousands_separators(num) {
                var num = parseFloat(num).toFixed(3);
                var num_parts = num.toString().split(".");
                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return num_parts.join(".");
    }


  var bitcoinPrice = 0;
  var coinToParsePrice = 0;



  app.request({
        url : 'https://api.coincap.io/v2/assets/bitcoin', 
        timeout : '0',
        method: 'GET',
        success : function (lokey) {
            var lokey = JSON.parse(lokey);
            var data = lokey["data"];
            var coinPrice = data["priceUsd"];
            bitcoinPrice = coinPrice;

            setTimeout(function(){
                loadCoinDetails(coinToParse);
              }, 1000);
            

            },
            error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });

function loadCoinDetails(coinToParse){
    app.request({
        url : 'https://api.coincap.io/v2/assets/' + coinToParse, 
        timeout : '0',
        method: 'GET',
        success : function (lokey) {
              console.log(JSON.parse(lokey));
              app.preloader.hide();

            
            var lokey = JSON.parse(lokey);
            var data = lokey["data"];


         
            

          

            

              var coinID = data["id"];
              coinName = data["name"];
              var coinMarketCap = thousands_separators(data["marketCapUsd"]);
              var coinVolume = thousands_separators(data["volumeUsd24Hr"]);
              var coinPrice = thousands_separators(data["priceUsd"]);
              var coinSymbol = data["symbol"];
              coinSymbolLC = coinSymbol.toLowerCase();
              var coinRank = data["rank"];
              var changePercent = parseFloat(data["changePercent24Hr"]).toFixed(2) + "%";
              var coinCirculatingSupply = thousands_separators(data["supply"]);
              var coinMaxSupply = thousands_separators(data["maxSupply"]);
              var coinPercentageSupplied = parseInt((data["supply"] / data["maxSupply"]) * 100);

              var coinBTCPrice = parseFloat(data["priceUsd"] / bitcoinPrice).toFixed(8);

              coinToParsePrice = data["priceUsd"];

              var coinImage = "https://icons.bitbot.tools/api/" + coinSymbolLC + "/32x32";

               var changeColor = 'text-color-green';
              if (changePercent.includes("-")) {
                changeColor = 'text-color-red';
              }
              else{
                changeColor = 'text-color-green';
              }

              $$(".title").html(coinName);
              $$("#coin-title").html(coinName + " (" + coinSymbol + ")");
              $$("#coin-icon").prop("src", coinImage);
              $$(".coin-price").html("$" + coinPrice);
              $$("#coin-rank").html("#" + coinRank);
              $$("#coin-market-cap").html("$" + coinMarketCap);
              $$("#coin-24h-volume").html("$" + coinVolume);
              $$("#coin-24h-change").html(changePercent).addClass(changeColor);
              $$("#coin-circulating-supply").html(coinSymbol + " " +  coinCirculatingSupply);
              $$("#coin-max-supply").html(coinSymbol + " " +  coinMaxSupply);
              $$("#coin-percentage-supplied").html(coinPercentageSupplied + "%");
              $$(".coin-btc-price").html("฿" + coinBTCPrice);

              setTimeout(function(){
                loadCoinHistory("d1");
              }, 1000);
              
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });

  }




/*
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
    type: 'bar',
  });*/







 $$(".add-2-my-coins, .remove-from-my-coins").hide();


  var myCoins = window.localStorage.getItem("my_coins");
  myCoins = JSON.parse(myCoins);


  for(q = 0; q < myCoins.length; q++){

    if (myCoins[q]["coin_symbol"] == coinToParse) {
      $$(".remove-from-my-coins").show();
      $$(".add-2-my-coins").hide();
      break;
    }
    else{
      $$(".add-2-my-coins").show();
      $$(".remove-from-my-coins").hide();
    }

  }




  	$$(".add-2-my-coins").click(function(){
    if(myCoins.length == 21){
      toastMe("Maximum of 20 coins can be added to <b>Favourites</b>");
    }
    else{
      var thisCoinDetails = {
        "coin_symbol" : coinToParse,
        "coin_name" : coinName
      }
      myCoins.push(thisCoinDetails);
      window.localStorage.setItem("my_coins", JSON.stringify(myCoins));
      $$(".add-2-my-coins").hide();
      $$(".remove-from-my-coins").show();

      toastMe(coinName + " added to Favourites");
    }
    
  });





  	$$(".remove-from-my-coins").click(function(){

    for(q = 0; q < myCoins.length; q++){

      if (myCoins[q]["coin_symbol"] == coinToParse) {

        var theIndex = myCoins.indexOf(myCoins[q]);
        if (theIndex >  -1) {
          myCoins.splice(theIndex, 1);
          
        }

        window.localStorage.setItem("my_coins", JSON.stringify(myCoins));
        $$(".add-2-my-coins").show();
        $$(".remove-from-my-coins").hide();
        
        toastMe(coinName + " removed from Favourites");
        break;
      }

    }  

  });






    // Loading flag
var allowInfinite = true;

// Last loaded index
var lastItemIndex = null;

// Max items to load
var maxItems = 100;

// Append items per load
var itemsPerLoad = 10;

var bigMarketData = null;




  function loadCoinMarkets(){

    //load coin markets
     app.request({
        url : 'https://api.coincap.io/v2/assets/' + coinToParse + '/markets', 
        timeout : '0',
        method: 'GET',
        success : function (realData) {
            
            var lokey = JSON.parse(realData);
            console.log(lokey);
            var data = lokey["data"];

            bigMarketData = JSON.parse(realData);

            var coinStack = "";



          for(q = 0; q <= 19; q++){

              var exchangeId = data[q]["exchangeId"];
              var baseId = data[q]["baseId"];
              var quoteId = data[q]["quoteId"];
              var baseSymbol = data[q]["baseSymbol"];
              var quoteSymbol = data[q]["quoteSymbol"];
              var volumeUsd24Hr = thousands_separators(data[q]["volumeUsd24Hr"]);
              var priceUsd = thousands_separators(data[q]["priceUsd"]);

              
           


           

              coinStack += "<li><a href='#' class='item-link item-content'> <div class='item-inner'> <div class='item-title'> <div class='item-header'><b>" + exchangeId + "</b></div> " + baseSymbol + " " + quoteSymbol + "<div class='item-footer text-color-white'>24H Vol: <b>$" + volumeUsd24Hr + "</b></div></div><div class='item-after text-color-white'>$" + priceUsd + "</div> </div> </a> </li>";

                 
                }

                
                $$("#coin-market-list").html(coinStack);
                lastItemIndex = $$('.coin-market-list li').length;
                app.preloader.hide();
                
           
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });


   }















   // Attach 'infinite' event handler
$$('.infinite-scroll-content').on('infinite', function () {

  console.log(bigMarketData);

  // Exit, if loading in progress
  if (!allowInfinite) return;

  // Set loading flag
  allowInfinite = false;

  // Emulate 1s loading
  setTimeout(function () {
    // Reset loading flag
    allowInfinite = true;

    if (lastItemIndex >= maxItems) {
      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
      //app.infiniteScroll.destroy('.infinite-scroll-content');
      // Remove preloader
      //$$('.infinite-scroll-preloader').remove();
      return;
    }

    // Generate new items HTML
    var html = '';
    for (var i = lastItemIndex; i < lastItemIndex + itemsPerLoad; i++) {

     
      html += "<li><a href='#' class='item-link item-content'> <div class='item-inner'> <div class='item-title'> <div class='item-header'><b>" + bigMarketData["data"][i]["exchangeId"] + "</b></div> " + bigMarketData["data"][i]["baseSymbol"] + " " + bigMarketData["data"][i]["quoteSymbol"] + "<div class='item-footer text-color-white'>24H Vol: <b>$" + thousands_separators(bigMarketData["data"][i]["volumeUsd24Hr"]) + "</b></div></div><div class='item-after text-color-white'>$" + thousands_separators(bigMarketData["data"][i]["priceUsd"]) + "</div> </div> </a> </li>";  
    }

    // Append new items
    $$('.coin-market-list ul').append(html);

    // Update last loaded index
    lastItemIndex = $$('.coin-market-list li').length;
    
  }, 1000);
});






  
  var coinHistory = [];





  function loadCoinHistory(intervalTime){

    //load coin markets
     app.request({
        url : 'https://api.coincap.io/v2/assets/' + coinToParse + '/history?interval=' + intervalTime, 
        timeout : '0',
        method: 'GET',
        
        success : function (realData) {
            
            var lokey = JSON.parse(realData);
            console.log(lokey);
            lokey = lokey['data'];

            var tenStepsBackwards = lokey.length - 11;

            for (var i = tenStepsBackwards; i < lokey.length; i++) {
             coinHistory.push([lokey[i]["time"], lokey[i]["priceUsd"]]);
             
              console.log(lokey[i]);
            }

           

           
           coinHistory.push([new Date().getTime(), coinToParsePrice]);
           console.log("coin history is ", coinHistory);

           runChart();
           setTimeout(function(){
                loadCoinMarkets();
              }, 1000);

           
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });


   }




var screenWidth = $$('body').width();



function runChart(){


var options = {

  tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
       fillSeriesColor: true,
         x: {
          show: false,
      },
      theme : "dark"
    },


  markers: {
    size: 5,
    colors: ["#069"],
    strokeColors: '#ffffff',
  },

  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: ['#f93'],
    width: 3,
    dashArray: 0,      
},

dataLabels: {
  enabled: true,
  formatter: (value) => { return "$" + parseFloat(value.toFixed(2)).toLocaleString() },
  style: {
      fontSize: '10px',
      fontWeight: 400,
      colors: ['#069', '#096', '#f93', '#906']
  },
  offsetX: -4,
},

  grid: {
  borderColor: '#ffffff',
  strokeDashArray: 1,
},

  chart: {
    height: 300,
    width: parseInt(screenWidth),
    type: "area",
    animations: {
      initialAnimation: {
        enabled: false
      }
    },
    toolbar :{
      show: false
    }
   
  },
  series: [
    {
      name: coinToParse.toUpperCase(),
      data: coinHistory
    }
  ],
  xaxis: {
    type: 'datetime',
    labels : {
      style : {
        colors : '#ffffff',
        fontSize: '10px',
        fontWeight: 200,
      }
    },
  },

  yaxis: {
    type: 'datetime',
    labels : {
      style : {
        colors : '#ffffff',
        fontSize: '10px',
        fontWeight: 200,
      },
      formatter: (value) => { return "$" + parseFloat(value.toFixed(2)).toLocaleString() },
    },
  }

};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

}








});




















$$(document).on('page:init', '.page[data-name="donate"]', function (e){

  copyAddress = function(coinName, coinAddressField){

       /* Get the text field */
  var copyText = document.getElementById(coinAddressField);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  app.dialog.alert(coinName + " address copied!");
   }




   $$(".share-btn").click(function(){
    shareApp();
    });


});







