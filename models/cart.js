const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
        'data',
        'cart.json'
);



class Cart {

    static async add(course) {
        const cart = await Cart.fetch();
        console.log('CART', cart);
        const idx = cart.courses.findIndex((c) => c.id === course.id);
        const candidate = cart.courses[idx];

        if (candidate) {
            // course already exists, add count
            candidate.count++
            cart.courses[idx] = candidate;
        } else {
            // need to add course to the cart
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        return new Promise(((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(cart),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            )
        }))
    }

    static async fetch() {
        return new Promise(((resolve, reject) => {
            fs.readFile(
                p,
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content));
                    }
                }
            )
        }))

    };

    static async remove(course) {
        let cart = await Cart.fetch();
        const idx = cart.courses.findIndex((c) => c.id === course.id);
        console.log(idx);
        const candidate = cart.courses[idx];
        console.log('CANDIDATE', candidate);

        if (candidate.count > 1) {
            // need to reduce count
            candidate.count--
        } else {
            // need to remove course from the cart list
            cart.courses = [
                ...cart.courses.slice(0, idx),
                ...cart.courses.slice(idx + 1)
                ];

            if (!cart.courses.length) {
                cart.price = 0
            }
        }

        cart.price -= course.price;

        return new Promise(((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(cart),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cart);
                    }
                }
            )
        }))

    }
}

module.exports = Cart;