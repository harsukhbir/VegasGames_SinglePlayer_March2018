package io.vegasgames.singleplayer;

import java.util.HashMap;
import java.util.Map;

import org.apache.cordova.LOG;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import com.supersonic.adapters.supersonicads.SupersonicConfig;
import com.supersonic.mediationsdk.logger.SupersonicError;
//Import the Offerwall Listener
import com.supersonic.mediationsdk.sdk.OfferwallListener;
import com.supersonic.mediationsdk.sdk.Supersonic;
import com.supersonic.mediationsdk.sdk.SupersonicFactory;

public class MyApp extends Application  {

	// Declare the Supersonic Mediation Agent
	public static final String mAppKey = "465b1a0d";
	private static Supersonic mMediationAgent;	

	@Override
	public void onCreate() {
		// TODO Auto-generated method stub
		super.onCreate();
		LOG.e("Application", "Application is created");
		registerActivityLifecycleCallbacks(callbacks);		
	}
	
	private void setUpAds(Activity activity)
	{
		// Get the mediation publisher instance
				mMediationAgent = SupersonicFactory.getInstance();

				// Set the Offerwall Listener
				mMediationAgent.setOfferwallListener(mOfferwallListener);

				// Set the unique id of your end user.
				String mUserId = "" + System.currentTimeMillis();
				// Set the Application Key - can be retrieved from Supersonic platform

				// You can set Optional Custom parameters which will be passed to your
				// server if you use server-to-server callbacks.
				Map<String, String> owParams = new HashMap<String, String>();
				owParams.put("userType", "gamer");
				SupersonicConfig.getConfigObj().setOfferwallCustomParams(owParams);

				// You can set optional parameters as well via the .getConfigObj
				SupersonicConfig.getConfigObj().setClientSideCallbacks(true);

				// Init Offerwall
				mMediationAgent.initOfferwall(activity, mAppKey, mUserId);
	}

	public static void hitALog() {
		LOG.e("Application", "We hit the 'hitALog' successfully !!!");
		// show offer wall when user clicks the offer wall button
		mMediationAgent.showOfferwall();
	}

	/****** ACTIVITIEs LIFE-CYCLE **/
	ActivityLifecycleCallbacks callbacks = new ActivityLifecycleCallbacks() {
		
		@Override
		public void onActivityStopped(Activity activity) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivityStarted(Activity activity) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivityResumed(Activity activity) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivityPaused(Activity activity) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivityDestroyed(Activity activity) {
			// TODO Auto-generated method stub
			
		}
		
		@Override
		public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
			// TODO Auto-generated method stub
			
			setUpAds(activity);
		}
	};
	
	
	/////////////////////// -ADS-//////////////////////////////////////////////

	OfferwallListener mOfferwallListener = new OfferwallListener() {
		/**
		 * Invoked when the Offerwall is prepared and ready to be shown to the
		 * user
		 */
		public void onOfferwallInitSuccess() {
		}

		/**
		 * Invoked when the Offerwall does not load
		 */
		public void onOfferwallInitFail(SupersonicError error) {
		}

		/**
		 * Invoked when the Offerwall successfully loads for the user, after
		 * calling the 'showOfferwall' method
		 */
		public void onOfferwallOpened() {
		}

		/**
		 * Invoked when the method 'showOfferWall' is called and the OfferWall
		 * fails to load. //@param supersonicError - A SupersonicError Object
		 * which represents the reason of 'showOfferwall' failure.
		 */
		public void onOfferwallShowFail(SupersonicError supersonicError) {
		}

		/**
		 * Invoked each time the user completes an Offer. Award the user with
		 * the credit amount corresponding to the value of the ‘credits’
		 * parameter.
		 * 
		 * @param credits
		 *            - The number of credits the user has earned.
		 * @param totalCredits
		 *            - The total number of credits ever earned by the user.
		 * @param totalCreditsFlag
		 *            - In some cases, we won’t be able to provide the exact
		 *            amount of credits since the last event (specifically if
		 *            the user clears the app’s data). In this case the
		 *            ‘credits’ will be equal to the ‘totalCredits’, and this
		 *            flag will be ‘true’.
		 * @return boolean - true if you received the callback and rewarded the
		 *         user, otherwise false.
		 */
		public boolean onOfferwallAdCredited(int credits, int totalCredits, boolean totalCreditsFlag) {
			return totalCreditsFlag;

		}

		/**
		 * Invoked when the method 'getOfferWallCredits' fails to retrieve the
		 * user's credit balance info.
		 * 
		 * @param supersonicError
		 *            - A SupersonicError object which represents the reason of
		 *            'getOffereallCredits' failure. If using client-side
		 *            callbacks to reward users, it is mandatory to return true
		 *            on this event
		 */
		public void onGetOfferwallCreditsFail(SupersonicError supersonicError) {
		}

		/**
		 * Invoked when the user is about to return to the application after
		 * closing the Offerwall.
		 */
		public void onOfferwallClosed() {
		}
	};
}
