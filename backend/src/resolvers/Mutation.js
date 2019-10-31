let dogs = []
const Mutation = {
    addDog(parent, args, ctx, info) {
        dogs.push({name: args.name})

        return args
    }
};

module.exports = {Mutation, dogs};
