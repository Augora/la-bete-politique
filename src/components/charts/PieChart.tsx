import React from "react"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

interface PieProps {
  width: number
  height: number
  margin?: { top: number; left: number; right: number; bottom: number }
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
  totalDeputes: number
}

// accessors
const sigle = (d) => d.id
const nombreDeputes = (d) => d.value
const colorGroupe = (d) => d.color
const labelGroupe = (d) => d.label

const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 }

export default function PieChart({ width, height, margin = defaultMargin, data, totalDeputes }: PieProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  //const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const top = innerHeight + margin.top
  const left = centerX + margin.left
  const HALF_PI = Math.PI / 2

  const handleMouseLeave = () => {
    hideTooltip()
  }

  const handleMouseMove = (event, data) => {
    const top = event.clientY
    const left = event.clientX
    showTooltip({
      tooltipData: {
        key: labelGroupe(data),
        bar: nombreDeputes(data),
        color: colorGroupe(data),
      },
      tooltipTop: top,
      tooltipLeft: left,
    })
  }

  return (
    <div className="piechart chart">
      <svg width={width} height={height}>
        <Group top={top} left={left}>
          <Pie
            data={data}
            pieValue={nombreDeputes}
            pieSortValues={sigle}
            outerRadius={200}
            innerRadius={100}
            padAngle={0.01}
            startAngle={-HALF_PI}
            endAngle={HALF_PI}
            cornerRadius={5}
          >
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const groupeArc = arc.data
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.2
                const arcPath = pie.path(arc)
                return (
                  <g key={`arc-${groupeArc}-${index}`}>
                    <path
                      d={arcPath}
                      fill={colorGroupe(groupeArc)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(event) => handleMouseMove(event, arc.data)}
                    />
                    {hasSpaceForLabel && (
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="#ffffff"
                        fontSize={22}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {nombreDeputes(groupeArc)}
                      </text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <ChartTooltip tooltipTop={tooltipTop} tooltipLeft={tooltipLeft} totalDeputes={totalDeputes} tooltipData={tooltipData} />
      )}
    </div>
  )
}
