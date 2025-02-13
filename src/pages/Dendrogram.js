import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../style/Dendrogram.css";

const Dendrogram = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 1300;
    const height = 900;

    const treeLayout = d3.tree().size([height, width - 260]);

    // const root = d3.hierarchy(data);
    var root = d3.hierarchy(data, function (d) {
      return d.children;
    });
    treeLayout(root);

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-120, 0, width, height]);

    // Define link styles
    const link = svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .style("stroke", (d) =>
        d.target.data.name
          ? d.target.data.name.includes("Not Achieved")
            ? "#000"
            : "#000"
          : ""
      )
      .style("stroke-width", 1.5);

    // Define node styles
    const node = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr(
        "class",
        (d) => "node" + (d.children ? " node--internal" : " node--leaf")
      )
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // node
    //   .append("circle")
    //   .attr("r", 6)
    //   .attr("class", (d) =>
    //     d.data.name.includes("Not Achieved") ? "big-dot" : ""
    //   );

    // .attr("class", (d) =>
    //   d.data.name.includes("Not Achieved").descendants ? "big-dot" : ""
    // );

    node
      .append("text")
      .attr("dy", -10) // Move text above the node
      .attr("x", 0) // Center text horizontally
      .style("text-anchor", "middle")
      .text((d) => (d.data.name ? d.data.name : d.name));

    const myNodeSelection = d3
      .selectAll(".node--internal")
      .filter((d) => (d.data.name ? d.data.name.includes("Not Achieved") : ""));
    const descendants = myNodeSelection.datum().descendants();

    node
      .append("circle")
      .attr("r", 6)
      .attr("class", (d) => (descendants.includes(d) ? "big-dot" : ""));
    // Add markers to the end of the links
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#000")
      .style("stroke", "none");

    svg.selectAll(".link").attr("marker-end", "url(#arrowhead)");
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default Dendrogram;
