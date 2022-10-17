import * as actionType from './actionTypes'; // Import all action types as name (actionTypes) or any name

const initalState = {
    login: {},
    register: {},
    errors: [],
    loading: '',
    me: {}
};

const reducer = (state = initalState, action) => {
    switch(action.type) {
        case actionType.LOADING:
        return {
            ...state,
            loading: action.loading
        };

        case actionType.REGISTER:
        return {
            ...state,
            register: action.register,
            errors: action.errors
        };

        case actionType.LOGIN:
        return {
            ...state,
            login: action.login,
            errors: action.errors
        };

        case actionType.ME:
        return {
            ...state,
            me: action.me,
        };

        default:
        return state;
    }
}

export { reducer };