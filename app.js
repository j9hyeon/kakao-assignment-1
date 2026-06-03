// ==========================================
// 1. DOM 요소 선택
// ==========================================
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const validationMsg = document.getElementById('validation-msg');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn'); 

const weeklyGrid = document.getElementById('weekly-grid');
const monthDisplay = document.getElementById('current-month-display');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

// ==========================================
// 2. 상태(State) 관리 변수
// ==========================================
let todos = [];
let currentId = 0;
let currentFilter = 'all'; 

// ✨ 수정: 두 가지의 날짜 상태를 각각 분리해서 관리합니다.
// 1. 실제로 사용자가 클릭해서 선택된 날짜 (Todo를 저장하고 필터링하는 기준)
let selectedDateObj = new Date(); 
// 2. 현재 화면에 표시되고 있는 주(Week)를 기억하는 날짜 (달력을 좌우로 넘길 때 사용)
let currentViewWeekObj = new Date(); 

function initData() {
    const storedData = localStorage.getItem('saved_todos');
    if (storedData) {
        todos = JSON.parse(storedData);
        if (todos.length > 0) {
            const maxId = Math.max(...todos.map(todo => todo.id));
            currentId = maxId + 1;
        }
    }
}

function saveTodos() {
    localStorage.setItem('saved_todos', JSON.stringify(todos));
}

// ==========================================
// 3. ✨ 날짜 및 주간 그리드 관련 유틸리티/동작 함수
// ==========================================
function getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * [추가] 특정 날짜가 속한 주의 '월요일'을 찾아 반환하는 함수
 */
function getMonday(dateObj) {
    const result = new Date(dateObj);
    const day = result.getDay(); // 0(일요일) ~ 6(토요일)
    
    // 만약 일요일(0)이면 월요일로 가기 위해 6일을 빼고, 그 외 요일은 (현재 요일 - 1)만큼 뺍니다.
    const diff = result.getDate() - day + (day === 0 ? -6 : 1);
    result.setDate(diff);
    return result;
}

/**
 * ✨ 수정: 월요일부터 일요일까지 가로로 나열하고, 데이터 개수와 오늘 날짜를 표시하는 함수
 */
function renderWeeklyGrid() {
    weeklyGrid.innerHTML = ''; 
    // 월요일 시작이므로 월~일 배열로 변경
    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
    
    // 현재 보고 있는 주(Week)의 '월요일'을 가져옵니다.
    const startOfWeek = getMonday(currentViewWeekObj);

    // 상단 타이틀을 해당 월요일이 속한 연도와 월로 업데이트합니다.
    monthDisplay.textContent = `${startOfWeek.getFullYear()}년 ${startOfWeek.getMonth() + 1}월`;

    // 시스템의 '진짜 오늘 날짜'와, 사용자가 '선택한 날짜'를 문자열로 미리 뽑아둡니다.
    const todayStr = getFormattedDate(new Date());
    const selectedStr = getFormattedDate(selectedDateObj);

    // 월요일부터 시작해 7번 반복하여 일요일까지 버튼을 만듭니다.
    for (let i = 0; i < 7; i++) {
        const iterDate = new Date(startOfWeek);
        iterDate.setDate(startOfWeek.getDate() + i);
        const iterDateStr = getFormattedDate(iterDate);

        const dayBtn = document.createElement('button');
        dayBtn.className = 'day-btn';
        
        // 1. '진짜 오늘'인 경우 테두리 등을 강조하는 today 클래스 추가
        if (iterDateStr === todayStr) {
            dayBtn.classList.add('today');
        }

        // 2. 사용자가 클릭해서 '선택된 날짜'인 경우 보라색으로 칠하는 active 클래스 추가
        if (iterDateStr === selectedStr) {
            dayBtn.classList.add('active');
        }

        const dayName = document.createElement('span');
        dayName.className = 'day-name';
        dayName.textContent = daysOfWeek[i];

        const dayNum = document.createElement('span');
        dayNum.className = 'day-number';
        dayNum.textContent = iterDate.getDate();

        // 3. ✨ 해당 날짜에 저장된 Todo가 총 몇 개인지 배열을 필터링해 개수(length)를 구합니다.
        const todoCount = todos.filter(todo => todo.date === iterDateStr).length;
        
        const countBadge = document.createElement('div');
        countBadge.className = 'todo-count-badge';
        // Todo가 0개라도 깔끔하게 '0'으로 표시합니다.
        countBadge.textContent = todoCount;

        dayBtn.appendChild(dayName);
        dayBtn.appendChild(dayNum);
        dayBtn.appendChild(countBadge); // 배지를 하단에 추가

        // 요일 버튼 클릭 시 동작
        dayBtn.onclick = () => {
            selectedDateObj = new Date(iterDate); // 선택된 날짜 업데이트
            renderTodos();                        // 해당 날짜의 할 일 목록 갱신
            renderWeeklyGrid();                   // 활성화(보라색) 위치 옮기기
        };

        weeklyGrid.appendChild(dayBtn);
    }
}

