<p align="center">
    <img src="android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"><br/>
    Aplicación para organizar las tareas de niños con trastorno del espectro autista
</p>

<p align="center">
    <a href=""><img src="https://img.shields.io/badge/release-v1.0-blue?style=flat-square" alt="Downloads"></a>
    <a href="https://github.com/jchicano/teayudo"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Builds"></a>
    <a href="https://ionicframework.com/"><img src="https://img.shields.io/badge/Ionic Framework-v5.0.7-blueviolet?style=flat-square" alt="Ionic Framework"></a>
    <a href="https://capacitor.ionicframework.com/"><img src="https://img.shields.io/badge/Capacitor CLI-v2.0.1-blueviolet?style=flat-square" alt="Capacitor"></a>
    <a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-v8.1.3-blueviolet?style=flat-square" alt="Angular"></a>

</p>


## Puesta en marcha

* [Descarga el instalador](https://nodejs.org/) de Node LTS.
* Instala ionic CLI globalmente: `npm install -g ionic`.
* Clona este repositorio: `git clone https://github.com/jchicano/teayudo`.
* Ejecuta `npm install` desde la raíz del proyecto.
* Ejecuta `ionic serve` en una terminal desde la raíz del proyecto.
* Listo. :tada:

_Nota: Ver [Cómo Evitar Errores de Permisos](https://docs.npmjs.com/getting-started/fixing-npm-permissions) si estás teniendo problemas al instalar paquetes globalmente._

## App Preview

### [Menú](https://github.com/jchicano/teayudo/blob/master/src/app/app.component.html)

| Material Design  |
| -----------------|
| ![Android Menu](/resources/screenshots/android-menu.png) |


### [Página principal](https://github.com/jchicano/teayudo/blob/master/src/app/home/home.page.html)

| Material Design  |
| -----------------|
| ![Android Main Page](/resources/screenshots/android-menu.png) |

### [Listado de alumnos](https://github.com/jchicano/teayudo/blob/master/src/app/list/list.page.html)

| Material Design  |
| -----------------|
| ![Android List Page](/resources/screenshots/android-list.png) |

### [Crear horario](https://github.com/jchicano/teayudo/blob/master/src/app/create-schedule/create-schedule.page.html)

| Material Design  |
| -----------------|
| ![Android Create Page](/resources/screenshots/android-create.png) |

### [Mostrar horario](https://github.com/jchicano/teayudo/blob/master/src/app/show/show.page.html)

| Material Design  |
| -----------------|
| ![Android Show Page](/resources/screenshots/android-show.png) |

### [Página de configuración](https://github.com/jchicano/teayudo/blob/master/src/app/settings/settings.page.html)

| Material Design  |
| -----------------|
| ![Android Settings Page](/resources/screenshots/android-settings.png) |

## Despliegue

### Android

1. Ejecuta `ionic capacitor update && ionic build && npx cap copy && npx cap open android`.
2. Ejecutar la app desde Android Studio.

## License

TEAyudo se encuentra bajo la licencia [GNU General Public License v2.0](https://opensource.org/licenses/MIT).