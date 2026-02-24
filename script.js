class BMIAnimationController {
    constructor() {
        this.currentScene = 1;
        this.totalScenes = 6;
        this.sceneDuration = 4000;
        this.timer = null;

        this.scenes = document.querySelectorAll('.scene');
        this.progressDots = document.querySelectorAll('.progress-dot');
        this.progressFill = document.querySelector('.progress-fill');

        this.init();
    }

    init() {
        this.showScene(1);
        this.startAutoPlay();
    }

    showScene(sceneNum) {
        const previousScene = document.querySelector('.scene.active');
        const nextScene = document.querySelector(`.scene[data-scene="${sceneNum}"]`);

        if (previousScene) {
            previousScene.classList.add('exiting');
            previousScene.classList.remove('active');
            
            setTimeout(() => {
                previousScene.classList.remove('exiting');
            }, 600);
        }

        if (nextScene) {
            setTimeout(() => {
                nextScene.classList.add('active');
            }, previousScene ? 100 : 0);
        }

        this.currentScene = sceneNum;
        this.updateProgress();
    }

    updateProgress() {
        this.progressDots.forEach((dot, index) => {
            const sceneNum = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (sceneNum === this.currentScene) {
                dot.classList.add('active');
            } else if (sceneNum < this.currentScene) {
                dot.classList.add('completed');
            }
        });

        const progressPercent = ((this.currentScene - 1) / (this.totalScenes - 1)) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
    }

    nextScene() {
        if (this.currentScene < this.totalScenes) {
            this.showScene(this.currentScene + 1);
        } else {
            this.showScene(1);
        }
        this.startAutoPlay();
    }

    startAutoPlay() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.nextScene();
        }, this.sceneDuration);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BMIAnimationController();
});
