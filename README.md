# 구성
Context API를 통해서 상태를 관리한다.
마찬가지로 하나의 js파일에 모았으며
state와 dispatch를 반환하는 각각의 커스텀 훅을 만들어 export하였다.
users와 user의 url이 다르므로 한 함수에서 처리하기보단 Reducer의 state에 users와 user를 따로 만들어서
따로 관리하도록 하였다.

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
초기 상태인 initialState와 상태관리 함수인 Reducer, state와 dispatch를 반환하는 커스텀 훅,
그리고 자식 컴포넌트를 children으로 받아 provider로 감싸서 반환하는 UserProvider 함수를 작성하였다.
비슷한 코드들이 많아서 리팩토링 하였다.

## `api.js`
axios를 이용해서 서버에서 데이터를 받아오는 함수들을 작성하였다.
함수 특성상 데이터를 받아오고 기다려야 하므로 async -await function으로 작성되었다.

## `asyncActionUtils.js`
코드들을 간략화 하였다.

### * action 함수들을 간략화 하였다.

첫 번째 parameter인 type은 user혹은 users이다.
이벤트 이름들을 _SUCCESS, _ERROR로 통일하여서 텍스트 리터럴을 통해 action의 type를 다룰 수 있게 되었다.

두 번째 parameter인 promiseFn은 타입에 따라 실행할 promiseFn을 받아온다.
여기선 위의 `api.js` 에서 작성한axios.get으로 데이터를 받아와 반한하는 함수를 인수로 썼다.

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