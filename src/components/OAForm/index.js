import { Form } from 'antd';
import OAModal from './modal';
import create from './Config';
import DatePicker from './DatePicker';
import Address from './Address';
import InputTags from './InputTags';
import SearchTable from './SearchTable';
import FormList from './FormList';
import List from './StaticList';
import TreeSelect from './TreeSelect';

const formCreate = Form.create;
Form.create = create(formCreate);

export default Form;
export {
  List,
  OAModal,
  Address,
  FormList,
  InputTags,
  DatePicker,
  TreeSelect,
  SearchTable,
};
