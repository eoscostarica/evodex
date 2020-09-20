import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(3),
    overflowX: 'hide'
  },
  table: {
    minWidth: 340,
    border: 'none'
  },
  tableCell: {
    padding: '10px 5px',
    border: 'none',
    textAlign: 'end',
    paddingRight: 5,
    fontSize: 13,
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
  },
  tableHeadCell: {
    padding: 0,
    border: 'none',
    color: '#1976d2',
    fontSize: 13,
    textAlign: 'end',
    paddingRight: 5
  },
  tableHead: {
    backgroundColor: 'transparent'
  },
  firstTableHeadRow: {
    width: '50%',
    textAlign: 'start'
  },
  firstTableBodyRow: {
    textAlign: 'start',
    fontSize: 15.5
  },
  clickable: {
    cursor: 'pointer'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  underline: {
    textDecoration: 'underline'
  }
}))

const TableData = ({ data, onClick }) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('pool1')

  const handleOnClick = (row) => {
    if (!onClick) {
      return
    }

    onClick(row)
  }

  const descendingComparator = (a, b) => {
    let valueA = a[orderBy]
    let valueB = b[orderBy]

    if (orderBy.includes('pool')) {
      valueA = Number.parseInt(a[orderBy].asset.amount)
      valueB = Number.parseInt(b[orderBy].asset.amount)
    }

    if (valueB < valueA) return -1

    if (valueB > valueA) return 1

    return 0
  }

  const getComparator = (order) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b)
  }

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })

    return stabilizedThis.map((el) => el[0])
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Box className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell
              className={clsx(classes.tableHeadCell, classes.firstTableHeadRow)}
              sortDirection={false}
            >
              <TableSortLabel
                className={clsx({ [classes.underline]: orderBy === 'token' })}
                onClick={() => handleRequestSort('token')}
                hideSortIcon
              >
                {t('tokenPair').toUpperCase()}
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <TableSortLabel
                className={clsx({ [classes.underline]: orderBy === 'pool1' })}
                onClick={() => handleRequestSort('pool1')}
                hideSortIcon
              >
                {`${t('pool')} 1`.toUpperCase()}
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <TableSortLabel
                className={clsx({ [classes.underline]: orderBy === 'pool2' })}
                onClick={() => handleRequestSort('pool2')}
                hideSortIcon
              >
                {`${t('pool')} 2`.toUpperCase()}
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <TableSortLabel
                className={clsx({ [classes.underline]: orderBy === 'fee' })}
                direction="asc"
                onClick={() => handleRequestSort('fee')}
                hideSortIcon
              >
                {t('fee').toUpperCase()}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {stableSort(data, getComparator(order)).map((n, index) => (
            <TableRow
              key={`${n.token}-${index}`}
              className={onClick ? classes.clickable : ''}
              onClick={() => handleOnClick(n)}
            >
              <TableCell
                component="th"
                scope="row"
                className={clsx(classes.tableCell, classes.firstTableBodyRow)}
              >
                {n.token}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {n.pool1.asset.toString()}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {n.pool2.asset.toString()}
              </TableCell>
              <TableCell className={classes.tableCell}>
                {n.fee ? n.fee / 100 : 0}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

TableData.propTypes = {
  data: PropTypes.array,
  onClick: PropTypes.func
}

TableData.defaultProps = {
  data: []
}

export default TableData
