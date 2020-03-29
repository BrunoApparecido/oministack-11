const connection = require('../database/connection');

module.exports = {
    async index(req,res) {
        const id = req.headers.authorization;

        const ong = await connection('ongs').where({id}).select('*');

        return res.json(ong);
    }
}