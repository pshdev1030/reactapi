# 구성
Context API를 통해서 상태를 관리한다.
마찬가지로 하나의 js파일에 모았으며
state와 dispatch를 반환하는 각각의 커스텀 훅을 만들어 export하였다.

## `index.js`
App.js를 랜더링한다.

## `App.js`
```
  return (
  <>
  <UsersProvider>   //Context Custom Hook
    <Users/>        //정보 출력
  </UsersProvider>  //닫는 태그
  </>
  );

```

User.js를 랜더링한다.
index.js에서 랜더링된다.

User.js