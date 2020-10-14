import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
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
    width: 'auto',
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
    justifyContent: 'space-between',
    height: 56,
    lineHeight: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottom: '2px solid rgba(255,255,255,0.38)',
    padding: '5px 14px 0 14px'
  },
  rootContainerError: {
    borderBottom: `2px solid ${theme.palette.error.main}`,
    '& p': {
      color: theme.palette.error.main
    }
  },
  inputText: {
    fontSize: 16.2,
    lineHeight: 1.48,
    letterSpacing: '0.15px',
    color: '#ffffff',
    '& input': {
      color: '#ffffff',
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
  value: inputValRef,
  useHelperTextAsNode,
  hasError,
  containerId,
  isValueAllowed,
  placeholder,
  suffix
}) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')
  const inputEl = useRef(null)
  const [valuePrefix, setValuePrefix] = useState('')

  const handleOnKeyPress = (key) => {
    if (key === 'Enter' && inputEl?.current) {
      inputEl.current.querySelector('input').blur()
    }
  }

  const handleOnChange = (event) => {
    const inputValue = event.target.value.replace(suffix, '')
    const element = inputEl.current.querySelector('input')

    if (!isValueAllowed(inputValue)) {
      suffix &&
        setTimeout(() => {
          element.setSelectionRange(
            inputValue.length - 1,
            inputValue.length - 1
          )
        }, 0)
      return
    }

    suffix &&
      setTimeout(() => {
        element.setSelectionRange(inputValue.length, inputValue.length)
      }, 0)

    setValuePrefix(`${inputValue || ''}${inputValue ? suffix : ''}`)
    onChange({ ...inputValRef, inputValue })
  }

  const handleOnChangeSelect = (value) => {
    onChange({ ...inputValRef, selectValue: value })
  }

  useEffect(() => {
    setValuePrefix(
      `${inputValRef.inputValue || ''}${inputValRef.inputValue ? suffix : ''}`
    )
  }, [inputValRef.inputValue, suffix])

  return (
    <Box className={classes.boxInputContainer} id={containerId}>
      <form
        autoComplete="off"
        className={clsx({
          [classes.rootContainer]: true,
          [classes.rootContainerError]: hasError
        })}
      >
        <Box className={classes.inputWrapper}>
          <Typography className={classes.labelText} variant="body1">
            {label}
          </Typography>
          <TextField
            ref={inputEl}
            onKeyPress={(e) => handleOnKeyPress(e.key)}
            value={valuePrefix}
            classes={{
              root: classes.inputText
            }}
            placeholder={placeholder || t('placeholder')}
            onChange={handleOnChange}
          />
        </Box>
        <FormControl className={classes.formControl} disabled={!options.length}>
          <Select
            id={id}
            onChange={(e) => handleOnChangeSelect(e.target.value)}
            value={inputValRef.selectValue || t('selected')}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography
                    className={classes.placeholderSelect}
                    variant="body1"
                  >
                    {t('selected')}
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
  useHelperTextAsNode: PropTypes.bool,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
  containerId: PropTypes.string,
  isValueAllowed: PropTypes.func,
  suffix: PropTypes.string
}

InputTextAndSelect.defaultProps = {
  label: '',
  selected: null,
  helperText: null,
  onChange: () => {},
  options: [],
  useHelperTextAsNode: false,
  placeholder: null,
  isValueAllowed: () => true,
  suffix: ''
}

export default InputTextAndSelect
