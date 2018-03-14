// /*
//  * Licensed to the Apache Software Foundation (ASF) under one
//  * or more contributor license agreements.  See the NOTICE file
//  * distributed with this work for additional information
//  * regarding copyright ownership.  The ASF licenses this file
//  * to you under the Apache License, Version 2.0 (the
//  * "License"); you may not use this file except in compliance
//  * with the License.  You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing,
//  * software distributed under the License is distributed on an
//  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  * KIND, either express or implied.  See the License for the
//  * specific language governing permissions and limitations
//  * under the License.
//  */

// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');
//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');
//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();





document.addEventListener('deviceready', function onDeviceReady() {
//    alert("1");
    var ANDROID_KEY = '465b1a0d';
    var IOS_KEY = '3efd0b09';
    var ssAds = new SupersonicAds(cordova.platformId === 'ios' ? IOS_KEY : ANDROID_KEY, 'demo_' + Date.now());
//    alert(Date.now());
    // var eventLog = document.getElementById('eventLog');
    // var interstitialBtn = document.getElementById('interstitial');
    var offerwallBtn = document.getElementById('offerWall');
    // var rewardedVideoBtn = document.getElementById('rewarded');
    var rvAvailable = false;
    var interstitialAvailable = false;

    window.addEventListener("interstitialInitialized", function() {
        log("interstitialInitialized");
    }, false);

    window.addEventListener("interstitialInitizationFailed", function(e) {
        log("interstitialInitFailed", e.error);
    }, false);

    window.addEventListener("interstitialAvailabilityChanged", function(e) {
        log("interstitialAvailabilityChanged", e.available);
        interstitialAvailable = e.available;
        if(e.available) {
            // interstitialBtn.classList.remove('disabled');
        } else {
            // interstitialBtn.classList.add('disabled');
        }
    }, false);
    
    window.addEventListener("interstitialShown", function() {
        log("interstitialShown")
    }, false);
    window.addEventListener("interstitialShowFailed", function(e) {
        log("interstitialShowFailed", e.error);
    }, false);
    window.addEventListener("interstitialClicked", function() {
        log("interstitialClicked")
    }, false);
    window.addEventListener("interstitialClosed", function() {
        log("interstitialClosed")
    }, false);
    window.addEventListener("offerwallClosed", function() {
        log("offerwallClosed")
    }, false);
    window.addEventListener("offerwallCreditFailed", function(e) {
        log("offerwallCreditFailed", e.error);
    }, false);
    window.addEventListener("offerwallCreditReceived", function(e) {
        log("offerwallCreditReceived", e.credit)
    }, false);
    window.addEventListener("offerwallShowFailed", function(e) {
        log("offerwallShowFailed", e.error);
    }, false);
    window.addEventListener("offerwallOpened", function() {
        log("offerwallOpened");
    }, false);
    window.addEventListener("offerwallInitializationFailed", function(e) {
        log("offerwallInitializationFailed", e.error);
    }, false);
    window.addEventListener("offerwallInitialized", function() {
        log("offerwallInitialized");
    }, false);
    window.addEventListener("rewardedVideoRewardReceived", function(e) {
        log("rewardedVideoRewardReceived", e.placement);
    }, false);
    window.addEventListener("rewardedVideoEnded", function() {
        log("rewardedVideoEnded");
    }, false);
    window.addEventListener("rewardedVideoStarted", function() {
        log("rewardedVideoStarted")
    }, false);
    window.addEventListener("rewardedVideoAvailabilityChanged", function(e) {
        log("rewardedVideoAvailabilityChanged", e.available);
        rvAvailable = e.available;
        if(e.available) {
            rewardedVideoBtn.classList.remove('disabled');
        } else {
            rewardedVideoBtn.classList.add('disabled');
        }
    }, false);
    window.addEventListener("rewardedVideoClosed", function() {
        log("rewardedVideoClosed");
    }, false);
    window.addEventListener("rewardedVideoOpened", function() {
        log("rewardedVideoOpened");
    }, false);
    window.addEventListener("rewardedVideoInitializationFailed", function(e) {
        log("rewardedVideoInitializationFailed", e.error);
    }, false);
    window.addEventListener("rewardedVideoInitialized", function() {
        log("rewardedVideoInitialized");

        ssAds.showInterstitial();
        
    }, false);

    // rewardedVideoBtn.addEventListener('click', function reward() {
        if(rvAvailable) {
            ssAds.showRewardedAd();
        } else {
            // alert('No rewarded videos are available.')
        }
    // }, false);

    offerwallBtn.addEventListener('click', function offerWall() {
        ssAds.showOfferwall();
    }, false);

    // interstitialBtn.addEventListener('click', function interstitial() {
    // interstitialBtn.addEventListener('click', function interstitial() {
        if(interstitialAvailable) {
            ssAds.showInterstitial();
        } else {
            // alert('No interstitial ads available.')
        }
    // }, false);

    function log(event, data) {

        eventLog.value += [event, data !== undefined ? (': ' + JSON.stringify(data)) : '', '\n'].join('');

        // alert(eventLog.value += [event, data !== undefined ? (': ' + JSON.stringify(data)) : '', '\n'].join(''););
    }

    // window.onload = function () {
    // fade();
    // alert("1");
    // alert("1.1");
    // alert("1.2");
    //     setTimeout(interstitial(), 10000);
    // alert("2");    
    // };

    
}, false);
