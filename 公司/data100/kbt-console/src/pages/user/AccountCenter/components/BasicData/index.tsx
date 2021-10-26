import GeneralForm from '@/components/Form';
import React from 'react';
import { connect } from 'umi';
import { ModalState } from '../../model';

const generalFormColumns = [
  {
    name: 'nickName',
    label: '用户昵称',
    type: 'INPUT',
    placeholder: '请输入用户昵称',
    rules: [{ required: true, message: '请输入用户昵称!' }],
    colSpan: 24,
    colXs: 24,
  },
  {
    name: 'phonenumber',
    label: '手机号码',
    type: 'INPUT',
    placeholder: '请输入手机号码',
    rules: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号!', validateTrigger: ['blur', 'change'] }],
    colSpan: 24,
    colXs: 24,
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'INPUT',
    placeholder: '请输入邮箱',
    rules: [{ type: 'email', message: '请输入正确的邮箱地址!', validateTrigger: ['blur', 'change'] }],
    colSpan: 24,
    colXs: 24,
    disabled: true
  },
  {
    name: 'sex',
    label: '性别',
    type: 'RADIO',
    options: [
      {
        label: '男',
        value: '0'
      },
      {
        label: '女',
        value: '1'
      }
    ],
    colSpan: 24,
    colXs: 24,
  },
];

const BasicData: React.FC<Partial<ModalState>> = (props) => {
  const { currentUser, dispatch }: any = props;

  const onFinish = (values: any) => {
    dispatch({
      type: 'userAndAccountCenter/fetchUpdataCurrent',
      params: values
    });
  }
  
  return (
    currentUser.data ? <GeneralForm
      initialValues={{...currentUser.data}}
      columns={generalFormColumns}
      onFinish={(async (values) => onFinish(values))}
    /> : null
  );
};

export default connect(({ userAndAccountCenter }: { userAndAccountCenter: ModalState }) => ({
  currentUser: userAndAccountCenter.currentUser,
}))(BasicData);
