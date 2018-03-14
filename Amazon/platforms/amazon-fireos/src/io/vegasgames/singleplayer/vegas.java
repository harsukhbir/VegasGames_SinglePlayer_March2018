/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package io.vegasgames.singleplayer;

import android.os.Bundle;
import android.util.Log;

import java.io.IOException;

import org.apache.cordova.*;


import com.supersonic.mediationsdk.logger.LogListener;
import com.supersonic.mediationsdk.logger.SupersonicError;
import com.supersonic.mediationsdk.logger.SupersonicLogger;
import com.supersonic.mediationsdk.sdk.InterstitialListener;
import com.supersonic.mediationsdk.sdk.Supersonic;
import com.supersonic.mediationsdk.sdk.SupersonicFactory;

public class vegas extends CordovaActivity {
	private Supersonic mMediationAgent;
	private String mAddId;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();

		/*
		 * Check to make sure Amazon WebView library loaded correctly. For more
		 * information, see the Cordova Amazon Fire OS Platform Guide:
		 * http://cordova.apache.org/docs/en/edge/
		 * guide_platforms_amazonfireos_index.md.html
		 */
		if (this.appView != null) {
			// Set by <content src="index.html" /> in config.xml
			loadUrl(launchUrl);

		}

		// private Supersonic mMediationAgent;
		// Declare the Supersonic Mediation Agent

		// Get the mediation publisher instance
		mMediationAgent = SupersonicFactory.getInstance();
		// Set the Interstitial Listener
		mMediationAgent.setInterstitialListener(mInterstitialListener);
		
//		try {
//			mAddId = AdvertisingIdClient.getAdvertisingIdInfo(this).getId();
//		} catch (IllegalStateException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (GooglePlayServicesRepairableException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (GooglePlayServicesNotAvailableException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		// Set the unique id of your end user.
		String mUserId = "" + System.currentTimeMillis();
		// Set the Application Key - can be retrieved from Supersonic platform
		String mAppKey = "465b1a0d";
		// Init Interstitial
		mMediationAgent.initInterstitial(this, mAppKey, mUserId);
		mMediationAgent.setLogListener(new LogListener() {
			@Override
			public void onLog(SupersonicLogger.SupersonicTag tag, String message, int logLevel) {
				Log.e("Level:" + logLevel, message);
			}
		});
	}
	
	protected void onResume() {
		  super.onResume();
		  if (mMediationAgent != null) {
		    mMediationAgent.onResume (this);
		  }
		}
		protected void onPause() {
		  super.onPause();
		  if (mMediationAgent != null) {
		    mMediationAgent.onPause(this);
		  }
		}
		

	private InterstitialListener mInterstitialListener = new InterstitialListener() {

		/**
		 * Invoked when Interstitial initialization process completes
		 * successfully.
		 */
		public void onInterstitialInitSuccess() {
			Log.e(TAG, "InterstitialInitSuccess");
			mMediationAgent.loadInterstitial();
		}

		/**
		 * Invoked when Interstitial initialization process is failed.
		 * 
		 * @param supersonicError
		 *            - An Object which represents the reason of initialization
		 *            failure.
		 */
		public void onInterstitialInitFailed(SupersonicError supersonicError) {
			Log.e(TAG, "SupersonicError:" + supersonicError.getErrorMessage());
		}

		/**
		 * Invoked when Interstitial Ad is ready to be shown after load function
		 * was called.
		 */
		public void onInterstitialReady() {
			Log.e(TAG, "onInterstitialReady");
			//String placementName = "DefaultRewardedVideo";
			mMediationAgent.showInterstitial();
			
			
			
		}

		/**
		 * invoked when there is no Interstitial Ad available after calling load
		 * function.
		 */
		public void onInterstitialLoadFailed(SupersonicError supersonicError) {
			Log.e(TAG, "SupersonicError-Failure:" + supersonicError.getErrorMessage());
		}

		@Override
		public void onInterstitialClick() {
			// TODO Auto-generated method stub			
			Log.e(TAG, "onInterstitialClick");

		}

		@Override
		public void onInterstitialClose() {
			// TODO Auto-generated method stub
			Log.e(TAG, "onInterstitialClose");
		}

		@Override
		public void onInterstitialOpen() {
			// TODO Auto-generated method stub
			Log.e(TAG, "onInterstitialOpen");

		}

		@Override
		public void onInterstitialShowFailed(SupersonicError error) {
			// TODO Auto-generated method stub
			Log.e(TAG, "onInterstitialShowFailed:: " + error.getErrorMessage());

		}

		@Override
		public void onInterstitialShowSuccess() {
			// TODO Auto-generated method stub
			Log.e(TAG, "onInterstitialShowSuccess");
		}
	};

}
