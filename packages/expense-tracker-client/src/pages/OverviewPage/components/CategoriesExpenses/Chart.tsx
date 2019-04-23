import React, { PureComponent } from 'react'
import { PieChart, Pie, PieLabelRenderProps } from 'recharts'
import { FormattedAmount } from '@components/FormattedAmount'

const LabelRenderer: React.FC<PieLabelRenderProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180
  const radius =
    25 + Number(innerRadius) + (Number(outerRadius) - Number(innerRadius))
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN)
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN)

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={13}
      >
        {name}
      </text>
      <text
        x={x}
        y={y}
        dy={16}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        ({value * -1}
        <FormattedAmount amount={value * -1} />)
      </text>
    </g>
  )
}

interface ChartProps {
  data?: Array<{ name: string; value: number }>
}

export class Chart extends PureComponent<ChartProps> {
  render() {
    const { data } = this.props
    return (
      <PieChart width={320} height={250}>
        <Pie
          dataKey="value"
          outerRadius={50}
          isAnimationActive={false}
          data={data}
          fill="#8884d8"
          label={LabelRenderer}
        />
      </PieChart>
    )
  }
}
