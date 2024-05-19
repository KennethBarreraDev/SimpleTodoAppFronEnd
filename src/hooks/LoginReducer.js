export const InputReducer= (initialState, action)=>{
    switch (action.type) {
        case "setValue":
            return {
                error: initialState.error,
                message: initialState.message,
                value: action.payload
            }
        break;

        case "setError":
            return {
                value: initialState.value, 
                error: action.payload.error,
                message: action.payload.message
            }
        break;

        default:
            return initialState;
        break;
    }
}