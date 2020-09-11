const User = require('../models/User');

module.exports = {
    async post(req, res, next) {
        const keys = Object.keys(req.body);
        
                
            console.log(
                    req.body
                );
        

        for(key of keys) {
            if (req.body[key] == "" && key != "is_admin" && key != "id") {
                return res.render('./admin/user/register', {
                    user: req.body,
                    error: keys
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
                error: 'Usuário já cadastrado'
            });
        }

        next();
    }
}