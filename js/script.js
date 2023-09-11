/* --------------------
    loader section
-------------------- */

const toggleProgress = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('hidden')
    }
    else {
        loaderSection.classList.add('hidden')
    }
};

/* ----------------------------------------------------------
    section 1: load data and show info into cards and button
----------------------------------------------------------- */

// data load and fetch
let allCards = [];
let slicedCards = [];

fetch(`https://openapi.programming-hero.com/api/ai/tools`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        allCards = data.data.tools;
        slicedCards = allCards.slice(0, 6);
        displayData(slicedCards);
    });

// display data into the cards
const displayData = (cards) => {

    // start loader
    toggleProgress(true);

    // card container
    const dataContainer = document.getElementById("card-container");
    dataContainer.innerText = '';

    // loop for every cards
    cards.forEach((card) => {

        // date conversion
        const date = new Date(card.published_in);
        const convertDate = date.toLocaleDateString();

        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
        <div class="card w-96 h-4/5 bg-base-100 shadow-xl md:mx-16 my-8">
            <figure class="px-6 pt-6"><img class="rounded-lg" src="${card.image}" alt="Shoes" /></figure>
            <div class="card-body">
                <h2 class="card-title">Features</h2>
                    <ul>
                        <li>${card.features && card.features[0] !== undefined ? "1. " + card.features[0] : ""}</li>
                        <li>${card.features && card.features[1] !== undefined ? "2. " + card.features[1] : ""}</li>
                        <li>${card.features && card.features[2] !== undefined ? "3. " + card.features[2] : ""}</li>
                        <li>${card.features && card.features[3] !== undefined ? "4. " + card.features[3] : ""}</li>
                    </ul>
                <div class="card-actions">
                    <div class="border-b-2 border-gray-400 w-full my-6"></div>
                    <h2 class="card-title">${card.name}</h2>
                </div>
                <div class="flex justify-center items-center">
                    <img class="inline" src="./image/Frame.png" alt="">
                    <p class=" mx-1 p-0">${convertDate}</p>
                    <label onclick="loadModalDetails('${card.id}')" for="my-modal" class="btn btn-sm btn-circle btn-error text-white">&#8594;</label>
                </div>
            </div>
        </div>
        `;
        dataContainer.appendChild(cardDiv);

        // stop loader
        toggleProgress(false);
    });

    /* -------------------
      see more button
    ------------------- */

    const seeMoreBtn = document.getElementById("see-more-btn");

    // Show all cards when See More button is clicked
    seeMoreBtn.addEventListener("click", () => {
        displayData(allCards);
        seeMoreBtn.style.display = "none";
    });

    // Show the See More button if not all cards are displayed
    if (slicedCards.length < allCards.length) {
        seeMoreBtn.style.display = "block, center";
    } else {
        seeMoreBtn.style.display = "none";
    }
};

/* ---------------------------------------------------
    data fetch and display info for modal section
--------------------------------------------------- */

// data fetch
const loadModalDetails = async id => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayCardDetails(data.data);
    } catch (error) {
        console.error(error);
    }
};

// data display for modal section
const displayCardDetails = card => {

    // modal description
    const modalDescription = document.getElementById('description');
    modalDescription.innerText = card.description;

    // modal first price
    const pricingOne = document.getElementById('price-first');
    pricingOne.innerText = (card.pricing !== null) ? (card.pricing[0].price !== "0" ? card.pricing[0].price : "No cost") : "Free of cost";

    // modal second price
    const pricingSecond = document.getElementById('price-second');
    pricingSecond.innerText = (card.pricing !== null) ? (card.pricing[1].price !== "0" ? card.pricing[1].price : "No cost") : "Free of cost";

    // modal third price
    const pricingThird = document.getElementById('price-third');
    pricingThird.innerText = (card.pricing !== null) ? (card.pricing[2].price !== "0" ? card.pricing[2].price : "No cost") : "Free of cost";

    // modal first plan
    const planOne = document.getElementById('plan-first');
    planOne.innerText = (card.pricing) ? ((card.pricing[0].plan !== null) ? (card.pricing[0].plan !== "Free" ? card.pricing[0].plan : "") : "No data found") : "Basic";

    // modal second plan
    const planSecond = document.getElementById('plan-second');
    planSecond.innerText = (card.pricing) ? ((card.pricing[1].plan !== null) ? (card.pricing[1].plan !== "Free" ? card.pricing[1].plan : "") : "No data found") : "Pro";

    // modal third plan
    const planThird = document.getElementById('plan-third');
    planThird.innerText = (card.pricing) ? ((card.pricing[2].plan !== null) ? (card.pricing[2].plan !== "Free" ? card.pricing[2].plan : "") : "No data found") : "Enterprise";

    // modal feature
    const featureContainer = document.getElementById('feature-container');

    // Array destructuring to extract the feature objects from the features object
    const [feature1, feature2, feature3] = Object.values(card.features);
    const { feature_name: featureName1 } = feature1;
    const { feature_name: featureName2 } = feature2;
    const { feature_name: featureName3 } = feature3;

    featureContainer.innerHTML = `
        <li>${featureName1 && featureName1 !== null ? "• " + featureName1 : ''}</li>
        <li>${featureName2 && featureName2 !== null ? "• " + featureName2 : ''}</li>
        <li>${featureName3 && featureName3 !== null ? "• " + featureName3 : ''}</li>
    `;

    // modal integrations
    const integrationsContainer = document.getElementById('integrations-container')
    integrationsContainer.innerHTML = `
        <li>${(card.integrations) ? (card.integrations[0] && card.integrations[0] !== null ? "• " + card.integrations[0] : '') : '• No data found'}</li>
        <li>${(card.integrations) ? (card.integrations[1] && card.integrations[1] !== null ? "• " + card.integrations[1] : '') : ''}</li>
        <li>${(card.integrations) ? (card.integrations[2] && card.integrations[2] !== null ? "• " + card.integrations[2] : '') : ''}</li>
    `;

    // modal image 
    const image = document.getElementById('image');
    const imageUrl = card.image_link[0];
    imageUrl ? image.setAttribute('src', imageUrl) : image.style.display = 'none';

    // modal accuracy
    const accuracy = document.getElementById('accuracy');
    accuracy.innerText = card.accuracy.score * 100;

    // modal accuracy hide if the data is null
    const score = document.getElementById('score');
    score.style.display = (card.accuracy.score === null) ? 'none' : 'block';

    // input_output_examples
    const inputQuestion = document.getElementById('input');
    inputQuestion.innerText = (card.input_output_examples) ? card.input_output_examples[0].input : "Can you give any example?";

    const outputAnswer = document.getElementById('output');
    outputAnswer.innerText = (card.input_output_examples) ? card.input_output_examples[0].output : "No! Not Yet! Take a break!!!";

    const inputQuestion2 = document.getElementById('input2');
    inputQuestion2.innerText = (card.input_output_examples[1]) ? card.input_output_examples[1].input : "";

    const outputAnswer2 = document.getElementById('output2');
    outputAnswer2.innerText = (card.input_output_examples[1]) ? card.input_output_examples[1].output : "";
};

/* ---------------------------------------------------------
    sort data by published_in date from latest to oldest 
--------------------------------------------------------- */

const sortDataByDate = (data) => {
    data.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
};

// function of sort button
const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', () => {
    // start loader
    toggleProgress(true);

    // fetch data
    fetch(`https://openapi.programming-hero.com/api/ai/tools`)
        .then(res => res.json())
        .then(data => {
            sortDataByDate(data.data.tools)
            displayData(data.data.tools);
        })
        .catch(err => console.error(err))
        .finally(() => {

            // stop loader
            toggleProgress(false);
        });
});