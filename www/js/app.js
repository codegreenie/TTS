var shareApp, changeStatusBarColor, routeTo, prepareIntAd, showInterstitialAd, showBottomBannerAd;
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
  StatusBar.backgroundColorByHexString("#043a7a");

  
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
  url: 'http://onelink.to/2w3zpp',
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
                      isTesting:false
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
                    isTesting : false,
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



$$(document).on('page:afterin', '.page[data-name="about"]', function (e){
  changeStatusBarColor("#043a7a");
});
$$(document).on('page:init', '.page[data-name="about"]', function (e){

  $$(".left .link").click(function(){
      showInterstitialAd();
  });


  $$(".share-btn").click(function(){
    shareApp();
  });


  $$("#goto-privacy-btn").click(function(){
    mainView.router.navigate("/privacy/");
  });


});







$$(document).on('page:afterin', '.page[data-name="privacy"]', function (e){
  changeStatusBarColor("#043a7a");
});
$$(document).on('page:init', '.page[data-name="privacy"]', function (e){

  $$(".left .link").click(function(){
     showInterstitialAd();
  }); 


  $$(".share-btn").click(function(){
    shareApp();
  });


});








$$(document).on('page:afterin', '.page[data-name="dashboard"]', function (e){
  
  changeStatusBarColor("#1c1c1d");

  });

$$(document).on('page:beforeout', '.page[data-name="dashboard"]', function (e){
  
   //grab the current scroll position & store
    var currentScroll = $$("#page-content").scrollTop();
    window.localStorage.setItem("currentScroll", currentScroll);

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
var maxItems = 200;

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


           

          

             
              //var coinImage = "https://cryptoicons.org/api/icon/" + coinSymbolLC + "/40";
              
              var coinImage = "https://icons.bitbot.tools/api/" + coinSymbolLC + "/32x32";

              coinStack += "<li onclick=routeTo('" + coinID + "')><a href='#' class='item-link item-content'><div class='lazy item-media' style='border:solid 2px #ededed;border-radius:50%; width:40px;height:40px;background:url(" + coinImage + "); background-size:cover; background-repeat:no-repeat;'><small style='margin: -60px auto 0px;'>" + coinRank + "</small></div><div class='item-inner'><div class='item-title text-color-white'><div class='item-header'>Market Cap: $" + coinMarketCap + "</div>" + coinName + " (" + coinSymbol + ")<div class='item-footer text-color-white'><span>Volume 24H: $" + coinVolume + "</span><br><small class=" + changeColor +" id='changePercentSpan" + q + "'>1D " + changePercent + "</small> &nbsp; </div> </div> <div class='item-after text-color-white'>$" + coinPrice +"</div> </div> </a> </li>"; 


                 
                }

                
                $$("#coin-stack-list").html(coinStack);
                app.preloader.hide();
                lastItemIndex = $$('.coin-stack-list li').length;
                
                
                

                
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
    
  }, 1000);
});





     setTimeout(function() {
        loadMarket();
     }, 1000);



  app.preloader.show("blue");
  
  



   


/*

  if (!window.localStorage.getItem("my_banks")) {
    
    var emptyBankArray = [];
    var emptyBankDetails = {
      "bank_path" : "",
      "bank_image" : "",
      "bank_ussd" : "",
      "bank_name" : ""
    }
    emptyBankArray.push(emptyBankDetails);
    window.localStorage.setItem("my_banks", JSON.stringify(emptyBankArray));

  }*/

 


  

  // now look for my banks
/*
  var myBanks = window.localStorage.getItem("my_banks");
  myBanks = JSON.parse(myBanks);

  if (myBanks.length != 1) {
    for(q = 1; q < myBanks.length; q++){

        var bankName = myBanks[q]["bank_name"];
        var bankPath = myBanks[q]["bank_path"];
        var bankImage = myBanks[q]["bank_image"];
        var bankUssd = myBanks[q]["bank_ussd"];

        $$("#favorite-banks-list-ul").append("<li style='padding-bottom:10px;'><div class='item-content' onclick=routeTo(" + + "")><div class='item-media' style='border:solid 2px #ededed;border-radius:50%; width:60px;height:60px;background:url(imgs/" + bankImage + "); background-size:cover; background-repeat:no-repeat;' onclick=routeTo('" + bankPath + "')></div><div class='item-inner'><div class='item-title'><a href='/" + bankPath + "/' class='text-color-black'>" + bankName + "</a></div><div class='item-after text-color-black'><a href='/" + bankPath + "/' class='text-color-black'  style='margin-top:10px;'><span style='margin-top:10px;'>" + bankUssd + "</span>&nbsp;</a><a href='#' style='color:#043a7a;' onclick=routeTo('" + bankPath + "')><i class='f7-icons' style='font-size:38px;'>phone_round</i></a></div></div></div></li>");
    }

    $$("#block-title-my-banks, #favorite-banks-list").show();
    $$("#block-title-all-banks").css({"margin-top" : "15px"});
  }
  else{

    $$("#block-title-my-banks, #favorite-banks-list").hide();
    $$("#block-title-all-banks").removeAttr("style");
  }*/



 

  



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

  setTimeout(function() {
    loadCoinDetails(coinToParse);
  }, 100);

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
            var coinStack = "";

            function  thousands_separators(num) {
                var num = parseFloat(num).toFixed(3);
                var num_parts = num.toString().split(".");
                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return num_parts.join(".");
            }

              var coinID = data["id"];
              var coinName = data["name"];
              var coinMarketCap = thousands_separators(data["marketCapUsd"]);
              var coinVolume = thousands_separators(data["volumeUsd24Hr"]);
              var coinPrice = thousands_separators(data["priceUsd"]);
              var coinSymbol = data["symbol"];
              coinSymbolLC = coinSymbol.toLowerCase();
              var coinRank = data["rank"];

              $$(".title").html(coinName);
        },
        error :  function(xhr, status){

            app.dialog.alert("Unable to fetch data");
            console.log(status);
            app.preloader.hide();
        }
      });

  }


});