/**
 * ✨ 수정: 버튼을 눌러 이전 주 / 다음 주로 이동하는 함수 (7일 단위 이동)
 */
function changeWeek(weeks) {
    // 1주(weeks) = 7일 이므로, weeks * 7을 더하거나 뺍니다.
    currentViewWeekObj.setDate(currentViewWeekObj.getDate() + (weeks * 7));
    renderWeeklyGrid();
}


// ==========================================
// 4. 핵심 기능 함수들 (CRUD)
// ==========================================
function handleAddTodo() {
    const textValue = todoInput.value.trim();

    if (textValue === '') {
        validationMsg.classList.remove('hidden');
        todoInput.focus();
        return;
    }
    validationMsg.classList.add('hidden');

    const newTodo = {
        id: currentId++,
        text: textValue,
        isCompleted: false,
        date: getFormattedDate(selectedDateObj) // 생성 시 현재 '선택된 날짜'를 저장
    };

    todos.push(newTodo);
    saveTodos(); 
    todoInput.value = '';
    
    // ✨ 데이터 개수가 변했으므로 그리드(숫자 배지)와 리스트를 모두 다시 그립니다.
    renderWeeklyGrid(); 
    renderTodos();
}

function toggleTodoCompletion(id) {
    todos = todos.map(todo => {
        if (todo.id === id) return { ...todo, isCompleted: !todo.isCompleted };
        return todo;
    });
    saveTodos();
    renderTodos();
}

function editTodoText(id) {
    const targetTodo = todos.find(todo => todo.id === id);
    if (!targetTodo) return;

    const newText = prompt('할 일을 수정해주세요:', targetTodo.text);
    if (newText !== null && newText.trim() !== '') {
        todos = todos.map(todo => {
            if (todo.id === id) return { ...todo, text: newText.trim() };
            return todo;
        });
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    
    // ✨ 데이터 개수가 변했으므로 그리드(숫자 배지)와 리스트를 모두 다시 그립니다.
    renderWeeklyGrid();
    renderTodos();
}

// ==========================================
// 5. 화면 렌더링 & 필터 함수
// ==========================================
function handleFilterChange(e) {
    document.querySelector('.filter-btn.active').classList.remove('active');
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    const selectedDateString = getFormattedDate(selectedDateObj);

    const filteredTodos = todos.filter(todo => {
        if (todo.date !== selectedDateString) return false;
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true; 
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.className = `todo-text ${todo.isCompleted ? 'completed' : ''}`;
        span.textContent = todo.text; 

        const btnGroup = document.createElement('div');
        btnGroup.className = 'button-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
        completeBtn.onclick = () => toggleTodoCompletion(todo.id);

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.onclick = () => editTodoText(todo.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);

        todoList.appendChild(li);
    });
}

// ==========================================
// 6. 초기화 및 이벤트 리스너 등록
// ==========================================
initData(); 
renderWeeklyGrid(); 
renderTodos(); 

// ✨ 수정: 주 단위로 이동하기 위해 -1주, +1주씩 함수로 넘깁니다.
prevWeekBtn.addEventListener('click', () => changeWeek(-1));
nextWeekBtn.addEventListener('click', () => changeWeek(1));

addBtn.addEventListener('click', handleAddTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterChange);
});