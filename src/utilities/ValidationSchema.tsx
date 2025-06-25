import * as yup from 'yup';

export const SignInSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .min(8, 'Password must be at least 8 characters long'),
  email: yup.string().required('Email is required'),
});

export const CreateUserSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  name: yup.string().required('Name is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .min(8, 'Password must be at least 8 characters long'),
  address: yup.string().required('Address is required'),
  facebook_url: yup
    .string()
    .url('Please enter a valid Facebook URL')
    .required('Facebook URL is required'),
  instagram_url: yup
    .string()
    .url('Please enter a valid Instagram URL')
    .required('Instagram URL is required'),
  linkedin_url: yup
    .string()
    .url('Please enter a valid LinkedIn URL')
    .required('LinkedIn URL is required'),
  whatsapp_number: yup
    .string()
    .required('WhatsApp number is required')
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid WhatsApp number'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid phone number'),
  image_url: yup
    .string()
    .url('Please enter a valid image URL')
    .required('Image URL is required'),
  role: yup
    .string()
    .oneOf(['visitor', 'admin', 'owner'], 'Invalid role')
    .required('Role is required'),
});

export const EditUserSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').optional(),
  name: yup.string().optional(),
  password: yup
    .string()
    .optional()
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .min(8, 'Password must be at least 8 characters long'),
  address: yup.string().optional(),
  phone_number: yup
    .string()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid phone number')
    .optional(),
  whatsapp_number: yup
    .string()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid WhatsApp number')
    .optional(),
  facebook_url: yup
    .string()
    .url('Please enter a valid Facebook URL')
    .optional(),
  instagram_url: yup
    .string()
    .url('Please enter a valid Instagram URL')
    .optional(),
  linkedin_url: yup
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
  image_url: yup
    .string()
    .url('Please enter a valid image URL')
    .optional(),
  role: yup
    .string()
    .oneOf(['visitor', 'admin', 'owner'], 'Invalid role')
    .optional(),
  is_phone_verified: yup.boolean().optional(),
  is_email_verified: yup.boolean().optional(),
  is_active: yup.boolean().optional(),
});

export const EditAndCreateProfessionalSchema = yup.object().shape({
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid Status')
    .required('Status is required'),
  name: yup.string().required('name is required'),
  phoneNumber: yup
    .string()
    .required('phone number is required')
    .min(8, 'Phone number must be at least 8 characters long')
    .max(20, 'Phone number must be at most 20 characters long'),
});

export const EditAndCreateBranchSchema = yup.object().shape({
  address: yup.string().required('address is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('emails is required'),
  branchAdminEmail: yup
    .string()
    .email('Please enter a valid email')
    .required('branch admin email is required'),
  name: yup.string().required('name is required'),
  areaId: yup.string().required('area is required'),
  phoneNumber: yup
    .string()
    .required('phone number is required')
    .min(8, 'Phone number must be at least 8 characters long')
    .max(20, 'Phone number must be at most 20 characters long'),
});

export const EditAndCreateServiceSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Invalid Gender')
    .required('Gender is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid Status')
    .required('Status is required'),
});

export const EditAndCreateAreasSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  country: yup.string().required('country is required'),
  city: yup.string().required('city is required'),
});

