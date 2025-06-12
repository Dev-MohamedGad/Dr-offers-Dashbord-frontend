import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro';
import React, { useState } from 'react';
import { ActionsModalStateType } from 'types';
import Swal from 'sweetalert2';

const DeleteModal: React.FC<ActionsModalStateType> = ({
  visible,
  setVisible,
  modalTitle,
  action,
  selectedItem,
  isDeleteByEmail,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitChanges = async () => {
    try {
      setIsLoading(true);
      if (isDeleteByEmail) {
        await action(selectedItem?.email);
      } else {
        await action(selectedItem?.id as number);
      }
      setVisible?.(false);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>You want to delete {selectedItem?.name}?</div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => setVisible?.(false)}
          disabled={isLoading}
        >
          Close
        </CButton>
        <CButton color="danger" onClick={submitChanges} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Delete'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteModal;
