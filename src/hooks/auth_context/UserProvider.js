import { useState } from "react"
import { UserContext } from "./UserContex"

const userDefault = {
    name: "",
    email: "",
    token: ""
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(userDefault);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}