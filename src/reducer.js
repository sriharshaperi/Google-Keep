// initial object state
export const initialState = {
    user: null,
    view: "grid",
    mode: "light"
}

const reducer = (state, action) => {

    console.log(action);
    switch (action.type) {

        //action type
        case 'SET_USER':

            return {
                ...state, //previous state
                user: action.user //state with changes
            }

        case 'SET_VIEW':

            return {
                ...state,
                view: action.view
            }

        case 'SET_MODE':

            return {
                ...state,
                mode: action.mode
            }

        default:
            return state;
    }
}

export default reducer;