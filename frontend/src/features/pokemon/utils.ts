export const getPokemonImage = (pokemonId: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`
}
export const calculateHealth = (hp: number, maxHp: number) => (hp / maxHp) * 100
