import { createBrowserRouter, RouterProvider } from "react-router-dom";

import BaseLayout from "@/app/layouts/BaseLayout.tsx";

import { TestCalendarPage } from "@/pages/testCalendarPage";
import { TestButtonPage } from "@/pages/testButtonPage";
import { TestHintPage } from "@/pages/testHintPage";
import { TestTypographyPage } from "@/pages/testTypographyPage";
import { TestBadgePage } from "@/pages/testBadgePage";
import { TestControlPage } from "@/pages/testControlPage";
import { TestCheckboxPage } from "@/pages/testCheckboxPage";
import { TestDropdownMenuPage } from "@/pages/testDropdownmenuPage";
import { TestCounterPage } from "@/pages/testCounterPage";
import { TestSwitchPage } from "@/pages/testSwitchPage";
import { TestEmptyMessagePage } from "@/pages/testEmptyMessagePage";
import { TestStepperPage } from "@/pages/testStepperPage";
import { TestNotificationPage } from "@/pages/testNotificationPage";



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
      { path: "/test-checkbox", element: <TestCheckboxPage/> },
      { path: "/test-dropdownmenu", element: <TestDropdownMenuPage/> },
      { path: "/test-counter", element: <TestCounterPage/> },
      { path: "/test-switch", element: <TestSwitchPage/> },
      { path: "/test-emptymessage", element: <TestEmptyMessagePage/> },
      { path: "/test-stepper", element: <TestStepperPage/> },
      { path: "/test-notification", element: <TestNotificationPage/> },
      { path: "/calendar", element: <TestCalendarPage/>},
    ],
  },
]);

export const withRouter = () => () => {
  return <RouterProvider router={router} />;
};