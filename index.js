// POKEMON DICTIONARY

const pokemonForm = document.querySelector(".pokemonForm");
const pokemonInput = document.getElementById("pokemonName");
const dataCard = document.querySelector(".basicContainer");
const pokeName = document.querySelector(".imageContainer");


pokemonForm.addEventListener("submit", async event => {
    event.preventDefault();

    const pokemon = pokemonInput.value.toLowerCase();
    pokemonInput.value = "";
    console.log(pokemon);

    if (pokemon)
    {
        try {
            const pokemonData = await getPokemonData(pokemon);
            console.log(pokemonData);
            displayPokemonData(pokemonData);

        }
        catch(error) {
            console.error(error);
            displayError(error);
        }
    }
})



function displayError() {

}

async function getPokemonData(pokemon) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    const response = await fetch(apiUrl);
    console.log(response);

    if (!response.ok)
    {
        throw new Error("Could not find that pokemon!");
    }

    return await response.json();
}

async function getSuggestions() {
    const pokemonList = await fetchPokemonList();
    
    const input = pokemonInput.value.toLowerCase();
    const suggestionList = document.getElementById("suggestions");
    suggestionList.textContent = '';
    
    const filtered = pokemonList.filter(name => name.toLowerCase().includes(input));

    filtered.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name.toUpperCase();
        li.onclick = () => {
            pokemonInput.value = name.toUpperCase();
            suggestionList.textContent = '';
        }
        suggestionList.appendChild(li);
    })
}

function displayPokemonData(data) {
    const{name: name,
          abilities: abilities,
            types: types,
             cries: cries,
              id: id} = data;

    const {latest, legacy} = cries; //destructuring cries (which has two elements) into its separate elements


    //reset
    pokeName.textContent = "";
    pokeName.style.visibility = "visible";

    //sprite
    const sprite = data.sprites.front_default;
    const imgElement = document.createElement("img");
    imgElement.src = sprite;
    imgElement.classList.add("pokemonSprite");
    pokeName.appendChild(imgElement);

     //pokemon name

    const pokemonNameDisplay = document.createElement("h1");    //appending name to empty container

    pokemonNameDisplay.textContent = `${name.toUpperCase()} #${id}`;
    pokemonNameDisplay.classList.add("nameDisplay");
    pokeName.appendChild(pokemonNameDisplay);


    dataCard.textContent = "";
    dataCard.style.visibility = "visible";

    //pokemon type
    const typeNames = types.map(({type}) => type.name);
    const typeString = typeNames.join(", ");

    const typeDisplay = document.createElement("p");
    typeDisplay.textContent = `Type: ${typeString.toUpperCase()}`;
    typeDisplay.classList.add("typeDisplay");
    dataCard.appendChild(typeDisplay);

    
    //pokemon normal abilities

    const defaultAbilities = abilities.filter(ability => ability.is_hidden === false);
    console.log(defaultAbilities);
    const abilityString = defaultAbilities.map(({ability}) => ability.name).join(", ");
    console.log(abilityString);

    const abilityDisplay = document.createElement("p");
    abilityDisplay.textContent = `Ability: ${abilityString.toUpperCase()}`;
    abilityDisplay.classList.add("abilityDisplay");
    dataCard.appendChild(abilityDisplay);

    //pokemon hidden abilities

    const hiddenAbilities = abilities.filter(ability => ability.is_hidden === true);
    let hiddenString = hiddenAbilities.map(({ability}) => ability.name).join(", ");

    if (hiddenString == "")
    {
        hiddenString = "NONE";
    }

    console.log(hiddenString);

    const hiddenDisplay = document.createElement("p");
    hiddenDisplay.textContent = `Hidden Ability: ${hiddenString.toUpperCase()}`;
    hiddenDisplay.classList.add("hiddenDisplay");
    dataCard.appendChild(hiddenDisplay);

    
    //pokemon cry function button (need to fetch url to get the audio)

    const cryButton = document.createElement("button");
    cryButton.textContent = "Pokemon Cry";

    cryButton.addEventListener('click', async function() {
        const url = latest;
        await playPokemonCry(url);
    })

    cryButton.classList.add("cryDisplay");
    dataCard.appendChild(cryButton);




}

async function playPokemonCry(url) {
    try {
        const response = await fetch(url)
        if (!response.ok)
        {
            throw new Error("Failed to fetch audio");
        }

        const blob = await response.blob();

        const audio = new Audio();

        audio.src = URL.createObjectURL(blob);

        await audio.play();
    } 
    catch (error) {
        console.error("Error fetching pokemon cry:", error);
    }
}

async function fetchPokemonList() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');

        if (!response.ok) {
            throw new Error("Failed to fetch pokemon list");
        }

        const data = await response.json();

        const{results: results} = data;

        const pokemonList = results.map(pokemon => pokemon.name);

        return pokemonList;
    } catch (error) {
        console.error("Error fetching list", error);
        return [];
    }
}