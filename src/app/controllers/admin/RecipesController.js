const User = require('../../models/User');
const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipe.all();
            const recipes = results.rows;

            if(!recipes) {
                return res.send("Recipes not found");
            }

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                );                
            
                return files[0];
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            });

            const allSet = await Promise.all(recipesPromise);


            return res.render("./admin/recipe/index", { recipes: allSet });
        } catch(err) {
            console.error(err);
        }
    },
    async create(req, res) {
        let results = await Recipe.chefSelectOptions();
        const options = results.rows;

        return res.render("./admin/recipe/create", { chefOptions: options }) 
    },
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        if (req.files.length == 0) {
            return res.send('Please, send at least one image');
        }

        const { userId: id } = req.session;
        req.body.userId = id;

        let results = await Recipe.create(req.body);
        const recipe_id = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file, recipe_id}));
        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/${recipe_id}`);
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) return res.send("Recipe not found!");

        results = await Recipe.files(recipe.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("admin/recipe/show", { recipe, files });
    },
    async edit(req, res) {
        const { userId: id } = req.session;
        const user = await User.findOne({ Where: {id}});

        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if(!recipe) return res.send("Recipe not found!");

        results = await Recipe.chefSelectOptions();
        const chefs = results.rows;

        results = await Recipe.files(recipe.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));
        
        if (user.is_admin != true || recipe.user_id != id) {
            return res.render("./admin/recipe/show", { recipe, files, 
                error: "É necessário ser administrador ou criador de tal receita para editá-la!"
            });
        }

        return res.render("./admin/recipe/edit", { recipe, chefOptions: chefs, files });
    },
    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information" && key != "removed_files") {
                return res.send("Please, fill all fields!");
            }
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromise);
        }

        if(req.files.length != 0) {
            const oldFiles = await Recipe.files(req.body.id);
            const totalFiles = oldFiles.rows.length + req.files.length;

            if (totalFiles <= 5) {
                const newFilesPromise = req.files.map(file => 
                    File.create({...file, recipe_id: req.body.id}));
                
                await Promise.all(newFilesPromise);
            }
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id);

        return res.redirect("/admin/recipes");
    }
}