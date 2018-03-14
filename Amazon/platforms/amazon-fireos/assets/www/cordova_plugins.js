cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/com.matd.coolplugin/www/CoolPlugin.js",
        "id": "com.matd.coolplugin.CoolPlugin",
        "pluginId": "com.matd.coolplugin",
        "clobbers": [
            "CoolPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.appsflyer.phonegap.plugins.appsflyer": "4.0",
    "cordova-plugin-device": "1.1.3",
    "cordova-plugin-inappbrowser": "1.5.0",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0",
    "com.matd.coolplugin": "0.2.11"
}
// BOTTOM OF METADATA
});