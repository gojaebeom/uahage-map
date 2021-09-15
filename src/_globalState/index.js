import {combineReducers} from "redux";
import {userLocation} from "./modules/userLocation";

const mainReducer = combineReducers({
    userLocation
});
export default mainReducer;