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
		Slug: "united-kingdom",
		ISO2: "GB",
	},
	{
		Slug: "united-states",
		ISO2: "US",
	},
	{
		Slug: "china",
		ISO2: "CN",
	},
	{
		Slug: "denmark",
		ISO2: "DK",
	},
	{
		Slug: "switzerland",
		ISO2: "CH",
	},
	{
		Slug: "canada",
		ISO2: "CA",
	},
	{
		Slug: "belgium",
		ISO2: "BE",
	},
	{
		Slug: "slovakia",
		ISO2: "SK",
	},
	{
		Slug: "portugal",
		ISO2: "PT",
	},
	{
		Slug: "finland",
		ISO2: "FI",
	},
	{
		Slug: "israel",
		ISO2: "IL",
	},
	{
		Slug: "spain",
		ISO2: "ES",
	},
	{
		Slug: "argentina",
		ISO2: "AR",
	},
	{
		Slug: "austria",
		ISO2: "AT",
	},
	{
		Slug: "italy",
		ISO2: "IT",
	},
	{
		Slug: "turkey",
		ISO2: "TR",
	},
	{
		Slug: "australia",
		ISO2: "AU",
	},
	{
		Slug: "ireland",
		ISO2: "IE",
	},
	{
		Slug: "greece",
		ISO2: "GR",
	},
	{
		Slug: "korea-south",
		ISO2: "KR",
	},
	{
		Slug: "netherlands",
		ISO2: "NL",
	},
	{
		Slug: "germany",
		ISO2: "DE",
	},
	{
		Slug: "japan",
		ISO2: "JP",
	},
	{
		Slug: "france",
		ISO2: "FR",
	},
	{
		Slug: "norway",
		ISO2: "NO",
	},
	{
		Slug: "sweden",
		ISO2: "SE",
	},
	{
		Slug: "poland",
		ISO2: "PL",
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
const pagination = document.querySelector("#pagination");
const leftPgLink = document.querySelector("#leftPgLink");
const pgNum = document.querySelector("#pgNum");
const rightPgLink = document.querySelector("#rightPgLink");

let currentCountry = countries[0];
let int;
let chart;

function loadApp() {
	fetch(`https://api.covid19api.com/total/country/${currentCountry.Slug}`)
		.then((res) => res.json())
		.then((data) => {
			totalCasesTxt.setAttribute(
				"data-target",
				data[data.length - 1].Confirmed
			);

			activeCasesTxt.setAttribute("data-target", data[data.length - 1].Active);

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
										if (value > 1000000) return value / 1e6 + "M";
										if (value > 1000) return value / 1e3 + "K";
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
		`https://api.smartable.ai/coronavirus/news/${currentCountry.ISO2}?Subscription-Key=84c6bc03ddaa449596ea0726522936eb`
	)
		.then((res) => res.json())
		.then((data) => {
			if (data.news === undefined || data.news == 0) {
				newsPar.innerHTML = `Sorry! No news data found for this country.`;
				newsLink.href = "#";
				newsLink.setAttribute("target", "");
				pagination.style.display = "none";
			} else {
				newsPar.innerHTML = data.news[0].title.substring(0, 75);
				newsLink.href = data.news[0].webUrl;
				pagination.style.display = "flex";
				pgNum.innerHTML = `${1}`;
				leftPgLink.setAttribute("data-target", 29);
				rightPgLink.setAttribute("data-target", 1);

				let c = 1;
				int = setInterval(changeNews, 7500);

				leftPgLink.addEventListener("click", () => {
					clearInterval(int);
					c = +leftPgLink.getAttribute("data-target");
					changeNews();
					int = setInterval(changeNews, 7500);
				});
				rightPgLink.addEventListener("click", () => {
					clearInterval(int);
					c = +rightPgLink.getAttribute("data-target");
					changeNews();
					int = setInterval(changeNews, 7500);
				});

				function changeNews() {
					newsPar.classList.add("hide");
					setTimeout(() => {
						newsPar.innerHTML = data.news[c].title.substring(0, 75);
						newsLink.href = data.news[c].webUrl;
						if (c != 0) leftPgLink.setAttribute("data-target", c - 1);
						else leftPgLink.setAttribute("data-target", data.news.length - 1);
						if (c != data.news.length - 1)
							rightPgLink.setAttribute("data-target", c + 1);
						else rightPgLink.setAttribute("data-target", 0);
						pgNum.innerHTML = `${c + 1}`;
						if (data.news[c].title.length > 76) newsPar.innerHTML += "...";
						newsPar.classList.remove("hide");
						c++;
					}, 500);
					if (c >= data.news.length) {
						c = 0;
					}
				}
			}
		});
}

loadApp();

countrySelect.addEventListener("change", () => {
	countries.forEach((country) => {
		if (country.ISO2 == countrySelect.value) currentCountry = country;
	});
	clearInterval(int);
	chart.destroy();
	loadApp();
});
