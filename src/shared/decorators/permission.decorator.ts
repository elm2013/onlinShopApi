import { createParamDecorator, ForbiddenException } from '@nestjs/common';

const userPermissions = async (user: any, perm: string) => {
  let permissions = [];
  user.role.permissions.forEach(p => {
    permissions.push(p.name);
  });


  return permissions.includes(perm);
};

export const PanelPermission = createParamDecorator(
  async (permission: string, req) => {
    let result = await userPermissions(req.args[0].user, permission);
    if (!result) throw new ForbiddenException();
    return result;
  },
);