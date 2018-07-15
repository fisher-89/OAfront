import { Form } from 'antd';
import Config from './Config';

export default function create(options) {
  return function configAndCreate(FormComponet) {
    const createdComponent = Form.create(options)(FormComponet);
    return Config(createdComponent);
  };
}
