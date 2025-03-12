import axios from 'axios';

const pokeAPI = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    console.log(`Fetching pokemon with... limit=${limit}, offset=${offset}`);
    const response = await axios.get(`${pokeAPI}/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return { results: [] };
  }
};

export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await axios.get(`${pokeAPI}/pokemon/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.error(`Error!!!! ${nameOrId}:`, error);
    return null;
  }
};
