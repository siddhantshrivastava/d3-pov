import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
let ecg = require("./060.json");
let xDomain = 1800;
let chunkSize = 1800;
let data = [];
class App extends Component {

  componentDidMount() {
    this.chunking();
    this.draw();
    
  }

  chunking(){
    Object.defineProperty(Array.prototype, 'chunk', {
      value: function (chunkSize) {
        var temporal = [];

        for (var i = 0; i < this.length; i += chunkSize) {
          temporal.push(this.slice(i, i + chunkSize));
        }
        return temporal;
      }
    });
  }
  
  draw() {
    data = ecg.signal.sig_lead1.chunk(chunkSize)
    const width = 1000,
      height = 800;
    const graphContainer = d3.select(".full-disclosure"),
      g = graphContainer.append("g").attr("class","graph").attr('transform', 'translate(30,30)').attr("width", width).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, xDomain])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // g.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));

    // g.append("g")
    //   .attr("class", "axis axis--y")
    //   .call(d3.axisLeft(y));

    const line = d3.line()

      .x(function (d, i) {
        return x(i);
      })
      .y(function (d, i) {
        return y(d[0])
      })

    const numberOfGraph = 12;
    let ytranslate = 0;

    const translate = (d, i) => {
      if (i > 0) { ytranslate += height / numberOfGraph; }
      return `translate(0,${-height + ytranslate})`;
    }

    g.selectAll(".line")
      .data(data.slice(0, numberOfGraph))
      .enter().append("path")
      .attr("class", "line")
      .attr('transform', translate)
      .transition()
      .duration(750)
      .attr("d", line);

    d3.select(".selector")
      .on('change', () => {
        let sample = d3.select('.selector').property('value');
        ecg = sample < 80 ? require("./060.json") : sample < 100 ? require("./080.json") : sample < 120 ? require("./0100.json") : require("./0120.json")
        
        xDomain=sample < 80 ?1800 : sample < 100 ? 2400 : sample < 120 ? 3000 : 3600
        chunkSize=sample < 80 ?1800 : sample < 100 ? 2400 : sample < 120 ? 3000 : 3600
        d3.selectAll("svg > *").remove();
        this.draw();
      })
  }

  render() {
    return (
      <div className="main-container" style={{ margin: "10px" }}>
        <div style={{ paddingLeft: "20px" }}>
          <select className="selector">
            <option value="60">60Hz</option>
            <option value="80">80Hz</option>
            <option value="100">100Hz</option>
            <option value="120">120Hz</option>
          </select>
        </div>
        <svg className="full-disclosure" style={{ border: "solid 1px #eee", borderBottom: "solid 1px #ccc", marginLeft: "20px" }} width="1200" height="900" />
      </div>
    );
  }
}

export default App;
