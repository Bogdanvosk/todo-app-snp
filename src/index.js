import './styles/main.scss'

const todoItems = document.querySelector('.todo__items')
const todoInput = document.querySelector('.todo__input input')
const filterButtons = document.querySelector('.todo__filter')
const todoCounter = document.querySelector('.todo__count')
const clearTodosButton = document.querySelector('.todo__clear')
const selectAllButton = document.querySelector('.todo__select-all')

let todos = window.localStorage.getItem('todos')
	? JSON.parse(window.localStorage.getItem('todos'))
	: []

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
	const completedTodosLength = todos.filter(t => !t.completed).length

	todoCounter.textContent = completedTodosLength + ' items left'
}

// Рендер всех задач
const renderTodos = todos => {
	todoItems.innerHTML = ''

	todos &&
		todos.forEach(todo => {
			renderTodo(todo)
		})

	updateTodoCounter()
}

renderTodos(todos)

const addTodo = value => {
	const todo = { id: Date.now(), text: value, completed: false }
	todos.push(todo)
	todoInput.value = ''
}

const onTodoInputKeyPress = e => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const value = e.target.value.trim()

	if (e.key === 'Enter') {
		if (value) {
			addTodo(value)

			window.localStorage.setItem('todos', JSON.stringify(todos))
		}

		renderFilteredTodos(filterBtnActive)
	}
}

todoInput.addEventListener('keypress', onTodoInputKeyPress)

todoInput.addEventListener('blur', () => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const newValue = todoInput.value.trim()

	if (newValue) {
		addTodo(newValue)
		renderFilteredTodos(filterBtnActive)

		window.localStorage.setItem('todos', JSON.stringify(todos))
	}
})

const renderFilteredTodos = target => {
	switch (target.dataset.filter) {
		case 'active':
			renderTodos(todos.filter(t => !t.completed))
			break
		case 'completed':
			renderTodos(todos.filter(t => t.completed))
			break
		default:
			renderTodos(todos)
			break
	}
}

const onTodoItemsClick = e => {
	const target = e.target.closest('.todo__item')

	// При клике на кнопку "крестик" удаляем задачу
	if (e.target.classList.contains('todo__delete')) {
		const id = target.dataset.id

		todos.splice(
			todos.findIndex(t => t.id == id),
			1
		)
		target.removeChild(e.target)
		window.localStorage.setItem('todos', JSON.stringify(todos))

		const filterBtnActive = filterButtons.querySelector('.active')
		renderFilteredTodos(filterBtnActive)
	}

	// При клике на задачу обновляем ее статус
	if (e.target.classList.contains('todo__check')) {
		const id = target.closest('.todo__item').dataset.id
		const todo = todos.find(t => t.id == id)
		const todoEl = todoItems.querySelector(`.todo__item[data-id="${id}"]`)
		const filterBtnActive = filterButtons.querySelector('.active')

		todos.filter(t => t.id == id)[0].completed = !todo.completed
		todoEl.classList.toggle('completed')

		renderFilteredTodos(filterBtnActive)

		window.localStorage.setItem('todos', JSON.stringify(todos))
	}
}

todoItems.addEventListener('click', onTodoItemsClick)

// Изменение текста задачи
const changeInput = (target, todoItem, reset = false) => {
	const newValue = target.value.trim()
	const id = todoItem.dataset.id

	if (!newValue) return

	target.classList.remove('visible')

	if (reset) {
		return (target.value = todos.find(t => t.id == id).text)
	}

	todos.find(t => t.id == id).text = newValue

	window.localStorage.setItem('todos', JSON.stringify(todos))

	renderTodos(todos)
}

const onTodoItemsDblClick = e => {
	const todoItem = e.target.closest('.todo__item')
	if (!todoItem) return

	const changeInputEl = todoItem.querySelector('.todo__change')

	changeInputEl.classList.add('visible')
	// todoItem.classList.add('hidden')
	setTimeout(() => {
		changeInputEl.focus()
	}, 100)

	changeInputEl.addEventListener('keyup', e => {
		if (e.key === 'Enter') {
			changeInput(changeInputEl, todoItem)
		}

		if (e.key === 'Escape') {
			changeInput(changeInputEl, todoItem, true)
		}
	})

	changeInputEl.addEventListener('blur', () => {
		changeInput(changeInputEl, todoItem)
	})
}

todoItems.addEventListener('dblclick', onTodoItemsDblClick)

const onFilterButtonsClick = e => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const target = e.target.closest('.todo__filter-item')

	if (!target) return

	filterBtnActive.classList.remove('active')
	target.classList.add('active')

	renderFilteredTodos(target)
}

filterButtons.addEventListener('click', onFilterButtonsClick)

const onClearTodosClick = () => {
	const filterBtnActive = filterButtons.querySelector('.active')

	todos = todos.filter(t => !t.completed)
	renderFilteredTodos(filterBtnActive)

	window.localStorage.setItem('todos', JSON.stringify(todos))
}

clearTodosButton.addEventListener('click', onClearTodosClick)

const onSelectAllClick = () => {
	const filterBtnActive = filterButtons.querySelector('.active')
	const isAllCompleted = todos.every(t => t.completed)

	if (isAllCompleted) todos.map(t => (t.completed = false))
	else todos.map(t => (t.completed = true))

	renderFilteredTodos(filterBtnActive)
}

selectAllButton.addEventListener('click', onSelectAllClick)
