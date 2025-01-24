import * as THREE from './3Dmodules/three.module.js';
import { renderPage } from './router.js';
const appContainer = document.getElementById("app");
export let winners = [];

class GameRenderer {
	constructor(divContainer) {
		this._divContainer = divContainer;
		this._renderer = new THREE.WebGLRenderer({ antialias: true });
		this._renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(this._renderer.domElement);
	}

	resize() {
		this._renderer.setSize(window.innerWidth, window.innerHeight);
	}

	render(scene, camera1, camera2) {
		// 애니메이션 업데이트
		TWEEN.update();

		// 왼쪽 화면 렌더링
		this._renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
		this._renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
		this._renderer.setScissorTest(true);
		this._renderer.render(scene, camera1);

		// 오른쪽 화면 렌더링
		this._renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
		this._renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
		this._renderer.render(scene, camera2);
	}

	dispose() {
		this._renderer.dispose();
		this._divContainer.removeChild(this._renderer.domElement);
	}
}

class GameScene {
	constructor(ballColor, ballWireColor) {
		this._scene = new THREE.Scene();
		this._ballColor = ballColor;
		this._ballWireColor = ballWireColor;
		this._objects = {};

		this._setupLight();
		this._setupModels();
	}

	dispose() {
		this._scene.traverse((object) => {
			if (object.isMesh) {
				object.geometry.dispose();
				if (Array.isArray(object.material))
					object.material.forEach((material) => material.dispose());
				else if (object.material)
					object.material.dispose();
			}
		});
		this._objects = {};
	}

