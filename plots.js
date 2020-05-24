function Metadata(sample) {
  // Use `d3.json` to Fetch the Metadata for a Sample
    d3.json('samples.json').then((data) => {
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(data).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key}:${value}`);
        })
        // BONUS: Build the Gauge Chart
          buildGauge(data.WFREQ);
    })
}

function Charts(sample) {

  d3.json('samples.json').then((data) => {
    // Build a Bubble Chart Using the Sample Data
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;

    //Build a Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "OTU ID"}
    }
    
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    //Build a Pie Chart
    var pieData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
    
    var pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout)
})
}

function init() {
  // Grab a Reference to the Dropdown Select Element
  var selector = d3.select("#selDataset");

  // Use the List of Sample Names to Populate the Select Options
  d3.json("samples.json").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the First Sample from the List to Build Initial Plots
    var firstSample = sampleNames[0];
    Charts(firstSample);
    Metadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch New Data Each Time a New Sample is Selected
  Charts(newSample);
  Metadata(newSample);
}

// Initialize the Dashboard
init();