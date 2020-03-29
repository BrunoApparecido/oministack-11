const connection = require('../database/connection');


module.exports = {
   
    async index(req,res) {
        const ong_id = req.headers.authorization;
        const {page = 1} = req.query;

        const [count] = await connection('incidents').where({ong_id}).count();

        const incidents = await connection('incidents')
        .join('ongs','ongs.id', '=', 'incidents.ong_id')
        .where({
            ong_id
        }).limit(5).offset(page).select([
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf'
        ]);

        res.header('X-Total-Count',count['count(*)'])

        return res.json(incidents);
    },

    async create(req, res) {
        const ong_id = req.headers.authorization;
        const { title,description,value } = req.body;

        try {
            const [id] = await connection('incidents').insert({
                title,
                description,
                value,
                ong_id,
            });
        
            return res.json({
                id
            });    
        }
        catch(ex) {
            console.error(ex);
            return res.error('Sorry, have error on save this incidents, try again late');
        }
    },

    async delete(req,res) {
        const ong_id = req.headers.authorization;
        const { id } = req.params;

        const incidents = await connection('incidents')
        .where({id})
        .select('ong_id')
        .first();

        if (incidents.ong_id !== ong_id) {
            return res.status(401).json({error : "Operation not permitted."});
        }
        
        await connection('incidents').where({id}).delete();

        res.status(204).send();
    }

}