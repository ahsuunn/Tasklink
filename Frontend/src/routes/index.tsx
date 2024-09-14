import { Outlet, createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Layout from "./Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import IsLoggedIn from "./loaders/IsLoggedIn";
import { CurrentUserProvider } from "../lib/contexts/CurrentUserContext";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProfilePageEdit from "../pages/ProfilePage/ProfileEdit";
import CreateTaskPage from "../pages/CreateTaskPage/CreateTaskPage";
import DeleteTaskPage from "../pages/DeleteTaskPage/DeleteTaskPage";
import ViewStepsPage from "../pages/ViewStepsPage/ViewStepsPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import FindMyBuddiesPage from "../pages/FindMyBuddiesPage/FindMyBuddiesPage";
import SearchFriendsPage from "../pages/FindMyBuddiesPage/SearchFriendsPage";
import FriendRequestPage from "../pages/FindMyBuddiesPage/FriendRequestPage";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <CurrentUserProvider>
        <Outlet />
      </CurrentUserProvider>
    ),
    children: [
      {
        path: "/auth",
        element: <Outlet />,
        children: [
          {
            path: "sign-in",
            element: <LoginPage />,
          },
          {
            path: "sign-up",
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "findmybuddies",
            element: <FindMyBuddiesPage />,
          },
          {
            path: "findmybuddies/find-buddies",
            element: <SearchFriendsPage />,
          },
          {
            path: "findmybuddies/friendrequests",
            element: <FriendRequestPage />,
          },
          {
            path: "profile/:email",
            element: <ProfilePage />,
          },
          {
            path: "profile/create-task",
            element: <CreateTaskPage />,
          },
          {
          },
          {
            path: "delete-project/:taskId",
            element: <DeleteTaskPage />,
          },
          {
            path: "view-project/:taskId",
            element: <ViewStepsPage />,
          },
        ],
      },

      {
        //protected routes
        path: "/",
        loader: IsLoggedIn,
        element: <Outlet />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },

          {
            path: "profile/edit/:email",
            element: <ProfilePageEdit />,
          },
        ],
      },
    ],
  },
]);

export default router;
