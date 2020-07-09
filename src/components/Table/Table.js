import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
  }
}))

const TableData = ({ data }) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell
              className={clsx(classes.tableHeadCell, classes.firstTableHeadRow)}
            >
              TOKEN PAIR
            </TableCell>
            <TableCell className={classes.tableHeadCell}>VOLUME</TableCell>
            <TableCell className={classes.tableHeadCell}>FEE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((n, index) => {
            return (
              <TableRow key={`${n.token}-${index}`}>
                <TableCell
                  component="th"
                  scope="row"
                  className={clsx(classes.tableCell, classes.firstTableBodyRow)}
                >
                  {n.token}
                </TableCell>
                <TableCell className={classes.tableCell}>{n.lume}</TableCell>
                <TableCell className={classes.tableCell}>{n.fee}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

TableData.propTypes = {
  data: PropTypes.array
}

TableData.defaultProps = {
  data: [
    { token: 'ABCEOS', lume: '12.0403', fee: '0.1%' },
    { token: 'EVOABC', lume: '230.0012', fee: '0.1%' },
    { token: 'EVOEOS', lume: '450230.0012', fee: '0.2%' },
    { token: 'ABCEOS', lume: '12,0403', fee: '0.2%' },
    { token: 'EVOABC', lume: '230.0012', fee: '0.1%' },
    { token: 'EVOUSDT', lume: '12,0403', fee: '0.2%' },
    { token: 'ABCEOS', lume: '12,0403', fee: '0.1%' },
    { token: 'EVOABC', lume: '230.0012', fee: '0.1%' }
  ]
}

export default TableData
