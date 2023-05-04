import React, { FC } from 'react';
import { useAccess } from '../../../hooks/useAccess';
import { message } from 'antd';

/**
 * 权限高阶组件，使用示例：
 * 
 * import WithAccess from '@components/WithAccess';
 * 
 * const WithAccessBtn = WithAccess(你的组件, 可选'button' | 'menu' 默认为button);
 * 
 * <WithAccessBtn permission='permission' />
 * 
 * @param Comp 组件
 * @param type 鉴权类型 按钮：button，菜单：menu
 * @returns 
 */
const WithAccess = (Comp, type = 'button') => {
  const Access = props => {
    const { getPermission } = useAccess();
    const { permission, name, icon, onClick } = props;
    //showVisible是否展示, available是否有权限
    const { showVisible, available } = getPermission(permission, type) || {};
    let initProps = props
    console.log(props);
    const config = () => {
      if (available === 0) {
        return {
          onClick: () => {
            message.info('按钮没有权限')
          }
        }
      }
    }
    return showVisible ? <Comp {...initProps} {...config()}>{name}</Comp> : null;
  }

  return Access;
}

export default WithAccess;