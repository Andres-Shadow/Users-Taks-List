# Users Task List

Proyecto sencillo fullstack desarrollado con Golang en el backend y Astro en el frontend. La denámica del sistema es muy sencilla pues consiste en una serie de usuarios que a su vez contiene una lista de tareas que pueden ser marcadas como finalizadas.

Vista básica de un usuario sin tareas
![Vista no tareas](./images/table_no_task.png)

Vista del proyecto con datos lleno
![Vista base](./images/table_filled.png)

Vista para agregar una tarea a un usuario
![Vista tareas](./images/table_add_task.png)

## Componentes del sistema

### Backend

El proyecto backend fue basado en el proyecto creado por Fazt para posteriormente adaptar una serie de cambios que permitieran el despliegue del código en máquinas virtuales.

Los modelos de la base de datos son los siguientes  

- *Usario*:  Nombre (string), Apellido (string) y correo (string)
- *Tarea*: Titulo (string), Descripción (string) e ID del usuario (int)

### Frontend

El proyecto frontend fue realizado desde cero con Astro, posteriormente se implementó la integración con React para la codificación del componente "UserList.jsx".

## Ejecución del proyecto

1. Clonar el repositorio

    ```bash
        git clone https://github.com/Andres-Shadow/Users-Taks-List
    ```

2. Crear la base de datos en MySql

    ```bash
    mysql -u root -p
    create database users_tasks
    ```

3. Instalar las depedencias y ejecutar el servidor Backend

    ```bash
    cd backend
    go mod download
    ```

4. Instalar las dependeicas y ejecutar el servidor frontend

    ```bash
    cd frontend/users_tasks
    npm install
    npm run dev
    ```
