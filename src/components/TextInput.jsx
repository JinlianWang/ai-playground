import { TextField } from '@mui/material'

const TextInput = ({ label, value, onChange, placeholder, required = false, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      variant="outlined"
      fullWidth
      {...props}
    />
  )
}

export default TextInput