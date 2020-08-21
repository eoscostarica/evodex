import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Skeleton from '@material-ui/lab/Skeleton'
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
  boxContent: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

const TableSkeleton = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell
              className={clsx(classes.tableHeadCell, classes.firstTableHeadRow)}
            >
              <Skeleton width={100} />
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Box className={classes.boxContent}>
                <Skeleton width={70} />
              </Box>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Box className={classes.boxContent}>
                <Skeleton width={70} />
              </Box>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Box className={classes.boxContent}>
                <Skeleton width={70} />
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              className={clsx(classes.tableCell, classes.firstTableBodyRow)}
            >
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              className={clsx(classes.tableCell, classes.firstTableBodyRow)}
            >
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Skeleton />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default TableSkeleton
