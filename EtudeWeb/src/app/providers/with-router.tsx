import { createBrowserRouter, RouterProvider } from "react-router-dom";

import BaseLayout from "@/app/layouts/BaseLayout.tsx";

import { TestCalendarPage } from "@/pages/testCalendarPage";
import { TestButtonPage } from "@/pages/testButtonPage";
import { TestHintPage } from "@/pages/testHintPage";
import { TestTypographyPage } from "@/pages/testTypographyPage";
import { TestBadgePage } from "@/pages/testBadgePage";
import { TestControlPage } from "@/pages/TestControlPage";



const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <div>Error404</div>,
    children: [
      { path: "/", element: <div>ErrorMain</div> },
      { path: "/test-button", element: <TestButtonPage/> },
      { path: "/test-hint", element: <TestHintPage/> },
      { path: "/test-typography", element: <TestTypographyPage/> },
      { path: "/test-badge", element: <TestBadgePage/> },
      { path: "/test-control", element: <TestControlPage/> },
      { path: "/calendar", element: <TestCalendarPage/>},
    ],
  },
]);

export const withRouter = () => () => {
  return <RouterProvider router={router} />;
};