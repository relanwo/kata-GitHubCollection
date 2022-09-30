const search = document.querySelector(".search"),
	searchInput = document.querySelector(".search__input"),
	searchDropdown = document.querySelector(".search__dropdown"),
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

searchInput.addEventListener("input", debounce(onInputChange, 500));

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
				const fragment = document.createDocumentFragment();
				items.forEach((item) => {
					const element = document.createElement("li");
					element.addEventListener("click", () => {
						const element = document.createElement("li");
						element.classList.add("repository");

						const name = document.createElement("p");
						name.classList.add("repository__name");
						name.innerText = `Name: ${item.name}`;
						element.appendChild(name);

						const owner = document.createElement("p");
						owner.classList.add("repository__owner");
						owner.innerText = `Owner: ${item.owner.login}`;
						element.appendChild(owner);

						const stars = document.createElement("p");
						stars.classList.add("repository__stars");
						stars.innerText = `☆ ${item.stargazers_count}`;
						element.appendChild(stars);

						const cross = document.createElement("button");
						cross.classList.add("repository__cross");
						// cross.innerText = `${}`;
						element.appendChild(cross);

						cross.addEventListener("click", () => {
							element.remove();
						});

						repositoryList.appendChild(element);
						repositoryList.classList.add("open");

						searchDropdown.innerHTML = "";
						searchInput.value = "";
					});
					element.classList.add("search__item");
					element.innerText = item.full_name;
					fragment.appendChild(element);
				});
				searchDropdown.innerHTML = "";
				searchDropdown.appendChild(fragment);
			});
	} else {
		searchDropdown.innerHTML = "";
	}
}
