export const environment = {
  production: true,
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
  timemaxloading:10000, //Tiempo máximo que puede estar cargando la aplicación, supera deja de cargar y muestra error en carga
};
