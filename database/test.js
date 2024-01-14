app.put("/montre/update/:montre_id", async (req, res) => {
    const { montre_id } = req.params;
    const updatedMontre = req.body;

    // Check if the updated recipe data is provided
    if (!updatedMontre) {
        res.status(400).json({ error: "Updated montre data is required" });
        return;
    }
    // Construct the SQL query dynamically based on the provided data
    let updateQuery = "UPDATE Montres SET ";
    const updateParams = [];
    var cadran_i;
    var bracelet_i;
    var truc;
    var machin;
    const validAttributes = ["boitier_form", "cadran_name", "bracelet_name", "panier"];

    for (const attribute in updatedMontre) {
        if (validAttributes.includes(attribute)) {
            if (updatedMontre[attribute] !== undefined && updatedMontre[attribute] !== "") {
                if (attribute === "cadran_name") {
                    try {
                        const cadran = await getCadranId(updatedMontre[attribute]);
                        cadran_i = cadran.cadran_id;
                        const cadran_price = cadran.price;
                        truc = "cadran_id"
                        machin = cadran_i
                    } catch (error) {
                        return res.status(404).json({ error });
                    }
                }

                if (attribute === "bracelet_name") {
                    try {
                        const bracelet = await getBraceletId(updatedMontre[attribute]);
                        console.log("bracelet", bracelet)
                        bracelet_i = bracelet.bracelet_id;
                        const bracelet_price = bracelet.price;
                        truc = "bracelet_id"
                        machin = bracelet_i
                    } catch (error) {
                        return res.status(404).json({ error });
                    }
                }
                if (attribute === "boitier_form") {
                    truc = "boitier_form";
                    machin = updatedMontre[attribute]
                }
                if (attribute === "panier") {
                    truc = "Panier";
                    machin = updatedMontre[attribute]
                }
                console.log("cadran_i", cadran_i)
                console.log(truc)
                console.log("bracelet_i", bracelet_i)
                updateQuery += `${truc} = ?, `;
                console.log("updateQuery", updateQuery)
                updateParams.push(machin);
                console.log(updateParams)
            }
        }
    }

    //  Remove the trailing comma and space from the query
    updateQuery = updateQuery.slice(0, -2);

    // Add the WHERE clause to specify the recipe to update
    updateQuery += " WHERE montre_id = ?";
    console.log("updateQuery where", updateQuery)
    updateParams.push(montre_id);
    console.log("attends t'es quoi toi", updateParams)
    // res.status(200).json("Fini")
    // Execute the dynamic SQL update query
    db.run(updateQuery, updateParams, function (err) {
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