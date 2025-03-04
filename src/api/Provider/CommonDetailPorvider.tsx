import { createContext, FC, useState } from "react";

// 초기값의 타입
interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}
// 지정된 곳 아무데서나 사용이 가능한 context를 생성함(생성만 하였고, 사용은 아직)
export const CommonDetailCodeContext = createContext<ISearchKeyword>({});

// ReactNode는 React에서 렌더링할 수 있는 모든 요소를 나타내는 타입이다
// reactElement는 글자나 조건식같은건 안됨
// provider를 사용해서 context에 값을 넣어주고, 원하는 곳에 제공할 수 있게함함
export const CommonDetailCodeProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    return (
        <CommonDetailCodeContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </CommonDetailCodeContext.Provider>
    );
};