	_setupLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		this._scene.add(ambientLight);
	}

	_setupModels() {
		this._createRoom();
		this._createBall();
		this._createPaddles();
		this._createGuidelines();
		this._createHelpers();
	}

	_createRoom() {
		const roomGeometry = new THREE.BoxGeometry(30, 20, 25);
		const roomEdges = new THREE.EdgesGeometry(roomGeometry);
		const roomMaterial = new THREE.LineBasicMaterial({ color: 0x39FF14 });
		const room = new THREE.LineSegments(roomEdges, roomMaterial);

		this._scene.add(room);
		this._objects.room = room;
	}

	_createBall() {
		const ballGeometry = new THREE.SphereGeometry(2, 10, 10);
		const ballEdges = new THREE.EdgesGeometry(ballGeometry);
		const ballMaterial = new THREE.MeshPhongMaterial({ color: this._ballColor });
		const ballWireMaterial = new THREE.LineBasicMaterial({ color: this._ballWireColor });
		const ball = new THREE.Mesh(ballGeometry, ballMaterial);
		const ballWire = new THREE.LineSegments(ballEdges, ballWireMaterial);
		ballWire.rotation.x = Math.PI / 2;

		const ballGroup = new THREE.Group();
		ballGroup.add(ball);
		ballGroup.add(ballWire);

		this._scene.add(ballGroup);
		this._objects.ballGroup = ballGroup;
		this._objects.ball = ball;
		this._objects.ballWire = ballWire;
	}

	_createPaddles() {
		const paddleGeometry = new THREE.BoxGeometry(0.4, 5, 5);
		const paddleEdges = new THREE.EdgesGeometry(paddleGeometry);
		const paddleWireMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

		// 1P 패들 생성
		const p1Material = new THREE.MeshBasicMaterial({
			color: 0xD9A6A6,
			transparent: true,
			opacity: 0.5
		});
		const p1Paddle = new THREE.Mesh(paddleGeometry, p1Material);
		const p1PaddleWire = new THREE.LineSegments(paddleEdges, paddleWireMaterial);
		const p1PaddleGroup = new THREE.Group();

		// 2P 패들 생성
		const p2Material = new THREE.MeshBasicMaterial({
			color: 0xA6E1F9,
			transparent: true,
			opacity: 0.5
		});
		const p2Paddle = new THREE.Mesh(paddleGeometry, p2Material);
		const p2PaddleWire = new THREE.LineSegments(paddleEdges, paddleWireMaterial);
		const p2PaddleGroup = new THREE.Group();

		// CrossHair
		const whiteWireMat = new THREE.LineBasicMaterial({ color: 0xffffff });
		const circleGeo = new THREE.CircleGeometry(2, 64);
		const circleGeo2 = new THREE.CircleGeometry(0.5, 64);
		const circleEdge = new THREE.EdgesGeometry(circleGeo);
		const circleEdge2 = new THREE.EdgesGeometry(circleGeo2);
		const circleWire = new THREE.LineSegments(circleEdge, whiteWireMat);
		const circleWire2 = new THREE.LineSegments(circleEdge2, whiteWireMat);
		circleWire.rotation.y = Math.PI / 2;
		circleWire2.rotation.y = Math.PI / 2;

		const half = 5 / 2;
		const pointX = [new THREE.Vector3(-half, 0, 0), new THREE.Vector3(half, 0, 0)];
		const pointY = [new THREE.Vector3(0, -half, 0), new THREE.Vector3(0, half, 0)];
		const lineGeometryX = new THREE.BufferGeometry().setFromPoints(pointX);
		const lineX = new THREE.Line(lineGeometryX, whiteWireMat);
		const lineGeometryY = new THREE.BufferGeometry().setFromPoints(pointY);
		const lineY = new THREE.Line(lineGeometryY, whiteWireMat);
		lineX.rotation.y = Math.PI / 2;
		lineY.rotation.y = Math.PI / 2;

		p1PaddleGroup.add(p1Paddle);
		p1PaddleGroup.add(p1PaddleWire);
		p1PaddleGroup.add(circleWire);
		p1PaddleGroup.add(circleWire2);
		p1PaddleGroup.add(lineX);
		p1PaddleGroup.add(lineY);

		p2PaddleGroup.add(p2Paddle);
		p2PaddleGroup.add(p2PaddleWire);
		p2PaddleGroup.add(circleWire.clone());
		p2PaddleGroup.add(circleWire2.clone());
		p2PaddleGroup.add(lineX.clone());
		p2PaddleGroup.add(lineY.clone());

		p1PaddleGroup.position.set(15, 0, 0);
		p2PaddleGroup.position.set(-15, 0, 0);
		this._scene.add(p1PaddleGroup);
		this._scene.add(p2PaddleGroup);

		this._objects.p1PaddleGroup = p1PaddleGroup;
		this._objects.p2PaddleGroup = p2PaddleGroup;
	}

	_createGuidelines() {
		// Ball position guideline
		const ballPosX = new THREE.PlaneGeometry(25, 20);
		const ballPosXEdge = new THREE.EdgesGeometry(ballPosX);
		const ballPosXEdgeMat = new THREE.LineBasicMaterial({ color: 0x00FFFF });
		const ballPosXWire = new THREE.LineSegments(ballPosXEdge, ballPosXEdgeMat);
		ballPosXWire.rotation.y = Math.PI / 2;
		const ballPosZ = new THREE.PlaneGeometry(30, 20);
		const ballPosZEdge = new THREE.EdgesGeometry(ballPosZ);
		const ballPosZEdgeMat = new THREE.LineBasicMaterial({ color: 0xFF1493 });
		const ballPosZWire = new THREE.LineSegments(ballPosZEdge, ballPosZEdgeMat);

		this._scene.add(ballPosXWire);
		this._scene.add(ballPosZWire);
		this._objects._PosGuideX = ballPosXWire;
		this._objects._PosGuideZ = ballPosZWire;
	}

	_createHelpers() {
		const gridHelper = new THREE.GridHelper(100, 5);
		this._scene.add(gridHelper);
	}

	getScene() {
		return this._scene;
	}

	getObjects() {
		return this._objects;
	}
}

class GameController {
	constructor(speed, objects, p1Name, p2Name) {
		this._speed = speed;
		this._objects = objects;
		this._ballVec = new THREE.Vector3(1, 0, 0).normalize().multiplyScalar(speed * 0.3);
		this._ballRot = new THREE.Vector3(0, 0, 0);
		this._keyState = {};
		this._isGameOver = false;
		this.playerInfo = { player1Name: p1Name, player2Name: p2Name, player1Score: 0, player2Score: 0 };
		this._maxScore = 5; // 점수

		// 컨트롤 활성화 여부 플래그
		this._controlsEnabled = false;

		this._detectKeyPress();
	}

