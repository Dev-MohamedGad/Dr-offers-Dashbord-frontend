// User role definitions for Dr.Offers platform

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  level: number; // 1 = highest, 5 = lowest
  color: string;
  icon: string;
}

export interface Permission {
  module: string;
  actions: string[]; // 'create', 'read', 'update', 'delete', 'approve', 'manage'
}

// User role types
export type UserRoleType = 'super_admin' | 'admin' | 'brand_manager' | 'brand_owner' | 'customer';

// Verification status types
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_verified';

// User account status
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_approval';

// Complete user interface matching the provided schema
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Excluded in responses
  brand_name?: string;
  address?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp_number?: string;
  phone_number: string;
  role: UserRoleType;
  image_url?: string;
  refresh_token?: string; // Excluded in responses
  is_phone_verified: boolean;
  is_email_verified: boolean;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  last_login?: string;
  
  // Additional fields for enhanced functionality
  verification_status: VerificationStatus;
  subscription_plan?: 'free' | 'standard' | 'business' | 'premium';
  total_offers?: number;
  active_offers?: number;
  rating?: number;
  location?: {
    city: string;
    emirate: string;
    country: string;
  };
}

// Predefined user roles with permissions
export const USER_ROLES: { [key in UserRoleType]: UserRole } = {
  super_admin: {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Complete system access with all administrative privileges',
    level: 1,
    color: 'danger',
    icon: 'cilShieldAlt',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete', 'approve', 'manage'] },
      { module: 'brands', actions: ['create', 'read', 'update', 'delete', 'approve', 'manage'] },
      { module: 'offers', actions: ['create', 'read', 'update', 'delete', 'approve', 'manage'] },
      { module: 'analytics', actions: ['read', 'manage'] },
      { module: 'system', actions: ['manage', 'configure'] },
      { module: 'permissions', actions: ['manage'] }
    ]
  },
  
  admin: {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access to manage platform operations',
    level: 2,
    color: 'primary',
    icon: 'cilUser',
    permissions: [
      { module: 'users', actions: ['read', 'update', 'approve'] },
      { module: 'brands', actions: ['read', 'update', 'approve', 'manage'] },
      { module: 'offers', actions: ['read', 'update', 'approve', 'manage'] },
      { module: 'analytics', actions: ['read'] },
      { module: 'support', actions: ['manage'] }
    ]
  },
  
  brand_manager: {
    id: 'brand_manager',
    name: 'brand_manager',
    displayName: 'Brand Manager',
    description: 'Manages multiple brands and their offers',
    level: 3,
    color: 'info',
    icon: 'cilBriefcase',
    permissions: [
      { module: 'brands', actions: ['read', 'update'] },
      { module: 'offers', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'analytics', actions: ['read'] },
      { module: 'customers', actions: ['read'] }
    ]
  },
  
  brand_owner: {
    id: 'brand_owner',
    name: 'brand_owner',
    displayName: 'Brand Owner',
    description: 'Owns and manages their brand and offers',
    level: 4,
    color: 'success',
    icon: 'cilGrid',
    permissions: [
      { module: 'brands', actions: ['read', 'update'] }, // own brand only
      { module: 'offers', actions: ['create', 'read', 'update', 'delete'] }, // own offers only
      { module: 'analytics', actions: ['read'] }, // own data only
      { module: 'profile', actions: ['update'] }
    ]
  },
  
  customer: {
    id: 'customer',
    name: 'customer',
    displayName: 'Customer',
    description: 'End user who browses and redeems offers',
    level: 5,
    color: 'secondary',
    icon: 'cilPeople',
    permissions: [
      { module: 'offers', actions: ['read'] },
      { module: 'brands', actions: ['read'] },
      { module: 'profile', actions: ['read', 'update'] },
      { module: 'redemptions', actions: ['create', 'read'] }
    ]
  }
};

// Helper functions
export const getUserRoleInfo = (role: UserRoleType): UserRole => {
  return USER_ROLES[role];
};

export const getUserPermissions = (role: UserRoleType): Permission[] => {
  return USER_ROLES[role].permissions;
};

export const hasPermission = (
  userRole: UserRoleType, 
  module: string, 
  action: string
): boolean => {
  const permissions = getUserPermissions(userRole);
  const modulePermission = permissions.find(p => p.module === module);
  return modulePermission ? modulePermission.actions.includes(action) : false;
};

export const canManageUsers = (role: UserRoleType): boolean => {
  return hasPermission(role, 'users', 'manage') || hasPermission(role, 'users', 'approve');
};

export const canManageBrands = (role: UserRoleType): boolean => {
  return hasPermission(role, 'brands', 'manage') || hasPermission(role, 'brands', 'approve');
};

export const canManageOffers = (role: UserRoleType): boolean => {
  return hasPermission(role, 'offers', 'manage') || hasPermission(role, 'offers', 'approve');
};

export const isAdmin = (role: UserRoleType): boolean => {
  return role === 'super_admin' || role === 'admin';
};

export const isBrandUser = (role: UserRoleType): boolean => {
  return role === 'brand_owner' || role === 'brand_manager';
};

// Verification badge helpers
export const getVerificationBadge = (user: User) => {
  const emailVerified = user.is_email_verified;
  const phoneVerified = user.is_phone_verified;
  
  if (emailVerified && phoneVerified) {
    return { color: 'success', text: 'Fully Verified', icon: 'cilCheckCircle' };
  } else if (emailVerified || phoneVerified) {
    return { color: 'warning', text: 'Partially Verified', icon: 'cilWarning' };
  } else {
    return { color: 'danger', text: 'Not Verified', icon: 'cilXCircle' };
  }
};

// Status badge helpers
export const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return { color: 'success', text: 'Active' };
    case 'inactive':
      return { color: 'secondary', text: 'Inactive' };
    case 'suspended':
      return { color: 'danger', text: 'Suspended' };
    case 'pending_approval':
      return { color: 'warning', text: 'Pending Approval' };
    default:
      return { color: 'secondary', text: status };
  }
};

export default USER_ROLES; 