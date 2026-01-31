import { applyDiff } from "webjsx"

declare global {
	interface Window {
		confetti?: (options: Record<string, unknown>) => void
	}
	namespace JSX {
		interface IntrinsicElements {
			"x-potato-probability": {
				onclick?: () => void
			}
		}
	}
}

interface PotatoResult {
	type: "common" | "golden" | "russet" | "legendary"
	name: string
	emoji: string
	message: string
	probability: number
	color: string
}

const POTATO_RESULTS: PotatoResult[] = [
	{
		type: "common",
		name: "Common Tater",
		emoji: "🥔",
		message: "Just a regular spud. That's spec-tater-ly average!",
		probability: 0.6,
		color: "#8B4513",
	},
	{
		type: "golden",
		name: "Golden Potato",
		emoji: "✨",
		message: "A-peel-ing find! That's one golden spud!",
		probability: 0.25,
		color: "#FFD700",
	},
	{
		type: "russet",
		name: "Russet Royalty",
		emoji: "👑",
		message: "Tuber-iffic! A royal potato has appeared!",
		probability: 0.1,
		color: "#CD853F",
	},
	{
		type: "legendary",
		name: "Legendary Tater",
		emoji: "🌟",
		message: "Holy mashed potatoes! A LEGENDARY find!",
		probability: 0.05,
		color: "#FF6B35",
	},
]

class SoundEffects {
	ctx: AudioContext | null = null
	enabled = true

	init() {
		if (!this.ctx) {
			this.ctx = new (
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext
			)()
		}
	}

	toggle() {
		this.enabled = !this.enabled
		return this.enabled
	}

	playTone(freq: number, duration: number, type: OscillatorType = "sine") {
		if (!this.enabled || !this.ctx) return
		const osc = this.ctx.createOscillator()
		const gain = this.ctx.createGain()
		osc.type = type
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
		gain.gain.setValueAtTime(0.3, this.ctx.currentTime)
		gain.gain.exponentialRampToValueAtTime(
			0.01,
			this.ctx.currentTime + duration,
		)
		osc.connect(gain)
		gain.connect(this.ctx.destination)
		osc.start()
		osc.stop(this.ctx.currentTime + duration)
	}

	playClick() {
		this.playTone(800, 0.1, "square")
	}

	playCommon() {
		this.playTone(300, 0.3, "sine")
	}

	playGolden() {
		this.playTone(600, 0.2, "sine")
		setTimeout(() => this.playTone(800, 0.2, "sine"), 100)
	}

	playRusset() {
		this.playTone(500, 0.15, "sine")
		setTimeout(() => this.playTone(700, 0.15, "sine"), 100)
		setTimeout(() => this.playTone(900, 0.3, "sine"), 200)
	}

	playLegendary() {
		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				this.playTone(400 + i * 200, 0.15, "square")
			}, i * 50)
		}
	}
}

const sounds = new SoundEffects()

class PotatoProbability extends HTMLElement {
	currentResult: PotatoResult | null = null
	rollCount = 0
	stats = { common: 0, golden: 0, russet: 0, legendary: 0 }
	isRolling = false
	confettiLoaded = false

	connectedCallback() {
		sounds.init()
		this.loadConfetti()
		this.render()
	}

	async loadConfetti() {
		if (this.confettiLoaded) return
		const script = document.createElement("script")
		script.src =
			"https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"
		script.onload = () => {
			this.confettiLoaded = true
		}
		document.head.appendChild(script)
	}

	getPotatoResult = (): PotatoResult => {
		const roll = Math.random()
		let cumulative = 0
		for (const result of POTATO_RESULTS) {
			cumulative += result.probability
			if (roll <= cumulative) return result
		}
		return POTATO_RESULTS[0]
	}

	playSoundForResult = (result: PotatoResult) => {
		switch (result.type) {
			case "common":
				sounds.playCommon()
				break
			case "golden":
				sounds.playGolden()
				break
			case "russet":
				sounds.playRusset()
				break
			case "legendary":
				sounds.playLegendary()
				break
		}
	}

	triggerConfetti = () => {
		if (!window.confetti) return
		const duration = 3000
		const end = Date.now() + duration

		const frame = () => {
			window.confetti?.({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ["#FFD700", "#FF6B35", "#CD853F", "#8B4513"],
			})
			window.confetti?.({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ["#FFD700", "#FF6B35", "#CD853F", "#8B4513"],
			})

			if (Date.now() < end) {
				requestAnimationFrame(frame)
			}
		}
		frame()
	}

