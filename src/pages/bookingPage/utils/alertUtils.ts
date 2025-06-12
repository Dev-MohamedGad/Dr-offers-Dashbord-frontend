import Swal from 'sweetalert2';

export const showLoadingModal = () => {
  Swal.fire({
    title: 'Processing...',
    didOpen: () => Swal.showLoading(),
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  });
};

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 1500,
  });
};

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonText: 'OK',
  });
};

export const confirmModalClose = async (
  setVisible: (value: boolean) => void
) => {
  setVisible(false);
};
