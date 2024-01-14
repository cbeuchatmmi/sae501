const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); // for parsing JSON requests

const cors = require('cors')

const app = express();
const port = 4000;


// Middleware for parsing JSON requests
app.use(bodyParser.json());
// Enable Cors from all origins
app.use(cors())

// Créez une instance de la base de données SQLite
const db = new sqlite3.Database('montre.db');

// Route pour obtenir toutes les montres
app.get('/montres', (req, res) => {
    const query = `
        SELECT c.*, a.bracelet_texture, b.boitier_fond
        FROM MONTRE c
        LEFT JOIN BOITIER b ON c.id_boitier = b.id_boitier
        LEFT JOIN BRACELET a ON c.id_bracelet = a.id_bracelet
    `;
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ montres: rows });
    });
});

// Route pour obtenir une montre par son id_montre
app.get('/montres/id/:id', (req, res) => {
    const montreId = req.params.id;
    db.get(` 
    SELECT c.*, a.bracelet_texture, b.boitier_fond
    FROM MONTRE c
    LEFT JOIN BOITIER b ON c.id_boitier = b.id_boitier
    LEFT JOIN BRACELET a ON c.id_bracelet = a.id_bracelet
    WHERE id_montre =?`, [montreId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration de la cuisine' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Cuisine non trouvÃ©e' });
        }
        res.json(row);
    });
});

// Route pour obtenir toutes les montres dans le panier
app.get('/montres/panier', (req, res) => {
    const query = `
        SELECT c.*, a.bracelet_texture, b.boitier_fond
        FROM MONTRE c
        LEFT JOIN BOITIER b ON c.id_boitier = b.id_boitier
        LEFT JOIN BRACELET a ON c.id_bracelet = a.id_bracelet
        WHERE c.panier = 1;  -- Sélectionne les montres où panier est true
    `;

    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ montres: rows });
    });
});



// Route pour obtenir tous les bracelets
app.get('/bracelets', (req, res) => {
    const query = 'SELECT * FROM BRACELET';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour obtenir tous les boîtiers
app.get('/boitiers', (req, res) => {
    const query = `SELECT *  FROM BOITIER `;

    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


// Route pour obtenir toutes les montres
app.get('/pierres', (req, res) => {
    const query = 'SELECT * FROM PIERRE';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ pierres: rows });
    });
});


// Route pour obtenir tous les boutons
app.get('/boutons', (req, res) => {
    const query = 'SELECT * FROM BOUTON';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ boutons: rows });
    });
});


// Route pour obtenir tous les utilisateurs
app.get('/utilisateurs', (req, res) => {
    const query = 'SELECT * FROM UTILISATEUR';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ utilisateurs: rows });
    });
});