	rollTheTater = () => {
		if (this.isRolling) return
		this.isRolling = true
		sounds.playClick()

		// Animate through different potatoes
		let steps = 0
		const maxSteps = 10
		const interval = setInterval(() => {
			this.currentResult =
				POTATO_RESULTS[Math.floor(Math.random() * POTATO_RESULTS.length)]
			this.render()
			steps++

			if (steps >= maxSteps) {
				clearInterval(interval)
				const finalResult = this.getPotatoResult()
				this.currentResult = finalResult
				this.rollCount++
				this.stats[finalResult.type]++
				this.playSoundForResult(finalResult)

				if (finalResult.type === "legendary") {
					this.triggerConfetti()
				}

				this.isRolling = false
				this.render()
			}
		}, 100)
	}

	toggleSound = () => {
		const enabled = sounds.toggle()
		this.render()
		return enabled
	}

	render = () => {
		const result = this.currentResult
		const winRate =
			this.rollCount > 0
				? ((this.stats.legendary / this.rollCount) * 100).toFixed(1)
				: "0.0"

		const content = (
			<div w="100%" flex="~ col" items="center" gap="6">
				<div
					p="6"
					rounded="1.5rem"
					bg="#FFF8DC dark:#2a2418"
					border="~ 4 #8B4513"
					shadow="lg"
					w="100%"
					max-w="28rem"
					flex="~ col"
					items="center"
					gap="4"
				>
					<div w="100%" flex="~" justify="between" items="center" mb="2">
						<span text="sm #8B4513" font="medium">
							🥔 Spuds Rolled: {this.rollCount}
						</span>
						<button
							type="button"
							onClick={this.toggleSound}
							p="2"
							rounded="full"
							bg="transparent hover:#8B4513/10"
							text="#8B4513"
							font="mono"
							title="Toggle Sound"
						>
							{sounds.enabled ? "🔊" : "🔇"}
						</button>
					</div>

					<div
						w="100%"
						h="12rem"
						flex="~"
						items="center"
						justify="center"
						bg={result ? `${result.color}20` : "#F5DEB3"}
						rounded="1rem"
						transition="all"
						border="~ 2"
						border-color={result ? result.color : "#D2B48C"}
					>
						{result ? (
							<div flex="~ col" items="center" gap="2">
								<span text="6rem">{result.emoji}</span>
								<span text="xl" font="bold" style={`color: ${result.color}`}>
									{result.name}
								</span>
							</div>
						) : (
							<span text="4rem #8B4513" font="medium">
								🎲 Ready to Roll!
							</span>
						)}
					</div>

					{result && (
						<p text="center #5D4037" font="medium" px="4">
							{result.message}
						</p>
					)}

					<button
						type="button"
						onClick={this.rollTheTater}
						disabled={this.isRolling}
						p="y-4 x-8"
						rounded="1rem"
						bg="#8B4513 hover:#A0522D disabled:#D2B48C"
						color="white"
						font="bold"
						text="lg"
						shadow="md"
						transform={this.isRolling ? "scale-95" : "hover:scale-105"}
						transition="all"
						cursor={this.isRolling ? "not-allowed" : "pointer"}
					>
						{this.isRolling ? "Rolling..." : "🎲 Roll the Tater!"}
					</button>

					{this.rollCount > 0 && (
						<div w="100%" p="4" rounded="0.75rem" bg="#8B4513/10" mt="2">
							<p text="sm #8B4513" font="bold" mb="2">
								📊 Spud Statistics:
							</p>
							<div grid="~ cols-2" gap="2" text="xs #5D4037">
								<div>🥔 Common: {this.stats.common}</div>
								<div>✨ Golden: {this.stats.golden}</div>
								<div>👑 Russet: {this.stats.russet}</div>
								<div>🌟 Legendary: {this.stats.legendary}</div>
							</div>
							<p text="xs #8B4513" mt="2" font="medium">
								Legendary Rate: {winRate}% (Expected: 5%)
							</p>
						</div>
					)}
				</div>

				<div text="sm #8B4513/60" text-center>
					<p>
						🥔 Probabilities: Common 60% | Golden 25% | Russet 10% | Legendary
						5%
					</p>
					<p mt="2" font="italic">
						"May the spuds be ever in your favor!"
					</p>
				</div>
			</div>
		)

		applyDiff(this, content)
	}
}

customElements.define("x-potato-probability", PotatoProbability)
