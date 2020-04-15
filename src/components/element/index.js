import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Select,
  Option,
} from "element-ui";
const element = {
  install: function(Vue) {
    Vue.prototype.$message = Message;
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Option);
  },
};
export default element;
