export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  BRANCH_HR: 'BRANCH_HR',
  HEAD_HR: 'HEAD_HR'
};

export function isEmployeeRole(role) {
  return role === ROLES.EMPLOYEE;
}

export function isSelfServiceMobileRole(role) {
  return [ROLES.EMPLOYEE, ROLES.BRANCH_HR, ROLES.HEAD_HR].includes(role);
}
