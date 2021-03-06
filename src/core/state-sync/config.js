import { ROLE } from "../../models/role";

export default [
  {
    path: ["workplace", "panelType"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["workplace", "cameraPanelId"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["features", "globalMessage"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "timer"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "dice"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "draw"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "rush"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "clicker", "question"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "clicker", "answer"],
    toPath: ["widget", "clicker", "statistics"],
    primaryKey: true,
    listener: ROLE.TEACHER,
    sender: ROLE.STUDENT
  },
  {
    path: ["widget", "video"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["widget", "award"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["features"],
    toPath: ["workplace", "featuresList"],
    primaryKey: true,
    listener: null,
    sender: ROLE.STUDENT
  }
];
