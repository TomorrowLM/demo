import React from 'react'
import PropTypes from 'prop-types'
import { styled, Typography, Grid } from '@material-ui/core'

const MappingControlContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: `${theme.spacing()}px 0`
}))

const MappingControlLabel = styled(Typography)({
  fontWeight: 900
})

const MappingControlSeperator = styled('span')({
  paddingRight: '0.5em'
})

const MappingControlItem = (props) => {
  const { dataSource, labelKey, valueKey, seperator } = props
  return (
    <MappingControlContainer>
      <MappingControlLabel>
        {dataSource[labelKey]}
        <MappingControlSeperator>{seperator}</MappingControlSeperator>
      </MappingControlLabel>
      <Typography>{dataSource[valueKey]}</Typography>
    </MappingControlContainer>
  )
}

MappingControlItem.propTypes = {
  dataSource: PropTypes.shape(),
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  seperator: PropTypes.string
}

MappingControlItem.defaultProps = {
  dataSource: {},
  valueKey: 'value',
  labelKey: 'label',
  seperator: ':'
}

const MappingControl = (props) => {
  const {
    isGroup,
    dataSource,
    valueKey,
    labelKey,
    seperator,
    itemKey,
    itemSpan
  } = props
  return isGroup ? (
    <Grid container>
      {dataSource.map((mappingItem) => {
        return (
          <Grid key={mappingItem[itemKey]} item {...itemSpan}>
            <MappingControlItem
              dataSource={mappingItem}
              valueKey={valueKey}
              labelKey={labelKey}
              seperator={seperator}
            />
          </Grid>
        )
      })}
    </Grid>
  ) : (
    <MappingControlItem
      dataSource={dataSource}
      valueKey={valueKey}
      labelKey={labelKey}
      seperator={seperator}
    />
  )
}
MappingControl.propTypes = {
  isGroup: PropTypes.bool,
  itemKey: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  seperator: PropTypes.string,
  dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.shape()]),
  itemSpan: PropTypes.shape({
    xs: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xm: PropTypes.number
  })
}
MappingControl.defaultProps = {
  isGroup: false,
  itemKey: 'id',
  valueKey: 'value',
  labelKey: 'label',
  seperator: ':',
  dataSource: {},
  itemSpan: {
    xs: 12
  }
}

export default MappingControl
