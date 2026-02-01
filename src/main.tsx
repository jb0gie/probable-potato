import { applyDiff } from "webjsx"
import "./style.css"
import "./potato-probability"

class App extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	render = () => {
		const content = (
			<div className="w-screen min-h-screen bg-[#F5DEB3] dark:bg-[#1a1a1a]">
				<div className="max-w-[80rem] my-0 mx-auto p-8 text-center flex flex-col items-center">
					<div className="flex items-center gap-4 mb-6">
						<span className="text-[5rem]">🥔</span>
						<div className="flex flex-col">
							<h1 className="font-bold text-[3rem] text-[#8B4513]">
								Probable Potato
							</h1>
							<p className="text-lg text-[#A0522D] font-medium">
								The Ultimate Spud Probability Game
							</p>
						</div>
						<span className="text-[5rem]">🥔</span>
					</div>

					<div className="p-4 rounded-[1rem] bg-[#FFF8DC] dark:bg-[#2a2418] border-2 border-[#D2B48C] mb-6 max-w-[40rem]">
						<p className="text-[#5D4037] font-medium leading-relaxed">
							🎲 <strong>Welcome to Probable Potato!</strong> 🎲
							<br />
							<br />
							Roll the dice and test your luck! Will you find a legendary tater,
							a golden spud, or just another common potato? The odds are against
							you, but hey — that's what makes it a-peel-ing!
						</p>
					</div>

					<x-potato-probability />

					<div className="mt-8 p-4 rounded-[1rem] bg-[#8B4513]/10 max-w-[40rem]">
						<h3 className="text-[#8B4513] font-bold mb-3">
							🥔 Potato Puns Collection 🥔
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#5D4037] italic">
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

					<p className="text-sm text-[#8B4513]/60 mt-8">
						Built with 🥔 + Vite + WebJSX + Probable Luck
					</p>
				</div>
			</div>
		)

		applyDiff(this, content)
	}
}

customElements.define("x-app", App)
