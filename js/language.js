const languageButton = document.getElementById('globe-icon');

// Translations
export const languages = {
	en: {
		threeDBallSpd: "Ball speed",
		threeDBallCol: "Ball color",
		threeDStart: "Let's go!",
		threeDEasy: "Easy",
		threeDHard: "Hard",
		player1Nick: "Enter nickname for P1",
		player2Nick: "Enter nickname for P2",
	},
	ko: {
		threeDBallSpd: "공의 속도",
		threeDBallCol: "공의 색깔",
		threeDStart: "게임 시작!",
		threeDEasy: "쉬움",
		threeDHard: "어려움",
		player1Nick: "선수1의 이름을 입력",
		player2Nick: "선수2의 이름을 입력",
	},
	ja: {
		threeDBallSpd: "速度",
		threeDBallCol: "色",
		threeDStart: "ゲームスタート!",
		goBack: "前のページへ",
		threeDEasy: "普通",
		threeDHard: "速い",
		player1Nick: "1番の選手名入力",
		player2Nick: "2番の選手名入力",
	}
};

// Function to toggle the language selection menu
function langSelect() {
	let languageOptions = document.getElementById('language-options');
	if (languageOptions.style.display === 'none')
		languageOptions.style.display = 'block';
	else
		languageOptions.style.display = 'none';
}

// Function to handle language changes
function addLanguageChangeListeners() {
	document.querySelectorAll('.lang-btn').forEach(button => {
		button.addEventListener('click', () => {
			const selectedLang = button.getAttribute('data-lang');
			const currentHash = window.location.hash.substring(1);
			const [, currentPage] = currentHash.split('/');
			const page = currentPage || 'game-select'; // Default to 'game-select'

			window.location.hash = `#${selectedLang}/${page}`;

			document.getElementById('language-options').style.display = 'none';
		});
	});
}

function closeLangOptions(event) {
	const langOptions = document.getElementById('language-options');
	const langBtn = document.getElementById('globe-icon');

	if (!langOptions.contains(event.target) && !langBtn.contains(event.target))
		langOptions.style.display = 'none';
}

// Add language change listeners
addLanguageChangeListeners();

// Language button click listener
languageButton.addEventListener('click', langSelect);

document.addEventListener('click', closeLangOptions);