// Route pour ajouter une nouvelle montre
app.post("/montres/add", (req, res) => {
    const { id_montre, form_montre, boitier_fond, bracelet_texture, id_user, montre_prix, panier } = req.body;

    // Check if required fields are provided
    if (!form_montre || !bracelet_texture || !boitier_fond || !id_user) {
        res.status(400).json({
            error:
                "Recipe name, cuisine ID, goal name, ingredients, and instructions are required",
        });
        return;
    }

    db.get(
        "SELECT id_boitier, boitier_prix FROM BOITIER WHERE boitier_fond =?",
        [boitier_fond],
        (err, boitier) => {
            if (err) {
                console.error("Error checking boitier existence:", err.message);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            if (!boitier) {
                res.status(404).json({ error: "Le boitier n'existe pas." });
            } else {
                const id_boitier = boitier.id_boitier;
                const boitier_prix = boitier.boitier_prix;
                db.get(
                    "SELECT id_bracelet, bracelet_prix FROM BRACELET WHERE bracelet_texture =?",
                    [bracelet_texture],
                    (err, bracelet) => {
                        if (err) {
                            console.error("Error checking bracelet existence:", err.message);
                            res.status(500).json({ error: "Internal server error" });
                            return;
                        }
                        if (!bracelet) {
                            res.status(404).json({ error: "Le bracelet n'existe pas." });
                        } else {
                            const id_bracelet = bracelet.id_bracelet;
                            const bracelet_prix = bracelet.bracelet_prix;
                            const montre_prix = boitier_prix + bracelet_prix;
                            if (!panier) {
                                panier === false;
                            }
                            db.run(
                                "INSERT INTO MONTRE (form_montre, montre_prix, id_boitier, id_bracelet, panier, id_user) VALUES (?, ?, ?, ?, ?, ?)",
                                [form_montre, montre_prix, id_boitier, id_bracelet, panier, id_user],
                                function (err) {
                                    if (err) {
                                        console.error("Error adding recipe:", err.message);
                                        res.status(500).json({ error: "Internal server error" });
                                        return;
                                    }

                                    const recipeId = this.lastID; // Get the ID of the newly added recipe)
                                    res.json({
                                        recipe_id: recipeId,
                                        message: "Recipe added successfully",
                                    });
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

// Route pour ajouter une nouvelle montre
app.post('/boitier/add', (req, res) => {
    const { id_boitier, boitier_prix, id_materiaux, id_button, id_pierre, boitier_fond } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!boitier_prix || !id_button || !id_pierre || !boitier_fond) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Insérez la nouvelle montre dans la table MONTRE
    const query = `
        INSERT INTO BOITIER (id_boitier,boitier_prix ,id_materiaux , id_button , id_pierre,boitier_fond)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_boitier,        // id_boitier
        boitier_prix,      // boitier_prix
        id_materiaux,      // id_materiaux
        id_button,         // id_button
        id_pierre,         // id_pierre
        boitier_fond       // boitier_fond
    ];

    db.run(query, values, (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la boitier:', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        // Retournez la nouvelle montre ajoutée avec son ID
        res.json({ id_boitier: this.lastID, boitier_prix, id_materiaux, id_button, id_pierre, boitier_fond });
    });

});



app.post('/bracelet/add', (req, res) => {
    const { id_bracelet, bracelet_libelle, bracelet_prix, bracelet_texture, bracelet_fermoire } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!bracelet_libelle || !bracelet_prix || !bracelet_texture || !bracelet_fermoire) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Insérez la nouvelle montre dans la table MONTRE
    const query = `
        INSERT INTO BRACELET (id_bracelet, bracelet_libelle, bracelet_prix, bracelet_texture, bracelet_fermoire)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        id_bracelet, bracelet_libelle, bracelet_prix, bracelet_texture, bracelet_fermoire
    ];

    db.run(query, values, (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la boitier:', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        // Retournez la nouvelle montre ajoutée avec son ID
        res.json({ id_bracelet: this.lastID, bracelet_libelle, bracelet_prix, bracelet_texture, bracelet_fermoire });
    });

});


// Route pour ajouter un nouvel utilisateur
app.post('/user/add', (req, res) => {
    const { id_user, user_email, user_password } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!user_email || !user_password) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Insérez le nouvel utilisateur dans la table UTILISATEUR
    const query = `
        INSERT INTO UTILISATEUR (id_user, user_email, user_password)
        VALUES (?, ?, ?)
    `;

    const values = [id_user, user_email, user_password];

    db.run(query, values, (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        // Retournez le nouvel utilisateur ajouté avec son ID
        res.json({ id_user: this.lastID, user_email });
    });
});

// Route pour supprimer une montre par son id_montre
app.delete('/montres/:id/delete', (req, res) => {
    const montreId = req.params.id;

    // Supprimez la montre de la table MONTRE
    const query = 'DELETE FROM MONTRE WHERE id_montre = ?';

    db.run(query, [montreId], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression de la montre :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        res.json({ message: 'Montre supprimée avec succès' });
    });
});


// Route pour supprimer une montre par son id_montre
app.delete('/boitiers/:id/delete', (req, res) => {
    const boitierId = req.params.id;

    // Supprimez la montre de la table MONTRE
    const query = 'DELETE FROM BOITIER WHERE id_boitier = ?';

    db.run(query, [boitierId], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression de la montre :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        res.json({ message: 'Montre supprimée avec succès' });
    });
});


app.delete('/user/:id/delete', (req, res) => {
    const id_user = req.params.id;

    // Supprimez la montre de la table MONTRE
    const query = 'DELETE FROM MONTRE WHERE id_user = ?';

    db.run(query, [id_user], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        res.json({ message: 'Utilisateur supprimée avec succès' });
    });
});




// app.put("/montres/:id/update", (req, res) => {
//     const montreId = req.params.id;
//     const { id_user, form_montre, boitier_fond, bracelet_texture, montre_prix, panier } = req.body;

//     // Check if required fields are provided
//     if (!form_montre || !bracelet_texture || !boitier_fond) {
//         res.status(400).json({
//             error: "form_montre, bracelet_texture, boitier_fond, and panier are required",
//         });
//         return;
//     }

//     db.get(
//         "SELECT id_boitier, boitier_prix FROM BOITIER WHERE boitier_fond =?",
//         [boitier_fond],
//         (err, boitier) => {
//             if (err) {
//                 console.error("Error checking boitier existence:", err.message);
//                 res.status(500).json({ error: "Internal server error" });
//                 return;
//             }
//             if (!boitier) {
//                 res.status(404).json({ error: "Le boitier n'existe pas." });
//             } else {
//                 const id_boitier = boitier.id_boitier;
//                 const boitier_prix = boitier.boitier_prix;
//                 db.get(
//                     "SELECT id_bracelet, bracelet_prix FROM BRACELET WHERE bracelet_texture =?",
//                     [bracelet_texture],
//                     (err, bracelet) => {
//                         if (err) {
//                             console.error("Error checking bracelet existence:", err.message);
//                             res.status(500).json({ error: "Internal server error" });
//                             return;
//                         }
//                         if (!bracelet) {
//                             res.status(404).json({ error: "Le bracelet n'existe pas." });
//                         } else {
//                             const id_bracelet = bracelet.id_bracelet;
//                             const bracelet_prix = bracelet.bracelet_prix;
//                             const updatedMontrePrix = boitier_prix + bracelet_prix;

//                             db.run(
//                                 `UPDATE MONTRE 
//                                 SET form_montre = ?, montre_prix = ?, id_boitier = ?, id_bracelet = ?, panier = ? 
//                                 WHERE id_montre = ?`,
//                                 [form_montre, updatedMontrePrix, id_boitier, id_bracelet, panier, montreId],
//                                 (err) => {
//                                     if (err) {
//                                         console.error("Error updating montre:", err.message);
//                                         res.status(500).json({ error: "Internal server error" });
//                                         return;
//                                     }

//                                     res.json({ message: "Montre updated successfully" });
//                                 }
//                             );
//                         }
//                     }
//                 );
//             }
//         }
//     );
// });



function getBoitierId(updatedMontre) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id_boitier, boitier_prix FROM BOITIER WHERE boitier_fond = ?",
            [updatedMontre],
            (err, boitier) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!boitier) {
                    reject("Le boitier n'existe pas.");
                } else {
                    resolve({ id_boitier: boitier.id_boitier });
                }
            }
        );
    });
}

