import React, { Component } from "react";
import "./App.css";
import ecg from "./06426.json";
import * as d3 from "d3";

class App extends Component {

  componentDidMount() {
    this.draw()
  }

  draw() {

    Object.defineProperty(Array.prototype, 'chunk', {
      value: function (chunkSize) {
        var temporal = [];

        for (var i = 0; i < this.length; i += chunkSize) {
          temporal.push(this.slice(i, i + chunkSize));
        }

        return temporal;
      }
    });
    let data = [];
    data = ecg.signal.sig_lead1.chunk(1800)
    const width = 1000,
      height = 800;
    const graphContainer = d3.select(".full-disclosure"),
      g = graphContainer.append("g").attr('transform', 'translate(30,30)').attr("width", width).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, 1800])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

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
      console.log(i);

      if(i>0){ytranslate += height/numberOfGraph;}
      return `translate(0,${-height + ytranslate})`;
    }
    // let data = []
    // for (let i = 0; i < 1800; i++) {
    //   data.push([i, ecg.signal.sig_lead1[i][0]])
    // }
    g.selectAll(".line")
      .data(data.slice(0, numberOfGraph))
      .enter().append("path")
      .attr("class", "line")
      .attr('transform', translate)
      .attr("d", line);

    // g.append("path")
    //   .datum(data.slice(0,2))
    //   .attr("class", `line`)
    //   .attr('transform', 'translate(0,' + -height + ')')
    //   .attr("d", line);
  }

  render() {
    return (
      <div className="main-container">
        <svg className="full-disclosure" style={{ border: "solid 1px #eee", borderBottom: "solid 1px #ccc", marginLeft: "20px" }} width="1200" height="900" />
      </div>
    );
  }
}

export default App;
