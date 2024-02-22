import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/1941bcce4fc841f8bb02bcddde9cd9cd/raw/f70d5d206493facb7c2e1d8854a944641b10fcd6/results-summary-data.xml';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardResultTemplate = document.getElementById('card-result-template');
const cardCategoryTemplate = document.getElementById('card-data-item-template');
const cardSummaryTemplate = document.getElementById('card-summary-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (parentEl, name) => {
		const element = parentEl.getElementsByTagName(name)[0];
		const hasChildren = !!element.children.length;
		if (hasChildren) {
			return [...element.children].map(
				(item) => item.childNodes[0].nodeValue
			);
		}
		return element.childNodes[0].nodeValue;
	};

	const resultData = dataDoc.getElementsByTagName('result')[0];
	const summaryData = dataDoc.getElementsByTagName('summary')[0];

	const resultTitle = getElementValue(resultData, 'title');
	const resultChart = getElementValue(resultData, 'score');

	const summaryTitle = getElementValue(summaryData, 'title');
	const summaryCategories = getElementValue(summaryData, 'categories').map(
		(category) => {
			const categoryInfo = category.split(': ');
			return {
				name: categoryInfo[0],
				score: categoryInfo[1],
			};
		}
	);

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	/* [card result] */
	const cardResultTemplateNode = document.importNode(
		cardResultTemplate.content,
		true
	);
	const cardResultEl = cardResultTemplateNode.querySelector('.card__result');

	const cardResultTitleEl = cardResultEl.querySelector('.card__title');
	cardResultTitleEl.textContent = resultTitle;

	const cardResultChartScoreEl =
		cardResultEl.querySelector('.card__chart-score');
	cardResultChartScoreEl.textContent = resultChart[0].substring(
		0,
		resultChart[0].indexOf(' ')
	);

	const cardResultChartMaxScoreEl = cardResultEl.querySelector(
		'.card__chart-score + span'
	);
	cardResultChartMaxScoreEl.textContent = resultChart[0].substring(
		resultChart[0].indexOf(' ') + 1
	);

	const cardResultDescriptionTitleEl =
		cardResultEl.querySelector('.card__desc-title');
	cardResultDescriptionTitleEl.textContent = resultChart[1];

	const cardResultDescriptionContentEl = cardResultEl.querySelector(
		'.card__desc-content'
	);
	cardResultDescriptionContentEl.textContent = resultChart[2];

	/* [card summary] */
	const cardSummaryTemplateNode = document.importNode(
		cardSummaryTemplate.content,
		true
	);
	const cardSummaryEl =
		cardSummaryTemplateNode.querySelector('.card__summary');

	const cardSummaryTitleEl = cardSummaryEl.querySelector('.card__title');
	cardSummaryTitleEl.textContent = summaryTitle;

	const cardSummaryCategoriesEl =
		cardSummaryEl.querySelector('.card__data-list');

	for (const category of summaryCategories) {
		const { name, score } = category;

		const cardCategoryTemplateNode = document.importNode(
			cardCategoryTemplate.content,
			true
		);
		const cardCategoryEl =
			cardCategoryTemplateNode.querySelector('.card__data-item');
		cardCategoryEl.classList.add('card__data-item--' + name.toLowerCase());

		const cardCategoryImageEl =
			cardCategoryEl.querySelector('.card__data-img');
		cardCategoryImageEl.src =
			'./images/icons/' + name.toLowerCase() + '.svg';
		cardCategoryImageEl.alt = '';

		const cardCategoryTitleEl =
			cardCategoryEl.querySelector('.card__data-title');
		cardCategoryTitleEl.textContent = name;

		const cardCategoryScoreEl = cardCategoryEl.querySelector(
			'.card__data-score span:first-child'
		);
		cardCategoryScoreEl.textContent = score;

		cardSummaryCategoriesEl.appendChild(cardCategoryTemplateNode);
	}

	/* [init] */
	removeLoading();
	cardEl.appendChild(cardResultTemplateNode);
	cardEl.appendChild(cardSummaryTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
