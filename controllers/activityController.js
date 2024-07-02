const Activity = require("../models/activityModel");

const setActivity = async(req) => {
    const username = req.username;
    const activity = req.activity;
    const fullName = req.fullName;
    const _activity = await Activity.create({username, fullName, activity});
    return _activity;
}

const getActivity = async(req, res) => {
    const user = req.query.username;
    if(user == "ALL" || !user || user == null){
        const activities = await Activity.find({});
        activities.reverse();
        return res.status(200).json({
            message : "success",
            user : "ALL",
            activities : activities
        });
    }
    else{
        const activities = await Activity.find({username : user});
        activities.reverse();
        return res.status(200).json({
            message : "success",
            user : user,
            activities : activities
        });
    }
}

module.exports = {
    setActivity,
    getActivity
}