import React from "react";

const Loading = () => {
    return (
      <div className="loading-spinner">
        {/* loading spinner implementation */}
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };
  
  export default Loading;
  