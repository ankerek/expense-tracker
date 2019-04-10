import React, { PureComponent } from 'react'
import { PieChart, Pie, Legend, Tooltip } from 'recharts'
import { FormattedAmount } from '@components/FormattedAmount'

interface ChartProps {
  data?: object[]
}

export class Chart extends PureComponent<ChartProps> {
  tooltipFormatter = (value: number) => {
    return <FormattedAmount amount={value * -1} />
  }

  render() {
    const { data } = this.props
    return (
      <PieChart width={200} height={200}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          fill="#8884d8"
        />
        <Tooltip formatter={this.tooltipFormatter} />
      </PieChart>
    )
  }
}
