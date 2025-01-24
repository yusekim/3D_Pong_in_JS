const languageButton = document.getElementById('globe-icon');

// Translations
export const languages = {
	en: {
		welcome: "WELCOME TO PONG!",
		twoDPong: "2D Pong",
		threeDPong: "3D Pong",
		gameModeSel: "SELECT YOUR GAME MODE",
		oneVone: "1V1",
		tournament: "Tournament",
		threeDBallSpd: "Ball speed",
		threeDBallCol: "Ball color",
		threeDStart: "Let's go!",
		goBack: "Back",
		threeDEasy: "Easy",
		threeDHard: "Hard",
		player1Nick: "Enter nickname for P1",
		player2Nick: "Enter nickname for P2",
		player3Nick: "Enter nickname for P3",
		player4Nick: "Enter nickname for P4",
		players: "Players",
		final: "Final",
		winner: "Winner",
		goMain: "back to the main page",
	},
	ko: {
		welcome: "PONG에 오신 것을 환영합니다!",
		twoDPong: "평면 Pong",
		threeDPong: "입체 Pong",
		gameModeSel: "원하시는 게임 방식을 선택하세요",
		oneVone: "일대일",
		tournament: "토너먼트",
		threeDBallSpd: "공의 속도",
		threeDBallCol: "공의 색깔",
		threeDStart: "게임 시작!",
		goBack: "뒤로가기",
		threeDEasy: "쉬움",
		threeDHard: "어려움",
		player1Nick: "선수1의 이름을 입력",
		player2Nick: "선수2의 이름을 입력",
		player3Nick: "선수3의 이름을 입력",
		player4Nick: "선수4의 이름을 입력",
		players: "선수명",
		final: "결승전",
		winner: "승자",
		goMain: "메인 페이지로",
	},
	ja: {
		welcome: "PONGへようこそ!",
		twoDPong: "平面 Pong",
		threeDPong: "立体 Pong",
		gameModeSel: "ゲームモードを選択",
		oneVone: "一対一",
		tournament: "トーナメント",
		threeDBallSpd: "速度",
		threeDBallCol: "色",
		threeDStart: "ゲームスタート!",
		goBack: "前のページへ",
		threeDEasy: "普通",
		threeDHard: "速い",
		player1Nick: "1番の選手名入力",
		player2Nick: "2番の選手名入力",
		player3Nick: "3番の選手名入力",
		player4Nick: "4番の選手名入力",
		players: "選手名",
		final: "決勝戦",
		winner: "勝者",
		goMain: "メインページに戻ります",
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
