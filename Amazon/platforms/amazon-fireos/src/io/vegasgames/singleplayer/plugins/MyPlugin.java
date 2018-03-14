package io.vegasgames.singleplayer.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.json.JSONArray;
import org.json.JSONException;

import io.vegasgames.singleplayer.MyApp;

public class MyPlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		try {
			LOG.e("MyPlugin", "The button is hit");
			MyApp.hitALog();
			callbackContext.success();
		} catch (Exception e) {
			LOG.e("MyPlugin", "Trying to hit", e);
			callbackContext.error("" + e.getMessage());
		}
		return true;
	}
}