export const setUserDetails=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:"changeUserdata",
            payload:data
        })
    }
};
export const setAuthenticated=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:"changeAuthenticated",
            payload:data
        })
    }
};
export const setAllDeals=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:"getDeals",
            payload:data
        })
    }
};
export const setChatData=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:"getChat",
            payload:data
        })
    }
};
export const setChatList=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:"getChatList",
            payload:data
        })
    }
};


