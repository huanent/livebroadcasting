import axios from "axios";

export const testApi = function() {
  axios
    .post("/new/get", {
      name: "caffrey",
      desc: "ok"
    })
    .then(res => {
      console.log(res);
    });
};
