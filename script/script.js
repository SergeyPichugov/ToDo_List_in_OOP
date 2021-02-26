'use strict';

class Todo {
   constructor(form, input, todoList, todoCompleted, todoContainer) {
      this.form = document.querySelector(form);
      this.input = document.querySelector(input);
      this.todoList = document.querySelector(todoList);
      this.todoCompleted = document.querySelector(todoCompleted);
      this.todoContainer = document.querySelector(todoContainer);
      this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList'))); //
   }

   addToStorage(){
      localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
   }

   render() {
      this.todoList.textContent = '';
      this.todoCompleted.textContent = '';
      this.todoData.forEach(this.createItem, this);
      this.addToStorage();
      this.input.value = '';
   }

   createItem(todo) {
      const li = document.createElement('li');
      li.classList.add('todo-item');

      li.key = todo.key;

      li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
      `);

      if (todo.conpleted) {
         this.todoCompleted.append(li);
      } else {
         this.todoList.append(li);
      }
   }

   addTodo(e) {
      e.preventDefault();

      if (this.input.value.trim()){
         const newTodo = {
            value: this.input.value,
            conpleted: false,
            key: this.generareKey(),
         };
         this.todoData.set(newTodo.key, newTodo);
         
         this.render();
      } else {
         alert('Пустое дело добавить нельзя!');
         return;
      }
   }

   generareKey() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
   }

   deliteItem(target) {
      this.todoData.forEach((item, iKey) => {
         if (target.closest('.todo-item').key === item.key) {
            this.todoData.delete(iKey);
            this.render();
         }
      });
   }

   completedItem(target) {
      this.todoData.forEach((item)=> {
         if (target.closest('.todo-item').key === item.key){
            item.conpleted = !item.conpleted;
            this.render();
         }
      });
   }


   handler() {
      this.todoContainer.addEventListener('click', (e)=> {
         let target = event.target;
         if (target.matches('.todo-complete')){
            this.completedItem(target);
         } else if (target.matches('.todo-remove')) {
            this.deliteItem(target);
         }
      });
   }

   init() {
      this.form.addEventListener('submit', this.addTodo.bind(this));
      this.render();
      this.handler();
   }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();