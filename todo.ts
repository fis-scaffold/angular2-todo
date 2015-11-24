/// <reference path="./components/angular2/typings/es6-shim/es6-shim.d.ts" />
/// <reference path="./components/angular2/typings/angular2/angular2.d.ts" />
import {Component, bootstrap, Inject, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import {TodoStore} from './deps/services/TodoStore';

@Component({
    selector: 'todo-app',
    templateUrl: __uri('todo.html'),
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    providers: [TodoStore]
})
class TodoApp {
    todoStore: TodoStore;
    todoEdit: any;
    todos: Array;

    constructor( @Inject(TodoStore) store: TodoStore) {
        this.todoStore = store;
        this.todoEdit = null;
        this.todos = store.list;
    }
    enterTodo($event, newTodo) {
        if ($event.which === 13) { // ENTER_KEY
            this.addTodo(newTodo.value);
            newTodo.value = '';
        }
    }
    editTodo($event, todo) {
        this.todoEdit = todo;
    }
    doneEditing($event, todo) {
        var which = $event.which;
        var target = $event.target;
        if (which === 13) {
            todo.title = target.value;
            this.todoStore.save(todo);
            this.todoEdit = null;
        } else if (which === 27) {
            this.todoEdit = null;
            target.value = todo.title;
        }
    }
    addTodo(newTitle) {
        this.todoStore.add({
            title: newTitle,
            completed: false
        });
    }
    completeMe(todo) {
        todo.completed = !todo.completed;
        this.todoStore.save(todo);
    }
    deleteMe(todo) {
        this.todoStore.remove(todo);
    }
    toggleAll($event) {
        var isComplete = $event.target.checked;
        this.todoStore.list.forEach(function(todo) {
            todo.completed = isComplete;
            this.todoStore.save(todo);
        }.bind(this));
    }
    clearCompleted() {
        [].concat(this.todoStore.list).forEach((todo) => {
            if (todo.completed) {
                this.deleteMe(todo);
            }
        });
    }

}

export function run() {
  bootstrap(TodoApp);
}
