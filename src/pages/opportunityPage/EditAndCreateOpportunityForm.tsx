import TextError from '@components/Forms/TextError';
import { cilImage } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CContainer,
} from '@coreui/react-pro';
import {
  CreateOpportunitySchema,
  EditOpportunitySchema,
} from '@utils/ValidationSchema';
import { Formik, Field, Form } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import './EditAndCreateOpportunityForm.css';

import { ActionsModalStateType } from 'types';

interface FormTypes {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  about_en: string;
  about_ar: string;
  country: string;
  directions: string;
  number_of_shares: number;
  share_price: number;
  unit_purchase_date: string;
  time_to_exit: number;
  currency: string;
  cta_phone_number: string;
  cta_whatsapp_number: string;
  cta_email: string;
  location_en: string;
  location_ar: string;
  number_of_bathrooms: number;
  number_of_bedrooms: number;
  area: number;
  amenities: string[];
  market_valuation: number;
  market_valuation_date: string;
  rental_yield: number;
  rental_yield_date_from: string;
  rental_yield_date_to: string;
  estimate_sales_range_start: number;
  estimate_sales_range_end: number;
  roi_appreciation_from?: number;
  roi_appreciation_to?: number;
  roi_revenue_from?: number;
  roi_revenue_to?: number;
  phoneNumber: string;
}

interface MediaItem {
  type: string;
  index: number;
  url: string;
  metadata: {
    mime_type: string;
    original_name: string;
    size: number;
  };
  alt_text: string;
}

