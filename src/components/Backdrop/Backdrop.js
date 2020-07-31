import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
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
    padding: 0
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
      layerHeight,
      classes: extraClasses,
      className,
      headerText,
      backgroundColor,
      isStaticPage
    },
    ref
  ) => {
    const theme = useTheme()
    const classes = useStyles()
    const rootClasses = useRootStyles({ color: backgroundColor })
    const frontLayerRef = useRef()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const [frontLayerHeight, setFrontLayerHeight] = useState(layerHeight)
    const [transaction, setTransaction] = useState(false)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const handleOnClick = () => {
      const contentHeight = frontLayerRef.current.clientHeight
      setNewHeight(contentHeight)
    }

    useImperativeHandle(ref, () => ({
      toggleOnClickMobile: () => {
        if (isMobile) {
          handleOnClick()
        }
      }
    }))

    const setNewHeight = useCallback(
      async (value) => {
        const snappedY = value || layerHeight

        setTransaction(true)
        setFrontLayerHeight(snappedY)
        setTimeout(() => {
          setTransaction(false)
        }, TRANSITION_DURATION)
      },
      [layerHeight]
    )

    useEffect(() => {
      if (isMobile && frontLayerRef.current && isFirstTime) {
        const contentHeight = frontLayerRef.current.clientHeight

        setNewHeight(contentHeight)
        setIsFirstTime(false)
      }

      if (
        !isMobile &&
        frontLayerRef.current &&
        frontLayerRef.current.clientHeight === layerHeight
      ) {
        setNewHeight()
        setIsFirstTime(true)
      }
    }, [isMobile, frontLayerRef])

    useEffect(() => {
      setNewHeight(layerHeight)
    }, [layerHeight])

    return (
      <div className={clsx(className, rootClasses.root, extraClasses.root)}>
        <div
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
        <Paper
          className={clsx(classes.frontLayer, extraClasses.frontLayer)}
          ref={frontLayerRef}
        >
          <div className={clsx(classes.headerBox, extraClasses.headerBox)}>
            {headerText}
            {isMobile && !isStaticPage && (
              <IconButton
                aria-label=""
                classes={{ root: classes.iconDrop }}
                onClick={handleOnClick}
              >
                {frontLayerHeight === layerHeight ? <DropDown /> : <DropUp />}
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
  layerHeight: 56,
  frontLayer: null,
  backLayer: null,
  className: null,
  classes: {},
  headerText: <span>Settings</span>,
  backgroundColor: '#00bace',
  isStaticPage: false
}

Backdrop.propTypes = {
  layerHeight: PropTypes.number,
  frontLayer: PropTypes.node,
  backLayer: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  headerText: PropTypes.node,
  backgroundColor: PropTypes.string,
  isStaticPage: PropTypes.bool
}

export default Backdrop
