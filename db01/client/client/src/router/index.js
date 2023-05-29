import { createRouter, createWebHistory } from "vue-router";
import ViewPaste from "../components/ViewPaste";
import CreatePaste from "../components/CreatePaste"
import UserProfile from "../components/UserProfile"
const routes = [
  {
    path: "/",
    name: "home",
    props: true,
    component: CreatePaste,
  },
  {
    path: "/pastes/:id",
    name: "pastes",
    props: true,
    component: ViewPaste,
  },
  {
    path: "/users/:id",
    name: "users",
    props: true,
    component: UserProfile
  }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;
