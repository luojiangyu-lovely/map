import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Space, Button, Input, Form } from "antd";
import "./App.css";
import "antd/dist/reset.css";
import axios from "axios";
function App() {
  const [padding] = useState({ left: 50, right: 50, top: 20, bottom: 20 });
  const [buttName, setButtName] = useState("monster");
  const [wwidth] = useState(1500);
  const [hheight] = useState(1100);
  const [width] = useState(1400);
  const [height] = useState(1000);
  const [domainName, setDomainName] = useState("http://tianlin:8111");
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    var svg = d3
      .select("#body")
      .append("svg")
      .attr("id", "svg")
      .attr("width", wwidth)
      .attr("height", hheight);
    //比例尺

    var xScale = d3.scaleLinear().domain([0, 1200]).range([0, width]).nice();
    var yScale = d3.scaleLinear().domain([0, 1200]).range([0, height]).nice();
    //圆

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
    //更新函数
    drawPoint();
  };
  const draw = (dataset) => {
    d3.selectAll("circle").remove();
    // d3.selectAll("text").remove();
    var svg = d3.select("#svg");
    //update
    var xScale = d3.scaleLinear().domain([0, 1200]).range([0, width]).nice();
    var yScale = d3.scaleLinear().domain([0, 1200]).range([0, height]).nice();
    var circleUpdate = svg.selectAll("circle").data(dataset);
    circleUpdate
      .attr("cx", function (d, i) {
        return padding.left + xScale(d[0]);
      })
      .attr("cy", function (d, i) {
        return height + padding.top - yScale(d[1]);
      });
    //enter
    var circleEnter = circleUpdate.enter().append("g");
    circleEnter
      .append("circle")
      .attr("cx", padding.left)
      .attr("cy", height + padding.top)
      .attr("r", 2)
      .attr("fill", "black")
      .transition()
      .duration(500)
      .attr("cx", function (d, i) {
        return padding.left + xScale(d[0]);
      })
      .attr("cy", function (d, i) {
        return height + padding.top - yScale(d[1]);
      });
    // circleEnter.append('text')
    // .text(function(d) { return 1 }) .attr("dx", function (d, i) {
    //   console.log(padding.left + xScale(d[0]));
    //   return padding.left + xScale(d[0]);
    // })
    // .attr("dy", function (d, i) {
    //   return height + padding.top - yScale(d[1]);
    // })
  };
  const drawPoint = (type = "monster") => {
    setButtName(type);
    let url = "getCoordinate/monster";
    switch (type) {
      case "monster":
        url = "getCoordinate/monster";
        break;
      case "mainCity":
        url = "getCoordinate/mainCity";
        break;
      case "born":
        url = "getCoordinate/born";
        break;
      default:
        url = "getCoordinate/monster";
    }

    axios.get(url, {
      params: {
        domainName
      }
    }).then((res) => {
      draw(res.data);
    });
  };
  return (
    <>
      {/* <button onClick={drawPoint} className="app-button">
        点击更新数据
      </button> */}
      <Form
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        style={{ maxWidth: 600, marginTop: 10 }}
        initialValues={{ domainName }}
        validateTrigger="onBlur"
        autoComplete="off"
      >
        <Form.Item
          label="域名"
          name="domainName"
          rules={[{ required: true, message: "请输入正确的域名"}]}
        >
          <Input
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
        </Form.Item>
      </Form>
      <div id="body"></div>
      <Space style={{ marginLeft: 10 }}>
        <Button
          onClick={() => drawPoint("monster")}
          type={buttName === "monster" ? "primary" : "default"}
        >
          非专属野怪
        </Button>
        <Button
          onClick={() => drawPoint("mainCity")}
          type={buttName === "mainCity" ? "primary" : "default"}
        >
          玩家主城
        </Button>
        <Button
          onClick={() => drawPoint("born")}
          type={buttName === "born" ? "primary" : "default"}
        >
          出生点
        </Button>
      </Space>
    </>
  );
}

export default App;
