const User = require('../models/User');

module.exports = {
    async post(req, res, next) {
        try {
            const keys = Object.keys(req.body);
        
            for(const key of keys) {
                if (req.body[key] == "" && key != "is_admin" && key != "id") {
                    return res.render('./admin/user/register', {
                        user: req.body,
                        error: "Preencha todos os campos!"
                    });
                }
            }
    
            let { email } = req.body;
    
            const user = await User.findOne({
                where: { email }
            });
    
            if(user) {
                return res.render('./admin/user/register', {
                    user: req.body,
                    error: 'Usuário já cadastrado!'
                });
            }
    
            next();

        } catch(err) {
            console.error(err);
        }
    },
    async put(req, res, next) {
        try {
            const keys = Object.keys(req.body);

            for (const key of keys) {
                if (req.body[key] == "" && key != "is_admin" && key != "id") {
                    return res.render('./admin/user/edit', {
                        user: req.body,
                        error: "Preencha todos os campos!" 
                    });
                }
            }

            next();
            
        } catch(err) {
            console.error(err);
        }

    },
    async delete(req, res, next) {
        try {
            // we are going to verify if our logged users are trying to delete their own accounts
            const { userId: id } = req.session;
            // console.log(id);

            // const user = await User.findOne({ Where: { id } });
            // console.log(user);

            const aboutToBeDeleteUser = req.body.id;
            // console.log(aboutToBeDeleteUser);

            const users = await User.list();

            if ( id == aboutToBeDeleteUser ) {
                return res.render('./admin/user/index', {
                    users,
                    error: 'Você não pode deletar sua própia conta!'
                });
            }
            
            next();
        } catch(err) {
            console.error(err);
        }
    }
}