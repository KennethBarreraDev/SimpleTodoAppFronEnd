import "../styles/login.css"
import { Urls } from "../utils/urls"
import { useState } from "react"
import { memo } from "react"
import { InputReducer } from "../hooks/LoginReducer"
import { useReducer, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../hooks/auth_context/UserContex"
import { jwtDecode } from "jwt-decode"


export const LoginForm = ({setAuth}) => {
    const url = memo(Urls.baseUrl)
    const element = useContext(UserContext)
    console.log(setAuth)



    useState(
        () => {
        },
        []
    )

    const [emailState, dipatchEmail] = useReducer(InputReducer, { value: "", error: false, message: "" })
    const [passwordState, dipatchPassword] = useReducer(InputReducer, { value: "", error: false, message: "" })
    const [loginError, loginErrorState] = useState(false)

    const navigate = useNavigate();

    const handleEmail = (event) => {
        const { value } = event.target

        const email = {
            type: "setError",
            payload: {
                error: false,
                message: ""
            }
        }

        dipatchEmail(email)
        loginErrorState(false)

        const action = {
            type: "setValue",
            payload: value
        }

        dipatchEmail(action)

        console.log(emailState)

    }
    const handlePassword = (event) => {
        const { value } = event.target

        const password = {
            type: "setError",
            payload: {
                error: false,
                message: ""
            }
        }

        dipatchPassword(password)
        loginErrorState(false)

        const action = {
            type: "setValue",
            payload: value
        }

        dipatchPassword(action)
        console.log(passwordState)


    }

    const handleLogin = async () => {

        if (!emailState.value) {
            const email = {
                type: "setError",
                payload: {
                    error: true,
                    message: "Email is required"
                }
            }

            dipatchEmail(email)

        }

        if (!passwordState.value) {

            const password = {
                type: "setError",
                payload: {
                    error: true,
                    message: "Password is required"
                }
            }

            dipatchPassword(password)
        }

        if (emailState.value && passwordState.value) {
            const response = await fetch(`${url.type}auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": emailState.value,
                    "password": passwordState.value
                })
            })
            const data = await response.json()
            console.log("Data is")
            console.log(data)

            if (response.status !== 200) {
                loginErrorState(true)
            }
            else {
                setAuth(true)
                console.log("Navegando")   
                localStorage.setItem("token", data.token)
                const decoded = jwtDecode(data.token);
                element.setUser({
                    name: decoded.firstName + " " + decoded.lastName,
                    email: decoded.email,
                    token: data.token
                })


                navigate("/todos");
            }
        }

    }


    return (
        <>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img src="./login.jpg" className="img-fluid" alt="" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <form>

                                <h1 className="mb-5">
                                    Welcome!
                                </h1>
                                <div data-mdb-input-init className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form1Example13">Email address</label>
                                    <input type="email" id="form1Example13" className="form-control form-control-lg" onChange={(event) => handleEmail(event)} required />
                                    {emailState.error ? <div className="error-message">{emailState.message}</div> : <span></span>}
                                </div>


                                <div data-mdb-input-init className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form1Example23">Password</label>
                                    <input type="password" id="form1Example23" className="form-control form-control-lg" onChange={(event) => handlePassword(event)} required />
                                    {passwordState.error ? <div className="error-message">{passwordState.message}</div> : <span></span>}
                                    {loginError ? <div className="error-message">{"Wrong credentials"}</div> : <span></span>}
                                </div>

                                <div className="d-flex justify-content-around align-items-center mb-4"></div>
                                <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block" onClick={(event) => handleLogin()}>Sign in</button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}