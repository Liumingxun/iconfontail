import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="card t-w-max t-p-4">
    <button id="counter" type="button"></button>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
