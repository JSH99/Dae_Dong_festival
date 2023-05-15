// dummy data
const data = [
    {
        id: 1,
        image: './assets/sample1.jpeg',
        name : '어묵탕',
        price: 5000,
        able: true
    },
    {
        id: 2,
        image: './assets/sample2.jpeg',
        name : '군만두',
        price: 500,
        able: true
    },
    {
        id: 3,
        image: './assets/sample3.jpeg',
        name : '파전',
        price: 15000,
        able: true
    },
    {
        id: 4,
        image: './assets/sample4.jpeg',
        name : '황도',
        price: 50000,
        able: true
    },
    {
        id: 5,
        image: './assets/sample4.jpeg',
        name : '더 맛있는 황도',
        price: 500000,
        able: true
    },
];

const backButton = document.querySelector('.back-button');
const menuContainer = document.querySelector('.menu-container');

backButton.addEventListener('click', () => {
    window.location.href = './admin.html'; 
});

data.forEach((menu) => {
    const menuBox = document.createElement('div');
    menuBox.classList.add('menu-box');
    menuContainer.appendChild(menuBox);

    menuBox.innerHTML = `
        <div class="menu-img"> 
            <img src="${menu.image}">
        </div>
        <div class="menu-info">
            <div class="menu-name">${menu.name}</div>
            <div class="menu-able">${menu.able ? '주문가능' : '품절'}</div>
            <div class="menu-price">${menu.price}</div>
            <div class="menu-button">
                <button class="sold-out-button">품절</button>
                <button class="able-button">주문가능</button>
            </div>
        </div>
    `;

    const soldOutButton = menuBox.querySelector('.sold-out-button');
    const ableButton = menuBox.querySelector('.able-button');
    const menuAbleElement = menuBox.querySelector('.menu-able');

    // 기본 설정 : 주문 가능
    menu.able = true; 
    ableButton.classList.toggle('active');

    soldOutButton.addEventListener('click', () => {
        soldOutButton.classList.toggle('active');
        ableButton.classList.remove('active');

        // 주문 상태 품절로 바꾸기
        menu.able = false; 
        menuAbleElement.textContent = '품절';
    });

    ableButton.addEventListener('click', () => {
        ableButton.classList.toggle('active');
        soldOutButton.classList.remove('active');

        // 주문 상태 가능으로 바꾸기
        menu.able = true; 
        menuAbleElement.textContent = '주문가능';
    });
});