	dispose() {
		this._keyState = {};
		this._isGameOver = false;
		this.playerInfo = null;
	}

	_detectKeyPress() {
		window.addEventListener('keydown', (event) => {
			this._keyState[event.code] = true;
		});

		window.addEventListener('keyup', (event) => {
			this._keyState[event.code] = false;
		});
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async update() {
		if (this._isGameOver) return;

		this._movePaddles();
		await this._moveBall();
	}

	_movePaddles() {
		if (!this._controlsEnabled) return; // 컨트롤이 비활성화된 경우 패들 이동 중지

		const moveSpd = 0.3;

		// 1P 패들 이동
		const p1PaddleGroup = this._objects.p1PaddleGroup;
		if (this._keyState['KeyW'] && p1PaddleGroup.position.y < 7.5)
			p1PaddleGroup.position.y += moveSpd;
		if (this._keyState['KeyS'] && p1PaddleGroup.position.y > -7.5)
			p1PaddleGroup.position.y -= moveSpd;
		if (this._keyState['KeyA'] && p1PaddleGroup.position.z < 10)
			p1PaddleGroup.position.z += moveSpd;
		if (this._keyState['KeyD'] && p1PaddleGroup.position.z > -10)
			p1PaddleGroup.position.z -= moveSpd;

		// 2P 패들 이동
		const p2PaddleGroup = this._objects.p2PaddleGroup;
		if (this._keyState['ArrowUp'] && p2PaddleGroup.position.y < 7.5)
			p2PaddleGroup.position.y += moveSpd;
		if (this._keyState['ArrowDown'] && p2PaddleGroup.position.y > -7.5)
			p2PaddleGroup.position.y -= moveSpd;
		if (this._keyState['ArrowLeft'] && p2PaddleGroup.position.z > -10)
			p2PaddleGroup.position.z -= moveSpd;
		if (this._keyState['ArrowRight'] && p2PaddleGroup.position.z < 10)
			p2PaddleGroup.position.z += moveSpd;
	}

	async _moveBall() {
		const ball = this._objects.ball;
		const ballWire = this._objects.ballWire;

		this._ballVec.normalize().multiplyScalar(this._speed * 0.3);

		if (Math.abs(ball.position.x) > 12.7 && Math.abs(ball.position.x) < 13.4) {
			if (this._isPaddleHit()) {
				this._ballVec.x *= -1;
			}
		} else if (Math.abs(ball.position.x) > 13.6) {
			// 점수 업데이트
			if (ball.position.x > 0) {
				this.playerInfo.player2Score += 1;
			} else {
				this.playerInfo.player1Score += 1;
			}
			ScoreBoard.update(this.playerInfo, this._playernames)

			// 게임 종료 체크
			if (this.playerInfo.player1Score >= this._maxScore || this.playerInfo.player2Score >= this._maxScore) {
				this._isGameOver = true;
				ScoreBoard.showGameOver(this.playerInfo);
				return;
			}

			// 공과 패들 초기화
			this._resetGameObjects();
			await this.sleep(1000);
		}

		// 벽 충돌 처리
		if (Math.abs(ball.position.y) > 8) this._ballVec.y *= -1;
		if (Math.abs(ball.position.z) > 10.5) this._ballVec.z *= -1;

		// 공 회전 적용
		ballWire.rotation.z += this._ballRot.z;
		ballWire.rotation.y += this._ballRot.y;

		// 공 위치 업데이트
		ball.position.add(this._ballVec);
		ballWire.position.add(this._ballVec);
		this._objects._PosGuideX.position.x = ball.position.x;
		this._objects._PosGuideZ.position.z = ball.position.z;
	}

	_isPaddleHit() {
		const ball = this._objects.ball;
		const p1PaddleGroup = this._objects.p1PaddleGroup;
		const p2PaddleGroup = this._objects.p2PaddleGroup;

		let paddlePos;
		let isPlayer1;

		if (ball.position.x > 0) {
			isPlayer1 = true;
			paddlePos = p1PaddleGroup.position.clone();
		}
		else {
			isPlayer1 = false;
			paddlePos = p2PaddleGroup.position.clone();
		}

		const zDiff = paddlePos.z - ball.position.z;
		const yDiff = paddlePos.y - ball.position.y;

		if (Math.abs(zDiff) <= 2.7 && Math.abs(yDiff) <= 2.7) {
			this._adjustBallVector(zDiff, yDiff, isPlayer1);
			return true;
		}
		return false;
	}

	_adjustBallVector(zDiff, yDiff, isPlayer1) {
		if (Math.sqrt(zDiff ** 2 + yDiff ** 2) <= 0.5) {
			this._ballVec.set(this._ballVec.x, 0, 0);
			this._ballRot.set(0, 0, 0);
		}
		else {
			let vecZ = zDiff / 5;
			let vecY = yDiff / 5;
			this._ballVec.z = -vecZ;
			this._ballVec.y = -vecY;
			this._ballRot.z = -vecZ / 2;
			this._ballRot.y = -vecY / 2;
			this._ballVec.x = 0.8;
			if (!isPlayer1)
				this._ballVec.x *= -1;
		}
		this._ballVec.normalize().multiplyScalar(this._speed * 0.3);
	}

	_resetGameObjects() {
		const ball = this._objects.ball;
		const ballWire = this._objects.ballWire;
		const p1PaddleGroup = this._objects.p1PaddleGroup;
		const p2PaddleGroup = this._objects.p2PaddleGroup;

		p1PaddleGroup.position.set(15, 0, 0);
		p2PaddleGroup.position.set(-15, 0, 0);
		this._ballVec.set(this._ballVec.x > 0 ? 1 : -1, 0, 0);
		this._ballRot.set(0, 0, 0);
		ball.position.set(0, 0, 0);
		ballWire.position.set(0, 0, 0);
	}
}

class ScoreBoard {
	static init(gameNum) {
		this._scoreBoard = document.createElement('div');
		this._scoreBoard.classList.add('game-score');
		this._gameNum = gameNum;
		appContainer.appendChild(this._scoreBoard);
	}

