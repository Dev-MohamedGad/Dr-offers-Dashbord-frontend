import{ useEffect, useState } from 'react';
import {
  CButton,
  CCardBody,
  CCollapse,
  CSmartTable,
} from '@coreui/react-pro';

import type { Item } from '@coreui/react-pro/src/components/smart-table/types';

import DeleteModal from '@components/DeleteModal';
import EditAndCreateNewsLetterForm from './editAndCreateNewsLetterForm';
import EmptyState from '@components/EmptyState';
import {
  useRemoveNewsletterMutation,
  useNewsletterListQuery,
  useAddNewsletterMutation
} from '@redux/slices/newletters/newsletterApiSlice';

const NewsletterPage = () => {
  const [details, setDetails] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [removeNewsletter] = useRemoveNewsletterMutation();
  const { data:newsletters, isLoading } = useNewsletterListQuery();
  const [addNewsletter] = useAddNewsletterMutation();
  const columns = [
    {
      key: 'email',
      _style: { width: '40%' },
    },
    {
      key: 'created_at',
      label: 'Created At',
      _style: { width: '40%' },
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '20%' },
      filter: false,
      sorter: false,
    },
  ];
  const toggleDetails = (index: number) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  const openCreateModal = () => {
    setSelectedItem({});
    setVisible(true);
  };
 
  const deleteItem = (item: Item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  return (
    <div className="py-5">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end">
            <CButton className="primary-btn" onClick={openCreateModal}>
              Create Newsletter
            </CButton>
          </div>
          <DeleteModal
            visible={deleteModal}
            selectedItem={selectedItem}
            isDeleteByEmail={true}
            setVisible={setDeleteModal}
            modalTitle="Delete Newsletter"
            action={removeNewsletter}
          />
          <EditAndCreateNewsLetterForm
            visible={visible}
            setVisible={setVisible}
            modalTitle="Add Newsletter Subscription"
            modalType="create"
            selectedItem={selectedItem}
            action={addNewsletter}
          />
          
          {newsletters?.data?.length === 0 ? (
            <EmptyState 
              title="No Newsletter Subscriptions"
              description="No users have subscribed to the newsletter yet. Newsletter subscriptions will appear here."
              actionButton={{
                text: "Create Newsletter Subscription",
                onClick: openCreateModal,
                color: "primary"
              }}
            />
          ) : (
            <CSmartTable
              
                sorterValue={{ column: 'email', state: 'asc' }}
                clickableRows
                tableProps={{
                  striped: true,
                  hover: true,
                }}
                activePage={1}
                items={newsletters?.data || []}
                columns={columns}
                columnFilter
                tableFilter
                cleaner
                itemsPerPageSelect
                itemsPerPage={10}
                columnSorter
                pagination
                scopedColumns={{
                  created_at: (item: Item) => (
                    <td>
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  ),
                  show_details: (item: Item) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            toggleDetails(item.id ?? 0);
                          }}
                        >
                          {details.includes(item.id ?? 0) ? 'Hide' : 'Show'}
                        </CButton>
                      </td>
                    );
                  },
                  details: (item: Item) => {
                    return (
                      <CCollapse visible={details.includes(item.id ?? 0)}>
                        <CCardBody className="gap-3 p-2 d-flex">
                       
                          <CButton
                            size="sm"
                            color="danger"
                            className="ml-1"
                            onClick={() => deleteItem(item)}
                          >
                            Delete
                          </CButton>
                        </CCardBody>
                      </CCollapse>
                    );
                  },
                }}
              />
          )}
        </>
      )}
    </div>
  );
};

export default NewsletterPage;
