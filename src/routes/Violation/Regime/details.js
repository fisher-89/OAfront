import React, { PureComponent, Fragment } from 'react';
import OAForm, { OAModal } from '../../../components/OAForm';
import ShowRule from './ruleTags';
import style from './details.less';

@OAForm.create()
export default class extends PureComponent {
  render() {
    const {
      content,
      ruletype,
      onCancel,
      visible,
      initialValue,
    } = this.props;
    const [midkey] = ruletype.filter(item => item.id === initialValue.type_id);
    const typename = midkey ? midkey.name : '';
    return (
      <Fragment>
        <OAModal
          title="查看制度"
          visible={visible}
          onCancel={() => onCancel(false)}
          footer={null}
        >
          <div className={style.whole}>
            <div>
              <div className={style.namediv}>
                <font>大爱原因： {initialValue.name}</font>
              </div>
              <div className={style.typediv}>
                <font>类型：{typename}</font>
              </div>
            </div>
            <div className={style.xuxian} />
            <div className={style.biglove}>
              <ShowRule content={content} title="大爱规则" value={initialValue.money} />
            </div>
            <div className={style.pointrule}>
              <ShowRule content={content} title="扣分规则" value={initialValue.score} />
            </div>
            <div className={style.remark}>
              <label> 备注：{initialValue.remark}</label>
            </div>
          </div>
        </OAModal>
      </Fragment>
    );
  }
}
