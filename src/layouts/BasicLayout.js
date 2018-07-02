import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, notification } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import './BasiclLayout.less';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
  };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  componentWillMount() {
    const userStorage = localStorage.getItem('oa-current-user') || null;
    window.user = JSON.parse(userStorage) || undefined;
    this.fetchCurrentUser();
  }


  componentDidMount() {
    this.checkOauthPermission();
    // setInterval(this.checkOauthPermission, 1000);
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!Object.keys(nextProps.currentUser).length && !nextProps.loginLoading) {
      notification.error({
        message: '请求错误:',
        description: '获取当前用户信息失败',
      });
      return;
    }

    if (nextProps.currentUser
      !== this.props.currentUser
      && Object.keys(nextProps.currentUser).length
    ) {
      localStorage.setItem('oa-current-user', JSON.stringify(nextProps.currentUser));
      window.user = nextProps.currentUser;
    }
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }

  fetchCurrentUser = () => {
    this.props.dispatch({
      type: 'currentUser/fetchCurrent',
    });
  }

  // handleMenuCollapse = (collapsed) => {
  //   this.props.dispatch({
  //     type: 'global/changeLayoutCollapsed',
  //     payload: collapsed,
  //   });
  // }
  // handleNoticeClear = (type) => {
  //   message.success(`清空了${type}`);
  //   this.props.dispatch({
  //     type: 'global/clearNotices',
  //     payload: type,
  //   });
  // }
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  // handleNoticeVisibleChange = (visible) => {
  //   if (visible) {
  //     this.props.dispatch({
  //       type: 'global/fetchNotices',
  //     });
  //   }
  // }

  checkOauthPermission() {
    if (localStorage.getItem('OA_access_token')
      && localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
      //
    } else if (localStorage.getItem('OA_refresh_token')) {
      this.props.dispatch({
        type: 'oauth/refreshAccessToken',
      });
    } else {
      this.redirectToOaAuthorize();
    }
  }

  redirectToOaAuthorize = () => {
    this.props.dispatch(routerRedux.push('/passport/redirect_to_authorize'));
  }

  render() {
    const {
      currentUser, routerData, match, location,
    } = this.props;
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          // collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            // fetchingNotices={fetchingNotices}
            // notices={notices}
            // collapsed={collapsed}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item =>
                    (
                      <AuthorizedRoute
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                        authority={item.authority}
                        redirectPath="/exception/403"
                      />
                    )
                  )
                }
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                <Redirect exact from="/" to="/dashboard/analysis" />
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              // links={[{
              //   key: 'Pro 首页',
              //   title: 'Pro 首页',
              //   href: 'http://pro.ant.design',
              //   blankTarget: true,
              // }, {
              //   key: 'github',
              //   title: <Icon type="github" />,
              //   href: 'https://github.com/ant-design/ant-design-pro',
              //   blankTarget: true,
              // }, {
              //   key: 'Ant Design',
              //   title: 'Ant Design',
              //   href: 'http://ant.design',
              //   blankTarget: true,
              // }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2018 喜歌实业IT部出品
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => (
            <div className={classNames(params)} style={{ height: '100%' }}>
              {layout}
            </div>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ currentUser, loading }) => ({
  currentUser: currentUser.currentUser,
  loginLoading: loading.models.currentUser,
  // collapsed: global.collapsed,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  // notices: global.notices,
}))(BasicLayout);