	static dispose() {
		if (this._scoreBoard && this._scoreBoard.parentNode) {
			this._scoreBoard.parentNode.removeChild(this._scoreBoard);
			this._scoreBoard = null;
		}
		if (this._gameOverElement && this._gameOverElement.parentNode) {
			this._gameOverElement.parentNode.removeChild(this._gameOverElement);
			this._gameOverElement = null;
		}
		// 이벤트 리스너 제거
		if (this._returnBtn) {
			this._returnBtn.removeEventListener('click', () => renderPage('game-select'));
			this._returnBtn = null;
		}
	}

	static update(playerInfo) {
		let gameNumTxt = '';
		if (this._gameNum)
			gameNumTxt = `Game ` + this._gameNum + `<br>`;
		this._scoreBoard.innerHTML = gameNumTxt + `${playerInfo.player1Name}: ${playerInfo.player1Score} - ${playerInfo.player2Name}: ${playerInfo.player2Score}`;
	}

	static showGameOver(playerInfo) {
		const gameOverText = document.createElement('div');
		gameOverText.classList.add('game-over');
		const winner = playerInfo.player1Score >= 5 ? `${playerInfo.player1Name}` : `${playerInfo.player2Name}`;
		gameOverText.innerHTML = `Game Over<br>${winner}` + ' Wins!';
		appContainer.appendChild(gameOverText);

		const returnBtn = document.createElement('button');
		returnBtn.classList.add('game-over-button');
    returnBtn.textContent = 'Back to the game setting';
    returnBtn.addEventListener('click', () => renderPage('3d-setting'));
    console.log('HERE');
		gameOverText.appendChild(returnBtn);

		this._gameOverElement = gameOverText;
		this._returnBtn = returnBtn;
	}
}

export class ThreeGame {
	constructor(gameNum, color, speed, p1Name, p2Name) {
		this._divContainer = null;
		this._divContainer = document.getElementById('3dpong');
		this._renderer = new GameRenderer(this._divContainer);
		this._scene = new GameScene(Number(color), Number(color) === 0xC0C0C0 ? 0x000000 : 0xFFFFFF);
		this._objects = this._scene.getObjects();
		this._controller = new GameController(speed, this._objects, p1Name, p2Name);

		this._setupCameras();
		// this._setupControls();
		this._onWindowResize = this.resize.bind(this);
		window.addEventListener('resize', this._onWindowResize);
		this.resize();

		ScoreBoard.init(gameNum);
		ScoreBoard.update(this._controller.playerInfo);

		this._animationId = null;
		// 컨트롤 비활성화
		this._controller._controlsEnabled = false;

		// 카메라 애니메이션 실행
		this._startCameraAnimation();
	}

