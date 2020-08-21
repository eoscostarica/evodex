import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import DropUp from '@material-ui/icons/ArrowDropUp'
import DropDown from '@material-ui/icons/ArrowDropDown'
import IconButton from '@material-ui/core/IconButton'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const TRANSITION_DURATION = 250
const MIN_HEIGHT_TO_COLLAPSE = 450

const useRootStyles = makeStyles({
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: (props) => props.color,
    borderRight: (props) => `2px solid ${props.color}`,
    borderLeft: (props) => `2px solid ${props.color}`
  }
})

const useStyles = makeStyles((theme) => ({
  backLayer: {
    overflow: 'hidden'
  },
  backlayerTransition: {
    transitionDuration: `${TRANSITION_DURATION}ms`,
    transitionProperty: 'height',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2)
  },
  frontLayer: {
    width: '100%',
    flex: 1,
    borderRadius: theme.spacing(2, 2, 0, 0),
    display: 'flex',
    flexDirection: 'column'
  },
  contentWrapper: {
    position: 'relative',
    flex: 1
  },
  frontLayerContent: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  iconDrop: {
    fontSize: 25,
    padding: 0,
    width: 35,
    height: 35
  },
  secondaryPage: {
    width: '100%',
    height: '100%'
  }
}))

const Backdrop = forwardRef(
  (
    {
      frontLayer,
      backLayer,
      layerHeightUp,
      classes: extraClasses,
      className,
      headerText,
      backgroundColor,
      isStaticPage,
      layerHeightDown
    },
    ref
  ) => {
    const theme = useTheme()
    const classes = useStyles()
    const rootClasses = useRootStyles({ color: backgroundColor })
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const isLandscape = useMediaQuery('(orientation: landscape)')
    const [frontLayerHeight, setFrontLayerHeight] = useState(layerHeightUp)
    const [transaction, setTransaction] = useState(false)
    const [isArrowUp, setIsArrowUp] = useState(false)
    const [showHeader, setShowHeader] = useState(false)

    const refEle = useRef(null)

    const handleOnClick = () => {
      const height = window.innerHeight
      const contentHeight = isArrowUp
        ? height - layerHeightDown
        : height - (height - layerHeightUp)

      setIsArrowUp(!isArrowUp)
      setNewHeight(contentHeight)
    }

    useImperativeHandle(ref, () => ({
      toggleOnClickMobile: () => {
        if (isMobile) {
          handleOnClick()
        }
      }
    }))

    useImperativeHandle(ref, () => ({
      test: () => {
        refEle.current.scroll({
          top: 0,
          behavior: 'smooth'
        })
        console.log({ ele: refEle.current })
      }
    }))

    const setNewHeight = useCallback(async (value) => {
      setTransaction(true)
      setFrontLayerHeight(value)
      setTimeout(() => {
        setTransaction(false)
      }, TRANSITION_DURATION)
    }, [])

    useEffect(() => {
      const height = window.innerHeight

      setShowHeader(
        (height < MIN_HEIGHT_TO_COLLAPSE && isLandscape) ||
          (isMobile && !isStaticPage)
      )

      if (isStaticPage) {
        setNewHeight(height - (height - layerHeightUp))

        return
      }

      if (isMobile) {
        setNewHeight(height - layerHeightDown)

        return
      }

      if (!isMobile) {
        setNewHeight(
          isLandscape && height < MIN_HEIGHT_TO_COLLAPSE
            ? height - layerHeightDown
            : height - (height - layerHeightUp)
        )
      }
    }, [
      isMobile,
      layerHeightDown,
      layerHeightUp,
      setNewHeight,
      isStaticPage,
      isLandscape
    ])

    return (
      <div className={clsx(className, rootClasses.root, extraClasses.root)}>
        <div
          ref={refEle}
          className={clsx(
            classes.backLayer,
            transaction ? classes.backlayerTransition : null,
            extraClasses.backLayer
          )}
          style={{
            height: frontLayerHeight
          }}
        >
          {backLayer}
        </div>
        <Paper className={clsx(classes.frontLayer, extraClasses.frontLayer)}>
          <div className={clsx(classes.headerBox, extraClasses.headerBox)}>
            {headerText}
            {showHeader && (
              <IconButton
                aria-label=""
                classes={{ root: classes.iconDrop }}
                onClick={handleOnClick}
              >
                {isArrowUp ? <DropDown /> : <DropUp />}
              </IconButton>
            )}
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.frontLayerContent}>{frontLayer}</div>
          </div>
        </Paper>
      </div>
    )
  }
)

Backdrop.defaultProps = {
  layerHeightUp: 200,
  layerHeightDown: 51,
  frontLayer: null,
  backLayer: null,
  className: null,
  classes: {},
  headerText: <span>Settings</span>,
  backgroundColor: '#00bace',
  isStaticPage: false
}

Backdrop.propTypes = {
  layerHeightUp: PropTypes.number,
  layerHeightDown: PropTypes.number,
  frontLayer: PropTypes.node,
  backLayer: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  headerText: PropTypes.node,
  backgroundColor: PropTypes.string,
  isStaticPage: PropTypes.bool
}

export default Backdrop
