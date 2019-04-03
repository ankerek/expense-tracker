import React from 'react'
import addMonths from 'date-fns/addMonths'
import { formatDateString, getPeriod, parseDateString } from '@utils/date'
import { GetOverviewFilterQuery_overviewFilter_period } from '@schema-types'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { Wrapper } from './elements'
import { client } from '@apollo/initializeApollo'

interface PeriodFilterProps {
  period: GetOverviewFilterQuery_overviewFilter_period
}

export class PeriodFilter extends React.Component<PeriodFilterProps> {
  handleChangePeriod = (modifier: 'prev' | 'next') => {
    const { period } = this.props
    const newPeriod = getPeriod({
      currentPeriod: period,
      modifier,
    })

    client.writeData({
      data: {
        overviewFilter: {
          __typename: 'OverviewFilter',
          period: newPeriod,
        },
      },
    })
  }

  render() {
    const { period } = this.props
    return (
      <Wrapper>
        <IconButton onClick={() => this.handleChangePeriod('prev')}>
          <ChevronLeft />
        </IconButton>
        <div>
          {formatDateString(period.start, 'PP')}
          &nbsp;–&nbsp;
          {formatDateString(period.end, 'PP')}
        </div>
        <IconButton onClick={() => this.handleChangePeriod('next')}>
          <ChevronRight />
        </IconButton>
      </Wrapper>
    )
  }
}
