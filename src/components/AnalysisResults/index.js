import React, { useState, useEffect } from 'react';
import { Typography, Card } from 'antd';
import { DownOutlined, UpOutlined, CloseCircleOutlined, WarningOutlined, CheckCircleOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  const ErrorSection = ({ title, content, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      const handleResizeObserverError = () => {
        console.warn("ResizeObserver loop error suppressed.");
      };
  
      window.addEventListener('error', handleResizeObserverError);
  
      return () => {
        window.removeEventListener('error', handleResizeObserverError);
      };
    }, []);

    const renderIcon = () => {
      switch (icon) {
        case 'spelling':
          return <CloseCircleOutlined className="error-icon" style={{ color: '#ff4d4f' }} />;
        case 'grammar':
          return <WarningOutlined className="error-icon" style={{ color: '#faad14' }} />;
        case 'punctuation':
          return <CheckCircleOutlined className="error-icon" style={{ color: '#52c41a' }} />;
        case 'suggestion':
          return <BulbOutlined className="error-icon" style={{ color: '#1890ff' }} />;
        default:
          return null;
      }
    };

    const parseContent = (content) => {
      if (content === "None found." || content === "" || content === "No errors found." || content === "No errors found") {
        return [];
      }
      return content.split('\n').filter(item => item.trim() !== '');
    };

    const items = parseContent(content);
    const count = items.length;

    return (
      <Card className="error-section" bordered={false}>
        <div className="error-header" onClick={() => setIsOpen(!isOpen)}>
          {renderIcon()}
          <span className="error-title">{count} {title}</span>
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
        {isOpen && (
          <ul className="error-list">
            {count > 0 ? items.map((item, index) => (
              
              <li key={index} className="error-item">
                {item}
              </li>
            )) : (
              <li className="no-errors">No {title.toLowerCase()} found.</li>
            )}
          </ul>
        )}
      </Card>
    );
  };

  return (
    <div className="analysis-results">
      <Title level={3}>Analysis Results</Title>
      <Title level={5}>Prompt Category: <Text type="secondary">{analysis.category}</Text></Title>
      <Title level={5}>Content Feedback:</Title>
      <Paragraph>{analysis.content_feedback}</Paragraph>
      <ErrorSection
        title="Spelling Errors"
        content={analysis.spelling_errors}
        icon="spelling"
      />
      <ErrorSection
        title="Grammar Errors"
        content={analysis.grammar_errors}
        icon="grammar"
      />
      <ErrorSection
        title="Punctuation Errors"
        content={analysis.punctuation_errors}
        icon="punctuation"
      />
      <ErrorSection
        title="Improvement Suggestions"
        content={analysis.improvement_suggestions}
        icon="suggestion"
      />
      
    </div>
  );
};

export default AnalysisResults;
