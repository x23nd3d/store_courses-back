const toCurrency = price => {
    return new Intl.NumberFormat(
            'ua-UA',
            {
                style: 'currency',
                currency: 'UAH'
            }
        ).format(Number(price));
};

const toDate = date => {
    return new Intl.DateTimeFormat(
        'ua-UA', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
    ).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
})

// const prices = document.querySelectorAll('.price');
//     for (let i = 0; i < prices.length; i++) {
//         prices[i].textContent = toCurrency(prices[i].textContent)
//     }

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
})

// delete items

const $course = document.querySelector('#courses');
if ($course) {

    $course.addEventListener('click', e => {

        if (e.target.classList.contains('c-remove')) {
            const id = e.target.dataset.id;
            console.log(id);

            fetch(`/courses/${id}/remove`, {
                method: 'DELETE'
            }).then(res => res.json())
                .then(body => {
                    if (body.length > 0) {
                        console.log('COURSES', body);
                        const html = body.map(i => {
                            return `
        <div class="row">
            <div class="col s6 offset-s3">
                <div class="card">
                    <div class="card-image">
                        <img src="${i.img}" alt="${i.title}">
                    </div>
                    <div class="card-content">
                        <span class="card-title">${i.title}</span>
                        <p class="price">${i.price}</p>
                    </div>
                    <div class="card-action">
                        <a class="btn btn-main" href="/courses/${i.id}" target="_blank">Open course</a>
                        <div class="btns-control">
                            <a class="btn blue" href="/courses/${i.id}/edit?allowed=true">Edit Course</a>
                             <button class="btn red btn-remove c-remove" data-id="${i.id}">Delete Course</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
                `});

                        $course.querySelector('.c-body').innerHTML = html;
                        const price =  $course.querySelectorAll('.price');
                        for (let i = 0; i < body.length; i++) {
                            console.log('!!!', price);
                            price[i].textContent = toCurrency(body[i].price)
                        }
                    } else {
                        $course.querySelector('.c-body').innerHTML = '<h3>No courses added.</h3>';
                    }
                });
        }
    });
}


// delete cart

const $cart = document.querySelector('#cart');
if ($cart) {

    $cart.addEventListener('click', e => {

        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            console.log(id);

            fetch('/cart/remove/' + id, {
                method: 'DELETE'
            }).then(res => res.json())
                .then(body => {
                    console.log(body, 'BODY');
                    if (body.courses.length) {
                            const html =  body.courses.map(i => {
                                return `
                <tr>
                    <td>${i.title}</td>
                    <td>${i.count}</td>
                    <td>
                        <button class="btn btm-small js-remove" data-id="${i.id}">Remove</button>
                    </td>
                </tr>
                `}).join('');
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(body.price)

                    } else {
                        $cart.innerHTML = '<h3>The cart is empty.</h3>';
                    }
                })
        }
    })

}


M.Tabs.init(document.querySelectorAll('.tabs'));

