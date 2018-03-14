cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "com.appsflyer.phonegap.plugins.appsflyer.appsflyer",
        "file": "plugins/com.appsflyer.phonegap.plugins.appsflyer/www/appsflyer.js",
        "pluginId": "com.appsflyer.phonegap.plugins.appsflyer",
        "clobbers": [
            "window.plugins.appsFlyer"
        ]
    },
    {
        "id": "cordova-plugin-appavailability.AppAvailability",
        "file": "plugins/cordova-plugin-appavailability/www/AppAvailability.js",
        "pluginId": "cordova-plugin-appavailability",
        "clobbers": [
            "appAvailability"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-supersonicads.SupersonicAds",
        "file": "plugins/cordova-plugin-supersonicads/www/supersonicads.js",
        "pluginId": "cordova-plugin-supersonicads",
        "clobbers": [
            "SupersonicAds"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-device": "1.1.3",
    "com.appsflyer.phonegap.plugins.appsflyer": "4.0",
    "cordova-plugin-appavailability": "0.4.2",
    "cordova-plugin-inappbrowser": "1.5.0",
    "cordova-plugin-supersonicads": "0.2.2"
};
// BOTTOM OF METADATA
});