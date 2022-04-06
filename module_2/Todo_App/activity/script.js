
let addTodoButton = document.querySelector(".add-todo");
let inputTodo = document.querySelector(".todo-input-field");
let todoList = document.querySelector(".todo-list-container");

inputTodo.addEventListener("keypress",function(e){
    if(e.key == "Enter"){
        addTodo();
    }
});

addTodoButton.addEventListener("click",function(){
    // console.log("button clicked");
    addTodo();
    
});

function addTodo(){
    let inputTodoValue = inputTodo.value;
    if(inputTodoValue){
        // console.log(inputTodoValue);
        appendTodo(inputTodoValue);

        //it will empty the input field
        inputTodo.value = " ";   
    }
}

function appendTodo(todo){
    let todoItemDiv = document.createElement("div");
    todoItemDiv.classList.add("todo-item");
    //<div class="todo-item"></div>

    let pTag = document.createElement("p");
    pTag.classList.add("todo-input");
    pTag.textContent = todo;
    //<p class="todo-input">Learn Css</p>

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("todo-delete");
    deleteButton.textContent = "Delete";
    //<button class="todo-delete">Delete</button>

    deleteButton.addEventListener("click",deleteTodo);

    todoItemDiv.append(pTag);
    todoItemDiv.append(deleteButton);

    todoList.append(todoItemDiv);
    // <div class="todo-item">
    //         <p class="todo-input">Learn Css</p>
    //         <button class="todo-delete">Delete</button>
    // </div>
}

function deleteTodo(e){
    // console.log(e);
    e.target.parentNode.remove();
}
