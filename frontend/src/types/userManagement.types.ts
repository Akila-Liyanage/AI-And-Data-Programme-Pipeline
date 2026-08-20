/**
 * User Management Domain Types
 * Defines interfaces and types for administration of programme user records.
 */

export type UserCategory = 'ADMIN' | 'PERMANENT_STAFF' | 'INTERN';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export interface ManagedUser {
  id: string;
  fullName: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  category: UserCategory | string;
  professionalRole: string;
  department: string;
  accountStatus: AccountStatus | string;
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string;
}
