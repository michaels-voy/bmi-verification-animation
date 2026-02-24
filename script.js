class BMIAnimationController {
    constructor() {
        this.currentScene = 1;
        this.totalScenes = 6;
        this.sceneDuration = 4000;
        this.isPlaying = true;
        this.timer = null;

        this.scenes = document.querySelectorAll('.scene');
        this.progressDots = document.querySelectorAll('.progress-dot');
        this.progressFill = document.querySelector('.progress-fill');
        this.playPauseBtn = document.querySelector('.play-pause');
        this.replayBtn = document.querySelector('.replay');

        this.init();
    }

    init() {
        this.showScene(1);
        this.bindEvents();
        this.startAutoPlay();
    }

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.replayBtn.addEventListener('click', () => this.replay());

        this.progressDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const sceneNum = parseInt(e.target.dataset.scene);
                this.goToScene(sceneNum);
            });
        });

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowRight':
                    this.nextScene();
                    break;
                case 'ArrowLeft':
                    this.previousScene();
                    break;
                case 'r':
                case 'R':
                    this.replay();
                    break;
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (this.isPlaying) {
                this.play();
            }
        });
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
            this.resetTimer();
        } else {
            this.pause();
            this.playPauseBtn.classList.add('paused');
        }
    }

    previousScene() {
        if (this.currentScene > 1) {
            this.showScene(this.currentScene - 1);
            this.resetTimer();
        }
    }

    goToScene(sceneNum) {
        if (sceneNum >= 1 && sceneNum <= this.totalScenes) {
            this.showScene(sceneNum);
            this.resetTimer();
            
            if (!this.isPlaying && sceneNum < this.totalScenes) {
                this.play();
            }
        }
    }

    startAutoPlay() {
        if (this.isPlaying) {
            this.timer = setTimeout(() => {
                this.nextScene();
                if (this.currentScene < this.totalScenes && this.isPlaying) {
                    this.startAutoPlay();
                }
            }, this.sceneDuration);
        }
    }

    resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.isPlaying && this.currentScene < this.totalScenes) {
            this.startAutoPlay();
        }
    }

    play() {
        this.isPlaying = true;
        this.playPauseBtn.classList.remove('paused');
        this.playPauseBtn.setAttribute('aria-label', 'Pause animation');
        
        if (this.currentScene >= this.totalScenes) {
            this.showScene(1);
        }
        
        this.startAutoPlay();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.classList.add('paused');
        this.playPauseBtn.setAttribute('aria-label', 'Play animation');
        
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    replay() {
        this.showScene(1);
        this.isPlaying = true;
        this.playPauseBtn.classList.remove('paused');
        this.playPauseBtn.setAttribute('aria-label', 'Pause animation');
        this.resetTimer();
    }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
    const animation = new BMIAnimationController();

    if (prefersReducedMotion.matches) {
        animation.pause();
    }
});
