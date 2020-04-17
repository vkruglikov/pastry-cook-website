import {getStoreStateData} from "../dataProvider";

const initialState = getStoreStateData('authors') || {};

const userReducer = (state = initialState) => {
    return state;
}

export default userReducer;