CREATE TABLE IF NOT EXISTS marcas_vehiculo (
    id_marca SERIAL PRIMARY KEY,
    nombre_marca VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS modelos_vehiculo (
    id_modelo SERIAL PRIMARY KEY,
    nombre_modelo VARCHAR(100) NOT NULL,
    id_marca INT NOT NULL,
    FOREIGN KEY (id_marca) REFERENCES marcas_vehiculo(id_marca)
);

CREATE TABLE IF NOT EXISTS choferes (
    id_chofer SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    licencia VARCHAR(25) UNIQUE NOT NULL,
    telefono VARCHAR(10),
    email VARCHAR(100) UNIQUE,
    estado BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS administradores (
    id_admin SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios{
    id SERIAL PRIMARY KEY,
    nombre varchar (255),
    email varchar (255),
    lastname varchar (255),
    password varchar (255)
};

CREATE TABLE IF NOT EXISTS unidades (
    id_unidad SERIAL PRIMARY KEY,
    placa VARCHAR(7) UNIQUE NOT NULL,
    anio INT,
    id_chofer INT,
    id_modelo INT,
    FOREIGN KEY (id_chofer) REFERENCES choferes(id_chofer),
    FOREIGN KEY (id_modelo) REFERENCES modelos_vehiculo(id_modelo)
);

CREATE TABLE IF NOT EXISTS tipos_alerta (
    id_tipo_alerta SERIAL PRIMARY KEY,
    nombre_alerta VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS alertas (
    id_alerta SERIAL PRIMARY KEY,
    id_tipo_alerta INT NOT NULL,
    id_unidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_alerta) REFERENCES tipos_alerta(id_tipo_alerta),
    FOREIGN KEY (id_unidad) REFERENCES unidades(id_unidad)
);

