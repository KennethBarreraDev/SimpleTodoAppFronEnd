import { UserContext } from "../hooks/auth_context/UserContex"
import { useContext, useEffect, useState } from "react"
import { memo } from "react"
import { Urls } from "../utils/urls"
import Swal from 'sweetalert2'

export const TodoList = () => {

    const [todo, todoState] = useState('')
    const element = useContext(UserContext)
    const [todos, setTodos] = useState([])
    const url = memo(Urls.baseUrl)

    const toastMixin = memo(
        Swal.mixin({
            toast: true,
            title: 'General Title',
            animation: false,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
    )

    const handleInputChange = (event) => {
        const { value } = event.target
        todoState(value)
    }

    const handleAddTodo = async () => {

        if (!todo) {
            toastMixin.type.fire({
                animation: true,
                title: 'Insert content in todo',
                icon: 'error',
            });
        } else {
            const token = "Bearer " + element.user.token
            console.log(token)

            const response = await fetch(`${url.type}todos/createTodo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    "title": todo,
                    "content": "a"
                })
            })

            if (response.status != 200) {
                toastMixin.type.fire({
                    animation: true,
                    title: 'Signed in Successfully',
                    icon: 'error',
                });
            }
            else {
                const data = await response.json()
                console.log(data)
                setTodos([...todos, {
                    "id": data.id,
                    "title": data.title,
                    "content": data.content,
                    "createdAt": data.createdAt,
                    "updatedAt": data.updatedAt,
                    "UserId": data.UserId
                }])
                toastMixin.type.fire({
                    animation: true,
                    title: 'Todo created Successfully',
                    icon: 'success',
                });
            }
        }
    }


    const getTodos = async () => {
        const token = "Bearer " + element.user.token

        const response = await fetch(`${url.type}todos/list/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        })



        if (response.status !== 200) {

        }
        else {
            const data = await response.json()
            setTodos(data.data)
        }
    }


    const handleDelete = async (id) => {
        const token = "Bearer " + element.user.token

        const response = await fetch(`${url.type}todos/todo/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        })

        if (response.status != 200) {
            toastMixin.type.fire({
                animation: true,
                title: 'Error deleting todo',
                icon: 'error',
            });
        }
        else {
            const currentTodos = todos.filter((item) => item.id != id)
            setTodos([...currentTodos])
            toastMixin.type.fire({
                animation: true,
                title: 'Todo deleted successfully',
                icon: 'success',
            });
        }
    }

    useEffect(() => {
        getTodos()
    }, [])



    return (
        <>

            <div data-mdb-input-init className="form-outline mb-4 ps-3 pe-3">
                <label className="form-label" htmlFor="form1Example13">Insert todo</label>
                <input type="email" id="form1Example13" className="form-control form-control-lg mb-3" onChange={(event) => handleInputChange(event)} required />
                <button type="button" className="btn btn-primary" onClick={(event) => handleAddTodo(event)}>Add todo</button>
            </div>
            <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: "70vw" }}>
                    {todos ? todos.map((element) => (
                        <div className="card mt-3" key={element.id}>
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <span>{element.title}</span>

                                <div>
                                    <button className="btn btn-primary me-1" onClick={() => handleDelete(element.id)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(element.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )) : <span></span>}
                </div>
            </div>
        </>
    )
}