import Home from "../components/content/home.jsx";
import User from "../components/content/Users.jsx";
import About from "../components/content/About.jsx";
import User1 from "../components/content/users1.jsx";
const route = [
  {
    path: "Home",
    component: Home,
  },
  {
    path: "User",
    component: User,
  },
//   {
//     path: "User1",
//     component: User1,
//   },
  {
    path: "About",
    component: About,
  }
];
export default route;
