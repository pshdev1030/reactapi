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
/*복잡하게 만든 함수들을 한줄로 정리할 수 있게 만든다. promiseFn을 받아서 반환한다.
user의 경우 id가 필요한데, 이런 값들을 rest에 넣어놓고 훗날 수정하더라도 편하게끔 바꾼다.
users를 호출할씨 rest가 없고 user를 호출할시 rest가 있다.(id)*/

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

/*초기값을 간편하게 만들 수 있다.*/ 

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
//reducer action 별로 정의 액션이 비슷해서 함수를 따로 만들어주었다.
//인수를 받아 반환하는 callback 함수를 정의한다.

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
/*type 와 key(users인지 user인지) 
타입을 받아서 두개로 각각 구현된 reducer를 합쳤다.*/