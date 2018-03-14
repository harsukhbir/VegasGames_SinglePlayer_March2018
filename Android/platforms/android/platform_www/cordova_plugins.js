cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.appsflyer.phonegap.plugins.appsflyer.appsflyer",
        "file": "plugins/com.appsflyer.phonegap.plugins.appsflyer/www/appsflyer.js",
        "pluginId": "com.appsflyer.phonegap.plugins.appsflyer",
        "clobbers": [
            "window.plugins.appsFlyer"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
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
        "id": "cc.fovea.cordova.purchase.InAppBillingPlugin",
        "file": "plugins/cc.fovea.cordova.purchase/www/store-android.js",
        "pluginId": "cc.fovea.cordova.purchase",
        "clobbers": [
            "store"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "ionic-plugin-keyboard.keyboard",
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "com.appsflyer.phonegap.plugins.appsflyer": "4.0",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-inappbrowser": "1.5.0",
    "cc.fovea.cordova.purchase": "6.0.0",
    "cordova-plugin-statusbar": "2.2.0",
    "ionic-plugin-keyboard": "2.2.1"
};
// BOTTOM OF METADATA
});