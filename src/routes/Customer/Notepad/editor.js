import React from 'react';
import LzEditor from 'react-lz-editor';

export default class Editor extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      htmlContent: value || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value !== this.props.value && !value) {
      this.setState({ htmlContent: value });
    }
  }

  receiveHtml = (content) => {
    this.props.onChange(content);
  }

  render() {
    const uploadProps = {
      listType: 'picture',
      multiple: true,
      showUploadList: true,
    };

    return (
      <LzEditor
        active
        lang="zh-en"
        image={false}
        video={false}
        audio={false}
        autoSave={false}
        uploadProps={uploadProps}
        cbReceiver={this.receiveHtml}
        importContent={this.state.htmlContent}
      />
    );
  }
}
Editor.defaultProps = {
  onChange: () => { },
};
