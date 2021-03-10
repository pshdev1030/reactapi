import React,{useState}  from 'react';
import User from './User'
import { getUsers, useUsersDispatch, useUsersState } from './UsersContext';


function Users(){
    const [userId,setUserId]=useState(null);
    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const {isLoading,data:users,error}=state.users;
    
    const fetchData= ()=>{
        getUsers(dispatch);
    };

    if(isLoading) return <div>로딩중</div>
    if(error) return <div>에러 발생</div>
    if(!users) return <button onClick={fetchData}>불러오기</button>

    return (
    <>
    <ul>
        {users.map(user=>(
        <li key={user.id} onClick={()=>setUserId(user.id)}>
            {user.username} {user.name}
            </li>
        ))}
    </ul>
    <button onClick={fetchData}>다시 불러오기</button>
    {userId&&<User id={userId}/>}
    </>
    );
}
/*state값인 userId가 존재 할 경우에만 랜더링된다. state값이 변할 때마다 자동으로 반영됨. */

export default Users