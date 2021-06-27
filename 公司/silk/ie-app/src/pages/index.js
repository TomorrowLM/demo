import {
  Dashboard as DashboardIcon,
  Description as DataSourceProfileListIcon,
  Storage as ProductIcon,
  Backup as NewDataUploadIcon,
  History as ImportDataHistoryIcon,
  BorderAll as ChannelsIcon,
  Person as UsersIcon,
  Settings as SettingsIcon
} from '@material-ui/icons'

import Dashboard from './Dashboard/Dashboard'
import DataSourceProfileList from './DataSourceProfileList/DataSourceProfileList'
import DataProfileDetail from './DataSourceProfileList/DataProfileDetail'
import DataSourceProfile from './DataSourceProfile/DataSourceProfile'
import Products from './Products/Products'
import ProductDetail from './ProductDetail/ProductDetail'
import NewDataUpload from './NewDataUpload/NewDataUpload'
import ImportDataHistory from './ImportDataHistory/ImportDataHistory'
import Channels from './Channels/Channels'
import ChannelDetail from './ChannelDetail/ChannelDetail'
import Users from './Users/Users'
import UserDetail from './Users/UserDetail'
import Settings from './Settings/Settings'

const routes = [
  {
    path: '/dashboard',
    primary: 'nav.dashboard',
    icon: DashboardIcon,
    highlightMenu: '/dashboard',
    isMenuItem: true,
    exact: true,
    component: Dashboard,
    permissionCodes: []
  },
  {
    path: '/data-source-profile/list',
    primary: 'nav.data.source.profile',
    icon: DataSourceProfileListIcon,
    component: DataSourceProfileList,
    highlightMenu: '/data-source-profile/list',
    isMenuItem: true,
    exact: true,
    permissionCodes: [100]
  },
  {
    path: '/data-source-profile/:id',
    primary: 'nav.data.source.profile.view',
    component: DataProfileDetail,
    highlightMenu: '/data-source-profile/list',
    isMenuItem: false,
    exact: true,
    permissionCodes: [10004]
  },
  {
    path: '/data-source-profile',
    primary: 'page.data.source.profile.page.title',
    component: DataSourceProfile,
    highlightMenu: '/data-source-profile/list',
    isMenuItem: false,
    exact: true,
    permissionCodes: [10002]
  },
  {
    path: '/products',
    primary: 'nav.products',
    icon: ProductIcon,
    component: Products,
    isMenuItem: true,
    exact: true,
    permissionCodes: [200],
    highlightMenu: '/products'
  },
  {
    path: '/products/:id',
    primary: 'nav.product.detail',
    component: ProductDetail,
    exact: true,
    permissionCodes: [20004],
    highlightMenu: '/products'
  },
  {
    path: '/new-data-upload',
    primary: 'nav.data.import.new.upload',
    icon: NewDataUploadIcon,
    component: NewDataUpload,
    isMenuItem: true,
    exact: true,
    permissionCodes: [20002],
    highlightMenu: '/new-data-upload'
  },
  {
    path: '/import-data-history',
    primary: 'nav.data.import.history',
    icon: ImportDataHistoryIcon,
    component: ImportDataHistory,
    isMenuItem: true,
    exact: true,
    permissionCodes: [700],
    highlightMenu: '/import-data-history'
  },
  {
    path: '/channels',
    primary: 'nav.channels',
    icon: ChannelsIcon,
    component: Channels,
    isMenuItem: true,
    exact: true,
    permissionCodes: [500],
    highlightMenu: '/channels'
  },
  {
    path: '/channels/:channelId',
    component: ChannelDetail,
    primary: 'nav.channel',
    exact: true,
    isBackButtonHidden: true,
    permissionCodes: [50002],
    highlightMenu: '/channels'
  },
  {
    path: '/users',
    primary: 'nav.users',
    icon: UsersIcon,
    component: Users,
    isMenuItem: true,
    exact: true,
    permissionCodes: [300],
    highlightMenu: '/users'
  },
  {
    path: '/users/add',
    primary: 'nav.users.add',
    component: UserDetail,
    exact: true,
    permissionCodes: [30002],
    highlightMenu: '/users'
  },
  {
    path: '/users/:id',
    primary: 'nav.users.edit',
    component: UserDetail,
    exact: true,
    permissionCodes: [30004],
    highlightMenu: '/users'
  },
  {
    path: '/settings',
    primary: 'nav.settings',
    icon: SettingsIcon,
    component: Settings,
    exact: true,
    permissionCodes: [1000],
    highlightMenu: '/settings'
  }
]
export default routes
