const express = require('express');
const router = express.Router();
const Entry = require('../schema/entrySchema');
const entryHelper = require('../util/entryHelper');

/**
 * Get all entries from a single user for a given time frame
 */
router.get('/get/:userid/:timeframe', async (req, res, next) => {
    try {
        if (isNaN(req.params.timeframe)) {
            res.status(200).json({message: 'Wrong type for timeframe. It must be type "Number"'});
        }
        let timeframe = new Date();
        timeframe.setDate(timeframe.getDate() + Math.abs(parseInt(req.params.timeframe)));
        timeframe = timeframe.toISOString();
    
        const entries = await Entry.find({
            user: req.params.userid,
            startDate: {$gt: new Date().toISOString()},
            endDate: {$lt: timeframe}
        }).sort({startDate: 'asc'});
    
        if (!entries) {
            res.status(200).json({message: 'No entries found for the given time frame!'});
        } else {
            res.status(200).json(entries);
        }
    } catch (error) {
        next(error)
    }
});

/**
 * Create a new entry 
 */
router.post('/create', async (req, res) => {
    const data = req.body;

    // Validate date range
    const validationObject = await entryHelper.validateEntry(data);
    
    if (validationObject.isValid) {
        const entry = new Entry(data);
        entry.save((err, doc) => {
            if (err) {
                res.status(400).json({err})
            }
            res.status(201).json(doc);
        });
    } else {
        res.status(200).json({message: validationObject.message});
    }
});


/**
 * Update an existing entry 
 */
router.post('/update', async (req, res, next) => {
    const updateObj = req.body;

    if (!updateObj.id || !updateObj.user) {
        res.status(400).json({error: 'ID or user missing!'});
    }

    try {
        const validationObject = await entryHelper.validateEntry(updateObj);
    
        if (!validationObject.isValid) res.status(200).json({message: validationObject.message});
    
        const entry = await Entry.findOne({_id: updateObj.id});
    
        if (!entry) res.status(200).json({message: 'No entry found!'});

        if (entry.state === 'booked') delete updateObj.state;
    
        const updatedEntry = await Entry.findOneAndUpdate({_id: updateObj.id}, updateObj, {new: true});
    
        res.status(201).json(updatedEntry);
    } catch (error) {
        next(error);
    }
});

/**
 * Delete an entry by id
 */
router.delete('/delete/:id', (req, res) => {
    if (!req.params.id) res.status(404).json({message: 'ID is missing'}); 

    Entry.findOneAndDelete({_id: req.params.id}, (err, doc) => {
        if (err) res.status(404);
    });
    res.status(204);
});

router.get('/check/:user/:startDate/:endDate', async (req, res) => {
    const validationObject = await entryHelper.validateEntry(req.params);
    const obj = {
        message: 'The time frame is valid.'
    };

    if (!validationObject.isValid) {
        obj.message = validationObject.message;
    } 

    res.status(200).json(obj);
});

module.exports = router;