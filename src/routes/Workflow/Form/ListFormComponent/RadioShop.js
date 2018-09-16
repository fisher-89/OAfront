import React from 'react';
import RadioComponent from './RadioComponent';
import { SearchTable } from '../../../../components/OAForm';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <SearchTable.Shop
          {...this.props}
          showName="text"
          name={{
            value: 'shop_sn',
            text: 'name',
          }}
        />
      </div>
    );
  }
}
