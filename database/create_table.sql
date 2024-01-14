-- Table UTILISATEUR
CREATE TABLE UTILISATEUR (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT ,
    user_email VARCHAR,
    user_password VARCHAR
);


-- Table MONTRE
CREATE TABLE MONTRE (
    id_montre INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,   
    id_bracelet INTEGER,                
    id_boitier INTEGER,                
    montre_prix INTEGER,          
    form_montre VARCHAR,
    panier BOOLEAN,
    FOREIGN KEY (id_user) REFERENCES UTILISATEUR(id_user),    
    FOREIGN KEY (id_bracelet) REFERENCES BRACELET(id_bracelet),
    FOREIGN KEY (id_boitier) REFERENCES BOITIER(id_boitier) 
);



-- Table BRACELET
CREATE TABLE BRACELET (
    id_bracelet INTEGER PRIMARY KEY AUTOINCREMENT,
    bracelet_libelle VARCHAR,
    bracelet_prix VARCHAR,
    bracelet_texture VARCHAR,
    bracelet_fermoire VARCHAR
);

-- Table BOITIER
CREATE TABLE BOITIER (
    id_boitier INTEGER PRIMARY KEY AUTOINCREMENT,
    boitier_libelle VARCHAR,
    boitier_prix VARCHAR,
    boitier_fond VARCHAR,
    id_materiaux INTEGER,  
    id_button INTEGER,     
    id_pierre INTEGER,     
    FOREIGN KEY (id_materiaux) REFERENCES MATERIAUX(id_materiaux),
    FOREIGN KEY (id_button) REFERENCES BOUTON(id_bouton),
    FOREIGN KEY (id_pierre) REFERENCES PIERRE(id_pierre)
);

-- Table PIERRE
CREATE TABLE PIERRE (
    id_pierre INTEGER PRIMARY KEY AUTOINCREMENT,
    pierre_libelle VARCHAR,
    pierre_prix VARCHAR
);



-- Table BOUTON
CREATE TABLE BOUTON (
    id_bouton INTEGER PRIMARY KEY AUTOINCREMENT,
    bouton_libelle VARCHAR,
    bouton_prix VARCHAR
);
