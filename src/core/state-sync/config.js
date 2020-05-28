import { ROLE } from "../../models/role";

export default [
  {
    path: ["workplace", "panelType"],
    listener: ROLE.STUDENT,
    sender: ROLE.TEACHER
  },
  {
    path: ["features", "noTalking"],
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
    path: ["features"],
    toPath: ["workplace", "featuresList"],
    primaryKey: true,
    listener: null,
    sender: ROLE.STUDENT
  }
];
