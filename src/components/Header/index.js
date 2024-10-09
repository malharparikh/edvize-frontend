// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeftOutlined } from '@ant-design/icons';
// import { signInWithGooglePopup, signOutUser, auth } from '../../utils/firebase.utils'; // import signOut and auth
// import './Header.css';

// const Header = () => {
//   const [user, setUser] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const showBackArrow = location.pathname === '/analyze';

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user); // Set the logged-in user
//       } else {
//         setUser(null); // Clear user when logged out
//       }
//     });

//     return unsubscribe; // Cleanup listener on unmount
//   }, []);

//   const handleSignIn = async () => {
//     await signInWithGooglePopup();
//   };

//   const handleLogout = async () => {
//     await signOutUser();
//     setUser(null); // Clear the user state after logout
//   };

//   return (
//     <header className="header">
//       <div className="back-arrow-container">
//         {showBackArrow && (
//           <ArrowLeftOutlined
//             className="back-arrow"
//             onClick={() => navigate('/')}
//           />
//         )}
//       </div>
//       <div className="logo-container">
//         <img
//           src="logo.png"
//           alt="Next Level Tutors"
//           className="logo"
//           onClick={() => navigate('/')}
//         />
//       </div>
//       <div className="spacer"></div>

//       <div className="user-section">
//         {user ? (
//           <div className="user-info">
//             <span className="user-name">Welcome, {user.displayName}</span>
//             <button className="logout-button" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         ) : (
//           <button className="login-button" onClick={handleSignIn}>
//             Sign In With Google
//           </button>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { signInWithGooglePopup, signOutUser, auth } from '../../utils/firebase.utils'; 
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBackArrow = location.pathname === '/analyze';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
      }
    });

    return unsubscribe; 
  }, []);

  const handleSignIn = async () => {
    await signInWithGooglePopup();
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null); 
    setShowLogout(false); 
  };

  return (
    <header className="header">
      <div className="back-arrow-container">
        {showBackArrow && (
          <ArrowLeftOutlined
            className="back-arrow"
            onClick={() => navigate('/')}
          />
        )}
      </div>
      <div className="logo-container">
        <img
          src="logo.png"
          alt="Next Level Tutors"
          className="logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="user-section">
        {user ? (
          <div className="user-info">
            <span
              className="user-name"
              onClick={() => setShowLogout(!showLogout)}
            >
              Hi, {user.displayName}
            </span>
            {showLogout && (
              <div className="logout-dropdown">
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleSignIn}>
            Sign In With Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
