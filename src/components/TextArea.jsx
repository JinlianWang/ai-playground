import { TextField } from '@mui/material'

const TextArea = ({ label, value, onChange, placeholder, rows = 4, required = false, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      variant="outlined"
      fullWidth
      multiline
      rows={rows}
      {...props}
    />
  )
}

export default TextArea