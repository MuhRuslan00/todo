// находим эл на стр

const form = document.querySelector('#form');
//  console.log('form')

const taskinput = document.querySelector('#taskInput');
// console.log('taskinput');

const tasksList = document.querySelector('#tasksList')
// console.log('tasksList')
const emptyList = document.querySelector('#emptyList')
let tasks = [];

if(localStorage.getItem('tasks')) {
  
tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function(task) {
  rederTask(task)
})


checkEmptyList()

// добавление задачи
// ниже описание функции, здесь же вызов ее
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask)

// отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask)


// описание функции

function addTask(event) {
  // отменяем отправку формы
  event.preventDefault()
  // console.log('SUBMITT');

  // Достаем текст задачи из поля ввода

  const taskText = taskinput.value
  // console.log(taskText);
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  // Добавляем задачу в массив с задачами
  tasks.push(newTask)
  saveToLocalStorage();
  rederTask(newTask)
  // очищаем поле ввода и возвпащаем фокус на него
  taskinput.value = ''
  taskinput.focus()

  checkEmptyList()
}

function deleteTask(event) {
  // console.log(event.target);
  // проверякм чо клик был по  не по кнопке удалить задачу
  if (event.target.dataset.action !== 'delete') {
    return
  }
    const parentNode = event.target.closest('.list-group-item');
    // console.log(parenNode)

    // определяем id задачи
  const id = Number(parentNode.id)
  // находим индекс задачи в массиве
  const index = tasks.findIndex((task) => {
    return task.id === id;
  })

  // Удаляем задачу из массива с задачами
  tasks.splice(index, 1)

  saveToLocalStorage();

    parentNode.remove()
    checkEmptyList()
}
function doneTask(event) {
  // console.log('doneTask')
  // проверяем что клик был по не по кнопке "Задача выполнена"
  if (event.target.dataset.action !== 'done') {
    return
  }
    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id)
    const task = tasks.find(function(task) {
      if(task.id ===id) {
        return true
      }
    })

    task.done = !task.done

    saveToLocalStorage();

    console.log(task)
    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
    // console.log(taskTitle);
}

function checkEmptyList(){

  if(tasks.length === 0) {
const emptyListHTML = ` <li id="emptyList" class="list-group-item empty-list">
<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
<div class="empty-list__title">Список дел пуст</div>
</li> `;

tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList')
    emptyListEl ? emptyListEl.remove() : null;
  }

}
function saveToLocalStorage(){
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
function rederTask(task){
  const cssClass = task.done ? "task-title task-title--done" : "task-title"
  // формируем разметку для новой задачи

  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
    </div>
  </li>`;
  // console.log(taskHTML);
  // добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
