import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../../src/pages/Login";
import { DashBoard } from "../components/layout/DashBoard/DashBoard";
import { NotFound } from "../components/common/NotFound/NotFound";
import { Notice } from "../pages/management/Notice";
import { CommonCode } from "../pages/management/CommonCode";
import { DetailCode } from "../pages/management/DetailCode";

const routers: RouteObject[] = [
    { path: "*", element: <NotFound /> },
    { path: "/", element: <Login /> },
    {
        path: "/react",
        element: <DashBoard />,
        children: [
            // { path: "management/notice", element: <Notice /> }
            {
                path: "management",
                children: [
                    { path: "notice", element: <Notice /> },
                    { path: "common-code", element: <CommonCode /> },
                    { path: "common-code/:groupIdx", element: <DetailCode /> },
                ],
            },
        ],
    },
];

export const Routers = createBrowserRouter(routers);
