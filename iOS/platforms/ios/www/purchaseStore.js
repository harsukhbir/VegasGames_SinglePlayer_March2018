
var purchaseStore = (function () {

    document.addEventListener("deviceready", function () {
        console.log('deviceready');
        initStore();
    }, false);

    function initStore() {
        console.log('init store');

        if (!window.store) {
            console.log('Store not available');
            return;
        }

        //    app.platform = device.platform.toLowerCase();
        //    document.getElementsByTagName('body')[0].className = app.platform;

        // Enable maximum logging level
        store.verbosity = store.DEBUG;

        // Enable remote receipt validation
        //    store.validator = "https://api.fovea.cc:1982/check-purchase";

        // Inform the store of your products
        console.log('registerProducts');
        store.register({
            id:    '1vg500_storecurrency_1', // id without package name!
            alias: '500 Playing Chips',
            type:   store.CONSUMABLE
        });
        store.register({
            id:    '1vg1400_storecurrency_2', // id without package name!
            alias: '1,400 Playing Chips',
            type:   store.CONSUMABLE
        });
        store.register({
            id:    '1vg5000_storecurrency_5', // id without package name!
            alias: '5000 Playing Chips',
            type:   store.CONSUMABLE
        });
        store.register({
            id:    '1vg50000_storecurrency_25', // id without package name!
            alias: '50000 Playing Chips',
            type:   store.CONSUMABLE
        });

        //    store.register({
        //        id:    'consumable1', // id without package name!
        //        alias: 'extra life',
        //        type:   store.CONSUMABLE
        //    });
        //
        //    store.register({
        //        id:    'nonconsumable1', // id without package name!
        //        alias: 'full version',
        //        type:   store.NON_CONSUMABLE
        //    });
        //
        //    store.register({
        //        id:    'subscription1', // id without package name!
        //        alias: 'subscription1',
        //        type:  store.PAID_SUBSCRIPTION
        //    });
        //
        //    store.register({
        //        id:    'nonconsumablenonhosted1', // id without package name!
        //        alias: 'non-hosted content download',
        //        type:   store.NON_CONSUMABLE
        //    });
        //
        //    if(app.platform === "ios"){
        //        store.register({
        //            id:    'nonconsumablehosted1', // id without package name!
        //            alias: 'hosted content download',
        //            type:   store.NON_CONSUMABLE
        //        });
        //    }


        // When any product gets updated, refresh the HTML.
        //    store.when("product").updated(function (p) {
        //        app.renderIAP(p);
        //    });

        // Log all errors
        store.error(function(error) {
            console.log('ERROR ' + error.code + ': ' + error.message);
        });

        // When purchase of an extra life is approved,
        // deliver it... by displaying logs in the console.
        store.when("1vg500_storecurrency_1").approved(function (order) {
alert("Order Approved");
            console.log("You got currency_1");
            order.finish();
        });
        store.when("1vg1400_storecurrency_2").approved(function (order) {
            console.log("You got currency_2");
            order.finish();
        });
        store.when("1vg5000_storecurrency_5").approved(function (order) {
            console.log("You got currency_5");
            order.finish();
        });
        store.when("1vg50000_storecurrency_25").approved(function (order) {
            console.log("You got currency_25");
            order.finish();
        });
        // When purchase of the full version is approved,
        // show some logs and finish the transaction.
        //    store.when("full version").approved(function (order) {
        //        log('You just unlocked the FULL VERSION!');
        //        order.finish();
        //    });

        // The play button can only be accessed when the user
        // owns the full version.
        //    store.when("full version").updated(function (product) {
        //        document.getElementById("access-full-version-button").style.display =
        //            product.owned ? "block" : "none";
        //    });

        /*
         * iOS Apple-hosted content
         */

        // When purchase of the downloadable content is approved,
        // show some logs.
        //    store.when("hosted content download").approved(function (product) {
        //        log("You've purchased the content for " + product.id + " - it will now download to your device!");
        //    });
        //
        //    // Show progress during hosted content download
        //    store.when("hosted content download").downloading(function(product) {
        //        var html = 'Downloading content: ' + product.progress + '%';
        //        document.getElementById('non-consumable-hosted-content-download').innerHTML = html;
        //    });
        //
        //    // When hosted content download is complete, finish the transaction
        //    store.when("hosted content download").downloaded(function(product) {
        //        product.finish();
        //    });
        //
        //    // If the product content is downloading or downloaded, display the downloaded content
        //    store.when("hosted content download").updated(function (product) {
        //        var displayEl = document.getElementById("non-consumable-hosted-content-download");
        //        if(product.downloading || product.downloaded){
        //            displayEl.style.display = "block";
        //        }else{
        //            displayEl.style.display = "none";
        //        }
        //        if(product.downloaded){
        //            var productName = product.id.split(".").pop();
        //            displayDownloadedContent(cordova.file.documentsDirectory + productName, displayEl);
        //        }
        //    });

        /*
         * Non-hosted (self-hosted) content
         */

        // When purchase of the downloadable content is approved,
        // show some logs.
        //    store.when("non-hosted content download").approved(function (product) {
        //        log("You've purchased the content for " + product.id + " - it will now download to your device!");
        //        downloadNonHostedContent(product);
        //    });
        //
        //    // Show progress during hosted content download
        //    store.when("non-hosted content download").downloading(function(product) {
        //        var html = 'Downloading content';
        //         if(product.progress >= 0){
        //            html += ': ' + product.progress + '%';
        //         }
        //         document.getElementById('non-consumable-non-hosted-content-download').innerHTML = html;
        //    });
        //
        //    // When hosted content download is complete, finish the transaction
        //    store.when("non-hosted content download").downloaded(function(product) {
        //        product.finish();
        //    });

        // Show download element if the product content is downloading or downloaded
        // When hosted content download is complete, display the downloaded content and finish the transaction
        //    store.when("non-hosted content download").updated(function (product) {
        //        var displayEl = document.getElementById("non-consumable-non-hosted-content-download");
        //        if(product.downloading || product.downloaded){
        //            displayEl.style.display = "block";
        //        }else{
        //            displayEl.style.display = "none";
        //        }
        //        if(product.downloaded){
        //            var productName = product.id.split(".").pop();
        //            displayDownloadedContent(cordova.file.dataDirectory + productName, displayEl);
        //        }
        //    });

        // When the store is ready (i.e. all products are loaded and in their "final"
        // state), we hide the "loading" indicator.
        //
        // Note that the "ready" function will be called immediately if the store
        // is already ready.
//            store.ready(function() {
//                var el = document.getElementById("loading-indicator");
//                if (el)
//                    el.style.display = 'none';
//            });
//
//            // When store is ready, activate the "refresh" button;
//            store.ready(function() {
//                var el = document.getElementById('refresh-button');
//                if (el) {
//                    el.style.display = 'block';
//                    el.onclick = function(ev) {
//                        store.refresh();
//                    };
//                }
//            });

        // Alternatively, it's technically feasible to have a button that
        // is always visible, but shows an alert if the full version isn't
        // owned.
        // ... but your app may be rejected by Apple if you do it this way.
        //
        // Here is the pseudo code for illustration purpose.

        // myButton.onclick = function() {
        //   store.ready(function() {
        //     if (store.get("full version").owned) {
        //       // access the awesome feature
        //     }
        //     else {
        //       // display an alert
        //     }
        //   });
        // };


        // Refresh the store.
        //
        // This will contact the server to check all registered products
        // validity and ownership status.
        //
        // It's fine to do this only at application startup, as it could be
        // pretty expensive.
        console.log('refresh');
        store.refresh();
        //    var p1 = store.get("store_currency_1");
        //    if(!p1) {
        //        log("store_currency_1 NOT EXIST");
        //    } else if (p1.state===store.REGISTERED) {
        //        log("store_currency_1 LOADING");
        //    } else if (p1.state===store.INVALID) {
        //        log("store_currency_1 INVALID");
        //    } else {
        //        log(p1.title+","+p1.description+","+p1.price);
        //    }
        //    store.order("store_currency_2");
    }

    function purchase(quantity) {
        console.log('PURCHASE QUANTITY:'+quantity);
                     //alert("PURCHASING " + quantity);
		
        if(quantity==0) {
		//alert("Purchasing????????");
            purchase_1();
        }
        else if(quantity==1) {
            purchase_2();
        }
        else if(quantity==2) {
            purchase_3();
        }
        else if(quantity==3) {
            purchase_4();
        }
    }
    // store_currency_1
    function purchase_1(){
                     //alert(JSON.stringify(store));
        console.log('purchase_1');
//	alert("Making Purchase 1");
        store.order("1vg500_storecurrency_1");
    }

    // store_currency_2
    function purchase_2(){
        console.log('purchase_2');
        store.order("1vg1400_storecurrency_2");
    }

    // store_currency_5
    function purchase_3(){
        console.log('purchase_3');
        store.order("1vg5000_storecurrency_5");
    }

    // store_currency_25
    function purchase_4(){
        console.log('purchase_4');
        store.order("1vg50000_storecurrency_25");
    }

    return {
        purchase: purchase
    }
}());