const EditAndCreateOpportunityForm = ({
  setIsTableVisible,
  setIsFormVisible,
  modalType,
  selectedItem,
  action,
  typeOpportunity,
  onClose,
}: ActionsModalStateType) => {
  const [photos, setPhotos] = React.useState<File[]>([]);
  const token = useSelector((state: any) => state.auth.accessToken);
  const formatDate = (date: string | undefined): string => {
    return date ? new Date(date).toISOString().split('.')[0] + 'Z' : '';
  };

  const createMediaItems = (urls: string[], files: File[]): MediaItem[] => {
    return urls.map((url, index) => ({
      type: 'image',
      index,
      url,
      metadata: {
        mime_type: files[index].type,
        original_name: files[index].name,
        size: files[index].size,
      },
      alt_text: 'Uploaded image',
    }));
  };

  const prepareFormData = (values: FormTypes, mediaUrls: string[]): any => {
    const media = createMediaItems(mediaUrls, photos);

    return {
      media,
      ...values,
      unit_purchase_date: values.unit_purchase_date
        ? formatDate(values.unit_purchase_date)
        : null,
      market_valuation_date: values.market_valuation_date
        ? formatDate(values.market_valuation_date)
        : '',
      rental_yield_date_from: values.rental_yield_date_from
        ? formatDate(values.rental_yield_date_from)
        : '',
      rental_yield_date_to: values.rental_yield_date_to
        ? formatDate(values.rental_yield_date_to)
        : '',
      estimate_sales_range_start:
        typeOpportunity === 'property'
          ? undefined
          : values.estimate_sales_range_start,
      estimate_sales_range_end:
        typeOpportunity === 'property'
          ? undefined
          : values.estimate_sales_range_end,
      roi_appreciation_from:
        typeOpportunity === 'property'
          ? undefined
          : values.roi_appreciation_from,
      roi_appreciation_to:
        typeOpportunity === 'property' ? undefined : values.roi_appreciation_to,
      roi_revenue_from:
        typeOpportunity === 'property' ? undefined : values.roi_revenue_from,
      roi_revenue_to:
        typeOpportunity === 'property' ? undefined : values.roi_revenue_to,
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setPhotos((prevPhotos) => [...prevPhotos, ...Array.from(selectedFiles)]);
    }
  };

  const handleUploadMedia = async (photos: File[]): Promise<string[]> => {
    if (!photos.length) return [];

    const uploadFile = async (photo: File): Promise<string> => {
      const requestBody = {
        original_name: photo.name,
        size: photo.size,
        mime_type: photo.type,
      };

      const signedUrlResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/opportunities/signed-urls`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { data: signedUrl } = await signedUrlResponse.json();

      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: photo,
        headers: { 'Content-Type': photo.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      return signedUrl.split('?')[0];
    };

    try {
      return await Promise.all(photos.map(uploadFile));
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  const onSubmit = async (values: FormTypes) => {
    try {
      const mediaUrls = await handleUploadMedia(photos);
      const formData = prepareFormData(values, mediaUrls);

      if (modalType === 'create') {
        const result = await action({
          body: formData,
          typeOpportunity,
        });

        if ('error' in result) {
          throw new Error('Failed to create opportunity');
        }
      } else {
        // For edit operations, only include changed fields
        const changedFields = Object.keys(values).reduce((acc: any, key) => {
          const valueKey = key as keyof FormTypes;

          // Skip undefined or null values
          if (values[valueKey] === undefined || values[valueKey] === null) {
            return acc;
          }

          // Handle date fields
          if (key.includes('date')) {
            const formattedInitialDate = initialValues[valueKey]
              ? formatDate(initialValues[valueKey] as string)
              : '';
            const formattedNewDate = values[valueKey]
              ? formatDate(values[valueKey] as string)
              : '';

            if (formattedInitialDate !== formattedNewDate) {
              acc[key] = formData[key];
            }
            return acc;
          }

          // Handle arrays (like amenities)
          if (Array.isArray(values[valueKey])) {
            const initialArray = initialValues[valueKey] || [];
            if (
              JSON.stringify(values[valueKey]) !== JSON.stringify(initialArray)
            ) {
              acc[key] = values[valueKey];
            }
            return acc;
          }

          // Handle regular fields
          if (values[valueKey] !== initialValues[valueKey]) {
            acc[key] = values[valueKey];
          }

          return acc;
        }, {});

        // Add media only if there are new photos
        if (photos.length > 0) {
          changedFields.media = formData.media;
        }

        const type = selectedItem?.opportunity_type || typeOpportunity;

        // Only proceed with update if there are changes
        if (Object.keys(changedFields).length > 0) {
          const result = await action({
            id: selectedItem?.id,
            body: changedFields,
            typeOpportunity: type,
          });

          if ('error' in result) {
            throw new Error('Failed to update opportunity');
          }
        } else {
          // No changes were made
          Swal.fire({
            icon: 'info',
            title: 'No changes detected',
            text: 'No updates were necessary',
            showConfirmButton: false,
            timer: 1500,
          });
          onClose?.();
          return;
        }
      }

      Swal.fire({
        icon: 'success',
        title:
          modalType === 'create'
            ? 'Successfully created!'
            : 'Successfully updated!',
        showConfirmButton: false,
        timer: 1500,
      });

      setIsTableVisible?.(true);
      setIsFormVisible?.(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit form. Please try again.',
      });
    }
  };

  const initialValues = {
    // Basic Information
    title_en: selectedItem?.title_en,
    title_ar: selectedItem?.title_ar,
    description_en: selectedItem?.description_en,
    description_ar: selectedItem?.description_ar,
    about_en: selectedItem?.about_en,
    about_ar: selectedItem?.about_ar,

    // Contact Information
    phoneNumber: selectedItem?.phoneNumber,
    cta_email: selectedItem?.cta_email,
    cta_phone_number: selectedItem?.cta_phone_number,
    cta_whatsapp_number: selectedItem?.cta_whatsapp_number,

    // Location Details
    country: selectedItem?.country ?? 'Egypt',
    directions: selectedItem?.directions,
    location_en: selectedItem?.location_en,
    location_ar: selectedItem?.location_ar,

    // Investment Details
    number_of_shares: selectedItem?.number_of_shares,
    share_price: selectedItem?.share_price,
    currency: selectedItem?.currency ?? 'EGP',
    time_to_exit: selectedItem?.time_to_exit,
    unit_purchase_date: selectedItem?.unit_purchase_date
      ? new Date(selectedItem.unit_purchase_date).toISOString().slice(0, 16)
      : '',

    // Property Specifications
    area: selectedItem?.area,
    number_of_bedrooms: selectedItem?.number_of_bedrooms,
    number_of_bathrooms: selectedItem?.number_of_bathrooms,
    amenities: selectedItem?.amenities ?? [],

    // Financial Metrics
    market_valuation: selectedItem?.market_valuation,
    market_valuation_date: selectedItem?.market_valuation_date,
    rental_yield: selectedItem?.rental_yield,
    rental_yield_date_from: selectedItem?.rental_yield_date_from,
    rental_yield_date_to: selectedItem?.rental_yield_date_to,

    // Project-specific Fields
    estimate_sales_range_start: selectedItem?.estimate_sales_range_start,
    estimate_sales_range_end: selectedItem?.estimate_sales_range_end,
    roi_appreciation_from:
      typeOpportunity === 'project'
        ? selectedItem?.roi_appreciation_from
        : undefined,
    roi_appreciation_to:
      typeOpportunity === 'project'
        ? selectedItem?.roi_appreciation_to
        : undefined,
    roi_revenue_from:
      typeOpportunity === 'project'
        ? selectedItem?.roi_revenue_from
        : undefined,
    roi_revenue_to:
      typeOpportunity === 'project' ? selectedItem?.roi_revenue_to : undefined,
  };

  return (
    <CContainer className="form-container py-4">
      {/* Header Section with improved styling */}
      <div className="header-section mb-4">
        <h2 className="form-title">
          {modalType === 'edit' ? 'Edit Opportunity' : 'Create Opportunity'}
        </h2>
        <div className="form-subtitle text-muted">
          Fill in the details below to{' '}
          {modalType === 'edit' ? 'update' : 'create'} your opportunity
        </div>
      </div>

      <CModalBody className="px-0">
        <Formik
          initialValues={initialValues}
          validationSchema={
            modalType === 'edit'
              ? EditOpportunitySchema
              : CreateOpportunitySchema
          }
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Form Section Component */}
              <div className="form-sections">
                {/* Basic Information Card */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-info-circle me-2"></i>
                      Basic Information
                    </h4>
                    <p className="section-description text-muted">
                      Enter the main details of your opportunity
                    </p>
                  </div>

                  <div className="section-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="title_en"
                            name="title_en"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="title_en">Title (English)</label>
                          {errors.title_en && touched.title_en && (
                            <TextError name="title_en" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="title_ar"
                            name="title_ar"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="title_ar">Title (Arabic)</label>
                          {errors.title_ar && touched.title_ar && (
                            <TextError name="title_ar" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="description_en"
                            name="description_en"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="description_en">
                            Description (English)
                          </label>
                          {errors.description_en && touched.description_en && (
                            <TextError name="description_en" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="description_ar"
                            name="description_ar"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="description_ar">
                            Description (Arabic)
                          </label>
                          {errors.description_ar && touched.description_ar && (
                            <TextError name="description_ar" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="about_en"
                            name="about_en"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="about_en">About (English)</label>
                          {errors.about_en && touched.about_en && (
                            <TextError name="about_en" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="about_ar"
                            name="about_ar"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="about_ar">About (Arabic)</label>
                          {errors.about_ar && touched.about_ar && (
                            <TextError name="about_ar" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="phoneNumber"
                            name="phoneNumber"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="phoneNumber">
                            General Phone Number
                          </label>
                          {errors.phoneNumber && touched.phoneNumber && (
                            <TextError name="phoneNumber" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="cta_phone_number"
                            name="cta_phone_number"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="cta_phone_number">
                            CTA Phone Number
                          </label>
                          {errors.cta_phone_number &&
                            touched.cta_phone_number && (
                              <TextError name="cta_phone_number" />
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="cta_whatsapp_number"
                            name="cta_whatsapp_number"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="cta_whatsapp_number">
                            WhatsApp Number
                          </label>
                          {errors.cta_whatsapp_number &&
                            touched.cta_whatsapp_number && (
                              <TextError name="cta_whatsapp_number" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="cta_email"
                            name="cta_email"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="cta_email">Contact Email</label>
                          {errors.cta_email && touched.cta_email && (
                            <TextError name="cta_email" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Upload Section with preview */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-images me-2"></i>
                      Media
                    </h4>
                  </div>

                  <div className="section-content">
                    <div className="media-upload-container">
                      <div className="upload-box p-4 text-center border-dashed">
                        <CIcon icon={cilImage} size="xl" className="mb-3" />
                        <input
                          type="file"
                          id="image"
                          onChange={handleFileChange}
                          multiple
                          className="d-none"
                        />
                        <label htmlFor="image" className="upload-label">
                          <span className="btn btn-outline-primary">
                            Choose Files
                          </span>
                          <span className="ms-2 text-muted">
                            or drag and drop files here
                          </span>
                        </label>
                      </div>

                      {/* Image Preview Grid */}
                      {photos.length > 0 && (
                        <div className="image-preview-grid mt-3">
                          {photos.map((photo, index) => (
                            <div key={index} className="preview-item">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                className="preview-image"
                              />
                              <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => {
                                  const newPhotos = [...photos];
                                  newPhotos.splice(index, 1);
                                  setPhotos(newPhotos);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Details Card */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Location Details
                    </h4>
                  </div>

                  <div className="section-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="country"
                            name="country"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="country">Country</label>
                          {errors.country && touched.country && (
                            <TextError name="country" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="directions"
                            name="directions"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="directions">
                            Directions URL (Google Maps Link)
                          </label>
                          {errors.directions && touched.directions && (
                            <TextError name="directions" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="location_en"
                            name="location_en"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="location_en">
                            Location (English)
                          </label>
                          {errors.location_en && touched.location_en && (
                            <TextError name="location_en" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="location_ar"
                            name="location_ar"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="location_ar">Location (Arabic)</label>
                          {errors.location_ar && touched.location_ar && (
                            <TextError name="location_ar" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Details Card */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-dollar-sign me-2"></i>
                      Investment Details
                    </h4>
                  </div>

                  <div className="section-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="number_of_shares"
                            name="number_of_shares"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="number_of_shares">
                            Number of Shares
                          </label>
                          {errors.number_of_shares &&
                            touched.number_of_shares && (
                              <TextError name="number_of_shares" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="share_price"
                            name="share_price"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="share_price">Share Price</label>
                          {errors.share_price && touched.share_price && (
                            <TextError name="share_price" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="currency"
                            name="currency"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="currency">Currency</label>
                          {errors.currency && touched.currency && (
                            <TextError name="currency" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="time_to_exit"
                            name="time_to_exit"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="time_to_exit">
                            Time to Exit (years)
                          </label>
                          {errors.time_to_exit && touched.time_to_exit && (
                            <TextError name="time_to_exit" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="unit_purchase_date"
                            name="unit_purchase_date"
                            type="datetime-local"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="unit_purchase_date">
                            Unit Purchase Date
                          </label>
                          {errors.unit_purchase_date &&
                            touched.unit_purchase_date && (
                              <TextError name="unit_purchase_date" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="market_valuation_date"
                            name="market_valuation_date"
                            type="datetime-local"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="market_valuation_date">
                            Market Valuation Date
                          </label>
                          {errors.market_valuation_date &&
                            touched.market_valuation_date && (
                              <TextError name="market_valuation_date" />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Specifications Card */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-home me-2"></i>
                      Property Specifications
                    </h4>
                  </div>

                  <div className="section-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="area"
                            name="area"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="area">Area (sq m)</label>
                          {errors.area && touched.area && (
                            <TextError name="area" />
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="number_of_bedrooms"
                            name="number_of_bedrooms"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="number_of_bedrooms">
                            Number of Bedrooms
                          </label>
                          {errors.number_of_bedrooms &&
                            touched.number_of_bedrooms && (
                              <TextError name="number_of_bedrooms" />
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="number_of_bathrooms"
                            name="number_of_bathrooms"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="number_of_bathrooms">
                            Number of Bathrooms
                          </label>
                          {errors.number_of_bathrooms &&
                            touched.number_of_bathrooms && (
                              <TextError name="number_of_bathrooms" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="amenities"
                            name="amenities"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="amenities">
                            Amenities (comma-separated)
                          </label>
                          {errors.amenities && touched.amenities && (
                            <TextError name="amenities" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Metrics Card */}
                <div className="form-section-card mb-4">
                  <div className="section-header">
                    <h4 className="section-title">
                      <i className="fas fa-chart-bar me-2"></i>
                      Financial Metrics
                    </h4>
                  </div>

                  <div className="section-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="market_valuation"
                            name="market_valuation"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="market_valuation">
                            Market Valuation
                          </label>
                          {errors.market_valuation &&
                            touched.market_valuation && (
                              <TextError name="market_valuation" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="rental_yield"
                            name="rental_yield"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="rental_yield">Rental Yield (%)</label>
                          {errors.rental_yield && touched.rental_yield && (
                            <TextError name="rental_yield" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="rental_yield_date_from"
                            name="rental_yield_date_from"
                            type="datetime-local"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="rental_yield_date_from">
                            Rental Yield Period Start
                          </label>
                          {errors.rental_yield_date_from &&
                            touched.rental_yield_date_from && (
                              <TextError name="rental_yield_date_from" />
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating mb-3">
                          <Field
                            id="rental_yield_date_to"
                            name="rental_yield_date_to"
                            type="datetime-local"
                            as={CFormInput}
                            className="form-control"
                          />
                          <label htmlFor="rental_yield_date_to">
                            Rental Yield Period End
                          </label>
                          {errors.rental_yield_date_to &&
                            touched.rental_yield_date_to && (
                              <TextError name="rental_yield_date_to" />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details Card (conditional rendering) */}
                {typeOpportunity !== 'property' && (
                  <div className="form-section-card mb-4">
                    <div className="section-header">
                      <h4 className="section-title">
                        <i className="fas fa-project-diagram me-2"></i>
                        Project Details
                      </h4>
                    </div>

                    <div className="section-content">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="estimate_sales_range_start"
                              name="estimate_sales_range_start"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="estimate_sales_range_start">
                              Estimated Sales Range Start
                            </label>
                            {errors.estimate_sales_range_start &&
                              touched.estimate_sales_range_start && (
                                <TextError name="estimate_sales_range_start" />
                              )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="estimate_sales_range_end"
                              name="estimate_sales_range_end"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="estimate_sales_range_end">
                              Estimated Sales Range End
                            </label>
                            {errors.estimate_sales_range_end &&
                              touched.estimate_sales_range_end && (
                                <TextError name="estimate_sales_range_end" />
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="roi_appreciation_from"
                              name="roi_appreciation_from"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="roi_appreciation_from">
                              ROI Appreciation From (%)
                            </label>
                            {errors.roi_appreciation_from &&
                              touched.roi_appreciation_from && (
                                <TextError name="roi_appreciation_from" />
                              )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="roi_appreciation_to"
                              name="roi_appreciation_to"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="roi_appreciation_to">
                              ROI Appreciation To (%)
                            </label>
                            {errors.roi_appreciation_to &&
                              touched.roi_appreciation_to && (
                                <TextError name="roi_appreciation_to" />
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="roi_revenue_from"
                              name="roi_revenue_from"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="roi_revenue_from">
                              ROI Revenue From (%)
                            </label>
                            {errors.roi_revenue_from &&
                              touched.roi_revenue_from && (
                                <TextError name="roi_revenue_from" />
                              )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <Field
                              id="roi_revenue_to"
                              name="roi_revenue_to"
                              as={CFormInput}
                              className="form-control"
                            />
                            <label htmlFor="roi_revenue_to">
                              ROI Revenue To (%)
                            </label>
                            {errors.roi_revenue_to &&
                              touched.roi_revenue_to && (
                                <TextError name="roi_revenue_to" />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <CModalFooter className="border-top pt-4 mt-4">
                <CButton color="secondary" variant="ghost" onClick={onClose}>
                  Cancel
                </CButton>
                <CButton type="submit" color="primary">
                  {modalType === 'edit' ? 'Update' : 'Create'} Opportunity
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModalBody>
    </CContainer>
  );
};

export default EditAndCreateOpportunityForm;
