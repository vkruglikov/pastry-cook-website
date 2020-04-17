import {getStoreStateData} from "../dataProvider";

const initialState = getStoreStateData('public') || {};

const userReducer = (state = initialState) => {
    return state;
}

export default userReducer;