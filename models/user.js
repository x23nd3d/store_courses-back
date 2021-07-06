const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 0
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }

});

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    });
    const candidate = items[idx];

    if (idx >= 0) {
        // course already exists, add count
        candidate.count++;
    } else {
        // no course in the cart, add it
        items.push({
            count: 1,
            courseId: course._id
        });
    }

    this.cart = {items}
    return this.save();

}

userSchema.methods.removeFromCart = function (course) {
    let items = [...this.cart.items];
    const idx = items.findIndex(item => {
        return item.courseId.toString() === course._id.toString();
    })
    const candidate = items[idx];
    console.log(candidate.count);

    if (candidate.count > 1) {
        // need to reduce the count
        candidate.count--;
    } else {
        // need to remove the course from the cart
        // items = [
        //     ...items.slice(0, idx),
        //     ...items.slice(idx + 1)
        // ];

        items = items.filter(i => i.courseId.toString() !== course._id.toString());
    }

    this.cart = {items}
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}


module.exports = model('User', userSchema);

