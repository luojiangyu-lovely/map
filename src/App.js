import * as d3 from "d3";
import { useEffect,useState } from "react";
import './App.css'
import axios from "axios";
function App() {
  const [padding] = useState( { left: 50, right: 50, top: 50, bottom: 50 })
  const [wwidth] = useState(1500)
  const [hheight] = useState(1500)
  const [width] = useState( 1400)
  const [height] = useState( 1100)
  useEffect(() => {
    axios.get("/getCoordinate").then((res) => {
      console.log(res.data);
      const dataset = res.data.map((item) => {
        item.pos.shift();
        return item.pos;
      });
      init(dataset);
    });
  }, []);
  const init = (dataset) => {
    
    var svg = d3
       .select("#body")
      .append("svg")
      .attr('id','svg')
      .attr("width", wwidth)
      .attr("height", hheight);
    //比例尺
    const datasetX = dataset.map((i) => i[0]);
    const datasetY = dataset.map((i) => i[1]);

    var xScale = d3
      .scaleLinear()
      .domain([0, d3.max(datasetX)])
      .range([0, width])
      .nice();
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(datasetY)])
      .range([0, height])
      .nice();
    //圆
    function draw() {
      //update
      var circleUpdate = svg.selectAll("circle").data(dataset);
      circleUpdate
        .transition()
        .duration(1000)
        .attr("cx", function (d, i) {
          return padding.left + xScale(d[0]);
        })
        .attr("cy", function (d, i) {
          return height + padding.top - yScale(d[1]);
        });
      //enter
      var circleEnter = circleUpdate.enter().append("circle");
      circleEnter
        .attr("cx", padding.left)
        .attr("cy", height + padding.top)
        .attr("r", 2)
        .attr("fill", "black")
        .transition()
        .duration(1000)
        .attr("cx", function (d, i) {
          return padding.left + xScale(d[0]);
        })
        .attr("cy", function (d, i) {
          return padding.top + yScale(d[1]);
        });
      var circleEcit=circleUpdate.exit().remove();
    }
    //坐标轴
    yScale.range([height, 0]);
    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);
    svg
      .append("g")
      .attr("className", "axis")
      .attr(
        "transform",
        "translate(" + padding.left + "," + (height + padding.top) + ")"
      )
      .call(xAxis);
    svg
      .append("g")
      .attr("className", "axis")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .call(yAxis);
    draw();
    //更新函数
  };
  const updata = ()=>{
   d3.select("#svg")
    .remove()
    axios.get("/getCoordinate").then((res) => {
      console.log(res.data);
      const dataset = res.data.map((item) => {
        item.pos.shift();
        return item.pos;
      });
      init(dataset);
    });
  }
  return (
    <>
     <button onClick={updata} className='app-button'>点击更新数据</button>
      <div id="body">
       
      </div>
      
    </>
  );
}

export default App;
