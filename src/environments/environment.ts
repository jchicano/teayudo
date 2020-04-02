// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCWZeuzDQ_Yb5a5d-3_n3D1GkaAtwkHtFk",
    authDomain: "horario-tea.firebaseapp.com",
    databaseURL: "https://horario-tea.firebaseio.com",
    projectId: "horario-tea",
    storageBucket: "horario-tea.appspot.com"
  },
  collection: {
    card: "card",
    student: "student"
  },
  timemaxloading:10000, //Tiempo máximo que puede estar cargando la aplicación, supera deja de cargar y muestra error en carga,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
