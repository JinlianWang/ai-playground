import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const Dropdown = ({ label, value, onChange, options, required = false, ...props }) => {
  return (
    <FormControl fullWidth variant="outlined" required={required} {...props}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default Dropdown