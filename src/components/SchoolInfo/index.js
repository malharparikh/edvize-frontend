import React, { useState } from 'react';
import { Typography, Collapse, Tag, Card, Carousel, Modal } from 'antd';
import './SchoolInfo.css';
import { universityData } from '../../resources/colleges_15';
import { commonAppEssayPrompts } from '../../resources/commonAppPrompts';

const { Title, Text } = Typography;
const { Panel } = Collapse;

function SchoolInfo({ university, onSelectPrompt }) {
  const [activeKey, setActiveKey] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const appTypes = universityData?.[university]?.applications?.appType || [];
  const prompts = universityData?.[university]?.prompts || [];

  const handleChange = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };

  const handlePromptClick = (prompt, wordCount) => {
    setSelectedPrompt({ prompt, wordCount });
    setIsModalVisible(true); // Show the modal on click
  };

  const handleModalOk = () => {
    onSelectPrompt(selectedPrompt.prompt, selectedPrompt.wordCount);
    setIsModalVisible(false); // Close modal on confirmation
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close modal on cancel
  };

  const groupedPrompts = prompts.reduce((acc, prompt) => {
    const categories = Array.isArray(prompt?.category) ? prompt.category : [prompt?.category];
    categories.forEach((category) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(prompt);
    });
    return acc;
  }, {});

  return (
    <div className="school-info">
      <div className="university-header">
        <span className="university-name">{universityData?.[university]?.Name ? universityData[university].Name : 'University'} Requirements</span>
      </div>

      {university in universityData ? (
        <>
          <div className="app-types">
            <Title level={4}>Application Types</Title>
            <div className="tag-container">
              {appTypes?.map((item, index) => (
                <Tag color="blue" key={index} className="tag-item">
                  {item}
                </Tag>
              ))}
            </div>
          </div>

          <div className="common-app-prompts">
            <Title level={4}>Personal Statement</Title>
            <Collapse activeKey={activeKey} onChange={handleChange} accordion style={{padding: '0px'}}>
              <Panel header="Common App Essay" key="commonAppPrompts">
                <Carousel 
                  className="carousel" 
                  dotPosition='bottom'
                  dots={true}
                  arrows={true}
                >
                  {commonAppEssayPrompts.map((prompt, index) => (
                    <div 
                      key={index} 
                      className="carousel-slide"
                      onClick={() => handlePromptClick(prompt, '650')} // Assuming a common 650-word count for Common App
                    >
                      <Text>{prompt}</Text>
                    </div>
                  ))}
                </Carousel>
              </Panel>
            </Collapse>
          </div>

          <div className="prompts-section">
            <Title level={5}>Supplements</Title>
            <Collapse activeKey={activeKey} onChange={handleChange} accordion>
              {Object.entries(groupedPrompts).map(([category, prompts], index) => (
                <Panel header={category} key={category}>
                  {prompts.length > 1 ? (
                    <Carousel
                      className="carousel"
                      dotPosition="bottom"
                      dots={true}
                      arrows={true}
                    >
                      {prompts.map((prompt, idx) => (
                        <div 
                          key={idx} 
                          className="carousel-slide"
                          onClick={() => handlePromptClick(prompt.prompt, prompt.wordCount)}
                        >
                          <Card bordered={false} style={{ marginBottom: '16px' }}>
                            <Text strong>Status: </Text>
                            <Tag color={prompt?.status === 'Mandatory' ? 'red' : 'green'}>
                              {prompt?.status}
                            </Tag>
                            <br />
                            <Text strong>Word Count: </Text>
                            <Tag color="blue">{prompt?.wordCount} words</Tag>
                            <br />
                            <Text strong>Prompt: </Text>
                            <p>{prompt?.prompt}</p>
                          </Card>
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <Card 
                      bordered={false} 
                      style={{ marginBottom: '16px' }} 
                      onClick={() => handlePromptClick(prompts[0].prompt, prompts[0].wordCount)}
                    >
                      <Text strong>Status: </Text>
                      <Tag color={prompts[0]?.status === 'Mandatory' ? 'red' : 'green'}>
                        {prompts[0]?.status}
                      </Tag>
                      <br />
                      <Text strong>Word Count: </Text>
                      <Tag color="blue">{prompts[0]?.wordCount} words</Tag>
                      <br />
                      <Text strong>Prompt: </Text>
                      <p>{prompts[0]?.prompt}</p>
                    </Card>
                  )}
                </Panel>
              ))}
            </Collapse>
          </div>
        </>
      ) : (
        <Text>Sorry, we don't have any information on this school yet.</Text>
      )}

      {/* Modal for prompt confirmation */}
      <Modal
        title="Confirm Selection"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to select this prompt for your essay?</p>
        {selectedPrompt && (
          <>
            <p><strong>Prompt:</strong> {selectedPrompt.prompt}</p>
            <p><strong>Word Count:</strong> {selectedPrompt.wordCount}</p>
          </>
        )}
      </Modal>
    </div>
  );
}

export default SchoolInfo;
