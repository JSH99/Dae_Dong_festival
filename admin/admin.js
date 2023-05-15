// dummy data
import { data } from './dummy.js';

// 실제 data
// const admin_data = localStorage.getItem('admin');
// const data = JSON.parse(admin_data);

// 진행중인 주문 / 완료 주문 활성화 버튼
const inProgressButton = document.querySelector('#in-progress-order-button');
const orderContainer = document.querySelector('.order-container');
const completedButton = document.querySelector('#complete-order-button');
const completedOrderContainer = document.querySelector('.completed-order-container');
const menuStateButton = document.querySelector('#menu-state-button');
const completed_at = {};

menuStateButton.addEventListener('click', () => {
    window.location.href = './menu.html'; 
});

inProgressButton.addEventListener('click', () => {
    orderContainer.classList.toggle('active');
    completedOrderContainer.classList.remove('active'); 
    inProgressButton.classList.toggle('active');
    completedButton.classList.remove('active');
});

completedButton.addEventListener('click', () => {
    completedOrderContainer.classList.toggle('active');
    orderContainer.classList.remove('active');
    completedButton.classList.toggle('active');
    inProgressButton.classList.remove('active');
});

data.forEach((order) => {
    const orderBox = document.createElement('div');
    orderBox.classList.add('order-box');
    orderBox.setAttribute('id', `order-box-${order.id}`);
    orderContainer.appendChild(orderBox);

    // 생성된 HTML 요소에 데이터를 적용
    orderBox.innerHTML = `
        <div class="order-info">
            <div class="order-user-info">
                <span class="order-time">${order.created_at}</span>
                <span class="phone-number">${order.phone_number}</span>
            </div>
            <div class="order-table-info">
                <span class="table-number">table ${order.table_num}</span>
                <span class="order-number">${order.id}</span>
            </div>
        </div>
    `;

    const foodInfoContainer = document.createElement('div');
    foodInfoContainer.classList.add('food-info-container');

    // 주문에 포함된 메뉴 정보를 추가
    order.menues.forEach(menu => {
        const foodInfo = document.createElement('div');
        foodInfo.classList.add('food-info');
        foodInfo.innerHTML = `
            <div class="menu-wrap">
                <span class="food-name">${menu.name}</span>
                <span class="food-quantity">${menu.quantity}</span>
            </div>
        `;
        foodInfoContainer.appendChild(foodInfo);
    });

    orderBox.appendChild(foodInfoContainer);

    const completeButtonWrap = document.createElement('div');
    completeButtonWrap.classList.add('complete-button-wrap');
    orderBox.appendChild(completeButtonWrap);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'finish';
    completeButton.classList.add('complete-button');
    
    // 진행 중인 주문이 맞으면 orderBox를 orderContainer에 추가
    if(order.status === 'in_progress') {
        completeButtonWrap.appendChild(completeButton);
        orderContainer.appendChild(orderBox);
    } else {
        completedOrderContainer.appendChild(orderBox);
    }

    // 완료 버튼 누르면 진행중인 주문 -> 완료 주문 
    completeButton.addEventListener('click', () => {
        const orderId = orderBox.getAttribute('id').split('-')[2];
        const orderBoxIdDiv = document.querySelector(`#order-box-${orderId}`);
        const now = new Date();

        completed_at[orderId] = now;

        // 주문 상태 변경하기 API 호출 
        const body = {
            state : "done"
        };

        fetch('/order/state/update/', { // 임시 URI
            method: 'POST',
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

        order.status = 'done'; // API 호출 시 삭제할 코드 (임시로 수동으로 바꿈)

        // 주문 상태 변경하기 API 호출 성공해서 status가 done으로 바뀌면 div 이동
        if (order.status === 'done' && orderId == order.id) {
            orderContainer.removeChild(orderBoxIdDiv);
            completeButtonWrap.removeChild(completeButton);
            completedOrderContainer.appendChild(orderBoxIdDiv);
        }

        // 생성 시간 정렬 => 가장 최근에 완료된 주문이 첫 번째로 보이게
        const sortedTime = Object.entries(completed_at)
            .sort((a, b) => new Date(b[1]) - new Date(a[1]));

        const sortedKeys = sortedTime.map(([key]) => parseInt(key));
        console.log(sortedKeys);

        // 정렬된 orderBox를 completedOrderContainer에 추가
        sortedKeys.forEach((orderId) => {
            const orderBox = document.getElementById(`order-box-${orderId}`);
            if (orderBox) {
                completedOrderContainer.appendChild(orderBox);
            }
        });


    });

    // 80분 경과 시 표시
    const isTimeOut = (datetime) => {
        // datetime: MM-DD HH:MM:SS 
        const now = new Date();
        const [, month, day, hour, minute] = datetime.match(/(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
        const year = now.getFullYear();
        const targetTime = new Date(`${year}-${month}-${day} ${hour}:${minute}`);
        const timeDiff = now - targetTime;
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // 80분 이상 경과했는지 여부 확인
        if (minutesDiff >= 80) {
            return true;
        } else {
            return false;
        }
    }
    
    const datetime = order.created_at;
    const isOut = isTimeOut(datetime);
    const orderId = orderBox.getAttribute('id').split('-')[2];
    const orderBoxIdDiv = document.querySelector(`#order-box-${orderId}`);
    
    if (isOut === true && orderId == order.id) {
        orderBoxIdDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    }
});

// orderContainer의 모든 orderBox 요소를 가져옴
const orderBoxes = Array.from(orderContainer.getElementsByClassName('order-box'));

// orderBox id 정렬 => 가장 오래된 주문이 첫 번째로 보이게
// id 순서 = 생성 시간 순서
orderBoxes.sort((a, b) => {
    const idA = parseInt(a.getAttribute('id').split('-')[2]);
    const idB = parseInt(b.getAttribute('id').split('-')[2]);
    return idA - idB;
});

// 정렬된 orderBox를 orderContainer에 추가
orderBoxes.forEach((orderBox) => {
    orderContainer.appendChild(orderBox);
});
