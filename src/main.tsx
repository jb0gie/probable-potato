import { applyDiff } from "webjsx"
import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "./style.css"
import "./potato-probability"

class App extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	render = () => {
		const content = (
			<div w="100vw" min-h="100vh" bg="#F5DEB3 dark:#1a1a1a">
				<div
					max-w="80rem"
					m="y-0 x-auto"
					p="8"
					un-text="align-center"
					flex="~ col"
					items="center"
				>
					<div flex="~" items="center" gap="4" mb="6">
						<span text="5rem">🥔</span>
						<div flex="~ col">
							<h1 font="bold" un-text="3rem" color="#8B4513">
								Probable Potato
							</h1>
							<p text="lg #A0522D" font="medium">
								The Ultimate Spud Probability Game
							</p>
						</div>
						<span text="5rem">🥔</span>
					</div>

					<div
						p="4"
						rounded="1rem"
						bg="#FFF8DC dark:#2a2418"
						border="~ 2 #D2B48C"
						mb="6"
						max-w="40rem"
					>
						<p text="#5D4037" font="medium" leading="relaxed">
							🎲 <strong>Welcome to Probable Potato!</strong> 🎲
							<br />
							<br />
							Roll the dice and test your luck! Will you find a legendary tater,
							a golden spud, or just another common potato? The odds are against
							you, but hey — that's what makes it a-peel-ing!
						</p>
					</div>

					<x-potato-probability />

					<div mt="8" p="4" rounded="1rem" bg="#8B4513/10" max-w="40rem">
						<h3 text="#8B4513" font="bold" mb="3">
							🥔 Potato Puns Collection 🥔
						</h3>
						<div
							grid="~ cols-1 md:cols-2"
							gap="2"
							text="sm #5D4037"
							font="italic"
						>
							<p>"This game is a-peel-ing!"</p>
							<p>"That's spec-tater-ly awesome!"</p>
							<p>"Don't be a couch potato!"</p>
							<p>"Let's get this mash started!"</p>
							<p>"You're one smart cookie... I mean, spud!"</p>
							<p>"This is tuber-iffic!"</p>
							<p>"I'm rooting for you!"</p>
							<p>"Don't potato around!"</p>
						</div>
					</div>

					<p text="sm #8B4513/60" mt="8">
						Built with 🥔 + Vite + WebJSX + Probable Luck
					</p>
				</div>
			</div>
		)

		applyDiff(this, content)
	}
}

customElements.define("x-app", App)
