const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    async index(req, res) {
        let { filter } = req.query;

        let results = await Recipe.findBy();
        const recipes = results.rows;

        if (!recipes) {
            return res.send("Recipes not found");
        }

        async function getImage(chefId) {
            let results = await Recipe.files(chefId);
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            );
            
            return files[0];
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id);
            return recipe
        });

        const allSet = await Promise.all(recipesPromise);

        return res.render("./home/index", { recipes: allSet, filter });
    },
    about(req, res) {
        return res.render("./home/about");
    },
    async recipes(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 3;

        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset
        };

        let results = await Recipe.paginate(params);
        let recipes = results.rows;

        let mathTotal = recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit );

        const pagination = {
            total: mathTotal,
            page
        }

        if(!recipes){
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
            recipe.img = await getImage(recipe.id);
            return recipe
        });

        const allSet = await Promise.all(recipesPromise);
                
        

        return res.render("./home/recipes", { recipes: allSet, pagination, filter });
    }, 
    async recipePage(req, res) {
        let result = await Recipe.find(req.params.id);
        const recipe = result.rows[0];
        
        if (!recipe) {
            return res.send("Recipe not found");
        }

        result = await Recipe.files(recipe.id);

        const files = result.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));
        
        return res.render("./home/recipePage", { recipe, files });
    },
    async chefs(req, res) {
        let results = await Chef.all();
        const chefs = results.rows;

        async function getImage(chefId) {
            let results = await Chef.files(chefId);
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            );
            
            return files[0];
        }

        const chefsPromise = chefs.map(async chef => {
            chef.img = await getImage(chef.id);
            return chef
        });

        const allSet = await Promise.all(chefsPromise);

        return res.render("./home/chefs", { chefs: allSet }); 
    }
}

// exports.index = function (req, res) {
//     return res.render("./home/index", { recipes: data.recipes });
// }

// exports.about = function (req, res) {
//     return res.render("./home/about");
// }

// exports.recipes = function (req, res) {
//     return res.render("./home/recipes", { recipes: data.recipes });
// }

// exports.recipePage = function (req, res) {
//     const {id} = req.params;
//     const foundRecipe = data.recipes.find(function (recipe) {
//         return recipe.id == id;
//     });
//     if(!foundRecipe){
//         return res.send("Sorry! Not found");
//     }

//     return res.render("./home/recipePage", { item: foundRecipe });
// }