function getBraceletId(updatedMontre) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id_bracelet, bracelet_prix FROM BRACELET WHERE bracelet_texture = ?",
            [updatedMontre],
            (err, bracelet) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!bracelet) {
                    reject("Le bracelet n'existe pas.");
                } else {
                    resolve({ id_bracelet: bracelet.id_bracelet });
                }
            }
        );
    });
}



app.put("/montres/:id_montre/update/", async (req, res) => {
    const { id_montre } = req.params;
    const updatedMontre = req.body;

    // Check if the updated recipe data is provided
    if (!updatedMontre) {
        res.status(400).json({ error: "Updated montre data is required" });
        return;
    }
    // Construct the SQL query dynamically based on the provided data
    let updateQuery = "UPDATE MONTRE SET ";
    const updateParams = [];
    var boitier_i;
    var bracelet_i;
    var truc;
    var machin;
    const validAttributes = ["form_montre", "boitier_fond", "bracelet_texture", "panier"];

    for (const attribute in updatedMontre) {
        if (validAttributes.includes(attribute)) {
            if (updatedMontre[attribute] !== undefined && updatedMontre[attribute] !== "") {
                if (attribute === "boitier_fond") {
                    try {
                        const boitier = await getBoitierId(updatedMontre[attribute]);
                        boitier_i = boitier.id_boitier;
                        const boitier_prix = boitier.boitier_prix;
                        truc = "id_boitier"
                        machin = boitier_i
                    } catch (error) {
                        return res.status(404).json({ error });
                    }
                }

                if (attribute === "bracelet_texture") {
                    try {
                        const bracelet = await getBraceletId(updatedMontre[attribute]);
                        console.log("bracelet", bracelet)
                        bracelet_i = bracelet.id_bracelet;
                        const bracelet_prix = bracelet.bracelet_prix;
                        truc = "id_bracelet"
                        machin = bracelet_i
                    } catch (error) {
                        return res.status(404).json({ error });
                    }
                }
                if (attribute === "form_montre") {
                    truc = "form_montre";
                    machin = updatedMontre[attribute]
                }
                if (attribute === "panier") {
                    truc = "panier";
                    machin = updatedMontre[attribute]
                }
                //console.log("boitier_i", boitier_i)
                //console.log(truc)
                //console.log("bracelet_i", bracelet_i)
                updateQuery += `${truc} = ?, `;
                //console.log("updateQuery", updateQuery)
                updateParams.push(machin);
                //console.log(updateParams)
            }
        }
    }

    //  Remove the trailing comma and space from the query
    updateQuery = updateQuery.slice(0, -2);

    // Add the WHERE clause to specify the recipe to update
    updateQuery += " WHERE id_montre = ?";
    console.log("updateQuery where", updateQuery)
    updateParams.push(id_montre);
    console.log("attends t'es quoi toi", updateParams)
    // res.status(200).json("Fini")
    // Execute the dynamic SQL update query
    db.run(updateQuery, updateParams, function (err) {
        console.log("updateQuery", updateQuery)
        console.log("updateParams", updateParams)
        if (err) {
            console.error("Error updating clock:", err.message);
            res.status(500).json({ error: "Internal server error." });
            return;
        }

        if (this.changes === 0) {
            // No rows were affected, indicating that the recipe with the given ID was not found
            res.status(404).json({ error: "Clock not found" });
        } else {
            // Recipe updated successfully
            res.json({ message: "Clock updated successfully" });
        }
    });
});



