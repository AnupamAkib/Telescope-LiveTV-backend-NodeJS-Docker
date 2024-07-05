const Activity = require("../models/activityModel");
const User = require("../models/userModel");

const setActivity = async(req) => {
    const username = req.username;
    const activity = req.activity;
    const fullName = req.fullName;
    const _activity = await Activity.create({username, fullName, activity});
    return _activity;
}

const getActivity = async(req, res) => {
    const user = req.query.username;
    if(req.username != "anupam"){
        return res.status(401).json({
            message : "failed"
        });
    }

    const allUsers = await User.find({});
    const allUsernames = allUsers.map(user => user.username);

    if(user == "ALL" || !user || user == null){
        let activities = await Activity.find({});
        activities.reverse();
        activities = activities.slice(0, 100);

        return res.status(200).json({
            message : "success",
            user : "ALL",
            allUser : allUsernames,
            topActivities : activities
        });
    }
    else{
        let activities = await Activity.find({username : user});
        activities.reverse();
        activities = activities.slice(0, 100);
        
        return res.status(200).json({
            message : "success",
            user : user,
            allUser : allUsernames,
            topActivities : activities
        });
    }
}

module.exports = {
    setActivity,
    getActivity
}