CREATE TABLE client(  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    created_at DATE,
    updated_at DATE
);
