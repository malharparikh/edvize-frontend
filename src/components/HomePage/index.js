import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, Layout, Typography, Space } from 'antd';
import { universities } from '../../resources/universities';
import './HomePage.css';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function HomePage() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const navigate = useNavigate();

  const handleSelectChange = (value) => {
    setSelectedUniversity(value); // Store the snake_case key in state
  };

  const navigateToAnalyzer = () => {
    navigate('/analyze', { state: { university: selectedUniversity } });
  };

  return (
    <Layout className="container">
      <Content className="content">
        <Title level={2}>Select Your University</Title>
        <Space direction="vertical" size="large" className="input-container">
          <Select
            placeholder="Select a University"
            onChange={handleSelectChange}
            className="university-select"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {Object.entries(universities).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option> // Display value, store key
            ))}
          </Select>
          <Button
            type="primary"
            onClick={navigateToAnalyzer}
            className="start-button"
            disabled={!selectedUniversity}
          >
            {selectedUniversity ? `Analyze ${universities[selectedUniversity]}` : 'Start Analyzing'}
          </Button>
        </Space>
      </Content>
      <div className='right-corner'>
        <p
          onClick={navigateToAnalyzer}
          className="right-corner-italic-blue"
        >
          {'Continue Without Selecting A University'}
        </p>
      </div>
    </Layout>
  );
}

export default HomePage;
