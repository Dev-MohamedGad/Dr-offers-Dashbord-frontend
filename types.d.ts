import { Item } from '@coreui/react-pro/src/components/smart-table/types';

export type FormikMessageErrorType = {
  name: string;
};
export type LoginValuesType = {
  email: string;
  password: string;
};

export type TokenStateType = {
  auth: {
    accessToken: string;
    refreshToken: string;
  };
};

export type ActionsModalStateType = {
  isFormVisible?: boolean;
  isTableVisible?: boolean;
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  modalTitle?: string;
  setIsFormVisible?: (visible: boolean) => void;
  setIsTableVisible?: (visible: boolean) => void;
  modalType?: string;
  action: any;
  selectedItem?: Item;
  typeOpportunity?: string;
  onClose?: () => void;
  idProperty?: number[];
  nameProperty?: string[];
  isDeleteByEmail?: boolean;
};
