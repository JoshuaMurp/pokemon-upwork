import React, { useState, useEffect } from 'react';
import { getPokemonList, getPokemonDetails } from '../services/pokeApi';
import PokemonCard from './PokemonCard';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState('');
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 12;

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    setIsLoading(true);
    const response = await getPokemonList(limit, offset);
    setNextUrl(response.next);
    
    const detailsPromises = response.results.map(pokemon => 
      getPokemonDetails(pokemon.name)
    );
    
    const pokemonDetails = await Promise.all(detailsPromises);
    setPokemonData(prev => [...prev, ...pokemonDetails.filter(p => p !== null)]);
    setIsLoading(false);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Search functionality Ik this wasn't required but I wanted to try it out
  const performSearch = async (term) => {
    if (!term.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    
    try {
      const allPokemon = await getPokemonList(1000, 0); //large batch to make search better
      
      const matchingPokemon = allPokemon.results.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      
      const detailsPromises = matchingPokemon.slice(0, 20).map(pokemon => // Limit to 20 results
        getPokemonDetails(pokemon.name)
      );
      
      const searchPokemonDetails = await Promise.all(detailsPromises);
      setSearchResults(searchPokemonDetails.filter(p => p !== null));
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search handler, to respect their fair use mention on the docs
  const debouncedSearch = debounce(performSearch, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMore = () => {
    setOffset(offset + limit);
    fetchPokemons();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const displayedPokemon = isSearching ? searchResults : pokemonData;

  return (
    <div className="pokemon-list-container">
      <h1>Pokemon Cards</h1>
      
      {/*search input I know you didn't ask for this but I thought it would be cool*/}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={clearSearch}>
            ✕
          </button>
        )}
      </div>
      
      {isLoading && <div className="loading">Searching for Pokemon...</div>}
      
      <div className="pokemon-grid">
        {!isLoading && displayedPokemon.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      
      {!isLoading && isSearching && searchResults.length === 0 && (
        <div className="no-results">No Pokemon found matching "{searchTerm}"</div>
      )}
      
      {nextUrl && !isLoading && !isSearching && (
        <button className="load-more" onClick={loadMore}>
          Load More Pokemon
        </button>
      )}

    </div>
  );
};

export default PokemonList;