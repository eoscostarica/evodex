import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  selectContent: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 56,
    lineHeight: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottom: '2px solid rgba(0, 0, 0, 0.38)',
    padding: '5px 14px 0 14px',
    '& .selectWrapper': {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    '& label': {
      position: 'absolute',
      right: 0,
      fontSize: 16.2,
      color: '#ffffff',
      zIndex: 0
    },
    '& .arrow': {
      border: 'none',
      borderTop: '5px solid #ffffff',
      borderLeft: '5px solid rgba(0,0,0,0)',
      borderRight: '5px solid rgba(0,0,0,0)',
      width: 10,
      height: 7.5,
      display: 'inline-block',
      marginLeft: 8,
      marginRight: 16
    },
    '& select': {
      zIndex: 1,
      appearance: 'none',
      outline: 0,
      boxShadow: 'none',
      border: '0 !important',
      background: 'none',
      backgroundImage: 'none',
      padding: '0 18px 0 0',
      cursor: 'pointer',
      width: '100%',
      fontSize: 20.2,
      fontWeight: 600,
      letterSpacing: '0.25px',
      color: '#ffffff'
    },
    '& input': {
      appearance: 'none',
      outline: 0,
      border: '0 !important',
      background: 'none',
      padding: '0 20px 0 0',
      cursor: 'auto',
      width: '100%',
      fontSize: 16.2,
      lineHeight: 1.48,
      letterSpacing: '0.15px',
      color: '#ffffff',
      '&::placeholder': {
        color: '#ffffff'
      },
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        appearance: 'none',
        margin: 0
      }
    },
    '& input[type=number]': {
      appearance: 'textfield'
    }
  },
  inputWrapper: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& p': {
      fontSize: 12.1,
      fontWeight: 600,
      lineHeight: 1.32,
      letterSpacing: '0.4px',
      color: '#ffffff'
    }
  },
  helperText: {
    fontSize: '12.1px !important',
    lineHeight: '1.32 !important',
    letterSpacing: '0.4px !important',
    color: '#ffffff',
    marginLeft: `${theme.spacing(1)}px !important`,
    marginTop: `${theme.spacing(0.5)}px !important`
  }
}))

const InputTextAndSelect = ({
  id,
  label,
  helperText,
  onChange,
  options,
  selected,
  value,
  inputDisabled
}) => {
  const classes = useStyles()
  const textInput = useRef(null)
  const [inputData, setInputData] = useState({})

  const handleOnChange = (value, type) => {
    setInputData({ ...inputData, [type]: value })
    onChange({ ...inputData, [type]: value })
  }

  const handleOnKeyPress = (key) => {
    if (key === 'Enter') textInput.current.blur()
  }

  useEffect(() => {
    setInputData(
      value || {
        inputValue: '',
        selectValue: 0
      }
    )
  }, [value])

  return (
    <Box width="100%">
      <Box className={classes.selectContent}>
        <Box className={classes.inputWrapper}>
          <Typography variant="body1">{label}</Typography>
          <input
            type="number"
            ref={textInput}
            onChange={(e) => handleOnChange(e.target.value, 'inputValue')}
            value={inputData.inputValue || ''}
            placeholder="This Amount"
            disabled={inputDisabled}
            onKeyPress={(e) => handleOnKeyPress(e.key)}
          />
        </Box>
        <Box className="selectWrapper">
          <label htmlFor={id}>
            {!inputData?.selectValue && 'This Token'}
            <span className={'arrow'}></span>
          </label>
          <select
            id={id}
            dir="rtl"
            onChange={(e) => handleOnChange(e.target.value, 'selectValue')}
            value={inputData.selectValue || '-'}
          >
            <option value="-" disabled hidden></option>
            {options.map(({ value, label }) => (
              <option
                key={value}
                value={value}
                disabled={inputData.selectValue === value}
              >
                {label}
              </option>
            ))}
          </select>
        </Box>
      </Box>
      <Typography className={classes.helperText}>{helperText}</Typography>
    </Box>
  )
}

InputTextAndSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.any,
  inputDisabled: PropTypes.bool
}

InputTextAndSelect.defaultProps = {
  label: '',
  selected: null,
  helperText: '',
  onChange: () => {},
  options: []
}

export default InputTextAndSelect
