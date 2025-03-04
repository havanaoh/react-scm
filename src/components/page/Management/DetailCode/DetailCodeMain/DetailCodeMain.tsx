import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { DetailCodeMainStyled } from "./styled";
import axios, { AxiosResponse } from "axios";
import { group } from "node:console";
import { useContext, useEffect, useState } from "react";
import { CommonDetailCodeContext } from "../../../../../api/Provider/CommonDetailPorvider";

interface ICommonDetailCode {
    detailIdx: number;
    groupCode: string;
    detailCode: string;
    detailName: string;
    useYn: "Y" | "N";
    author: string;
    createdDate: string;
    note: string;
}

interface ICommonDetailResponse extends ICommonDetailCode {
    commonDetailCode: ICommonDetailCode[];
    commonDetailCodeCnt: number;
}
export const DetailCodeMain = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { groupIdx } = useParams();
    const [commonDetailCodeList, setcommonDetailCodeList] = useState<ICommonDetailCode[]>();
    const { searchKeyword } = useContext(CommonDetailCodeContext);

    useEffect(() => {
        searchDetailCode();
    }, [searchKeyword]);

    const searchDetailCode = () => {
        axios
            .post("/management/commonDetailCodeListBody.do", {
                ...searchKeyword,
                groupCode: state.groupCode,
                currentPage: 1,
                pageSize: 5,
            })
            .then((res: AxiosResponse<ICommonDetailResponse>) => {
                setcommonDetailCodeList(res.data.commonDetailCode);
            });
    };
    return (
        <DetailCodeMainStyled>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>그룹코드</th>
                        <th>상세코드</th>
                        <th>상세코드명</th>
                        <th>상세코드설명</th>
                        <th>사용여부</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {commonDetailCodeList?.length > 0 ? (
                        commonDetailCodeList.map((commonDetailCode) => {
                            return (
                                <tr key={commonDetailCode.detailIdx}>
                                    <td>{commonDetailCode.detailIdx}</td>
                                    <td>{commonDetailCode.groupCode}</td>
                                    <td>{commonDetailCode.detailCode}</td>
                                    <td>{commonDetailCode.detailName}</td>
                                    <td>{commonDetailCode.note}</td>
                                    <td>{commonDetailCode.useYn}</td>
                                    <td>
                                        <StyledButton>수정</StyledButton>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7}>조회 내역이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <StyledButton onClick={() => navigate(-1)}>뒤로가기</StyledButton>
        </DetailCodeMainStyled>
    );
};
