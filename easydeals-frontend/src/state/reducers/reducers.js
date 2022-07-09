export const userR=(state="",action)=>{
    if(action.type === "changeUserdata"){
        if(action.payload !== undefined)
        return action.payload;
        else
        return state;
    }
    else{
        return state;
    }
}
export const authenticated=(state=false,action)=>{
    if(action.type === "changeAuthenticated"){
        if(action.payload !== undefined)
        return action.payload;
        else
        return state;
    }
    else{
        return state;
    }
}
export const allDeals=(state=[],action)=>{
    if(action.type === "getDeals"){
        if(action.payload !== undefined)
        return action.payload;
        else
        return state;
    }
    else{
        return state;
    }
}
export const chatData=(state={},action)=>{
    if(action.type === "getChat"){
        if(action.payload !== undefined)
        return action.payload;
        else
        return state;
    }
    else{
        return state;
    }
}
export const chatList=(state=[],action)=>{
    if(action.type === "getChatList"){
        if(action.payload !== undefined)
        return action.payload;
        else
        return state;
    }
    else{
        return state;
    }
}







