const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#favorites').style.display = 'none';
    let url = 'https://pokeapi.co/api/v2/pokemon/';
    const form = document.getElementById('search-form');
    const cardDiv = document.querySelector('.pokemon-card');
    const favorites = document.querySelector('#favorites');
    let isFavorite = false;

    document.getElementById('favorites-btn').addEventListener('click', (event) => {
        console.log('click');
        cardDiv.style.display = 'none';
        document.querySelector('#favorites').style.display = 'block';
        console.log(document.querySelector('#favorites'));
        showFavorites();
    })

    form.addEventListener('submit', (event) => {
        //create pokemon
        event.preventDefault();
        removePreviousPokemonCard(cardDiv);
        document.querySelector('#favorites').style.display = 'none';
        cardDiv.style.display = 'block';
        pokemonURL = url + event.target.pokemon.value;
        fetchPokemon(pokemonURL);
    });

    function fetchPokemon(url) {
        fetch(url).then(response => response.json())
        .then(pokemon => {
            console.log(pokemon);
            createPokemon(pokemon);
        })
        .catch(() => {
            alert('Pokemon does not exist');
        });
    }

    function createPokemon(pokemon) {
        const hp = document.createElement('p');
        const hpSpan = document.createElement('span');
        const pokemonImg = document.createElement('img');
        const pokemonName = document.createElement('h2');

        const divTypes = document.createElement('div');
        const divStats = document.createElement('div');

        const divAttack = document.createElement('div');
        const statAttack = document.createElement('h3');
        const pAttack = document.createElement('p');

        const divDefense = document.createElement('div');
        const statDefense = document.createElement('h3');
        const pDefense = document.createElement('p');

        const divSpeed = document.createElement('div');
        const statSpeed = document.createElement('h3');
        const pSpeed = document.createElement('p');

        const typeSpan = document.createElement('span');

        const addToFavBtn = document.createElement('button');

        const themeColor = typeColor[pokemon.types[0].type.name]; 

        hp.className = 'hp';
        hp.innerHTML = `HP ${pokemon.stats[0].base_stat}`;

        // hp.innerHTML = pokemon.stats[0].base_stat;
        pokemonImg.src = pokemon.sprites.other['official-artwork'].front_default;
        
        pokemonName.className = 'poke-name';
        pokemonName.innerHTML = pokemon.name;

        divTypes.className = 'types';

        divStats.className = 'stats';

        statAttack.innerHTML = pokemon.stats[1].base_stat;
        pAttack.innerHTML = 'Attack';

        divAttack.appendChild(statAttack);
        divAttack.appendChild(pAttack);
        divStats.appendChild(divAttack);

        statDefense.innerHTML = pokemon.stats[2].base_stat;
        pDefense.innerHTML = 'Defense';

        divDefense.appendChild(statDefense);
        divDefense.appendChild(pDefense);
        divStats.appendChild(divDefense);

        statSpeed.innerHTML = pokemon.stats[5].base_stat;
        pSpeed.innerHTML = 'Speed';

        divSpeed.appendChild(statSpeed);
        divSpeed.appendChild(pSpeed);
        divStats.appendChild(divSpeed);

        // typeSpan.textContent = pokemon.types[0].type.name;
        // divTypes.appendChild(typeSpan);
        
        cardDiv.appendChild(hp);
        cardDiv.appendChild(pokemonImg);
        cardDiv.appendChild(pokemonName);
        cardDiv.appendChild(divTypes);
        cardDiv.appendChild(divStats);

        let appendTypes = (types) => {
            types.forEach((item) => {
                let span = document.createElement('span');
                span.textContent = item.type.name;
                document.querySelector('.types').appendChild(span);
            })
        }

        appendTypes(pokemon.types);

        let styleCard = (color) => {
            cardDiv.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
            // cardDiv.style.background = `red`;
            cardDiv.querySelectorAll('.types span').forEach((typeColor) => {
                typeColor.style.background = color;
            });
        }
        styleCard(themeColor);

        addToFavBtn.innerHTML = 'Add to Favorites';
        addToFavBtn.style.color = themeColor;
        addToFavBtn.addEventListener('click', () => {
            addToFavorites(pokemon, isFavorite);
        });

        cardDiv.appendChild(addToFavBtn);
    }

    function addToFavorites(pokemon) {
        const configurationObject = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                hp: pokemon.stats[0].base_stat,
                img: pokemon.sprites.other['official-artwork'].front_default,
                name: pokemon.name,
                types: pokemon.types,
                attack: pokemon.stats[1].base_stat,
                defense: pokemon.stats[2].base_stat,
                speed: pokemon.stats[5].base_stat,
                themeColor: typeColor[pokemon.types[0].type.name]
            })
        }
        fetch('http://localhost:3000/favorites', configurationObject)
            .then(response => response.json())
            .then(pokemon => {
                console.log(pokemon);
            });
    }

    function showFavorites() {
        removePreviousPokemonCard(favorites);
        fetch('http://localhost:3000/favorites')
            .then(response => response.json())
            .then(pokemons => {
                pokemons.forEach(pokemon => {
                    const div = document.createElement('div');
                    const pokemonName = document.createElement('h2');
                    const img = document.createElement('img');
                    const btn = document.createElement('button');

                    div.className = 'card';
                    pokemonName.innerHTML = pokemon.name;

                    img.src = pokemon.img;

                    btn.innerHTML = 'Delete';
                    btn.style.color = pokemon.themeColor;
                    btn.addEventListener('click', () => {
                        deletePokemon(pokemon.id);
                    })

                    div.appendChild(pokemonName);
                    div.appendChild(img);
                    div.appendChild(btn);
                    favorites.appendChild(div);
                })
            });
    }

    function deletePokemon(id) {
        fetch(`http://localhost:3000/favorites/${id}`, {method: 'DELETE'})
            .then(showFavorites());
        
    }

    function removePreviousPokemonCard(div) {
        while(div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
});