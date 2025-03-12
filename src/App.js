import React from 'react';
import PokemonList from './components/PokemonList';
import './App.css';

// Main app component - Nothing fancy, just basic boiler plate setup

function App() {
  console.log("Test to see if app component is working, remember to delete this later josh...");
  return (
    <div className="App">
      <PokemonList />
    </div>
  );
}

export default App;
