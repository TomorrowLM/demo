import GeneralForm from '@/components/Form';
import React from 'react';
import { connect } from 'umi';
import { ModalState } from '../../model';

const generalFormColumns = [
  {
    name: 'oldPassword',
    label: '旧密码',
    type: 'INPUT',
    mode: 'password',
    placeholder: '请输入旧密码',
    rules: [{ required: true, message: '请输入旧密码!' }],
    colSpan: 24,
    colXs: 24,
  },
  {
    name: 'newPassword1',
    label: '新密码',
    type: 'INPUT',
    mode: 'password',
    placeholder: '请输入新密码',
    rules: [{ required: true, min: 6, max: 20, message: '长度在 6 到 20 个字符!' }],
    colSpan: 24,
    colXs: 24,
  },
  {
    name: 'newPassword2',
    label: '确认密码',
    type: 'INPUT',
    mode: 'password',
    placeholder: '请输入新密码',
    rules: [
      {
        required: true,
        message: '请输入新密码!',
      },
      ({ getFieldValue }: any) => ({
        validator(rule: any, value: any) {
          if (!value || getFieldValue('newPassword1') === value) {
            return Promise.resolve();
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('两次输入的密码不一致!');
        },
      }),
    ],
    colSpan: 24,
    colXs: 24,
  }
];

const ResetPassword: React.FC<Partial<ModalState>> = (props) => {
  const { currentUser, dispatch }: any = props;

  const onFinish = (values: any) => {
    dispatch({
      type: 'userAndAccountCenter/fetchUpdataCurrentPwd',
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
}))(ResetPassword);
