import { createBrowserRouter } from "react-router-dom";


import BaseLayout from "./layouts/BaseLayout.tsx";
import { TestPage } from "../pages/testPage";


export const appRouter = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <div>Error404</div>,
    children: [
      { path: "/", element: <div>ErrorMain</div> },
      { path: "/test", element: <TestPage/> }
    ],
  },
]);