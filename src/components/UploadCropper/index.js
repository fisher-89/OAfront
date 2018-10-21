import React from 'react';
import { Upload, message, Icon, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import './index.less';
import ModalCropper from './ModalCropper';

@connect()
export default class UploadCropper extends React.Component {
  constructor(props) {
    super(props);
    const { value, fileList } = this.makeUploadListValue(props.value || []);
    this.state = {
      value,
      fileList,
      fileItem: {},
      visible: false,
      cropperSrc: {},
      previewImage: '',
      previewVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value.length && !this.state.value.length) {
      const { value, fileList } = this.makeUploadListValue(nextProps.value);
      this.setState({ value, fileList });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    if (JSON.stringify(nextProps.value) === JSON.stringify(this.props.value)) {
      return false;
    }
    return true;
  }

  makeUploadListValue = (files) => {
    const params = [...files];
    const fileList = [];
    params.forEach((item, index) => {
      if (item) {
        const uid = `${moment().unix()}${index + 1}`;
        fileList.push({
          uid,
          name: uid,
          status: 'done',
          url: item,
        });
      }
    });
    return { fileList, value: fileList };
  }

  handleChange = ({ file, fileList }) => {
    const { max, onChange } = this.props;
    if (fileList.length > max) {
      message.error('上传数量已经达到最大限制!!');
      return;
    }
    const { value } = this.state;
    let newValue = [...value];
    if (file.status === 'removed') {
      newValue = value.filter(item => item.uid !== file.uid);
    }
    this.setState({ fileList, value: newValue }, () => {
      if (file.status === 'removed') onChange(newValue.map(item => item.url));
    });
  }

  handleCancel = () => {
    this.setState({
      previewImage: '',
      previewVisible: false,
    });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  beforeUpload = (file) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      const fileType = {
        name: file.name,
        type: file.type,
        uid: file.uid,
        webkitRelativePath: file.webkitRelativePath,
      };
      this.setState({
        visible: true,
        cropperSrc: {
          ...fileType,
          status: 'uploading',
          url: fr.result,
        },
      });
    };
    return true;
  }

  cropperChange = (blob, file) => {
    const { fileList } = this.state;
    const newFileList = fileList.map((item) => {
      if (item.uid === file.uid) {
        return file;
      }
      return item;
    });
    this.setState({
      visible: false,
      cropperSrc: {},
      fileItem: file,
      fileList: [...newFileList],
    }, () => this.customRequest(blob));
  }

  cropperCancel = (file) => {
    const { fileList } = this.state;
    const blob = fileList.find(item => item.uid === file.uid).originFileObj;
    this.setState({ visible: false, cropperSrc: {}, fileItem: file },
      () => this.customRequest(blob));
  }

  customRequest = (blob) => {
    const { fileItem } = this.state;
    if (!fileItem) return;
    const { actionType, name, dispatch } = this.props;
    const formData = new FormData();
    formData.append(name, blob);
    dispatch({
      type: actionType,
      payload: formData,
      onSuccess: response => this.afterCallBack(response, 'done'),
      onError: error => this.afterCallBack(error, 'error'),
    });
  }

  afterCallBack = (response, status = 'done') => {
    const { fileItem, value, fileList } = this.state;
    const { name, onChange } = this.props;
    const newFileList = fileList.map((item) => {
      if (item.uid === fileItem.uid) {
        return {
          ...item,
          status,
        };
      }
      return item;
    });
    if (status === 'done') {
      value.push({
        ...fileItem,
        url: response,
      });
    }
    if (status === 'error') message.error(`上传失败：${response[name]}`);
    this.setState({ value, fileList: newFileList, fileItem: null }, () => {
      if (status === 'done') {
        const params = value.map(item => item.url);
        onChange(params);
      }
    });
  }

  render() {
    const { fileList, visible, cropperSrc, previewVisible, previewImage } = this.state;
    const { CropperProps, max, placeholder } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{placeholder || '上传图片'}</div>
      </div>
    );
    return (
      <React.Fragment>
        <Upload
          fileList={fileList}
          listType="picture-card"
          customRequest={() => { }}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <ModalCropper
          {...CropperProps}
          visible={visible}
          cropperFile={cropperSrc}
          onChange={this.cropperChange}
          onCancel={this.cropperCancel}
        />
      </React.Fragment>
    );
  }
}
UploadCropper.defaultProps = {
  max: 1,
  name: 'file',
  cropper: true,
  actionType: '',
  CropperProps: {},
  onChange: () => { },
};
