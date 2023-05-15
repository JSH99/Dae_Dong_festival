// dummy data
const data = [
    {
        id: 1,
        image: './assets/sample1.jpeg',
        name : '어묵탕',
        price: 5000,
    },
    {
        id: 2,
        image: './assets/sample2.jpeg',
        name : '군만두',
        price: 500,
    },
    {
        id: 3,
        image: './assets/sample3.jpeg',
        name : '파전',
        price: 15000,
    },
    {
        id: 4,
        image: './assets/sample4.jpeg',
        name : '황도',
        price: 50000,
    },
    {
        id: 5,
        image: './assets/sample5.jpeg',
        name : '햄계란',
        price: 500000,
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

    // 기본 설정 : 주문 가능
    let menuAble = true; 

    menuBox.innerHTML = `
        <div class="menu-img-wrap"> 
            <img class="menu-img" src="${menu.image}">
        </div>
        <div class="menu-info">
            <div class="menu-name">${menu.name}</div>
            <div class="menu-able">${menuAble ? '주문가능' : '품절'}</div>
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
    ableButton.classList.toggle('active');

    soldOutButton.addEventListener('click', () => {
        soldOutButton.classList.toggle('active');
        ableButton.classList.remove('active');

        // 품절된 메뉴 id 전송
        const body = {
            id : menu.id,
        };
       
        fetch('/menu/state/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // csrftoken을 넣어줌
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.ok) {
                console.log('상태 업데이트 요청이 성공적으로 전송되었습니다.');
            } else {
                console.error('상태 업데이트 요청 전송 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('상태 업데이트 요청이 실패했습니다:', error);
        });

        // 주문 상태 품절로 바꾸기
        menuAble = false; 
        menuAbleElement.textContent = '품절';
    });

    ableButton.addEventListener('click', () => {
        ableButton.classList.toggle('active');
        soldOutButton.classList.remove('active');

        // 주문 가능한 메뉴 id 전송
        const body = {
            id : menu.id,
        };

        fetch('/menu/state/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // csrftoken을 넣어줌
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.ok) {
                console.log('상태 업데이트 요청이 성공적으로 전송되었습니다.');
            } else {
                console.error('상태 업데이트 요청 전송 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('상태 업데이트 요청이 실패했습니다:', error);
        });

        // 주문 상태 가능으로 바꾸기
        menuAble = true; 
        menuAbleElement.textContent = '주문가능';
    });
});