import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Form, Layout, Row, Col, Modal } from 'antd';
import { auth } from '../../utils/firebase.utils'; // Import Firebase Auth
import SchoolInfo from '../SchoolInfo';
import AnalysisResults from '../AnalysisResults';
import DraftList from '../DraftList';
import './TextAnalyzer.css';

const { Content } = Layout;
const { TextArea } = Input;

function TextAnalyzer() {
  const location = useLocation();
  const university = location.state?.university || 'No University Selected';
  const [prompt, setPrompt] = useState('');
  const [essayText, setEssayText] = useState('');
  const [wordCountLimit, setWordCountLimit] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false); // New state to toggle view
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [continueAnalysis, setContinueAnalysis] = useState(false); // To manage user response for exceeding word count
  const [user, setUser] = useState(null); // User state to store user info
  const [isDraftSaved, setIsDraftSaved] = useState(false); // Track if the draft was saved
  
  const [drafts, setDrafts] = useState([]); // State to store drafts
  // const backend = 'https://backend-next-level-tutor.onrender.com';
  const backend = 'http://10.0.0.87:5000';

  // Fetch all drafts when user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set the logged-in user info
        // Fetch all drafts from the backend
        axios.get(backend + '/get-all-drafts', {
          params: {
            user_id: user.uid,  // Pass user_id as query parameter 
          },
        })
        .then((response) => {
          if (response.data.drafts) {
            // Load all drafts data
            setDrafts(response.data.drafts); // Save drafts in state
            console.log('Drafts:', response.data.drafts); // Print drafts for now
          }
        })
        .catch((error) => {
          console.error('Error fetching drafts:', error);
        });
      } else {
        setUser(null); // Clear user state if logged out
      }
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);
  

  // Handle resize observer loop error
  useEffect(() => {
    const handleResizeObserverError = () => {
      console.warn("ResizeObserver loop error suppressed.");
    };

    window.addEventListener('error', handleResizeObserverError);

    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  // Function to handle prompt and word count selection from the SchoolInfo modal
  const handleSelectPrompt = (selectedPrompt, wordCount) => {
    setPrompt(selectedPrompt);
    setWordCountLimit(wordCount);
  };

  const handleAutofill = (selectedDraft) => {
    console.log("Selected Draft:", selectedDraft);
    setPrompt(selectedDraft.prompt);
    setWordCountLimit(selectedDraft.wordCount);
    setEssayText(selectedDraft.essay);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setContinueAnalysis(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setContinueAnalysis(false);
  };

  const handleSubmit = useCallback(async () => {
    const wordCount = essayText.trim().split(/\s+/).length;
    
    if (wordCountLimit && wordCount > wordCountLimit && !continueAnalysis) {
      setIsModalVisible(true); // Show modal if word count exceeds the limit
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(backend + '/analyze', { 
        prompt: prompt,
        essay: essayText,
        userId: user?.uid,  // Send userId
        userEmail: user?.email,  // Send user email
        userName: user?.displayName,  // Send user name
        isDraft: false,  // This is not a draft submission
      });
      console.log("In Submit", response.data);
      setAnalysis(response.data);
      setIsAnalyzed(true); // Switch to analysis view
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, essayText, wordCountLimit, continueAnalysis, user]);

  const handleSaveDraft = useCallback(async () => {
    setIsDraftSaved(true);
    if (!prompt || !essayText || !wordCountLimit) {
      console.error('Prompt, essay text, or word count limit is missing.');
      return;
    }
    try {
      await axios.post(backend + '/save-draft', { 
        prompt: prompt,
        essay: essayText,
        user_id: user?.uid,  // Send user_id (updated to match backend)
        wordCount: wordCountLimit,
        university: university,
        status: 'draft',  // Assuming 'status' is the same as 'isDraft'
      });
      setIsDraftSaved(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsDraftSaved(false);
    }
  }, [prompt, essayText, wordCountLimit, user, university]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);

  useEffect(() => {
    // Filter drafts based on the university
    const filtered = drafts.filter(draftObj => {
      const draftId = Object.keys(draftObj)[0];  // Get the draft ID
      const draftDetails = draftObj[draftId];    // Extract the draft details

      return draftDetails.university === university;   // Match university
    });

    // Update the filtered drafts state
    setFilteredDrafts(filtered);
  }, [drafts, university]);  // Re-run the filter whenever drafts or univ changes
  
  useEffect(() => {
   console.log("USER", user);
   
    
  }, [user]);

  useEffect(() => {
    if (continueAnalysis) {
      handleSubmit(); // Retry the submit if the user confirms to continue
    }
  }, [continueAnalysis, handleSubmit]);

  return (
    <Layout className="text-analyzer-container">
      <Content className={`content-layout ${isAnalyzed ? 'analyzed-view' : ''}`}>
        {!isAnalyzed &&
          <>
            {university !== 'No University Selected' && (
<div className="left-section">
  <div className="content-wrapper">
    <div className="school-info-wrapper">
      <SchoolInfo university={university} onSelectPrompt={handleSelectPrompt} />
    </div>
   {filteredDrafts.length > 0 && user && (
     
    <div className="draft-list-wrapper">
      <DraftList drafts={filteredDrafts} autofillDraft={handleAutofill}/>
    </div>
   )}
  </div>
</div>


            )}
          </>
        }

        <div className={`${university ? 'form-section' : 'form-section-center'} form-section-center ${isAnalyzed ? 'form-expanded' : ''}`}>
          <Form onFinish={handleSubmit} className="form-container">
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item>
                  <Input
                    placeholder="Enter Essay Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    list="prompt-options"
                  />
                  <datalist id="prompt-options">
                    {/* Datalist for previous prompts */}
                  </datalist>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Input
                    type="number"
                    placeholder="Word Count Limit"
                    value={wordCountLimit || ''}
                    onChange={(e) => setWordCountLimit(Number(e.target.value))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <TextArea
                rows={6}
                placeholder="Enter Essay Text"
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
              />
            </Form.Item>
            <div className='word-count'>
              {essayText ? essayText.trim().split(/\s+/).length : '0'} words
            </div>
            <div className="submit-button">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="submit-button"
              >
                Analyze
              </Button>
{user && (

              <div className='save-draft-button-container'>

              <Button
                type="default"
                onClick={handleSaveDraft}
                loading={isDraftSaved}
                className="save-draft-button"
              >
                Save as Draft
              </Button>
              </div>
)}
  

            </div>
          </Form>
        </div>

        {isAnalyzed && (
          <div className="right-section">
            <AnalysisResults analysis={analysis} />
          </div>
        )}

        {/* Modal for exceeding word count */}
        <Modal
          title="Word Count Exceeded"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Yes"
          cancelText="No"
        >
          <p>The word count exceeds the limit. Do you want to continue?</p>
        </Modal>

        <div className="fixed-buttons-container">
          {/* <Button type="primary" className="report-issue-button">
            Report an Issue
          </Button>
          <Button type="primary" className="contact-live-chat-button">
            Contact Live Chat
          </Button> */}
          <Button
  type="primary"
  className="report-issue-button"
  onClick={() => window.open('https://airtable.com/appQqeY2HuEkZGN5l/shrO4pCWKDczsFarz', '_blank')}
>
  Report an Issue
</Button>

<Button
  type="primary"
  className="contact-live-chat-button"
  onClick={() => window.open('https://airtable.com/appQqeY2HuEkZGN5l/shrwwKSfhAScRdK2k', '_blank')}
>
  Get Live Feedback
</Button>

        </div>
      </Content>
    </Layout>
  );
}

export default TextAnalyzer;
