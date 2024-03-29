import React, {createContext,useReducer,useContext} from 'react';
import * as api from './api';
import createAsyncDispatcher, { createAsyncHandler,initialAsyncState } from './asyncActionUtils';

const initialState={
    users:initialAsyncState,
    user:initialAsyncState
}
/*초기 상태 정의 Users랑 user를 따로 정의한다. user를 한명만 가져올경우를 대비
안할경우 랜더링 할 때마다 찾아서 가져와야한다. 저장해두면 편안
애초에 url도 다르다.*/



//GET_USERS
//GET_USERS_SUCCESS
//GET_USERS_ERROR

//GET_USER
//GET_USER_SUCCESS
//GET_USER_ERROR
//action들 정의

const usersHandler=createAsyncHandler('GET_USERS','users');
const userHandler=createAsyncHandler('GET_USER','user');
function usersReducer(state,action){
    switch(action.type){
        case'GET_USERS':
        case'GET_USERS_SUCCESS':
        case'GET_USERS_ERROR':
        return usersHandler(state,action);
        case'GET_USER':
        case'GET_USER_SUCCESS':
        case'GET_USER_ERROR':
        return userHandler(state,action);
        default:
    }
}


export const UsersStateContext=createContext(null);
export const UsersDispatchContext=createContext(null);

export function UsersProvider({children}){
    const[state,dispatch]=useReducer(usersReducer,initialState);
    return(
    <UsersStateContext.Provider value={state}>
        <UsersDispatchContext.Provider value={dispatch}>
            {children}
        </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
    );
}
/*children을 감싸주어서 받아와서 상태만 뽑아 쓸 수 있다. */

export function useUsersState(){
    const state=useContext(UsersStateContext);
    if(!state){
        throw new Error('Cannot find UserProvider');
    }
    return state;
}

export function useUsersDispatch(){
    const dispatch=useContext(UsersDispatchContext);
    if(!dispatch){
        throw new Error('Cannot find UserProvider');
    }
    return dispatch;
}

export const getUsers=createAsyncDispatcher('GET_USERS',api.getUsers);
export const getUser=createAsyncDispatcher('GET_USER',api.getUser);