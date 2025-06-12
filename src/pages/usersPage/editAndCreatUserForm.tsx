import TextError from '@components/Forms/TextError';
import { cilUser, cilLockLocked, cilMediaEject, cilPhone } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
} from '@coreui/react-pro';
import { useUpdateUserApiSliceMutation } from '@redux/slices/usersSlice/usersApiSlice';
import { EditUserSchema } from '@utils/ValidationSchema';
import { CreateUserSchema } from '@utils/ValidationSchema';
import { Formik, Field, Form } from 'formik';
import { ActionsModalStateType } from 'types';
import Swal from 'sweetalert2';

const EditAndCreateUserForm = ({
  visible,
  setVisible,
  modalTitle,
  modalType,
  selectedItem,
  action,
}: ActionsModalStateType) => {
  const [updateUserApiSlice] = useUpdateUserApiSliceMutation();

  const initialValues = {
    email: selectedItem?.email || '',
    password: selectedItem?.password || '',
    name: selectedItem?.name || '',
    gender: selectedItem?.gender || '',
    phone_number: selectedItem?.phone_number || '',
    image_url: 'https://example.com/image.jpg',
    secondary_email: selectedItem?.secondary_email || '',
    country: selectedItem?.country || '',
    birth_date: selectedItem?.birth_date || '',
    job_title: selectedItem?.job_title || '',
    role: selectedItem?.role || '',
  };
  type FormTypes = {
    email: string;
    password: string;
    name: string;
    gender: string;
    phone_number: string;
    image_url: string;
    secondary_email: string;
    country: string;
    birth_date: string;
    job_title: string;
    role: string;
  };

  const onSubmit = async (values: FormTypes) => {
    const id = selectedItem?.id;
    if (modalType === 'create') {
      const body = {
        name: values.name,
        email: values.email,
        password: values.password,
        gender: values.gender,
        phone_number: values.phone_number,
        image_url: values.image_url,
        secondary_email: values.secondary_email,
        country: values.country,
        birth_date: values.birth_date,
        job_title: values.job_title,
        role: values.role,
      };
      try {
        if (!action) {
          throw new Error('Action is not defined');
        }
        await action(body).unwrap();
        setVisible?.(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User created successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error creating user:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err instanceof Error ? err.message : 'Failed to create user. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    } else {
      const body = {
        name: values.name || undefined,
        email: values.email || undefined,
        password: values.password || undefined,
        gender: values.gender || undefined,
        phone_number: values.phone_number || undefined,
        image_url: values.image_url || undefined,
        secondary_email: values.secondary_email || undefined,
        country: values.country || undefined,
        birth_date: values.birth_date || undefined,
        job_title: values.job_title || undefined,
        role: values.role || undefined,
      };

      try {
        if (!id) {
          throw new Error('User ID is not defined');
        }
        await updateUserApiSlice({ id, body }).unwrap();
        setVisible?.(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error updating user:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err instanceof Error ? err.message : 'Failed to update user. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible?.(false)}
      aria-labelledby="EditAndCreateUserForm"
    >
      <CModalHeader>
        <CModalTitle id="EditAndCreateUserForm">{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Formik
          validationSchema={
            modalType === 'create' ? CreateUserSchema : EditUserSchema
          }
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors, touched, values }) => (
            <Form>
              <CInputGroup className="mb-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilMediaEject} />
                </CInputGroupText>
                <Field
                  name="email"
                  as={CFormInput}
                  placeholder="Email"
                  autoComplete="email"
                  type="email"
                  value={values.email}
                />
              </CInputGroup>
              {errors.email && touched.email ? (
                <TextError name="email" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilMediaEject} />
                </CInputGroupText>
                <Field
                  name="secondary_email"
                  as={CFormInput}
                  placeholder="Secondary Email"
                  type="email"
                  value={values.secondary_email}
                />
              </CInputGroup>
              {errors.secondary_email && touched.secondary_email ? (
                <TextError name="secondary_email" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilPhone} />
                </CInputGroupText>
                <Field
                  name="phone_number"
                  as={CFormInput}
                  placeholder="Phone Number"
                  autoComplete="phone"
                  type="text"
                  value={values.phone_number}
                />
              </CInputGroup>
              {errors.phone_number && touched.phone_number ? (
                <TextError name="phone_number" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <Field
                  name="name"
                  as={CFormInput}
                  type="name"
                  placeholder="name"
                  autoComplete="current-name"
                  value={values.name}
                />
              </CInputGroup>
              {errors.name && touched.name ? <TextError name="name" /> : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <Field
                  name="password"
                  as={CFormInput}
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={values.password}
                />
              </CInputGroup>
              {errors.password && touched.password ? (
                <TextError name="password" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <Field
                  name="country"
                  as={CFormInput}
                  placeholder="Country"
                  value={values.country}
                />
              </CInputGroup>
              {errors.country && touched.country ? (
                <TextError name="country" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <Field
                  name="birth_date"
                  as={CFormInput}
                  type="date"
                  placeholder="Birth Date"
                  value={values.birth_date}
                />
              </CInputGroup>
              {errors.birth_date && touched.birth_date ? (
                <TextError name="birth_date" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <Field
                  name="job_title"
                  as={CFormInput}
                  placeholder="Job Title"
                  value={values.job_title}
                />
              </CInputGroup>
              {errors.job_title && touched.job_title ? (
                <TextError name="job_title" />
              ) : null}

              <CInputGroup className="my-2">
                {/* <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilImage} />
                </CInputGroupText> */}
                {/* <CFormInput
                  disabled={true}
                  
                  type="file"
                  accept="image/*"
                  //  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  value="https://example.com/image.jpg"
                /> */}
              </CInputGroup>
              {/* {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="User Image"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                </div>
              )}
              {errors.image_url && touched.image_url ? (
                <TextError name="image_url" />
              ) : null} */}

              <CInputGroup className="my-2">
                <Field
                  id="male"
                  label="Male"
                  value="male"
                  name="gender"
                  as={CFormCheck}
                  type="radio"
                  autoComplete="male"
                  defaultChecked={selectedItem?.gender === 'male'}
                />

                <Field
                  id="female"
                  label="Female"
                  value="female"
                  name="gender"
                  as={CFormCheck}
                  type="radio"
                  autoComplete="female"
                  defaultChecked={selectedItem?.gender === 'female'}
                  className="ms-3"
                />
              </CInputGroup>
              {errors.gender && touched.gender ? (
                <TextError name="gender" />
              ) : null}

              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white text-secondary">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <Field
                  name="role"
                  as={CFormInput}
                  placeholder="Role"
                  value={values.role}
                />
              </CInputGroup>
              {errors.role && touched.role ? <TextError name="role" /> : null}

              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible?.(false)}>
                  Close
                </CButton>
                <CButton color="primary" type="submit">
                  Save changes
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModalBody>
    </CModal>
  );
};

export default EditAndCreateUserForm;
