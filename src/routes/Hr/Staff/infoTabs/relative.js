import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { isEmpty } from 'lodash';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.width = 900;
    this.height = 800;
    this.img_w = 60;
    this.img_h = 60;
    this.radius = 30;
    this.staffSn = props.staffSn;
  }

  componentDidMount() {
    if (this.props.relation.nodes !== null) {
      this.initD3();
    }
  }

  initD3 = () => {
    const { relation } = this.props;
    const svg = d3.select('#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // D3力导向布局
    const force = d3.layout.force()
      .nodes(relation.nodes)
      .links(relation.edges)
      .size([this.width, this.height])
      .linkDistance(200)
      .charge(-1500)
      .start();
    // 边
    const edgesLine = svg.selectAll('line')
      .data(relation.edges)
      .enter()
      .append('line')
      .style('stroke', '#ccc')
      .style('stroke-width', 1);
    // 边上的文字（人物之间的关系）
    const edgesText = svg.selectAll('.linetext')
      .data(relation.edges)
      .enter()
      .append('text')
      .attr('class', styles.linetext)
      .text(d => d.relation);
    // 圆形图片节点（人物头像）
    const nodesImg = svg.selectAll('image')
      .data(relation.nodes)
      .enter()
      .append('circle')
      .attr('class', styles.circleImg)
      .attr('r', this.radius)
      .attr('fill', (d, i) => {
        // 创建圆形图片
        const defs = svg.append('defs').attr('id', 'imgdefs');
        const catpattern = defs.append('pattern')
          .attr('id', `catpattern${i}`)
          .attr('height', 1)
          .attr('width', 1);
        catpattern.append('image')
          .attr('x', -((this.img_w / 2) - this.radius))
          .attr('y', -((this.img_h / 2) - this.radius))
          .attr('width', this.img_w)
          .attr('height', this.img_h)
          .attr('xlink:href', d.image);
        return `url(#catpattern${i})`;
      })
      .on('mouseover', (d) => {
        // 显示连接线上的文字
        edgesText.style('fill-opacity', (edge) => {
          if (edge.source === d || edge.target === d) {
            return 1.0;
          }
        });
      })
      .on('mouseout', (d) => {
        // 隐去连接线上的文字
        edgesText.style('fill-opacity', (edge) => {
          if (edge.source === d || edge.target === d) {
            return 0.0;
          }
        });
      })
      .call(force.drag);

    const textDx = -20;
    const textDy = 20;
    const nodesText = svg.selectAll('.nodetext')
      .data(relation.nodes)
      .enter()
      .append('text')
      .attr('class', styles.nodetext)
      .attr('dx', textDx)
      .attr('dy', textDy)
      .text(d => d.name);

    force.on('tick', () => {
      // 限制结点的边界
      relation.nodes.forEach((dx) => {
        const d = dx;
        const bw = (this.img_w / 2);
        const bh = (this.img_h / 2);
        d.x = d.x - bw < 0 ? bw : d.x;
        d.x = d.x + bw > this.width ? this.width - bw : d.x;
        d.y = d.y - bh < 0 ? bh : d.y;
        d.y = d.y + bh + textDy > this.height ? this.height - bh - textDy : d.y;
      });
      // 更新连接线的位置
      edgesLine.attr('x1', d => d.source.x);
      edgesLine.attr('y1', d => d.source.y);
      edgesLine.attr('x2', d => d.target.x);
      edgesLine.attr('y2', d => d.target.y);
      // 更新连接线上文字的位置
      edgesText.attr('x', d => (d.source.x + d.target.x) / 2);
      edgesText.attr('y', d => (d.source.y + d.target.y) / 2);
      // 更新结点图片和文字
      nodesImg.attr('cx', d => d.x);
      nodesImg.attr('cy', d => d.y);
      nodesText.attr('x', d => d.x);
      nodesText.attr('y', d => d.y + (this.img_w / 2));
    });
  }

  render() {
    return (
      <div id="map">{ isEmpty(this.props.relation.nodes) ? '暂无关系人' : '' }</div>
    );
  }
}

const styles = {
  nodetext: {
    fontSize: '12px',
    fontFamily: 'SimSun',
    fill: '#000000',
  },
  linetext: {
    fontSize: '12px',
    fontFamily: 'SimSun',
    fill: '#1f77b4',
    fillOpacity: 0.0,
  },
  circleImg: {
    stroke: '#ff7f0e',
    strokeWidth: '1.5px',
  },
};
