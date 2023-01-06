const { query } = require("../db/mysql");

exports.getChanel = async (req, res) => {
    user_id = req.body.id;
    const userId = req.userId;
    const result = await query("SELECT * FROM chat.session where users_id = ?", [userId]);
    let chanelId = -1; // -1 mean no chanel
    for await (item of result){
        const data = await query("SELECT * FROM chat.session where chanel_id = ? and users_id = ?", [item.chanel_id,user_id]);
        // typeof data === 'object' && data !== null
        const d = data.find(item => item)
        if(typeof d === 'object' && d !== null){
            chanelId = d.chanel_id;
            return res.json({chanelId: chanelId});
        }
    }

    if(chanelId === -1){
        // Create new chanel
        const result = await query("INSERT INTO chat.chanel (created_at) VALUES (?)", [new Date()]);
        const chanelId = result.insertId;
        await query("INSERT INTO chat.session (chanel_id, users_id) VALUES (?,?)", [chanelId, userId]);
        await query("INSERT INTO chat.session (chanel_id, users_id) VALUES (?,?)", [chanelId, user_id]);
        return res.json({chanelId: chanelId});
    }
   return res.json({chanelId: chanelId});
};

exports.getHistory = async (req, res) => {
    const userId = req.userId;
    const chanelId = req.body.chanelId?req.body.chanelId:0;
    const username = req.username ? req.username : '';
    let result = await query("SELECT * FROM chat.messages where chanel_id = ? limit 10", [chanelId]);
    // Push username to result
    result = result.map(item =>{return {...item, username: username}});
    // console.log(result);
    return res.json({history:result});
}