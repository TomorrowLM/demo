import Store from "../components/content/Store.jsx";
import Communicate from "../components/content/Communicate.jsx";
import OnRef from "../components/content/OnRef.jsx";
export const menu = [
  {
    path: "Store",
    component: Store,
    exact: true,
  },
  {
    path: "Communicate",
    component: Communicate,
    exact: true,
  },
  {
    path: "OnRef",
    component: OnRef,
    exact: true,
  },
];
