# TUTORIAL 03: Visualizing workspace data

Custom reports are a great way for analyzing and communicating Enterprise Architecture insights of your organization in an effective way.

In this step-by-step tutorial we create a simple [LeanIX](https://www.leanix.net/en/) custom report that demonstrates how to integrate a third party library for visualizing workspace data. More specifically, we'll display on a half-pie chart the average completion ratio for a specific factsheet type, configurable by the user, as in the picture below.

<div style="display:flex; justify-content:center">
  <img src="https://i.imgur.com/djsSRLd.png">
</div>

The complete source-code for this project can be found [here](https://github.com/pauloramires/leanix-custom-report-tutorial-03).

  

## Pre-requisites

*  [NodeJS LTS](https://nodejs.org/en/) installed in your computer.

## Getting started

Install the [leanix-reporting-cli](https://github.com/leanix/leanix-reporting-cli) globally via npm:

```bash
npm install -g @leanix/reporting-cli
```

Initialize a new project:

```bash
mkdir leanix-custom-report-tutorial-03
cd leanix-custom-report-tutorial-03
lxr init
npm install
```
Configure your environment by editing the *lxr.json* file, if required:
```json
{
  "host": "app.leanix.net",
  "apitoken": "your-api-token-here"
}
```

After this procedure, you should end up with the following project structure:

<div  style="display:flex; justify-content:center">
  <img  src="https://i.imgur.com/VSyEW2h.png">
</div>

## Adjust the report boilerplate source code

We need to make some modifications in our project's boilerplate code. We start by adding the following dependecies:
```bash
npm install --dev @babel/plugin-transform-runtime postcss-loader tailwindcss
npm install alpinejs chart.js tinygradient
```

 **Note:** During the course of this tutorial, we'll be using the [Alpine JS](https://github.com/alpinejs/alpine), [Tailwind CSS](https://tailwindcss.com/), [Chart.JS](https://www.chartjs.org/) and [tinygradient](https://github.com/mistic100/tinygradient) libraries.

After installing the dependencies, we modify the *webpack.config.js* file and include the *@babel/plugin-transform-runtime* and the *postcss-loader*, as indicated by the red arrows of the picture below:

<div  style="display:flex; justify-content:center;">
  <img  src="https://i.imgur.com/Vn0ZeWK.png">
</div>

 We then clean up our project source code by deleting the unnecessary files:
-  *src/report.js*
-  *src/fact-sheet-mapper.js*
-  *src/assets/bar.css*
-  *src/assets/main.css*

Next we create a *postcss.config.js* file in the *src* folder, with the following content:
```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ]
}
```

  

Additionally we create an *tailwind.css* file in the assets folder with the following content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Your project folder should look now like this:
<div  style="display:flex; justify-content:center">
<img  src="https://i.imgur.com/703o0Wx.png">
</div>

Afterwards, edit the *index.js* file as follows, including the [Alpine JS](https://github.com/alpinejs/alpine), [Tailwind CSS](https://tailwindcss.com/), [leanix-reporting](https://leanix.github.io/leanix-reporting/),[Chart.JS](https://www.chartjs.org/) and [tinygradient](https://github.com/mistic100/tinygradient)  dependencies.

```javascript
import 'alpinejs'
import '@leanix/reporting'
import  Chart  from  'chart.js'
import  tinygradient  from  'tinygradient'
import './assets/tailwind.css'

const state = {}

const methods = {
  async initializeReport () {
    console.log('initializing report')
  }
}

window.initializeContext = () => {
  return {
    ...state,
    ...methods
  }
}
```

  

And finally edit the *index.html* file as follows:

```html
<!doctype  html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="application-name" content="leanix-custom-report-tutorial-03">
    <meta name="description" content="Tutorial on how to visualize workspace data using a third party library">
    <meta name="author" content="LeanIX GmbH">
    <title>Tutorial 03: how to visualize workspace data using a third party library</title>
    <style>
      [x-cloak] { display: none; }
    </style>
  </head>

  <body x-data="initializeContext()" x-init="initializeReport()">
    <div x-cloak class="container mx-auto h-screen"></div>
  </body>
</html>
```
As you may have noticed, we have declared two [Alpine JS](https://github.com/alpinejs/alpine#learn) directives in the <code>body</code> tag of our HTML code, the [x-data](https://github.com/alpinejs/alpine#x-data) and the [x-init](https://github.com/alpinejs/alpine#x-init). The  [x-data](https://github.com/alpinejs/alpine#x-data) directive calls the global method *initializeContext*, declared in the *index.js* file, and sets the scope for our report. More specifically, the [x-data](https://github.com/alpinejs/alpine#x-data) directive makes available to our AlpineJS instance all the variables and methods that are declared in the *state* and *methods* attributes of our *index.js* file. On the other hand, the [x-init](https://github.com/alpinejs/alpine#x-init) directive triggers the *initializeReport* method, defined in the *index.js* file, once the report is initialized.

Another detail which you may have noticed as well is the inclusion of an [x-cloak](https://github.com/alpinejs/alpine#x-cloak) directive on the first <code>div</code> child of the <code>body</code> tag of our html code. This directive is automatically removed by [Alpine JS](https://github.com/alpinejs/alpine) once the report is loaded, thus used as a technique for hiding the report elements until the report is fully loaded.

You may start the development server now by running the following command:
```bash
npm start
```
**Note!**

When you run *npm start*, a local webserver is hosted on *localhost:8080* that allows connections via HTTPS. But since just a development SSL certificate is created the browser might show a warning that the connection is not secure. You could either allow connections to this host anyways, or create your own self-signed certificate: https://www.tonyerwin.com/2014/09/generating-self-signed-ssl-certificates.html#MacKeyChainAccess.

If you decide to add a security exception to your localhost, make sure you open a second browser tab and point it to https://localhost:8080. Once the security exception is added to your browser, reload the original url of your development server and open the development console. Your should see a screen similar to the one below:
<div  style="display:flex; justify-content:center">
  <img  src="https://i.imgur.com/5LoJVX0.png">
</div>
Nothing very exciting happens here... However we notice that our report loads, and triggers the *initializeReport* method as expected!

## Report design
In our report we want to analyze the average completion ratio for a specific factsheet type, configurable by the user. In order to do so, we'll use the [lx.openFormModal](https://leanix.github.io/leanix-reporting/classes/lxr.lxcustomreportlib.html#openformmodal) method of the [leanix-reporting api](https://leanix.github.io/leanix-reporting/). For the rest of this tutorial, we'll divide our report implementation into three parts: setting up the report configuration workflow, querying workspace data and visualizing the results.


### Setting up the report configuration workflow
We want to allow the user to select the factsheet type to be analyzed by the report. For that, we'll implement a **"Report Configuration"** button that triggers a modal presenting to the user a dropdown list of all factsheet types available in the workspace.

We start by editing the *index.js* file and declare the following state variables and methods:
```javascript
const state = {
  factSheetTypes: [],
  selectedFactSheetType:  null
}

const methods = {
  // method that configures our custom report, used only to extract the list of available factsheet types in the workspace
  async initializeReport () {
    const setup = await lx.init()
    const { settings } = setup
    const { dataModel } = settings
    const { factSheets } = dataModel
    // we extract here the list of all factsheet types available in the workspace and store it
    this.factSheetTypes = Object.keys(factSheets)
    // and select the first factsheet type of that list
    this.selectedFactSheetType = this.factSheetTypes.length ? this.factSheetTypes[0] : null
    const config = {}
    // we configure our custom report with an empty configuration object
    return  lx.ready(config)
  },
  // method for opening up the configuration modal and show a single select input containing the list of available factsheet types
  async  openReportConfigurationModal () {
    const fields = {
      factSheetType: {
        type: 'SingleSelect',
        label: 'FactSheet Type',
        options: this.factSheetTypes
          .map(factSheetType => ({
            value: factSheetType,
            label: lx.translateFactSheetType(factSheetType)
          })
         )
      }
    }
    const initialValues = { factSheetType: this.selectedFactSheetType }
    const values = await lx.openFormModal(fields, initialValues)
    if (values) this.selectedFactSheetType = values.factSheetType
  }
}
```
Now edit the <code>body</code> tag of our *index.html* file to add an **Report Configuration* button that will trigger the configuration modal. We also add an extra element which will display the current selected factsheet type.
```html
<html>
  ...
  <body x-data="initializeContext()" x-init="initializeReport()">
    <div x-cloak class="container mx-auto h-screen">
      <div class="flex justify-end py-2">
        <button
          class="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          @click="openReportConfigurationModal">
          Configure Report
        </button>
      </div>
      <div x-text="selectedFactSheetType"></div>
    </div>
  </body>
  ...
</html>
```

Notice now that a blue button was placed on the top-right corner of the report, and that when clicking on it the report configuration modal shows up. Confirm that when selecting a different factsheet type, the selected factsheet type placeholder situated on the top-left corner of the report gets updated accordingly.
<div style="display:flex; justify-content:center">
  <img src="http://i.imgur.com/cEovwfJ.png">
</div>
So now that we have our configuration workflow in place, let's proceed with the data querying and visualization part!


### Querying the workspace data
Having the report configuration workflow in place, it's time to implement the data querying mechanism for fetching data from the workspace. For each selected factsheet type, we want to compute an *factsheet type average completion ratio* defined as the sum of all factsheets completion ratios divided by the number of factsheets. We'll add the a state variable **averageCompletion** and a method **fetchGraphQLData** to our *index.js* file:
```javascript
const state = {
  factSheetTypes: [],
  selectedFactSheetType:  null,
  averageCompletion:  null
}

const methods = {
  async initializeReport () {
    ...
  },
  async  openReportConfigurationModal () {
    ...
  },
  async  fetchGraphQLData () {
    const query = 'query($factSheetType:FactSheetType){allFactSheets(factSheetType:$factSheetType){edges{node{completion{completion}}}}}'
    try {
      lx.showSpinner()
      this.averageCompletion = await lx.executeGraphQL(query, { factSheetType: this.selectedFactSheetType })
        .then(({ allFactSheets }) => {
          const completionSum = allFactSheets.edges.reduce((accumulator, { node }) =>  accumulator += node.completion.completion, 0)
          const factSheetCount = allFactSheets.edges.length
          const averageCompletion = completionSum / factSheetCount
          return averageCompletion
        })
    } finally {
      lx.hideSpinner()
    }
  }
}
```
We'll edit our *index.html* file and include in the [x-init](https://github.com/alpinejs/alpine#x-init) directive of the <code>body</code> tag a *watcher* which calls the **fetchGraphQLData** method everytime time the **selectedFactSheeType** state variable gets updated. We also add an <code>div</code> to our <code>body</code> tag for showing the results of the data fetching method. 
```html
<html>
  ...
  <body
    x-data="initializeContext()"
    x-init="() => {
      initializeReport()
      $watch('selectedFactSheetType', () => fetchGraphQLData())
    }">
    <div x-cloak class="container mx-auto h-screen">
      <div class="flex justify-end py-2">
        <button
          class="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          @click="openReportConfigurationModal">
          Configure Report
        </button>
      </div>
      <div  x-text="selectedFactSheetType + ' avg completion = ' + (averageCompletion * 100 || 0).toFixed(0) + '%'"></div>
    </div>
  </body>
  ...
</html>
```
Launching our report now, and switching between factsheet types, verify that the average completion percentage, shown on the top-left corner of the report, gets updated accordingly.
<div style="display:flex; justify-content:center">
  <img src="https://i.imgur.com/P3cRnBZ.png">
</div>
Now that we have the data querying mechanism for our report in place, lets proceed to the data visualization part!

### Visualizing the results
For the last part of this tutorial, we'll use the [Chart.JS](https://www.chartjs.org/) to display the average completion ratio as an *half-pie* chart.
We start by editing our *index.html* file and add a <code>div</code> container element for holding the chart canvas, title, subtitle and legend, as below. Notice also that we include new watcher in the [x-init](https://github.com/alpinejs/alpine#x-init) directive of the <code>body</code> tag which calls the **updateChart** method upon a change on the **averageCompletion** state variable. This **updateChart** method will be defined ahead.
```html
<html>
  ...
  <body
    x-data="initializeContext()"
    x-init="() => {
      initializeReport()
      $watch('selectedFactSheetType', () => fetchGraphQLData())
      $watch('averageCompletion', () => updateChart())
    }">
    <div x-cloak class="container mx-auto text-md text-gray-800">
      <div class="flex justify-end py-2">
        <button
          class="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          @click="openReportConfigurationModal">
          Configure Report
        </button>
      </div>

      <!-- chart container -->
      <div class="relative flex flex-col flex-wrap items-center mt-16 -mx-8 mt-16">
        <!-- chart title -->
        <div class="text-4xl mb-2">Average Completion Ratio for</div>
        <!-- chart subtitle -->
        <div class="text-6xl font-bold mb-10" x-text="selectedFactSheetType ? lx.translateFactSheetType(selectedFactSheetType, 'plural') : null"></div>
        <!-- chart legend -->
        <div class="absolute bottom-0 -mb-6 font-bold" style="left: 50%; transform: translateX(-50%); font-size: 7rem" x-ref="legend"></div>
        <!-- canvas container -->
        <div class="w-1/2">
          <canvas x-ref="chartCanvas"></canvas>
        </div>
      </div>
    </div>
  </body>
  ...
</html>
```
We now edit the *index.js* file and include the **updateChart** method previously referenced. As we want to change the chart color according the completeness ratio, we build a linear color gradient using the [tinygradient](https://github.com/mistic100/tinygradient) library. In our example, we'll be using a single dataset composed by two data points with the values of the average completeness ratio (corresponding to the colored bar of the chart) and the 1-complement value of this average (corresponding to the faded-gray bar). More details on the ChartJS api can be found on the [documentation](https://www.chartjs.org/docs/latest/).
```javascript
const state = {
  factSheetTypes: [],
  selectedFactSheetType:  null,
  averageCompletion:  null
}

const methods = {
  async initializeReport () {
    ...
  },
  async  openReportConfigurationModal () {
    ...
  },
  async  fetchGraphQLData () {
    ...
  },
  async updateChart () {
    const gradient = tinygradient([
      { color:  'red', pos:  0 },
      { color:  'yellow', pos:  0.3 },
      { color:  'green', pos:  1 }
    ])

    const data = [this.averageCompletion, 1 - this.averageCompletion]
    const backgroundColor = [gradient.rgbAt(this.averageCompletion).toHexString(), 'rgba(0, 0, 0, 0.1)']
    const { chart } = this
    // if the chart variable is not defined in the context, initialize the report
    if (typeof  chart === 'undefined') {
      const  config = {
        type:  'doughnut',
        data: {
          datasets: [{ data, backgroundColor }]
        },
        options: {
          cutoutPercentage: 70,
          circumference: Math.PI,
          rotation: Math.PI,
          tooltips: { enabled: false },
          hover: { mode: null }
        }
      }
      const  ctx = this.$refs.chartCanvas.getContext('2d')
      this.chart = new Chart(ctx, config)
      // otherwise just update the values of the dataset
    } else {
      chart.data.datasets[0] = { data, backgroundColor }
      chart.update()
    }
    // update the text content of the legend with the average completion percentage 
    this.$refs.legend.innerHTML = `${(this.averageCompletion * 100).toFixed(0)}%`
  }
}
```
Now just run <code>npm start</code> to launch the development server again and observe your report in its full splendour!
<div style="display:flex; justify-content:center">
  <img src="https://i.imgur.com/djsSRLd.png">
</div>

Congratulations, you have finalized this tutorial!