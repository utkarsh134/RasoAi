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

  const recipeCache = {};

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
    setShowContainer(false);
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

    if (recipeCache[ingredientsString]) {
      console.log("Using cached recipe");
      setGeneratedResponse(recipeCache[ingredientsString]);
      setIsLoading(false);
      setShowContainer(true);
      return;
    }
    // console.log(ingredientsString);
    const catchyprompt = `"Hey Cohere, I have the following ingredients: ${ingredientsString.join(
      ", "
    )} . Can you suggest a recipe I can make with these ingredients?"`;

    try {
      const recipeResponse = await cohere.generate({
        model: "command",
        prompt: `${catchyprompt}\n\n`,
        maxTokens: 300,
        temperature: 0.9,
        k: 0,
        stopSequences: [],
        returnLikelihoods: "NONE",
      });

      const recipeText = recipeResponse.generations[0].text;

      recipeCache[ingredientsString] = recipeText;
      setGeneratedResponse(recipeText);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setGeneratedResponse(
        "Sorry, we couldn't generate a recipe at this time. Please try again later."
      );
    }

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
        {isLoading ? "Generating Recipe" : "Generate Recipe"}
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
