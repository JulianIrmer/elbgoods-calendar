const Entry = require('../schema/entrySchema');

/**
 * Validates if the input data would be a valid entry regarding the time frame and state.
 * @params {Object} data
 * @return {Object} containing whether the entry is valid or not.
 * If the entry is not valid a error message is added to the object
 */
module.exports.validateEntry = async (data) => {
    if (data.startDate > data.endDate) {
        return {
            message: 'Start date is later than end date',
            isValid: false
        };
    }

    const entries = await Entry.find({
        user: data.user,
        startDate: {$lte: data.endDate}, 
        endDate: {$gte: data.startDate}
    });

    let sumOfTentativeEntries = 0;

    for (let i = 0; i < entries.length; i++) {
        if (entries[i].state === 'tentative') {
            sumOfTentativeEntries++;
        }

        if (sumOfTentativeEntries === 5) {
            return {
                message: 'Too many tentative entries in the given time span',
                isValid: false
            };
        }

        if (entries[i].state === 'booked') {
            return {
                message: 'Overlapping with booked entries',
                isValid: false
            };
        }
    }

    return {
        message: 'Time frame is valid',
        isValid: true
    };
};