import React, { useState } from "react";
import "./App.css";
import { CohereClient } from "cohere-ai";
import SpinnerComp from "./components/SpinnerComp";
import Container from "./components/Container";

const cohere = new CohereClient({
  token: process.env["REACT_APP_OPENAI_KEY"], // This is your trial API key
});

const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState("");

  const addIngredient = () => {
    const input = document.getElementById("ingredientInput");
    const ingredient = input.value.trim();

    if (ingredient) {
      setIngredients((prevIngredients) => [...prevIngredients, ingredient]);
      input.value = "";
    } else {
      alert("Please enter an ingredient.");
    }
  };

  const deleteIngredient = (index) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients];
      updatedIngredients.splice(index, 1);
      return updatedIngredients;
    });
  };

  const generateRecipe = async () => {
    setIsLoading(true);
    setShowContainer(false);
    const ingredientsString = [...ingredients];
    console.log(ingredientsString);
    const catchyprompt = `"Hey Cohere, I have the following ingredients: ${ingredientsString.join(
      ", "
    )} . Can you suggest a recipe I can make with these ingredients?"`;

    const recipeResponse = await cohere.generate({
      model: "command",
      prompt: `${catchyprompt}\n\n`,
      maxTokens: 300,
      temperature: 0.9,
      k: 0,
      stopSequences: [],
      returnLikelihoods: "NONE",
    });

    setGeneratedResponse(recipeResponse.generations[0].text);

    // const recipeContainer = document.getElementById("recipeContainer");
    // console.log(recipeResponse);
    // recipeContainer.textContent = recipeResponse.generations[0].text;
    // recipeContainer.style.display = "block"; // Display the recipe container

    setIsLoading(false);
    setShowContainer(true);
  };

  return (
    <div className="mainContainer">
      <h1>RasoAi</h1>
      <div className="input-container">
        <input
          type="text"
          id="ingredientInput"
          placeholder="Enter ingredient..."
        />
        <button onClick={addIngredient}>Add Ingredient</button>
      </div>
      <div id="ingredientList" className="ingredient-list">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient">
            {ingredient}
            <span className="delete" onClick={() => deleteIngredient(index)}>
              X
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={generateRecipe}
        disabled={isLoading}
        className="generate-button"
      >
        Generate Recipe
      </button>
      {isLoading ? (
        <SpinnerComp />
      ) : showContainer ? (
        <Container generatedResponse={generatedResponse} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default App;
