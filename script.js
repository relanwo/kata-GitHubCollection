const search = document.querySelector(".search"),
  searchInput = document.querySelector("#search__input"),
	searchDropdown = document.querySelector(".search__dropdown"),
	searchMessage = document.querySelector(".search__message"),
	repositoryList = document.querySelector(".repository-list"),
	debounce = (func, delay) => {
		let inDebounce;
		return function () {
			clearTimeout(inDebounce);
			inDebounce = setTimeout(() => func.apply(this, arguments), delay);
		};
	};

function onInputChange(event) {
	search.classList.add("open");
	getApiData(event.target.value);
}

function crossListenerHandler(event) {
	this.element.remove();
	event.target.removeEventListener("click", {
		handleEvent: crossListenerHandler,
		element: this.element,
	});
}

function searchItemListenerHandler() {
	const repositoryElement = document.createElement("li");
	repositoryElement.classList.add("repository");

	const name = document.createElement("p");
	name.classList.add("repository__name");
	name.innerText = `Name: ${this.item.name}`;
	repositoryElement.appendChild(name);

	const owner = document.createElement("p");
	owner.classList.add("repository__owner");
	owner.innerText = `Owner: ${this.item.owner.login}`;
	repositoryElement.appendChild(owner);

	const stars = document.createElement("p");
	stars.classList.add("repository__stars");
	stars.innerText = `☆ ${this.item.stargazers_count}`;
	repositoryElement.appendChild(stars);

	const cross = document.createElement("button");
	cross.classList.add("repository__cross");
	repositoryElement.appendChild(cross);

	cross.addEventListener("click", {
		handleEvent: crossListenerHandler,
		element: repositoryElement,
	});

	repositoryList.appendChild(repositoryElement);
	repositoryList.classList.add("open");

	searchDropdown.innerHTML = "";
	searchInput.value = "";
}

function getApiData(value) {
	if (value) {
		return fetch(
			`https://api.github.com/search/repositories?q=${value}&per_page=5`
		)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
			})
			.then((response) => {
				const items = response.items;
				items.length === 0
					? (searchMessage.innerText = "No repositories found")
					: (searchMessage.innerText = "");
				const searchFragment = document.createDocumentFragment();
				items.forEach((item) => {
					const searchItem = document.createElement("li");
					searchItem.classList.add("search__item");
					searchItem.innerText = item.full_name;
					searchFragment.appendChild(searchItem);

					searchItem.addEventListener(
						"click",
						{ handleEvent: searchItemListenerHandler, item: item },
						{ once: true }
					);
				});
				searchDropdown.innerHTML = "";
				searchDropdown.appendChild(searchFragment);
			});
	} else {
		searchDropdown.innerHTML = "";
	}
}

searchInput.addEventListener("input", debounce(onInputChange, 500));
