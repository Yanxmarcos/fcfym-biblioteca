# Biblioteca Virtual UNT

Biblioteca Virtual para la Facultad de Ciencias Físicas y Matemáticas de la UNT es un prototipo web de una biblioteca universitaria desarrollado con Next.js, React, TypeScript y Tailwind CSS.

## Finalidad del proyecto

El proyecto fue creado para representar de manera visual e interactiva el funcionamiento de una biblioteca universitaria. Permite explorar cómo estudiantes y personal bibliotecario podrían consultar recursos, organizar materiales y revisar información relacionada con los servicios de una biblioteca desde una plataforma web.

## Funcionalidades disponibles

- Inicio de sesión de demostración.
- Consulta y búsqueda de recursos bibliográficos.
- Visualización del catálogo de libros y materiales.
- Biblioteca personal con recursos de ejemplo.
- Consulta de préstamos y reservas simulados.
- Visualización del perfil del usuario.
- Lectura de recursos digitales de demostración.
- Generación y descarga de citas bibliográficas.
- Consulta de noticias, horarios, servicios y ayuda.
- Vistas demostrativas de gestión bibliotecaria.
- Reportes, estadísticas y reclamos con información mock.
- Compatibilidad con modo claro y modo oscuro.

## Acceso de demostración

Para ingresar se puede utilizar cualquier correo con formato válido y cualquier contraseña. El acceso no consulta ni guarda credenciales en una base de datos.

Todos los usuarios que ingresan mediante este acceso reciben un perfil de estudiante de demostración.

## Modo de solo lectura

La aplicación utiliza datos mock para que pueda funcionar de manera autónoma en Vercel. El catálogo, la biblioteca personal, los préstamos, las reservas, el perfil y los reportes se cargan desde información local incluida en el código.

Se puede navegar, buscar y consultar el contenido disponible. También se pueden utilizar funciones locales que no modifican información, como copiar o descargar citas bibliográficas.

Las siguientes acciones se encuentran deshabilitadas:

- Añadir o eliminar libros de la biblioteca personal.
- Solicitar o cancelar préstamos.
- Crear o cancelar reservas.
- Modificar el progreso de lectura almacenado.
- Registrar nuevos usuarios.
- Cambiar datos personales, fotografías o contraseñas.
- Añadir, editar o eliminar recursos bibliográficos.
- Modificar reclamos, préstamos, reservas o reportes.

Estas limitaciones evitan cambios permanentes y permiten presentar el proyecto de forma segura como una demostración pública.

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Recharts
- Lucide React