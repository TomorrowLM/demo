// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser }: any = initialState || {};
  return {
    canPermissions: (key: string): boolean => {
      if (currentUser) {
        return currentUser.permissions.includes('*:*:*') || currentUser.permissions.includes(key)
      } 
      return false
    }
  };
}
