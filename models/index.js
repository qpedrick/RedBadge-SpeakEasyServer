// const db = require('../db')

// const UserModel = require('./user');
// const JobModel = require('./job');
// const StoryModel = require('./story');

// UserModel.hasMany(JobModel)
// UserModel.hasMany(StoryModel)

// module.exports = {
//     dbConnection: db,
//     models: {
//         UserModel,
//         JobModel,
//         StoryModel
//     }
// }

const UserModel = require('./user');
const JobModel = require('./job');
const StoryModel = require('./story')

UserModel.hasMany(JobModel)
UserModel.hasMany(StoryModel)

module.exports = {
    UserModel,
    JobModel,
    StoryModel
}