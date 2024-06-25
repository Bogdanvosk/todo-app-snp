import './styles/main.scss'

const todoItems = document.querySelector('.todo__items')
const todoInput = document.querySelector('.todo__input input')

const todos = window.localStorage.getItem('todos')
	? JSON.parse(window.localStorage.getItem('todos'))
	: []

// Рендер отдельной задачи
const renderTodo = todo => {
	const todoItem = `
			<div class="todo__item ${todo.completed ? 'completed' : ''}" data-id="${
		todo.id
	}">
				<p class="todo__text">${todo.text}</p>
				<span class="todo__delete"></span>
			</div>
		`
	todoItems.insertAdjacentHTML('afterbegin', todoItem)
}

// Рендер всех задач
const renderTodos = todos => {
	todoItems.innerHTML = ''

	todos &&
		todos.forEach(todo => {
			renderTodo(todo)
		})
}

renderTodos(todos)

todoInput.addEventListener('keypress', e => {
	const value = e.target.value.trim()

	if (e.key === 'Enter') {
		if (value) {
			const todo = { id: Date.now(), text: value, completed: false }
			todos.push(todo)

			todoInput.value = ''
			renderTodo(todo)

			window.localStorage.setItem('todos', JSON.stringify(todos))
		}
	}
})

todoItems.addEventListener('click', e => {
	const target = e.target.closest('.todo__item')

	// При клике на кнопку "удалить задачу"
	if (e.target.classList.contains('todo__delete')) {
		const id = target.dataset.id
		
		todos.splice(
			todos.findIndex(t => t.id == id),
			1
		)
		target.removeChild(e.target)
		window.localStorage.setItem('todos', JSON.stringify(todos))

		renderTodos(todos)

		return
	}

	// При клике на задачу обновляем ее статус
	const id = target.dataset.id
	const todo = todos.find(t => t.id == id)
	const todoEl = todoItems.querySelector(`.todo__item[data-id="${id}"]`)

	todos.filter(t => t.id == id)[0].completed = !todo.completed
	todoEl.classList.toggle('completed')

	window.localStorage.setItem('todos', JSON.stringify(todos))
})
