import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout/Layout";
import { Toaster } from "sonner";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const MyBids = lazy(() => import("./pages/MyBids"));
const History = lazy(() => import("./pages/Transactions"));
const Profile = lazy(() => import("./pages/Profile"));

const NotFound = lazy(() => import("./NotFound"));
const SellItems = lazy(() => import("./pages/SellItems"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const Checkout = lazy(() => import("./pages/Checkout"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
import Loader from "./components/utils/Loader";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "my-bids",
        element: (
          <Suspense fallback={<Loader />}>
            <MyBids />
          </Suspense>
        ),
      },
      {
        path: "history",
        element: (
          <Suspense fallback={<Loader />}>
            <History />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "sell-items",
        element: (
          <Suspense fallback={<Loader />}>
            <SellItems />
          </Suspense>
        ),
      },
      {
        path: "item/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ItemDetails />
          </Suspense>
        ),
      },
      {
        path: "checkout/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Checkout />
          </Suspense>
        ),
      },
      {
        path: "delivery/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <DeliveryPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
