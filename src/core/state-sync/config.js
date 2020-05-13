import { ROLE } from "../../store/account";

export default [
  {
    path: ["workplace", "panelType"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "timer"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  }
];
