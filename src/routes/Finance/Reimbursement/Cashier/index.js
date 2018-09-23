import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../../utils/utils';
import ListComponent from './list/index';

export default class extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout>
        <Switch>
          {
            getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))
          }
          <ListComponent />
        </Switch>
      </PageHeaderLayout>
    );
  }
}
