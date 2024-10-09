import React, { useState } from 'react';
import { Collapse, Card, Tag, Typography, Modal } from 'antd';
import './DraftList.css'; // Create this CSS file to style DraftList

const { Panel } = Collapse;
const { Text } = Typography;

const DraftList = ({ drafts, autofillDraft }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const handleChange = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };

  const showModal = (draftDetails) => {
    setSelectedDraft(draftDetails); // Save the selected draft
    setIsModalVisible(true);        // Open the modal
  };

  const handleOk = () => {
    if (selectedDraft) {
      autofillDraft(selectedDraft);  // Call the autofill function with selected draft details
    }
    setIsModalVisible(false);        // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);        // Close the modal without autofilling
  };

  return (
    <div className="draft-list">
      <h3 style={{ display: 'flex', justifyContent: 'center' }}>Your Drafts</h3>
      <Collapse activeKey={activeKey} onChange={handleChange} accordion>
        {drafts.map((draft, index) => {
          const draftId = Object.keys(draft)[0]; // Get the draft ID
          const draftDetails = draft[draftId];   // Get the draft details

          return (
            <Panel header={draftDetails.prompt} key={draftId}>
              <Card
                bordered={false}
                style={{ marginBottom: '16px', cursor: 'pointer' }}
                onClick={() => showModal(draftDetails)} // Open modal on card click
              >
                <Text strong>Prompt:</Text>
                <p>{draftDetails.prompt}</p>
                <Text strong>Essay:</Text>
                <p>{draftDetails.essay}</p>
                <Text strong>Word Count:</Text>
                <Tag color="blue">{draftDetails.wordCount} words</Tag>
                <br />
                <Text strong>Status:</Text>
                <Tag color={draftDetails.status === 'Mandatory' ? 'red' : 'green'}>
                  {draftDetails.status}
                </Tag>
              </Card>
            </Panel>
          );
        })}
      </Collapse>

      {/* Modal to confirm autofill */}
      <Modal
        title="Complete Draft"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Autofill Form"
        cancelText="Cancel"
      >
        {selectedDraft && (
          <>
            <Text strong>Prompt:</Text>
            <p>{selectedDraft.prompt}</p>
            <Text strong>Essay:</Text>
            <p>{selectedDraft.essay}</p>
            <Text strong>Word Count:</Text>
            <Tag color="blue">{selectedDraft.wordCount} words</Tag>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DraftList;
