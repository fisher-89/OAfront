/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import {
  Card,
  Spin,
} from 'antd';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;
const staffProperty = ['无', '108将', '36天罡', '24金刚', '18罗汉'];

export default class StaffInfo extends PureComponent {
  render() {
    const { data, loading } = this.props;
    const relatives = data.relatives ? data.relatives.map((item) => {
      return `${item.realname}   (${item.relative_type.name})   编号(${item.staff_sn})`;
    }).join('') : '  ';
    const idNumber = data.id_card_number;
    const birthday = idNumber ? [idNumber.substr(6, 4), idNumber.substr(10, 2), idNumber.substr(12, 2)].join('-') : '';

    return (
      <Spin tip="Loading..." spinning={loading}>
        <Card type="inner" key="userInfo" title="用户信息">
          <DescriptionList>
            <Description term="编号">
              {`${data.staff_sn}`}
            </Description>
            <Description term="员工姓名">
              {`${data.realname}  (${data.gender.name})`}
            </Description>
            <Description term="电话号码">
              {`${data.mobile}`}
            </Description>
            <Description term="身份证号">
              {`${data.id_card_number}`}
            </Description>
            <Description term="部门">
              {`${data.department.full_name}`}
            </Description>
            <Description term="品牌-职位">
              {`${data.brand.name} - ${data.position.name}`}
            </Description>
            <Description term="状态">
              {`${data.status.name}`}
            </Description>
            <Description term="员工属性">
              {`${staffProperty[data.property]}`}
            </Description>
            <Description term="银行账户">
              {`${data.account_number}     ${data.account_name}     ${data.account_bank}`}
            </Description>
          </DescriptionList>
        </Card>
        <Card type="inner" key="at" title="">
          <DescriptionList>
            <Description term="入职时间">
              {`${data.hired_at || ''}`}
            </Description>
            <Description term="转正时间">
              {`${data.employed_at || ''}`}
            </Description>
            <Description term="离职时间">
              {`${data.left_at || ''}`}
            </Description>
          </DescriptionList>
        </Card>
        <Card type="inner" key="details" title="">
          <DescriptionList>
            <Description term="生日">
              {`${birthday || ''}`}
            </Description>
            <Description term="民族">
              {`${data.national || ''}`}
            </Description>
            <Description term="微信">
              {`${data.wechat_number || ''}`}
            </Description>
            <Description term="学历">
              {`${data.education || ''}`}
            </Description>
            <Description term="政治面貌">
              {`${data.politics || ''}`}
            </Description>
            <Description term="婚姻状况">
              {`${data.marital_status || ''}`}
            </Description>
            <Description term="身高/体重">
              {`${data.height || ''}  ${(data.height && data.weight) && '/'} ${data.weight || ''}`}
            </Description>
          </DescriptionList>
        </Card>
        <Card type="inner" key="Address" title="">
          <DescriptionList>
            <Description term="现居住地">
              {`
              ${data.living_province_name || ''}
              ${data.living_city_name ? `-${data.living_city_name}` : ''}
              ${data.living_county_name ? `-${data.living_county_name}` : ''}
              ${`${data.living_address || ''}`}
              `}
            </Description>
            <Description term="户口所在地">
              {`
              ${data.household_province_name || ''}
              ${data.household_city_name ? `-${data.household_city_name}` : ''}
              ${data.household_county_name ? `-${data.household_county_name}` : ''}
              ${`${data.household_address || ''}`}
              `}
            </Description>
            <Description term="籍贯">
              {`${data.native_place || ''}`}
            </Description>
            <Description term="钉钉编码">
              {`${data.dingtalk_number || ''}`}
            </Description>
            <Description term="招聘人员">
              {`${data.recruiter_name || ''}`}
            </Description>
            <Description term="紧急联系人">
              {`${data.concat_name || ''} ${data.concat_type ? `(${data.concat_type})` : ''} ${`${data.concat_tel || ''}`}`}
            </Description>
            <Description term="关系人">
              {relatives}
            </Description>
            <Description term="备注">
              {`${data.remark || ''}`}
            </Description>
          </DescriptionList>
        </Card>
      </Spin>
    );
  }
}
