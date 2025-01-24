// const appContainer = document.getElementById("app");
// index.html의 <div id="app">를 갈아끼우는식으로 작동함

import { threeDSetting } from './3d-setting.js';
import { threeDGame } from './3d-game.js'

const funcArray = [threeDSetting, threeDGame];

export const supportLangs = ['en', 'kr', 'jp'];
// 함수 배열, 각각의 함수는 대응되는 페이지의 내용을 랜더링해줌

import { languages } from './language.js';

let ignoreHashChange = false;
// 해시 변경 시 이벤트 무시 여부를 관리하는 boolean 플래그.
// 언어를 바꿀때, randerPage()함수가 두번씩 호출되는걸 포착해서 이를 막기 위해서 설정.

const hashList = [
	'3d-setting',
	'3d-game'
];

export function renderPage(hash) {
	ignoreHashChange = true;
	console.log(hash);
	const currentLang = getCurLangHash();

	let idx = hashList.indexOf(hash);
	funcArray[idx](currentLang);
	window.location.hash = `#${currentLang}/` + hash;

	const langSetting = document.getElementById("globe-icon");
	if (idx < 5 && window.getComputedStyle(langSetting).display === "none") {
		langSetting.style.display = "block";
	}

	setTimeout(() => { ignoreHashChange =false; }, 100);
}

function getCurLangHash() {
	const hash = window.location.hash.substring(1);
	const [lang] = hash.split('/');
	return languages[lang] ? lang : 'en';
}

function handleHashChange() {
	if (ignoreHashChange)
		return;
	const hash = window.location.hash.substring(1); // "#" 문자 지우기
	let [lang, page] = hash.split('/'); // 언어설정, 현 페이지 주소 분리

	const hashIdx = hashList.indexOf(page);
	if (hashIdx != 0) // 유효한 hash주솟값인지 확인
		page = '3d-setting';
	renderPage(page);
}

window.addEventListener('hashchange', handleHashChange);
// 주소갱신 이벤트

window.addEventListener('load', handleHashChange);
// 새로고침 이벤트
