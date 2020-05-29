var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

const countries = [
	{
		code: "GB",
		slug: "united-kingdom",
	},
	{
		code: "US",
		slug: "united-states",
	},
	{
		code: "CN",
		slug: "china",
	},
];

const totalCasesTxt = document.querySelector("#totalCasesTxt");
const activeCasesTxt = document.querySelector("#activeCasesTxt");
const recoveredTxt = document.querySelector("#recoveredTxt");
const deathsTxt = document.querySelector("#deathsTxt");
const ctx = document.querySelector("#chart").getContext("2d");
const counters = document.querySelectorAll(".counter");
const newsPar = document.querySelector("#newsPar");
const newsLink = document.querySelector("#newsLink");
const countrySelect = document.querySelector("#countrySelect");

let currentCountry = countries[0];
let int;
let chart;

function loadApp() {
	fetch(`https://api.covid19api.com/total/country/${currentCountry.slug}`)
		.then((res) => res.json())
		.then((data) => {
			totalCasesTxt.setAttribute(
				"data-target",
				data[data.length - 1].Confirmed
			);

			activeCasesTxt.setAttribute("data-target", data[data.length - 1].Active);
			console.log(data[data.length - 1]);

			recoveredTxt.setAttribute("data-target", data[data.length - 1].Recovered);

			deathsTxt.setAttribute("data-target", data[data.length - 1].Deaths);

			let labels = [];
			for (let i = 1; i <= 10; i++) {
				let d = new Date(data[data.length - i].Date);
				labels[i - 1] = `${month[d.getMonth()]} ${d.getDate()}`;
			}

			counters.forEach((counter) => {
				const updateCount = () => {
					const target = +counter.getAttribute("data-target");
					const count = +counter.innerText.replace(/,/g, "");

					const inc = parseInt(target / (target / 1111));

					if (count < target) {
						counter.innerText = (count + inc).toLocaleString("en");
						setTimeout(updateCount, 1);
					} else {
						counter.innerText = parseInt(target).toLocaleString("en");
					}
				};

				updateCount();
			});

			chart = new Chart(ctx, {
				type: "bar",

				data: {
					labels: [
						labels[9],
						labels[8],
						labels[7],
						labels[6],
						labels[5],
						labels[4],
						labels[3],
						labels[2],
						labels[1],
						labels[0],
					],
					datasets: [
						{
							backgroundColor: "rgb(0,123,255)",
							data: [
								data[data.length - 10].Active,
								data[data.length - 9].Active,
								data[data.length - 8].Active,
								data[data.length - 7].Active,
								data[data.length - 6].Active,
								data[data.length - 5].Active,
								data[data.length - 4].Active,
								data[data.length - 3].Active,
								data[data.length - 2].Active,
								data[data.length - 1].Active,
							],
							pointBackgroundColor: "#6c63ff",
						},
					],
				},

				options: {
					legend: {
						display: false,
					},
					scales: {
						yAxes: [
							{
								ticks: {
									// Abbreviate the millions
									callback: function (value, index, values) {

										if(value > 1000000)
											return value / 1e6 + "M";
										if(value > 1000)
											return value / 1e3 + "K";
										return value;
									},
								},
							},
						],
					},
				},
			});
		});

	fetch(
		`https://api.smartable.ai/coronavirus/news/${currentCountry.code}?Subscription-Key=84c6bc03ddaa449596ea0726522936eb`
	)
		.then((res) => res.json())
		.then((data) => {
			let counter = 0;

			newsPar.innerHTML = data.news[counter].title.substring(0, 130);
			newsLink.href = data.news[counter].webUrl;

			int = setInterval(function () {
				newsPar.classList.add("hide");
				setTimeout(() => {
					counter++;
					newsPar.innerHTML = data.news[counter].title.substring(0, 130);
					newsLink.href = data.news[counter].webUrl;
					if (data.news[counter].title.length > 131) newsPar.innerHTML += "...";
					newsPar.classList.remove("hide");
				}, 500);
				if (counter >= data.news.length) {
					counter = 0;
				}
			}, 7500);
		});
}

loadApp();

countrySelect.addEventListener("change", () => {
	countries.forEach((country) => {
		if (country.code == countrySelect.value) currentCountry = country;
	});
	clearInterval(int);
	chart.destroy();
	loadApp();
});
