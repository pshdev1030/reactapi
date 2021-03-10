# 구성
Context API를 통해서 상태를 관리한다.
마찬가지로 하나의 js파일에 모았으며
state와 dispatch를 반환하는 각각의 CustomHook을 만들어 export하였다.
users와 user의 url이 다르므로 한 함수에서 처리하기보단 Reducer의 state에 users와 user를 따로 만들어서
따로 관리하도록 하였다.

+ action.type를 통일하면 좋은 것 같다.
+ 자주 작성되는 함수의 경우 Refactoring 작업을 거쳐서 코드를 깔끔하게 할 수 있다.
Refactoring에 대한 글이다 https://nesoy.github.io/articles/2018-05/Refactoring

## `index.js`
App.js를 랜더링한다.

## `App.js`
User.js를 랜더링한다.
index.js에서 랜더링된다.

```
  return (
  <>
  <UsersProvider>   //Context Custom Hook
    <Users/>        //정보 출력
  </UsersProvider>  //닫는 태그
  </>
  );

```

## `UsersContext.js`
초기 상태인 initialState와 상태관리 함수인 Reducer, state와 dispatch를 반환하는 CustomHook,
그리고 자식 Component를 children으로 받아 provider로 감싸서 반환하는 UserProvider 함수를 작성하였다.
비슷한 코드들이 많아서 리팩토링 하였다.

## `api.js`
axios를 이용해서 서버에서 데이터를 받아오는 함수들을 작성하였다.
함수 특성상 데이터를 받아오고 기다려야 하므로 async -await function으로 작성되었다.

## `asyncActionUtils.js`
코드들을 간략화 하였다.

### * 서버로부터 데이터를 받아오는 함수들을 간략화 하였다.
데이터를 받아오는 작업이 성공했냐 실패했냐에 따라 dispatch값을 다르게 한다.

첫 번째 parameter인 type은 user혹은 users이다.
이벤트 이름들을 _SUCCESS, _ERROR로 통일하여서 텍스트 리터럴을 통해 action의 type를 다룰 수 있게 되었다.

두 번째 parameter인 promiseFn은 타입에 따라 실행할 promiseFn을 받아온다.
여기선 위의 `api.js` 에서 작성한 axios.get으로 데이터를 받아와 반환하는 함수를 인수로 썼다.

```
export default function createAsyncDispatcher(type,promiseFn){
    const SUCCESS=`${type}_SUCCESS`;
    const ERROR=`${type}_ERROR`;
    async function actionHandler(dispatch,...rest){
        dispatch({type});
        try{
        const data=await promiseFn(...rest);
        dispatch({
            type:SUCCESS,
            data,
        });
        }catch(e){
            dispatch({
                type:ERROR,
                error:e,
            })
        }
    }

    return actionHandler;
}
```

### * 여러번 사용되는 상태들을 정의하였다.
user와 users는 따로 관리되지만 똑같은 값들을 가지고 있어 로딩되었는지 안 되었는지 여부를 검사하기 위해 여러번 작성된 초기상태를 객체로 정의하였다.

```
export const initialAsyncState={
    loading:false,
    data:null,
    error:null,
}

const loadingState={
    loading:true,
    data:null,
    error:null,
};
```

### * 액션 함수를 정의하였다.
언급했듯이 users와 user는 따로 관리되지만 같은 값이기 때문에, 여러번 사용된 action함수를 콜백함수 형태로 정의하였다.

```
const success =(data)=>({
    loading:false,
    data,
    error:null,
});

const error= e=> ({
    loading:false,
    data:null,
    error:e,
});
```

### * 리듀서 함수를 간략화하였다.
첫 번째 parameter인 type은 'GET_USERS'혹은 'GET_USER'이다.
이를 받아서 내부에서 SUCCESS와 ERROR의 텍스트 리터럴을 만들어 각각의 action을 처리한다.

두 번쨰 인자인 key는 'users'혹은 'user'이다.
[]를 사용한 Computed property names을 통해 key라는 이름을 지닌 state를 위에서 정의한 액션함수를 이용해 변경한다.

```
export function createAsyncHandler(type,key){
    const SUCCESS=`${type}_SUCCESS`;
    const ERROR=`${type}_ERROR`;

    function handler(state,action){
        switch(action.type){
            case type:
                return {
                    ...state,
                    [key]:loadingState,
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]:success(action.data)
            }
            case ERROR:
                return{
                    ...state,
                    [key]:error(action.error)
                }
            default:
                return state;
        }
    }
    return handler;
}
```

## `Users.js`
Context API를 이용, state와 dispatch를 가져와서 state의 요소를 비구조화 할당으로 가져와 상태에 따라 출력을 달리한다.

에러가 없고 다 로딩되었을 경우 최종적으로 서버에서 받아온 데이터를 출력한다.
useState의 초기값이 null인 state인 userId와 User component를 &&식으로 묶어 UserId값이 null이 아닐경우 User component를 출력한다.

## `User.js`
단일 user의 값을 출력한다. `users.js`와 구조가 유사하다.