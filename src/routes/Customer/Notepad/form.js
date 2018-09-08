import React from 'react';
import {
  Row,
  Col,
  Icon,
  Input,
  Button,
  Select,
} from 'antd';
import OAForm, {
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import Upload from '../../../components/OATable/upload';
import store from './store';
import upload from '../../../utils/upload';

const FormItem = OAForm.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12, pull: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8, pull: 10 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 12, offset: 2 },
  },
};

const colFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8, pull: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16, pull: 2 },
  },
};

const colFormItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8, push: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16, push: 6 },
  },
};

const rowGutter = { sm: 16, lg: 8 };
const colSpan = { push: 1, sm: rowGutter.sm / 2, lg: rowGutter.lg / 2 };


@OAForm.create()
@store
export default class extends React.PureComponent {
  state = {
    fileList: [],
    attachments: [],
  }

  componentWillMount() {
    const { fetchStaffBrandsAuth, fetch, match } = this.props;
    const { id } = match.params;
    if (id) fetch({ id });
    fetchStaffBrandsAuth();
  }

  componentWillReceiveProps(nextProps) {
    const { notesDetails, match } = nextProps;
    const { id } = match.params;
    if (notesDetails !== this.props.notesDetails && notesDetails[id]) {
      const attachments = (notesDetails[id].attachments || []).map((item, index) => {
        return {
          uid: `${index + 1}`,
          name: `附件${index + 1}`,
          status: 'done',
          url: item,
        };
      });
      this.setState({ attachments: [...attachments], fileList: [...attachments] });
    }
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  uploadSuccess = (file) => {
    file.response.then((body) => {
      const filePath = body;
      const fileTemp = {
        uid: file.uid,
        name: file.name,
        status: file.status,
        url: filePath,
      };
      let attachments = [...this.state.attachments];
      attachments = attachments.concat(fileTemp);
      this.setState({ attachments });
    });
  }

  removeFile = (uid) => {
    const { attachments } = this.state;
    const newAttachments = attachments.filter(item => item.uid !== uid);
    this.setState({ attachments: [...newAttachments] });
  }

  fileChange = ({ file, fileList }) => {
    this.setState({ fileList });
    if (!file.error && file.status === 'done' && file.response) {
      this.uploadSuccess(file);
    }
    if (!file.error && file.status === 'removed') this.removeFile(file.uid);
  }

  customRequest = (options) => {
    const formData = new FormData();
    formData.append('file', options.file);
    upload(`${OA_CRM_UPLOAD}notes/files`, {
      body: formData,
    }).then((res) => {
      if (res.status === 200) {
        const response = res.text();
        options.onSuccess(response);
      } else {
        options.onError('上传失败');
      }
    });
  }

  handleSubmit = (values, onError) => {
    const { submit } = this.props;
    const { attachments } = this.state;
    const data = attachments.map(item => item.url);
    submit({ ...values, attachments: data }, onError, () => {
      this.props.history('/client/notepad/list');
    });
  }

  render() {
    const {
      match,
      brand,
      noteTypes,
      notesDetails,
      validateFields,
      staffBrandsAuth,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    const { id } = match.params;
    const { fileList } = this.state;
    const brandOption = brand.filter(item => staffBrandsAuth.indexOf(item.id) !== -1);
    let initialValue = {};
    if (notesDetails[id]) {
      initialValue = notesDetails[id];
    }
    return (
      <OAForm onSubmit={validateFields(this.handleSubmit)}>
        <FormItem label="标题" {...formItemLayout} required>
          {getFieldDecorator('title', {
            initialValue: initialValue.title,
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <Row gutter={rowGutter}>
          <Col {...colSpan} >
            <FormItem label="类型" {...colFormItemLayout} required>
              {getFieldDecorator('note_type_id', {
                initialValue: initialValue.note_type_id ? `${initialValue.note_type_id}` : undefined,
                rules: [validatorRequired],
              })(
                <Select placeholder="请输入" >
                  {noteTypes.map(item => (<Option key={item.id}>{item.name}</Option>))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="发生时间" {...colFormItemLayout1} required>
              {getFieldDecorator('took_place_at', {
                initialValue: initialValue.took_place_at,
                rules: [validatorRequired],
              })(
                <DatePicker placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem label="内容" {...formItemLayout} required>
          {getFieldDecorator('content', {
            initialValue: initialValue.content,
            rules: [validatorRequired],
          })(
            <Input.TextArea placeholder="请输入" autosize={{ minRows: 10, maxRows: 10 }} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="附件">
          <div className="dropbox">
            <Upload.Dragger
              name="files"
              fileList={fileList}
              onChange={this.fileChange}
              customRequest={this.customRequest}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击图标或者拖拽文件到上传区域</p>
              <p className="ant-upload-hint">支持单个或批量上传。</p>
            </Upload.Dragger>
          </div>
        </FormItem>

        <FormItem label="关联客户" {...formItemLayout} required>
          {getFieldDecorator('client', {
            initialValue: initialValue.client_id ? {
              id: initialValue.client_id,
              name: initialValue.client_name,
            } : {},
            rules: [validatorRequired],
          })(
            <SearchTable.Customer name={{ id: 'id', name: 'name' }} />
          )}
        </FormItem>

        <FormItem label="品牌选择" {...formItemLayout} required>
          {getFieldDecorator('brands', {
            initialValue: initialValue.brands,
            rules: [validatorRequired],
          })(
            <Select placeholder="请输入" mode="multiple">
              {brandOption.map(item => (<Option key={item.id}>{item.name}</Option>))}
            </Select>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" style={{ width: 150 }}>保存</Button>
        </FormItem>
      </OAForm>
    );
  }
}
