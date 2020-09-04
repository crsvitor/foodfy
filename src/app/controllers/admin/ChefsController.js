const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

module.exports = {
    async index(req, res) {
        // let all = await Chef.all();
        // const chefs = all.rows;

        try {
            let results = await Chef.all();
            const chefs = results.rows;

            if(!chefs) {
                return res.send("Chefs not found");
            }

            async function getImage(chefId) {
                let results = await Chef.files(chefId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                );

                return files[0];
            }

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
                return chef
            });

            const allChefs = await Promise.all(chefsPromise);

            return res.render("./admin/chef/chefs", { chefs: allChefs });
        
        } catch {
            console.error(err);
        }

        return res.render("./admin/chef/chefs", { chefs });            
    },
    create(req, res) {
        return res.render("./admin/chef/create");
    },
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all the fields!");
            }
        }

        if (req.files.length == 0) {
            return res.send("Please, select at least one image");
        }

        const filePromise = req.files.map(file => File.createChefFile({...file}));
        let results = await filePromise[0];
        const fileId = results.rows[0].id;

        results = await Chef.create(req.body, fileId);
        const chefId = results.rows[0].id;

        return res.redirect(`/admin/chefs/${chefId}`); 
    },
    async show(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if (!chef) return res.send("Chef not found!");

        results = await Chef.files(chef.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));


        let recipes = await Recipe.findByChef(chef.id);
        
        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId);
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            );
            
            return files[0];
        }

        const recipesPromises = recipes.rows.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            return recipe
        });

        const allFiles = await Promise.all(recipesPromises);  

        return res.render("admin/chef/show", { chef, recipes: allFiles, files });
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if(!chef) {
            return res.send("Sorry, chef not found!");
        }

        results = await Chef.files(chef.id);
        let files = results.rows;

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));      

        return res.render("./admin/chef/edit", { chef, file: files[0].src });
    },
    async put(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all the fields");
            }
        }

        let results = await Chef.files(req.body.id);
        let fileId = results.rows[0].id;

        if (req.files.length != 0) {
            const filesPromises = req.files.map(file => File.createChefFile({ ...file }));
            results = await filesPromises[0];
            fileId = results.rows[0].id;
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromises = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromises);
        }

        await Chef.update(req.body, fileId);

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },
    async delete(req, res) {
        let results = await Chef.find(req.body.id);

        if (results.rows[0].total_recipes == 0) {
            await Chef.delete(req.body.id);
            return res.redirect("/admin/chefs")         
        } else {
            return res.send("Chefs who have recipes on our website cannot be deleted");
        }
    }
}