export const BOOKING_FIELDS = (
  idProperty: number[] = [],
  nameProperty: string[] = []
) =>
  [
    {
      label: 'Property',
      name: 'property_id',
      type: 'select',
      options: idProperty.map((id, index) => ({
        value: id.toString(),
        label: nameProperty[index] || `Property ${id}`,
      })),
    },
    {
      label: 'Date Range',
      name: 'from',
      type: 'daterange',
    },
    { label: 'Customer ID', name: 'customer_id', type: 'number' },
  ] as const;
