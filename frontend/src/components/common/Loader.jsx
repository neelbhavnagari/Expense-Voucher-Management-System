import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <div className="loader-container">
      <div className="spinner"></div>
      {message && <p className="loader-text">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loader-fullscreen">{content}</div>;
  }

  return content;
};

export default Loader;
