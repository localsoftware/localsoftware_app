<template>
  <div
    class="logo"
    :class="{ showBg }"
    :style="{ width: pxSize, height: pxSize }"
  >
    <div id="graph" ref="graph"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import _ from 'lodash'

const colors = {
  white: '#ffffff',
  white2: '#ffffff',
  darker: '#3d3a00',
  brown: '#646100',
  lighter: '#b4ae00',
}

function constant(_) {
  return function() {
    return _
  }
}

// Ref: https://bl.ocks.org/cmgiven/547658968d365bcc324f3e62e175709b
function rectCollide() {
  let nodes, sizes, masses
  let size = constant([0, 0])
  let strength = 1
  let iterations = 1

  function force() {
    let node, size, mass, xi, yi
    let i = -1
    while (++i < iterations) {
      iterate()
    }

    function iterate() {
      let j = -1
      const tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

      while (++j < nodes.length) {
        node = nodes[j]
        size = sizes[j]
        mass = masses[j]
        xi = xCenter(node)
        yi = yCenter(node)

        tree.visit(apply)
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      const data = quad.data
      const xSize = (size[0] + quad.size[0]) / 2
      const ySize = (size[1] + quad.size[1]) / 2
      if (data) {
        if (data.index <= node.index) {
          return
        }

        let x = xi - xCenter(data)
        let y = yi - yCenter(data)
        const xd = Math.abs(x) - xSize
        const yd = Math.abs(y) - ySize

        if (xd < 0 && yd < 0) {
          const l = Math.sqrt(x * x + y * y)
          const m = masses[data.index] / (mass + masses[data.index])

          if (Math.abs(xd) < Math.abs(yd)) {
            node.vx -= (x *= (xd / l) * strength) * m
            data.vx += x * (1 - m)
          } else {
            node.vy -= (y *= (yd / l) * strength) * m
            data.vy += y * (1 - m)
          }
        }
      }

      return (
        x0 > xi + xSize || y0 > yi + ySize || x1 < xi - xSize || y1 < yi - ySize
      )
    }

    function prepare(quad) {
      if (quad.data) {
        quad.size = sizes[quad.data.index]
      } else {
        quad.size = [0, 0]
        let i = -1
        while (++i < 4) {
          if (quad[i] && quad[i].size) {
            quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
            quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
          }
        }
      }
    }
  }

  function xCenter(d) {
    // return d.x + d.vx + sizes[d.index][0] / 2
    return d.x + d.vx // UPDATED: origin as force center
  }
  function yCenter(d) {
    // return d.y + d.vy + sizes[d.index][1] / 2
    return d.y + d.vy // UPDATED: origin as force center
  }

  force.initialize = function(_) {
    sizes = (nodes = _).map(size)
    masses = sizes.map(function(d) {
      return d[0] * d[1]
    })
  }

  force.size = function(_) {
    return arguments.length
      ? ((size = typeof _ === 'function' ? _ : constant(_)), force)
      : size
  }

  force.strength = function(_) {
    return arguments.length ? ((strength = +_), force) : strength
  }

  force.iterations = function(_) {
    return arguments.length ? ((iterations = +_), force) : iterations
  }

  return force
}

export default {
  props: {
    r: {
      type: Number,
      default: 350,
    },
    showBg: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    size() {
      return this.r * 2
    },
    pxR() {
      return this.r + 'px'
    },
    pxSize() {
      return this.size + 'px'
    },
  },
  watch: {
    r(r) {
      this.drawData()
    },
  },
  mounted() {
    const size = this.r * 2
    const unit = Math.pow(size * 0.02, 2) / 40
    console.log({ unit })

    this.init()
  },
  methods: {
    randomBoundsXY() {
      if (Math.random() > 0.5)
        return {
          x: Math.random() > 0.5 ? this.r : -this.r,
          y: Math.random() * this.size - this.r,
        }
      else
        return {
          x: Math.random() * this.size - this.r,
          y: Math.random() > 0.5 ? this.r : -this.r,
        }
    },
    getData() {
      const newRect = ({ idx, r, rForce }) => {
        return {
          label: `r-${idx}`,
          r,
          // ...this.randomBoundsXY(),
          fill: _.sample(colors),
          collide: r * 1.1,
          force: r / 30,
          rForce,
        }
      }

      const minR = 5
      const minArea = Math.pow(minR, 2)
      let filledArea = 0
      let unfilledArea = ~~Math.pow(this.size * 0.7, 2)
      const maxR = this.size * 0.05

      const data = []

      while (unfilledArea > minArea) {
        const idx = data.length

        const filledR = Math.sqrt(filledArea / Math.PI)
        const rRate = 1 - Math.sin(((filledR / this.r) * Math.PI) / 2)

        let rectR = ~~(rRate * maxR)
        rectR = rectR > minR ? rectR : minR

        const marginRate = rectR > minR ? 1 : minR
        const rectArea = Math.pow(rectR * 2, 2) * marginRate

        unfilledArea -= rectArea
        filledArea += rectArea

        data.push(
          newRect({
            idx,
            r: rectR,
            rForce: ~~(filledR / 5) * 5,
          })
        )

        // console.log({ idx, rectR, filledR, rRate, unfilledArea })
      }

      return data
    },
    init() {
      this.svg = d3.select('#graph').append('svg')
      this.layer = this.svg.append('g').classed('layer', true)

      this.drawData()
    },
    setSize() {
      let width = this.size
      let height = this.size

      const margin = { top: 0, left: 0, bottom: 0, right: 0 }

      width = width - (margin.left + margin.right)
      height = height - (margin.top + margin.bottom)

      this.svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `${-this.r} ${-this.r} ${this.size} ${this.size}`)

      this.layer
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
    },
    drawData() {
      this.setSize()
      this.updateData(this.getData())
    },
    updateData(data) {
      const collisionForce = rectCollide().size(d => [d.r * 2 + 1, d.r * 2 + 1])

      this.simulation = d3
        .forceSimulation()
        // .force(
        //   'collide',
        //   // d3.forceCollide(d => d.r / 2 ).iterations(16)
        //   d3.forceCollide(d => d.collide).iterations(16)
        // )
        .force('collision', collisionForce)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(0, 0))
        // .force('y', d3.forceY(0).strength(d => d.force))
        // .force('x', d3.forceX(0).strength(d => d.force))

        .force(
          'r',
          d3
            .forceRadial(
              d => {
                return d.rForce
              },
              0,
              0
            )
            .strength(6)
        )

      const rects = this.layer
        .attr('class', 'rects')
        .selectAll('rect')
        .data(data)

      const enterRects = rects
        .enter()
        .append('rect')
        .merge(rects)
        .attr('width', d => d.r * 2)
        .attr('height', d => d.r * 2)
        // .attr('x', d => d.x)
        // .attr('y', d => d.y)
        .attr('fill', d => d.fill)
        .attr('transform', d => `translate(${-d.r},${-d.r})`)
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )

      const exitRects = rects.exit().remove()

      const ticked = () => {
        enterRects.attr('x', d => d.x).attr('y', d => d.y)
        exitRects.attr('x', d => d.x).attr('y', d => d.y)
      }

      this.simulation.alphaDecay(0.1)
      this.simulation.velocityDecay(0.85)

      this.simulation.nodes(data).on('tick', ticked)
      this.simulation.nodes(data).on('end', () => {
        console.log('[BigLogo] force end')
      })

      const simulation = this.simulation

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  &.showBg {
    background-color: $bg-color;
  }
}

$s: 100%;
#graph {
  width: $s;
  height: $s;
}
</style>
