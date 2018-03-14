package android;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;
import android.widget.Toast;
import io.vegasgames.singleplayer.MyApp;

public class CoolPlugin extends CordovaPlugin {

	public static final String TAG = "Cool Plugin";

	/**
	 * Constructor.
	 */
	public CoolPlugin() {
	}

	/**
	 * Sets the context of the Command. This can then be used to do things like
	 * get file paths associated with the Activity.
	 *
	 * @param cordova
	 *            The context of the main Activity.
	 * @param webView
	 *            The CordovaWebView Cordova is running in.
	 */

	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		Log.v(TAG, "Init CoolPlugin");
	}

	public boolean execute(final String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

		
		// Shows a toast
		Log.e(TAG, "CoolPlugin received:" + action);

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
//				Toast toast = Toast.makeText(cordova.getActivity().getApplicationContext(), action, duration);
//				toast.show();
				
				MyApp.hitALog();
			}
		});

		return true;
	}
}