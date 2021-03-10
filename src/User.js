import React,{useEffect} from 'react';
import { getUser, useUsersDispatch, useUsersState } from './UsersContext';


function User({id}){
    const state=useUsersState();
    const dispatch=useUsersDispatch();
    
    useEffect(()=>{
        getUser(dispatch,id);
    },[dispatch,id])

    const {
        data:user,
        error,
        loading,
    }=state.user
  
    if(loading)return <div>로딩중</div>
    if(error) return <div>에러가 발생했습니다.</div>
    if(!user) return null;
    return(
        <div>
            <h2>{user.username}</h2>
            <p><b>Email: </b>{user.email}</p>
        </div> 
    );
}

export default User;

/*랜더링 할 때 데이터를 불러와야한다면 useEffect등을 대신해주는 훅을 만들어서 사용하면 좋다.*/
  
/*useAsync
promiseFn :프로미스 반환하는 함수
id
watch:id //처음 랜더링될떈 getUser에다가 id넣어서 호출, id바뀌었을 때는 getUser 다시 호출(deps) */