import { Form, FormItem, Input, Button, Message } from "element-ui";
const element = {
    install: function (Vue) {
        Vue.prototype.$message = Message;
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Input);
        Vue.use(Button);
    },
};
export default element;
