import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputBase from '@material-ui/core/InputBase'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: '5px'
  },
  helperText: {
    fontSize: '12.1px !important',
    lineHeight: '1.32 !important',
    letterSpacing: '0.4px !important',
    color: '#ffffff',
    marginLeft: `${theme.spacing(1)}px !important`,
    marginTop: `${theme.spacing(0.5)}px !important`
  },
  formControl: {
    height: '100%',
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(0.7),
    '& .MuiInput-underline': {
      '&:after': {
        borderBottom: '0px !important'
      },
      '&:before': {
        borderBottom: '0px !important'
      },
      '&:hover': {
        borderBottom: '0px !important'
      }
    },
    '& .MuiInputBase-root': {
      fontSize: 20.2,
      fontWeight: 600,
      letterSpacing: '0.25px',
      textAlign: 'end',
      color: '#ffffff',
      backgroundColor: 'transparent',
      width: '100%',
      '& svg': {
        color: '#fff',
        margin: '0px !important',
        fontSize: '24px !important'
      }
    },
    '& .MuiSelect-select': {
      width: '100%',
      '&:focus': {
        backgroundColor: 'transparent'
      }
    }
  },
  rootContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 56,
    lineHeight: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottom: '0px solid rgba(255,255,255,0.38)',
    padding: '5px 14px 0 14px'
  },
  inputText: {
    fontSize: 16.2,
    lineHeight: 1.48,
    letterSpacing: '0.15px',
    color: '#ffffff',
    '& input': {
      '&::placeholder': {
        color: '#ffffff',
        opacity: '1 !important'
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
  labelText: {
    fontSize: '12.1px !important',
    fontWeight: '600  !important',
    lineHeight: 1.32,
    letterSpacing: '0.4px  !important',
    color: '#ffffff'
  },
  placeholderSelect: {
    fontSize: 16.2,
    lineHeight: 1.48,
    letterSpacing: '0.15px',
    color: '#ffffff'
  },
  boxInputContainer: {
    width: '100%'
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
  inputDisabled,
  useHelperTextAsNode
}) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')
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
    <Box className={classes.boxInputContainer}>
      <form autoComplete="off" className={classes.rootContainer}>
        <Box className={classes.inputWrapper}>
          <Typography className={classes.labelText} variant="body1">
            {label}
          </Typography>
          <InputBase
            className={classes.inputText}
            type="number"
            ref={textInput}
            onChange={(e) => handleOnChange(e.target.value, 'inputValue')}
            value={inputData.inputValue || ''}
            placeholder={t('placeholder')}
            readOnly={inputDisabled}
            onKeyPress={(e) => handleOnKeyPress(e.key)}
          />
        </Box>
        <FormControl className={classes.formControl} disabled={!options.length}>
          <Select
            id={id}
            onChange={(e) => handleOnChange(e.target.value, 'selectValue')}
            value={inputData.selectValue || ''}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography
                    className={classes.placeholderSelect}
                    variant="body1"
                  >
                    This Token
                  </Typography>
                )
              }

              return selected
            }}
          >
            {options.map(({ value, label }) => (
              <MenuItem key={value} value={value} disabled={selected === value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>

      {useHelperTextAsNode ? (
        helperText
      ) : (
        <Typography className={classes.helperText}>{helperText}</Typography>
      )}
    </Box>
  )
}

InputTextAndSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.any,
  helperText: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.any,
  inputDisabled: PropTypes.bool,
  useHelperTextAsNode: PropTypes.bool
}

InputTextAndSelect.defaultProps = {
  label: '',
  selected: null,
  helperText: null,
  onChange: () => {},
  options: [],
  useHelperTextAsNode: false
}

export default InputTextAndSelect
