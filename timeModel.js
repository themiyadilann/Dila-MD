const mongoose = require('mongoose');


const timeSchema = new mongoose.Schema({
    groupId: { type: String, required: true, unique: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true }
});

const TimeModel = mongoose.model('Time', timeSchema);

module.exports = TimeModel;
