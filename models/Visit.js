const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    // User responsible for the visit
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Starting place for the visit
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'place',
        required: true
    },
    // Destinations that will be included in visit
    destinations: [{type: Schema.Types.ObjectId, ref: 'place'}]
},
{
    timestamps: true
});

module.exports = Visit = mongoose.model('visit',VisitSchema);
