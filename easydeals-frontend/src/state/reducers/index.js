import { combineReducers } from "redux";
import { userR , authenticated,allDeals,chatData,chatList} from "./reducers";

const reducers = combineReducers({
    userR:userR,authenticated:authenticated,allDeals:allDeals,chatData:chatData,chatList:chatList
})

export default reducers;