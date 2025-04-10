import React from "react";

const Loading = () => {
  const spinnerStyle = {
    width: " 50px",
    height: "50px",
    border: "5px solid #FDF8CE",
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
    backgroundColor: "#F6A09E",
  };

  const textStyle = {
    fontSize: "18px",
    color: "#FDF8CE",
    fontFamily: "Stolzl",
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
