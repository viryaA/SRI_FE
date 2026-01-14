// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // apiUrlWebAdmin: 'http://localhost:8090/sri_starter_back',
  // apiUrlLocalAdmin: 'http://localhost:8090/sri_starter_back',
  apiUrlWebAdmin: 'http://10.4.72.107:8080/sri_starter_back',
  apiUrlLocalAdmin: 'http://10.4.72.107:8080/sri_starter_back',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTczMzU3ODI0M30.mCyOz4yd5_PLUjWQ9KsxJ-mHkBeMrmyUGToFHi7o0LyVfsoPQH4_y8tMFoVfxSErGKyMl7hA_Bb16w91LfdjjA',
  //apiUrlLocalAdmin: 'http://server-wlsdev:7002/local_admin',
  // apiUrl: 'http://server-wlsdev:7005'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
