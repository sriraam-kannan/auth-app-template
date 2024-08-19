CREATE TABLE users(  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255),
    role VARCHAR(255),
    created_at DATE,
    updated_at DATE
);