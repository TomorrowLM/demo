import { Directive, DirectiveBinding } from 'vue';

/**
 * 按钮权限校验
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 「超级管理员」拥有所有的按钮权限
    return true;
    // const { value } = binding;
    // if (value) {
    //   // const requiredPerms = value; // DOM绑定需要的按钮权限标识
    //   // const hasPerm = user.perms?.some(perm => {
    //   //   return requiredPerms.includes(perm);
    //   // });

    //   if (!hasPerm1) {
    //     el.parentNode && el.parentNode.removeChild(el);
    //   }
    // } else {
    //   throw new Error(
    //     "need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\""
    //   );
    // }
  }
};

/**
 * 角色权限校验
 */
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    return true;
    // const { value } = binding;

    // if (value) {
    //   const roles = storage.get('roles');
    //   const requiredRoles = value; // DOM绑定需要的角色编码
    //   const hasRole = roles.some((role: string) => {
    //     return requiredRoles.includes(role);
    //   });

    //   if (!hasRole) {
    //     el.parentNode && el.parentNode.removeChild(el);
    //   }
    // } else {
    //   throw new Error("need roles! Like v-has-role=\"['admin','test']\"");
    // }
  }
};
