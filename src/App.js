import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './components/HomePage';
import TextAnalyzer from './components/TextAnalyzer';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
        <Header />
      <Layout className="app-layout">
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<TextAnalyzer />} />
          </Routes>
        </Content>
      </Layout>
        <Footer />
    </Router>
  );
}

export default App;