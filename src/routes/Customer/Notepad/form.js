import React from 'react';
import {
  Row,
  Col,
  Icon,
  Input,
  Button,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import OAForm, {
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import Upload from '../../../components/OATable/upload';
import store from './store/store';
import Editor from './editor';


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


@store(['submit', 'fetchDataSource'])
@OAForm.create()
export default class extends React.PureComponent {
  state = {
    attachments: [],
  }

  componentWillMount() {
    const { fetchDataSource, match } = this.props;
    const { id } = match.params;
    if (id) {
      this.id = id;
      fetchDataSource({ id });
    }
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
      this.setState({ attachments: [...attachments] });
    }
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  uploadSuccess = (file) => {
    const fileTemp = {
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: file.response,
    };
    let attachments = [...this.state.attachments];
    attachments = attachments.concat(fileTemp);
    this.setState({ attachments });
    // file.response.then((body) => {
    //   const filePath = body;
    //   const fileTemp = {
    //     uid: file.uid,
    //     name: file.name,
    //     status: file.status,
    //     url: filePath,
    //   };
    //   let attachments = [...this.state.attachments];
    //   attachments = attachments.concat(fileTemp);
    //   this.setState({ attachments });
    // });
  }

  removeFile = (uid) => {
    const { attachments } = this.state;
    const newAttachments = attachments.filter(item => item.uid !== uid);
    this.setState({ attachments: [...newAttachments] });
  }

  fileChange = (data) => {
    const { file } = data;
    if (!file.error && file.status === 'done' && file.response) {
      message.success('上传成功!!');
      this.uploadSuccess(file);
    }
    if (!file.error && file.status === 'removed') this.removeFile(file.uid);
    if (file.status === 'error' && file.response) {
      message.error(file.response.errors.file.join('\n'));
    }
  }

  handleSubmit = (values, onError) => {
    const { submit } = this.props;
    const { attachments } = this.state;
    const data = attachments.map(item => item.url);
    const params = { ...values, attachments: data };
    if (this.id) params.id = this.id;
    submit(params, onError);
  }

  render() {
    const {
      brand,
      noteTypes,
      notesDetails,
      validateFields,
      staffBrandsAuth,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    const { id } = this;
    // const { fileList } = this.state;
    const { editable = [] } = staffBrandsAuth;
    const brandOption = brand.filter(item => editable.indexOf(item.id) !== -1);
    let initialValue = {};
    if (notesDetails[id]) {
      initialValue = notesDetails[id];
    }
    const accessToken = localStorage.getItem(`${TOKEN_PREFIX}access_token`);
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
                initialValue: initialValue.took_place_at || moment().format('YYYY-MM-DD'),
                rules: [validatorRequired],
              })(
                <DatePicker
                  placeholder="请输入"
                  style={{ width: '100%' }}
                  disabledDate={(currentDate) => {
                    return currentDate > moment();
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem label="内容" {...formItemLayout} required>
          {getFieldDecorator('content', {
            initialValue: initialValue.content,
            rules: [validatorRequired],
          })(
            <Editor />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="附件">
          <div className="dropbox">
            <Upload.Dragger
              name="file"
              // fileList={fileList}
              onChange={this.fileChange}
              // customRequest={this.customRequest}
              headers={
                { Authorization: `Bearer ${accessToken}` }
              }
              action="/api/crm/notes/files"
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
            initialValue: initialValue.brands ? initialValue.brands.map(item => `${item}`) : [],
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
      </OAForm >
    );
  }
}
