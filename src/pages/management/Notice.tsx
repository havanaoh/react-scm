import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { NoticeMain } from "../../components/page/Management/Notice/NoticeMain/NoticeMain";
import { NoticeSearch } from "../../components/page/Management/Notice/NoticeSearch/NoticeSearch";

export const Notice = () => {
    return (
        <>
            <ContentBox variant='primary' fontSize='large'>
                공지사항
            </ContentBox>
            {/* <ContentBox variant='primary' fontSize='large' title='공지사항' /> */}
            <NoticeSearch />
            <NoticeMain />
        </>
    );
};
