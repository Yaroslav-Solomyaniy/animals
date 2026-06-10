import type { StylesConfig } from 'react-select'

export function buildSelectStyles<Option>(isActive = false): StylesConfig<Option> {
    return {
        control: (base, { isFocused }) => ({
            ...base,
            borderColor: isActive ? '#f27438' : isFocused ? '#f27438' : '#e5e7eb',
            borderWidth: isActive ? '2px' : '1px',
            borderRadius: '0.5rem',
            boxShadow: isFocused ? '0 0 0 2px rgba(242, 116, 56, 0.2)' : 'none',
            '&:hover': { borderColor: '#f27438' },
            backgroundColor: isActive ? 'rgba(242, 116, 56, 0.05)' : 'white',
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#f27438' : isFocused ? 'rgba(242, 116, 56, 0.1)' : undefined,
            color: isSelected ? 'white' : '#1f2937',
            cursor: 'pointer',
        }),
        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
        singleValue: (base) => ({ ...base, color: '#1f2937' }),
    }
}