import React from "react"
import { BarStack } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

type AgeData = { age: number; groups: { [x: string]: number } }

interface BarStackProps extends Chart.BaseProps {
  dataAge: AgeData[]
  maxAge: number
  averageAge: number
}

export default function BarStackChart({ width, height, data, dataAge, maxAge, averageAge, totalDeputes }: BarStackProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()
  // bounds
  const verticalMargin = 120
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const age = (d) => d.age
  const sigle = (d) => d.id

  // scales, memoize for performance

  const xScale = scaleBand<number>({
    range: [0, xMax],
    round: true,
    domain: dataAge.map((d) => d.age).reverse(),
    padding: 0.15,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, maxAge],
  })

  const colorScale = (key, index) => {
    const foundValue = data.find((value) => {
      if (value.id === key) return true
    })
    if (foundValue) return foundValue.color
    else return ""
  }

  const handleMouseLeave = () => {
    hideTooltip()
  }

  const handleMouseMove = (event, data) => {
    showTooltip({
      tooltipData: {
        key: data.key,
        bar: data.bar.data.groups[data.key],
        color: data.color,
        age: data.bar.data.age,
      },
      tooltipTop: event.clientY,
      tooltipLeft: event.clientX,
    })
  }

  return width < 10 ? null : (
    <div className="pyramide chart">
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="url(#teal)" rx={14} />
        <Group top={verticalMargin / 2}>
          <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
          <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />
          <text x="-160" y="-50" transform="rotate(-90)" className="description_y">
            Nombre de députés
          </text>
          <text x={xMax + 10} y={yMax} className="description_x">
            Âge
          </text>
        </Group>
        <Group top={verticalMargin / 2}>
          <BarStack<AgeData, string>
            data={dataAge}
            keys={Object.keys(dataAge[0].groups)}
            value={(d, key) => d.groups[key]}
            x={(d) => d.age}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => handleMouseMove(event, bar)}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <Group top={verticalMargin / 2}>
          <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} numTicks={dataAge.map(age).length} />
        </Group>
        {/* Il faut enlever les 40 du padding sur ce groupe */}
        <Group left={width / 2 - 40} top={height}>
          <text className="age_moyen">Âge moyen : {averageAge} ans</text>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <ChartTooltip
          tooltipTop={tooltipTop}
          tooltipLeft={tooltipLeft}
          title={tooltipData.key}
          nbDeputes={tooltipData.bar}
          totalDeputes={totalDeputes}
          color={tooltipData.color}
          age={tooltipData.age}
        />
      )}
    </div>
  )
}
