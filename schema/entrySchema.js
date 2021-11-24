const {Schema, model} = require('mongoose');

const EntrySchema = new Schema({
    user: String,
    startDate: Date,
    endDate: Date,
    state: String
}, {collection: 'entries'});

module.exports = model('Entry', EntrySchema);