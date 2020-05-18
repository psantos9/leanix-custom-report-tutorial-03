import 'alpinejs'
import '@leanix/reporting'
import Chart from 'chart.js'
import tinygradient from 'tinygradient'
import './assets/tailwind.css'

const state = {
  selectedFactSheetType: null,
  factSheetTypes: [],
  modalOpened: false,
  averageCompletion: null
}

const methods = {
  async initializeReport () {
    const setup = await lx.init()
    const { settings } = setup
    const { dataModel } = settings
    const { factSheets } = dataModel
    this.factSheetTypes = [ ...this.factSheetTypes, ...Object.keys(factSheets) ]
    this.selectedFactSheetType = this.factSheetTypes[0]
    return lx.ready({})
  },
  async fetchGraphqlData () {
    const query = 'query($factSheetType:FactSheetType){allFactSheets(factSheetType:$factSheetType){edges{node{completion{completion}}}}}'
    try {
      lx.showSpinner()
      this.averageCompletion = await lx.executeGraphQL(query, { factSheetType: this.selectedFactSheetType })
      .then(({ allFactSheets }) => {
        const completionSum = allFactSheets.edges.reduce((accumulator, { node }) => accumulator += node.completion.completion, 0)
        const factSheetCount = allFactSheets.edges.length
        const averageCompletion = completionSum / factSheetCount
        return averageCompletion
      })
    } finally {
      lx.hideSpinner()
    }
  },
  async updateChart () {
    const gradient = tinygradient([
      { color: 'red', pos: 0 },
      { color: 'yellow', pos: 0.3 },
      { color: 'green', pos: 1 }
    ])
    const data = [this.averageCompletion, 1 - this.averageCompletion]
    const backgroundColor = [ gradient.rgbAt(this.averageCompletion).toHexString(), 'rgba(0, 0, 0, 0.1)']
    const { chart } = this
    if (typeof chart === 'undefined') {
      const config = {
        type: 'doughnut',
        data: {
          datasets: [{ data, backgroundColor }]
        },
        options: {
          cutoutPercentage: 70,
          circumference: 1 * Math.PI,
          rotation: Math.PI,
          tooltips: { enabled: false },
          hover: { mode: null }
        }
      }
      const ctx = this.$refs.chartCanvas.getContext('2d')
      this.chart = new Chart(ctx, config)
    } else {
      chart.data.datasets[0] = { data, backgroundColor }
      chart.update()
    }
    this.$refs.legend.innerHTML = `${(this.averageCompletion * 100).toFixed(0)}%`
  }
}

window.initializeContext = () => {
  return {
    ...state,
    ...methods
  }
}
