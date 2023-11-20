async function getTodo(){
  todosContainer.innerHTML = ""
  const res = await fetch('/api/todos')
  const data = await res.json()
  data.forEach((item)=>{
    createTodo(item.name,item.content,item.id)
  })
}
let selectedId;

async function saveTodo(name,content){
  try{
    const res = await fetch('/api/todos',{
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name:name,content:content})
    })
    const data = await res.json();
    createTodo(data.name, data.content, data.id)
  } catch (err){
    console.log(err)
  }

}

const todoName = document.querySelector("#todo-name")
const todoContent = document.querySelector("#todo-content")
const addTodoBtn = document.querySelector("#add-todo-btn")
const todosContainer = document.querySelector("#todos-container")

addTodoBtn.addEventListener("click",()=>{
  if (addTodoBtn.textContent === "Update Todo"){
    editTodo()
  }else{
    saveTodo(todoName.value,todoContent.value)
  }
})


async function editTodo(){
  const response = await fetch(`/api/todos/${selectedId}`,{
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({name:todoName.value,content:todoContent.value})
  })
  const data = await response.json()
  getTodo()
  addTodoBtn.textContent = "Add New Todo"
  selectedId = null;
  todoName.value = ""
  todoContent.value = ""
}

function createTodo(name,content,id){

  const todo = document.createElement("div")
  todo.classList.add("todo")
  todo.dataset.id = id
  const todoContent = document.createElement("div")
  todoContent.innerHTML = `<p>Name:${name}</p>
                    <p>Content:${content}</p>`
  const deleteBtn = document.createElement("button")
  deleteBtn.textContent ="X"
  deleteBtn.dataset.id = id
  deleteBtn.addEventListener("click",()=>{
    deleteTodo(deleteBtn.dataset.id)
  })
  todo.appendChild(todoContent)
  todo.appendChild(deleteBtn)
  todoContent.addEventListener("click",()=>{
    viewTodo(todo.dataset.id)
  })
  todosContainer.appendChild(todo)
}

async function deleteTodo(id){
  Array.from(todosContainer.children).forEach((todo)=>{
    if(todo.dataset.id === id){
      todosContainer.removeChild(todo)
    }
  })
  await fetch(`/api/todos/${id}`, {
    method:"DELETE"
  })

}

async function viewTodo(id){
  const res = await fetch(`/api/todos/${id}`)
  const data = await res.json()
  todoName.value = data.name
  todoContent.value = data.content
  selectedId = id
  addTodoBtn.textContent = "Update Todo"
}
getTodo()

