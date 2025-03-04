import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { INotice } from "../NoticeMain/NoticeMain";
// functionComponent
// NoticeModal: FC<{ setFlag: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setFlag })

interface INoticeModalProps {
    noticeId: number;
    setNoticeId: React.Dispatch<React.SetStateAction<number>>;
    postSuccess: () => void;
}

interface INoticeDetail extends INotice {
    fileName: string | null;
    fileExt: string | null;
    fileSize: number;
    logicalPath: string | null;
    physicalPath: string | null;
}

interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}

interface IPostResponse {
    result: "success" | "fail";
}

export const NoticeModal: FC<INoticeModalProps> = ({ noticeId, setNoticeId, postSuccess }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<INoticeDetail>();
    const formRef = useRef<HTMLFormElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>(null);

    useEffect(() => {
        noticeId && searchDetail();
        return () => {
            // noticeId = 0; props는 기본적으로 readOnly라 변경 안됨
            setNoticeId(0);
        };
    }, []);

    // const searchDetail = () => {
    //     axios
    //         .post("/management/noticeDetailJson.do", { noticeId })
    //         .then((res: AxiosResponse<INoticeDetailResponse>) => {
    //             setDetail(res.data.detailValue);
    //         });
    // };

    const saveNotice = () => {
        console.log(formRef.current);
        axios.post("/management/noticeSave.do", formRef.current).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("저장되었습니다.");
                postSuccess();
            }
        });
    };

    const updateNotice = () => {
        const formData = new FormData(formRef.current);
        formData.append("noticeId", noticeId.toString());
        axios.post("/management/noticeUpdate.do", formData).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("수정되었습니다.");
                postSuccess();
            }
        });
    };

    const deleteNotice = () => {
        axios.post("/management/noticeDeleteJson.do", { noticeId }).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("삭제되었습니다.");
                postSuccess();
            }
        });
    };

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        const fileInfo = e.target.files;
        if (fileInfo?.length > 0) {
            // "." 기준으로 name을 나눠
            const fileSplit = fileInfo[0].name.split(".");
            // 소문자로 바꿈
            const fileExt = fileSplit[1].toLowerCase();

            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                console.log(URL.createObjectURL(fileInfo[0]));
                // 미리보기 url 생성
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }
            setFileName(fileInfo[0].name);
        }
    };

    const saveNoticeFile = () => {
        const formData = new FormData(formRef.current);
        axios.post("/management/noticeFileSave.do", formData).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("저장되었습니다.");
                postSuccess();
            }
        });
    };

    const updateNoticeFile = () => {
        const formData = new FormData(formRef.current);
        formData.append("noticeId", noticeId.toString());
        axios.post("/management/noticeFileUpdate.do", formData).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("수정되었습니다.");
                postSuccess();
            }
        });
    };

    const deleteNoticeFile = () => {
        axios.post("/management/noticeFileDeleteJson.do", { noticeId }).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("삭제되었습니다.");
                postSuccess();
            }
        });
    };

    const searchDetail = () => {
        axios
            .post("/management/noticeFileDetailJson.do", { noticeId })
            .then((res: AxiosResponse<INoticeDetailResponse>) => {
                if (res.data.detailValue) {
                    setDetail(res.data.detailValue);
                    const { fileExt, logicalPath } = res.data.detailValue;
                    if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                        setImageUrl(logicalPath);
                    } else {
                        setImageUrl("");
                    }
                }
            });
    };

    const fileDownload = () => {
        const param = new URLSearchParams();
        param.append("noticeId", noticeId.toString());

        axios
            .post("/management/noticeDownload.do", param, { responseType: "blob" })
            .then((res: AxiosResponse<Blob>) => {
                const url = window.URL.createObjectURL(res.data);
                console.log(url);
                // a태그 동적으로 생성
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", detail?.fileName as string);
                document.body.appendChild(link);
                link.click();

                // a태그가 남아있음 데이터 누수(과부하)가 올 수 있어 지워줘야함
                document.body.removeChild(link);
                // 다운로드 후 URL이 필요 없어지므로 삭제 안 하면 메모리에 남아서 브라우저 성능 저하 가능
                window.URL.revokeObjectURL(url);
            });
    };

    return (
        <NoticeModalStyled>
            <div className='container'>
                <form ref={formRef}>
                    <label>
                        제목 :<StyledInput type='text' name='fileTitle' defaultValue={detail?.title}></StyledInput>
                    </label>
                    <label>
                        내용 : <StyledInput type='text' name='fileContent' defaultValue={detail?.content}></StyledInput>
                    </label>
                    파일 :
                    <StyledInput
                        type='file'
                        name='file'
                        id='fileInput'
                        style={{ display: "none" }}
                        onChange={handlerFile}
                    ></StyledInput>
                    <label className='img-label' htmlFor='fileInput'>
                        파일 첨부하기
                    </label>
                    <div>
                        {imageUrl ? (
                            <div onClick={fileDownload}>
                                <label>미리보기</label>
                                <img src={imageUrl}></img>
                                <br />
                                {fileName || detail.fileName}
                            </div>
                        ) : (
                            <div>{fileName}</div>
                        )}
                    </div>
                    <div className={"button-container"}>
                        {/* <StyledButton type='button' onClick={updateNotice}>
                            수정
                        </StyledButton> */}
                        <StyledButton type='button' onClick={noticeId ? updateNoticeFile : saveNoticeFile}>
                            {noticeId ? "수정" : "저장"}
                        </StyledButton>
                        {!!noticeId && (
                            <StyledButton type='button' onClick={deleteNoticeFile}>
                                삭제
                            </StyledButton>
                        )}
                        <StyledButton type='button' onClick={() => setModal(!modal)}>
                            나가기
                        </StyledButton>
                    </div>
                </form>
            </div>
        </NoticeModalStyled>
    );
};
