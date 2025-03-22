import { createBrowserRouter, RouterProvider } from "react-router-dom";

import BaseLayout from "@/app/layouts/BaseLayout.tsx";
import { TestPage } from "@/pages/testPage";
import { TestCalendarPage } from "@/pages/testCalendarPage";


const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <div>Error404</div>,
    children: [
      { path: "/", element: <div>ErrorMain</div> },
      { path: "/test", element: <TestPage/> },
      { path: "/calendar", element: <TestCalendarPage/>},
    ],
  },
]);

export const withRouter = () => () => {
  return <RouterProvider router={router} />;
};