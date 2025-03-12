import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null;

  return (
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
          alt={pokemon.name} 
        />
      </div>
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <div className="pokemon-moves">
          <h3>Moves they can learn</h3>
          <div className="moves-container">
            {pokemon.moves.slice(0, 4).map((moveData, index) => (
              <div key={index} className="move">
                {moveData.move.name.replace('-', ' ')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
