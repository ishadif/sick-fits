const {dogs} = require('./Mutation')
const Query = {
    dogs(parent, args, ctx, info) {
        return dogs
    }
};

module.exports = Query;
