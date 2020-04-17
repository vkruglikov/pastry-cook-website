import {getStoreStateData} from "../dataProvider";

const initialState = getStoreStateData('user') || {};

export const USER_AUTH_DATA = 'USER_AUTH_DATA_ACTION';

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_AUTH_DATA:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

export default userReducer;