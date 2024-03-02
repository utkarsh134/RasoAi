import React from "react";
import "../App.css";

const Container = ({ generatedResponse }) => {
  return (
    <div id="recipeContainer" className="recipe-container">
      {generatedResponse}
    </div>
  );
};

export default Container;
