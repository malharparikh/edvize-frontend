import React from 'react';
import { Layout } from 'antd';
import './Footer.css';

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer className="footer">
      <div className="footer-content">
        <p>Contact Us: <a href="mailto:eyal@edvize.com">eyal@edvize.com</a> | &copy; Copyright 2024. Ranak Investments, LLC. All rights reserved.</p>
      </div>
    </Footer>
  );
}

export default AppFooter;