// Ajoutez une nouvelle route pour mettre à jour la valeur du panier
app.put('/montres/:id_montre/update-panier', async (req, res) => {
    const { id_montre } = req.params;
    const { panier } = req.body;

    // Vérifiez si la valeur du panier est fournie
    if (panier === undefined) {
        return res.status(400).json({ error: "Panier value is required" });
    }

    // Exécutez la requête de mise à jour
    const updateQuery = "UPDATE MONTRE SET panier = ? WHERE id_montre = ?";
    const updateParams = [panier, id_montre];

    db.run(updateQuery, updateParams, function (err) {
        if (err) {
            console.error("Error updating panier:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (this.changes === 0) {
            // Aucune ligne n'a été affectée, ce qui indique que la montre avec l'ID donné n'a pas été trouvée
            return res.status(404).json({ error: "Montre not found" });
        }

        // Montre mise à jour avec succès
        res.json({ message: "Montre panier updated successfully" });
    });
});




// Route pour mettre à jour un boitier par son id_boitier
app.put('/boitier/:id/update', (req, res) => {
    const boitierId = req.params.id;
    const { boitier_prix, id_materiaux, id_button, id_pierre, boitier_fond } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!boitier_prix || !id_materiaux || !id_button || !id_pierre || !boitier_fond) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Mettez à jour le boitier dans la table BOITIER
    const query = `
        UPDATE BOITIER
        SET
            boitier_prix = ?,
            id_materiaux = ?,
            id_button = ?,
            id_pierre = ?,
            boitier_fond = ?
        WHERE id_boitier = ?
    `;

    const values = [
        boitier_prix,
        id_materiaux,
        id_button,
        id_pierre,
        boitier_fond,
        boitierId
    ];

    db.run(query, values, (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du boitier :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        res.json({ message: 'Boitier mis à jour avec succès' });
    });
});


// Route pour mettre à jour un utilisateur par son id_user
app.put('/user/:id/update', (req, res) => {
    const userId = req.params.id;
    const { user_email, user_password } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!user_email || !user_password) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Mettez à jour l'utilisateur dans la table UTILISATEUR
    const query = `
        UPDATE UTILISATEUR
        SET
            user_email = ?,
            user_password = ?
        WHERE id_user = ?
    `;

    const values = [
        user_email,
        user_password,
        userId
    ];

    db.run(query, values, (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        res.json({ message: 'Utilisateur mis à jour avec succès' });
    });
});

// Route pour gérer la connexion
app.post('/login', (req, res) => {
    const { user_email, user_password } = req.body;

    // Vérifiez si toutes les informations nécessaires sont fournies
    if (!user_email || !user_password) {
        res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies' });
        return;
    }

    // Vérifiez les informations d'identification dans la base de données
    const query = 'SELECT * FROM UTILISATEUR WHERE user_email = ? AND user_password = ?';

    db.get(query, [user_email, user_password], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification des informations d\'identification :', err.message);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }

        if (!row) {
            // Aucun utilisateur trouvé avec ces informations d'identification
            res.status(401).json({ error: 'Connexion échouée. Vérifiez vos informations d\'identification' });
            return;
        }

        // Connexion réussie
        res.json({ message: 'Connexion réussie', user: { id_user: row.id_user, user_email: row.user_email } });
    });
});






// Écoutez le port défini
app.listen(port, () => {
    console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});