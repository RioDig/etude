import "../styles/App.css";
import { Outlet } from "react-router-dom";
import { NotificationContainer } from "@/shared/ui/notification";
import { Header } from "@/widgets/header";
import React from "react";


function BaseLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header
        notificationsCount={5}
        className="sticky top-0 z-50 bg-white"
      />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  );
}

export default BaseLayout;