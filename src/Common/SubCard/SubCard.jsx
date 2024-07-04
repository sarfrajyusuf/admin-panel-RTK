import React from "react";
import "./SubCard.scss";

function SubCard(props) {
  const { earnings, description, icon: Icon } = props; 
  return (
    <div className={`subCard ${props.className}`}>
      <div className="subCard_top">
        <span>{earnings}</span>
        {Icon && <Icon />}
      </div>
      <p>{description}</p>
    </div>
  );
}

export default SubCard;
