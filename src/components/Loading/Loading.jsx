import React from "react";

const Loading = () => {
  const spinnerStyle = {
    width: "40px",
    height: "40px",
    border: "4px solid #3498db",
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "100vh",
  };

  const textStyle = {
    fontSize: "16px",
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <span style={textStyle}>Loading...</span>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