	_setupCameras() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		// 1P 카메라 초기 위치 (대각선 위쪽)
		this._camera1p = new THREE.PerspectiveCamera(75, width / 2 / height, 0.1, 1000);
		this._camera1p.position.set(60, 60, 60);
		this._camera1p.lookAt(new THREE.Vector3(0, 0, 0));

		// 2P 카메라 초기 위치 (대각선 위쪽)
		this._camera2p = new THREE.PerspectiveCamera(75, width / 2 / height, 0.1, 1000);
		this._camera2p.position.set(-60, 60, -60);
		this._camera2p.lookAt(new THREE.Vector3(0, 0, 0));
	}

	_setupControls() {
		new OrbitControls(this._camera1p, this._divContainer);
		new OrbitControls(this._camera2p, this._divContainer);
	}

	resize() {
		this._renderer.resize();

		this._camera1p.aspect = window.innerWidth / 2 / window.innerHeight;
		this._camera1p.updateProjectionMatrix();

		this._camera2p.aspect = window.innerWidth / 2 / window.innerHeight;
		this._camera2p.updateProjectionMatrix();
	}

	start(onGameOverCallback) {
		this._animationId = requestAnimationFrame(this._animate.bind(this));
	}

	async _animate() {
		await this._controller.update();

		this._renderer.render(this._scene.getScene(), this._camera1p, this._camera2p);

		if (this._renderer && !this._controller._isGameOver)
			this._animationId = requestAnimationFrame(this._animate.bind(this));
	}

	dispose() {
		if (this._animationId) {
			cancelAnimationFrame(this._animationId);
			this._animationId = null;
		}
		if (this._renderer) {
			this._renderer.dispose();
			this._renderer = null;
		}
		if (this._controller) {
			this._controller.dispose();
			this._controller = null;
		}
		if (this._scene) {
			this._scene.dispose();
			this._scene = null;
		}
		if (ScoreBoard) {
			ScoreBoard.dispose();
		}
		if (this._onWindowResize) {
			window.removeEventListener('resize', this._onWindowResize);
			this._onWindowResize = null;
		}
		// Tween 중지 및 제거
		if (this._camera1Tween) {
			this._camera1Tween.stop();
			this._camera1Tween = null;
		}
		if (this._camera2Tween) {
			this._camera2Tween.stop();
			this._camera2Tween = null;
		}
		// 모든 Tween 제거 (안전 장치)
		TWEEN.removeAll();

		// 기타 리소스 해제
		this._divContainer = null;
		this._objects = null;
		this._camera1p = null;
		this._camera2p = null;
		console.log('3D game resources dispose complete');
	}

	_startCameraAnimation() {
		// 1P 카메라 애니메이션
		const camera1TargetPosition = { x: 40, y: 0, z: 0 };
		const camera1Tween = new TWEEN.Tween(this._camera1p.position)
			.to(camera1TargetPosition, 2000) // 2초 동안 애니메이션
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this._camera1p.lookAt(new THREE.Vector3(0, 0, 0));
			})
			.onComplete(() => {
				// 카메라 애니메이션 완료 시 컨트롤 활성화
				this._controller._controlsEnabled = true;
			})
			.start();

		// 2P 카메라 애니메이션
		const camera2TargetPosition = { x: -40, y: 0, z: 0 };
		const camera2Tween = new TWEEN.Tween(this._camera2p.position)
			.to(camera2TargetPosition, 2000) // 2초 동안 애니메이션
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this._camera2p.lookAt(new THREE.Vector3(0, 0, 0));
			})
			.start();
	}
}
