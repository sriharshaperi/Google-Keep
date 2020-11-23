import React from "react";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="pagenotfound">
      <div className="pagenotfound__left">
        <img
          src="https://logo-logos.com/wp-content/uploads/2016/11/Google_logo_logotype.png"
          alt=""
        />
        <p>
          <strong>404.</strong> That's an error.
        </p>
        <p>
          The requested url was not found on this server. That's all we know
        </p>
      </div>
      <img
        className="pagenotfound__right"
        src="https://ih1.redbubble.net/image.1191542944.6942/raf,750x1000,075,t,FFFFFF:97ab1c12de.jpg"
        alt="pagenotfound"
      />
    </div>
  );
};

export default PageNotFound;
