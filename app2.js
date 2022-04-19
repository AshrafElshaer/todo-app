const switchTheme = document.querySelector('.switch');
const form = document.querySelector('form');
const newTodo = document.querySelector('.newTodo');
const todoList = document.querySelector('.todoList')
const coutnEl = document.querySelector('.count');
const statusBtns = document.querySelectorAll('.statusBtn');
const clearBtn = document.querySelector('#clear');

const localStorage = window.localStorage;
const todosArray = dataFromLocalStorage('todosArray') || [];
let count = dataFromLocalStorage('count') || 0;
let currentTodo;
let updatedTodo;

window.onload = function () {

    const todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {

        if (todo.dataset.completed === 'true') {
            const checkBox = todo.previousElementSibling;
            todo.classList.add('done')
            checkBox.classList.add('checked');
        }
    })
};

showCase();

function dataFromLocalStorage(el) {
    let data = localStorage.getItem(el)
    let todos = JSON.parse(data);
    return todos
}

function showCase() {
    if (!todosArray) return;
    todosArray.map(todo => showNewTodo(todo, todoList));
    coutnEl.textContent = `${count} items left`;
}

function upadateLocalStorage() {
    localStorage.setItem('todosArray', JSON.stringify(todosArray));
    localStorage.setItem('count', JSON.stringify(count));
}

function findIndexTodo(todoContent, todosArray) {
    let findTodo = todosArray.find(todo => todo.text === todoContent);
    let index = todosArray.indexOf(findTodo);
    return index;
}

function updateTodo(currentTodo, updatedTodo) {

    let findTodo = findIndexTodo(currentTodo, todosArray);
    todosArray.at(findTodo).text = updatedTodo;
    upadateLocalStorage()

}

function UpdateCount(number) {
    count = count + number;
    coutnEl.textContent = `${count} items left`;
    upadateLocalStorage();
};


function theme() {
    const body = document.querySelector('body');
    const img = switchTheme.childNodes[0];

    if (body.className === 'dark-theme') {
        body.className = 'light-theme';
        img.src = 'images/icon-moon.svg'
    } else {
        body.className = 'dark-theme';
        img.src = 'images/icon-sun.svg'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    createNewTodo(newTodo.value, todosArray);
    newTodo.value = '';

})

function createNewTodo(newTodo, todosArray) {

    if (!newTodo) return;
    const todo = {
        text: newTodo,
        completed: false
    }
    todosArray.push(todo);
    upadateLocalStorage()
    UpdateCount(+1)
    showNewTodo(todo, todoList);


}

function showNewTodo(todo, todoList) {

    todoList.innerHTML += ` <li class="todoItem draggable" draggable="true"><input type="radio" name="checkBox" class="unchecked" id="checkBox">
    <input type="text" name="todo" class="todo" value="${todo.text}" data-completed="${todo.completed}" readonly>
    <i class="fa-solid fa-pen btn edit" id="edit"></i>
    <i class="fa-solid fa-xmark btn" id="delete"></i></li>`;

}




function deleteTodo(e) {
    const element = e.target;

    if (element.id === 'delete') {
        const todo = element.previousElementSibling.previousElementSibling;
        const todoIndex = findIndexTodo(todo.value, todosArray)
        todosArray.splice(todoIndex, 1);
        upadateLocalStorage()
        element.parentElement.remove();
        if (todo.dataset.completed === 'false') {
            UpdateCount(-1);
        }
    }
}


function editTodo(e) {
    const element = e.target;

    if (element.classList.contains('edit')) {


        const todo = element.previousElementSibling;

        if (todo.dataset.completed === 'true') return

        if (element.classList.contains('fa-pen')) {

            element.classList.replace('fa-pen', 'fa-check');
            currentTodo = todo.value;
            todo.removeAttribute('readonly')
            todo.focus();

        } else if (element.classList.contains('fa-check')) {

            element.classList.replace('fa-check', 'fa-pen');
            updatedTodo = todo.value;
            todo.blur();
            todo.setAttribute('readonly', 'readonly');
            updateTodo(currentTodo, updatedTodo);
            currentTodo = null;
            updatedTodo = null;
        }
    }
}






function checkBox(e) {
    const element = e.target;
    if (element.id === 'checkBox') {
        const todo = element.nextElementSibling;
        const index = findIndexTodo(todo.value, todosArray);

        if (element.classList.contains('unchecked')) {

            element.classList.replace('unchecked', 'checked');
            todo.classList.add('done');
            todo.dataset.completed = true;
            todosArray.at(index).completed = todo.dataset.completed;
            UpdateCount(-1)
            upadateLocalStorage()
        } else if (element.classList.contains('checked')) {
            element.classList.replace('checked', 'unchecked');
            todo.classList.remove('done');
            todo.dataset.completed = false;
            todosArray.at(index).completed = todo.dataset.completed;
            UpdateCount(+1)
            upadateLocalStorage()
        }



    }
}

function clearCompleted() {

    const todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {
        if (todo.dataset.completed === 'true') {
            const todoIndex = findIndexTodo(todo.value, todosArray)
            todosArray.splice(todoIndex, 1);
            upadateLocalStorage()
            todo.parentElement.remove();
        }
    })

}





statusBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        statusBtns.forEach(el => el.classList.remove('selected'))
        btn.classList.add('selected');

        const todo = document.querySelectorAll('.todo');
        const todoItem = document.querySelectorAll('.todoItem');

        if (btn.id === 'all') {
            todoItem.forEach(item => item.style.display = 'flex');
        }

        if (btn.id === 'active') {
            todo.forEach(el => {
                if (el.dataset.completed === 'true') {
                    el.parentElement.style.display = 'none';
                }
                if (el.dataset.completed === 'false') {
                    el.parentElement.style.display = 'flex';
                }
            })
        }

        if (btn.id === 'completed') {
            todo.forEach(el => {
                if (el.dataset.completed === 'false') {
                    el.parentElement.style.display = 'none';
                }
                if (el.dataset.completed === 'true') {
                    el.parentElement.style.display = 'flex';
                }
            })
        }
    })
})
todoList.addEventListener('click', deleteTodo);
todoList.addEventListener('click', editTodo);
todoList.addEventListener('click', checkBox);
clearBtn.addEventListener('click', clearCompleted)
switchTheme.addEventListener('click', theme);
