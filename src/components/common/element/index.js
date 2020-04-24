import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Select,
  Option,
  Slider,
  ColorPicker,
  Dialog,
  Popover,
  Upload,
  MessageBox,
  Tooltip
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
    Vue.use(Slider);
    Vue.use(ColorPicker);
    Vue.use(Popover);
    Vue.use(Dialog);
    Vue.use(Upload);
    Vue.use(Tooltip);

    Vue.prototype.$confirm = MessageBox.confirm;
  }
};
export default element;
