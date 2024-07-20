import './styles/main.scss'

const todoItems = document.querySelector('.todo__items')
const todoInput = document.querySelector('.todo__input input')
const filterButtons = document.querySelector('.todo__filter')
const todoCounter = document.querySelector('.todo__count')
const clearTodosButton = document.querySelector('.todo__clear')
const selectAllButton = document.querySelector('.todo__select-all')

let todos = JSON.parse(window.localStorage.getItem('todos')) || []

// Рендер отдельной задачи
const renderTodo = todo => {
	const todoItem = `
			<div class="todo__item ${todo.completed ? 'completed' : ''}" data-id="${
		todo.id
	}">
				<span class="todo__check"></span>
				<p class="todo__text">${todo.text}</p>
				<input class="todo__change hidden" type="text" value="${todo.text}"/>
				<button class="todo__delete"></button>
			</div>
		`
	todoItems.insertAdjacentHTML('afterbegin', todoItem)
}

const updateTodoCounter = () => {
	const completedTodos = todos.filter(t => !t.completed).length

	todoCounter.textContent = `${completedTodos} items left`
}

// Рендер всех задач
const renderTodos = (todoList = todos) => {
	todoItems.innerHTML = ''

	todoList.forEach(todo => {
		renderTodo(todo)
	})

	updateTodoCounter()
}

renderTodos()

const updateLocalStorage = () => {
	window.localStorage.setItem('todos', JSON.stringify(todos))
}

const addTodo = value => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const newTodo = { id: Date.now(), text: value, completed: false }
	todos.push(newTodo)
	todoInput.value = ''

	updateLocalStorage()
	renderFilteredTodos(filterBtnActive.dataset.filter)
}

const handleChangeInput = e => {
	const newValue = e.target.value.trim()

	if (newValue && (e.type === 'blur' || e.key === 'Enter')) addTodo(newValue)
}

todoInput.addEventListener('keypress', handleChangeInput)
todoInput.addEventListener('blur', handleChangeInput)

const renderFilteredTodos = filter => {
	if (filter == 'active') renderTodos(todos.filter(t => !t.completed))
	else if (filter == 'completed') renderTodos(todos.filter(t => t.completed))
	else renderTodos()
}

const deleteTodo = id => {
	const filterBtnActive = filterButtons.querySelector('.active')
	todos = todos.filter(t => t.id != id)

	updateLocalStorage()
	renderFilteredTodos(filterBtnActive.dataset.filter)
}

const checkTodo = id => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const todo = todos.find(t => t.id == id)

	if (todo) todo.completed = !todo.completed

	updateLocalStorage()
	renderFilteredTodos(filterBtnActive.dataset.filter)
}

const handleTodoItemsClick = e => {
	const target = e.target.closest('.todo__item')
	const id = target && target.dataset.id

	// При клике на кнопку "крестик" удаляем задачу
	if (e.target.classList.contains('todo__delete')) deleteTodo(id)

	// При клике на задачу обновляем ее статус
	if (e.target.classList.contains('todo__check')) checkTodo(id)
}

todoItems.addEventListener('click', handleTodoItemsClick)

const changeTodoText = (target, todoItem, reset = false) => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const newValue = target.value.trim()

	const id = todoItem.dataset.id
	const editableTodo = todos.find(todo => todo.id == id)

	if (reset) target.value = editableTodo.text

	if (newValue) editableTodo.text = newValue
	else deleteTodo(id)

	target.classList.remove('visible')
	updateLocalStorage()
	renderFilteredTodos(filterBtnActive.dataset.filter)
}

const handleDblClickTodoItems = e => {
	const todoItem = e.target.closest('.todo__item')
	if (!todoItem) return

	const changeInputEl = todoItem.querySelector('.todo__change')

	changeInputEl.classList.add('visible')
	changeInputEl.focus()

	changeInputEl.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			changeTodoText(changeInputEl, todoItem)
		}

		if (e.key === 'Escape') {
			changeTodoText(changeInputEl, todoItem, true)
			changeInputEl.blur()
		}
	})

	changeInputEl.addEventListener('blur', () => {
		changeTodoText(changeInputEl, todoItem)
	})
}

todoItems.addEventListener('dblclick', handleDblClickTodoItems)

const handleChangeFilter = e => {
	const prevFilter = filterButtons.querySelector('.active')
	const newFilter = e.target.closest('.todo__filter-item')

	if (newFilter) {
		prevFilter.classList.remove('active')
		newFilter.classList.add('active')

		renderFilteredTodos(newFilter.dataset.filter)
	}
}

filterButtons.addEventListener('click', handleChangeFilter)

const handleClickClearCompletedTodos = () => {
	const filterBtnActive = filterButtons.querySelector('.active')

	todos = todos.filter(t => !t.completed)

	updateLocalStorage()
	renderFilteredTodos(filterBtnActive.dataset.filter)
}

clearTodosButton.addEventListener('click', handleClickClearCompletedTodos)

const handleClickSelectAll = () => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const isAllCompleted = todos.every(t => t.completed)

	todos.forEach(todo => (todo.completed = !isAllCompleted))

	renderFilteredTodos(filterBtnActive.dataset.filter)
	updateLocalStorage()
}

selectAllButton.addEventListener('click', handleClickSelectAll)
