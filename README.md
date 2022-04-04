# Prueba técnica - Gabriel Espinoza Rojas

Hola, como toolchain usé [Create React App](https://github.com/facebook/create-react-app). La app también está disponible en 
[My Fav Images](https://my-fav-imgs.web.app/). Pueden usar las credenciales email: nada@nada.com, password: nadada (en caso de no querer registrarse).
## Scripts importantes

Dentro de la carpeta del proyecto y habiendo instalado [NodeJS](https://nodejs.org/es/download/) (yo estoy usando la versión 6.14.13): 

### `npm install`

Para instalar todos los paquetes y dependencias necesarias.

### `npm start`

Para correr la en desarrollo [http://localhost:3000](http://localhost:3000)
### `npm test`

Para ver la cobertura de código y los resultados de las pruebas.

### `npm run build`

Para crear los archivos para luego hacer deploy en producción. Los deja en la carpeta `build`

# Explicación del proceso de desarrollo y justificación

Para esta prueba estoy usando una aplicación serverless porque el documento estipulaba que debía presentar un repositorio y crear un API habría tomado un repo más (o al menos a mí me gusta trabajar la interfaz por aparte). Escogí firebase como proveedor de servicios de autenticación y almacenamiento porque es sencillo, tengo experiencia en la plataforma y me parece una herramienta útil para aplicaciones sencillas que pueden escalar con el tiempo. Y escogí React porque me parece una biblioteca bastante completa para hacer single page apps y tengo experiencia en ella.

Debo decir que tal vez el proceso de autenticación fue una decisión creativa por mi parte, pero lo hice porque un álbum global donde cualquier usuario puede borrar o editar las imágenes de otro me parece caótico y poco funcional. La idea acá es que cada usuario pueda tener su espacio personal para administrar sus entradas. Como se menciona al inicio, la aplicación está corriendo bajo el dominio [My Fav Images](https://my-fav-imgs.web.app/) y se pueden utilizar las credenciales email: nada@nada.com, password: nadada si no quieren registrarse. También, para algunos elementos gráficos tomé componentes de la biblioteca [Material UI](https://mui.com/).

Fue muy divertido, gracias por la oportunidad.

