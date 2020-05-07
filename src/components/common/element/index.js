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
  Tooltip,
  Table,
  TableColumn,
  Pagination,
  Progress,
  DatePicker,
  Switch,
  Badge,
  Notification
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
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Progress);
    Vue.use(DatePicker);
    Vue.use(Switch);
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.use(Badge);
    Vue.prototype.$notify = Notification;
  }
};
export default element;