export const CreateOpportunitySchema = yup.object().shape({
  // Basic Information
  title_en: yup.string().required('Title in English is required'),
  title_ar: yup.string().required('Title in Arabic is required'),
  description_en: yup.string().required('Description in English is required'),
  description_ar: yup.string().required('Description in Arabic is required'),
  about_en: yup.string().required('About in English is required'),
  about_ar: yup.string().required('About in Arabic is required'),

  // Location Information
  country: yup.string().required('Country is required'),
  location_en: yup.string().required('Location in English is required'),
  location_ar: yup.string().required('Location in Arabic is required'),
  directions: yup
    .string()
    .required('Directions are required')
    .url('Directions must be a valid URL'),

  // Property Details
  area: yup
    .number()
    .required('Area is required')
    .integer('Area must be an integer')
    .positive('Area must be positive'),
  number_of_bedrooms: yup
    .number()
    .required('Number of bedrooms is required')
    .integer('Number of bedrooms must be an integer')
    .positive('Number of bedrooms must be positive'),
  number_of_bathrooms: yup
    .number()
    .required('Number of bathrooms is required')
    .integer('Number of bathrooms must be an integer')
    .positive('Number of bathrooms must be positive'),
  amenities: yup
    .array()
    .of(yup.string())
    .transform((value) => {
      if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim());
      }
      return value || [];
    }),

  // Investment Details
  currency: yup.string().required('Currency is required'),
  share_price: yup
    .number()
    .required('Share price is required')
    .integer('Share price must be an integer')
    .positive('Share price must be positive'),
  number_of_shares: yup
    .number()
    .required('Number of shares is required')
    .integer('Number of shares must be an integer')
    .positive('Number of shares must be positive'),
  time_to_exit: yup
    .number()
    .required('Time to exit is required')
    .integer('Time to exit must be an integer')
    .positive('Time to exit must be positive'),

  // Valuation and Returns
  market_valuation: yup
    .number()
    .positive('Market valuation must be positive')
    .required('Market valuation is required'),
  rental_yield: yup
    .number()
    .positive('Rental yield must be positive')
    .required('Rental yield is required'),
  market_valuation_date: yup
    .date()
    .typeError('Must be a valid date in YYYY-MM-DD format')
    .required('Market valuation date is required'),
  rental_yield_date: yup
    .date()
    .typeError('Must be a valid date in YYYY-MM-DD format')
    .required('Rental yield date is required'),
  unit_purchase_date: yup
    .date()
    .typeError('Must be a valid date in YYYY-MM-DD format')
    .required('Unit purchase date is required'),

  // ROI Projections
  roi_appreciation_from: yup
    .number()
    .nullable()
    .positive('ROI appreciation from must be positive')
    .integer('ROI appreciation from must be an integer')
    .optional(),
  roi_appreciation_to: yup
    .number()
    .nullable()
    .positive('ROI appreciation to must be positive')
    .integer('ROI appreciation to must be an integer')
    .optional(),
  roi_revenue_from: yup
    .number()
    .nullable()
    .positive('ROI revenue from must be positive')
    .integer('ROI revenue from must be an integer')
    .optional(),
  roi_revenue_to: yup
    .number()
    .nullable()
    .positive('ROI revenue to must be positive')
    .integer('ROI revenue to must be an integer')
    .optional(),

  // Sales Estimates
  estimate_sales_range_start: yup
    .number()
    .nullable()
    .positive('Estimate sales range start must be positive')
    .optional(),
  estimate_sales_range_end: yup
    .number()
    .nullable()
    .positive('Estimate sales range end must be positive')
    .min(
      yup.ref('estimate_sales_range_start'),
      'End range must be greater than start range'
    )
    .optional(),

  // Contact Information
  cta_phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  cta_whatsapp_number: yup.string().required('WhatsApp number is required'),
  cta_email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export const EditOpportunitySchema = yup.object().shape({
  // Basic Information
  title_en: yup.string().nullable().optional(),
  title_ar: yup.string().nullable().optional(),
  description_en: yup.string().nullable().optional(),
  description_ar: yup.string().nullable().optional(),
  about_en: yup.string().nullable().optional(),
  about_ar: yup.string().nullable().optional(),

  // Location Details
  country: yup.string().nullable().optional(),
  location_en: yup.string().nullable().optional(),
  location_ar: yup.string().nullable().optional(),
  directions: yup.string().url('Must be a valid URL').nullable().optional(),

  // Property Specifications
  area: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  number_of_bedrooms: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  number_of_bathrooms: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  amenities: yup
    .array()
    .of(yup.string())
    .transform((value) => {
      if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim());
      }
      return value || [];
    })
    .optional(),

  // Financial Details
  currency: yup.string().optional(),
  share_price: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  number_of_shares: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  time_to_exit: yup
    .number()
    .nullable()
    .integer('Must be an integer')
    .positive('Must be positive')
    .optional(),
  market_valuation: yup
    .number()
    .nullable()
    .positive('Must be positive')
    .optional(),
  rental_yield: yup.number().nullable().positive('Must be positive').optional(),

  // ROI and Estimates
  roi_appreciation_from: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .integer('Must be an integer')
    .optional(),
  roi_appreciation_to: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .integer('Must be an integer')
    .optional(),
  roi_revenue_from: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .integer('Must be an integer')
    .optional(),
  roi_revenue_to: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .integer('Must be an integer')
    .optional(),
  estimate_sales_range_start: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .optional(),
  estimate_sales_range_end: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Must be positive')
    .when('estimate_sales_range_start', {
      is: (val: number) => val !== null && !isNaN(val),
      then: (schema) =>
        schema.min(
          yup.ref('estimate_sales_range_start'),
          'Must be greater than start range'
        ),
    })
    .optional(),

  // Contact Information
  cta_phone_number: yup
    .string()
    .nullable()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),
  cta_whatsapp_number: yup.string().nullable().optional(),
  cta_email: yup.string().email('Invalid email address').nullable().optional(),
});

export const CreateBookingSchema = yup.object().shape({
  from: yup.date().required('From is required'),
  to: yup.date().required('To is required'),
  property_id: yup.string().required('Property is required'),
  customer_id: yup.string().required('Customer is required'),
});

export const NewsletterSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});