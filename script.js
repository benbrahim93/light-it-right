class LightGame {
    constructor() {
        this.gridSize = 3;
        this.score = 0;
        this.level = 1;
        this.targetPattern = [];
        this.currentPattern = [];
        this.isPlaying = false;
        
        this.gameGrid = document.getElementById('gameGrid');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createGrid();
        this.updateScore();
        this.updateLevel();
    }

    createGrid() {
        this.gameGrid.innerHTML = '';
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const light = document.createElement('div');
            light.className = 'light';
            light.dataset.index = i;
            this.gameGrid.appendChild(light);
        }
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.gameGrid.addEventListener('click', (e) => this.handleLightClick(e));
    }

    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.generateTargetPattern();
        this.showTargetPattern();
    }

    generateTargetPattern() {
        this.targetPattern = [];
        const numLights = Math.min(3 + this.level, 9);
        
        for (let i = 0; i < numLights; i++) {
            const randomIndex = Math.floor(Math.random() * (this.gridSize * this.gridSize));
            if (!this.targetPattern.includes(randomIndex)) {
                this.targetPattern.push(randomIndex);
            }
        }
    }

    showTargetPattern() {
        this.targetPattern.forEach((index, i) => {
            setTimeout(() => {
                const light = this.gameGrid.children[index];
                light.classList.add('on');
                setTimeout(() => {
                    light.classList.remove('on');
                }, 500);
            }, i * 1000);
        });
    }

    handleLightClick(e) {
        if (!this.isPlaying) return;
        
        const light = e.target.closest('.light');
        if (!light) return;
        
        const index = parseInt(light.dataset.index);
        light.classList.toggle('on');
        
        if (light.classList.contains('on')) {
            this.currentPattern.push(index);
        } else {
            this.currentPattern = this.currentPattern.filter(i => i !== index);
        }
        
        this.checkPattern();
    }

    checkPattern() {
        if (this.currentPattern.length !== this.targetPattern.length) return;
        
        const isCorrect = this.targetPattern.every(index => 
            this.currentPattern.includes(index)
        );
        
        if (isCorrect) {
            this.score += 10;
            this.level++;
            this.updateScore();
            this.updateLevel();
            setTimeout(() => {
                this.startGame();
            }, 1000);
        } else {
            this.resetGame();
        }
    }

    resetGame() {
        this.isPlaying = false;
        this.currentPattern = [];
        this.createGrid();
        this.score = 0;
        this.level = 1;
        this.updateScore();
        this.updateLevel();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateLevel() {
        this.levelElement.textContent = this.level;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LightGame();
}); 