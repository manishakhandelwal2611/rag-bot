import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material'
import {
  Language as LanguageIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'
import { getTimezoneInfo, getCurrentTime, getTimezoneDisplayName } from '../../utils/dateUtils'

interface TimezoneInfoProps {
  showTime?: boolean
  compact?: boolean
}

export default function TimezoneInfo({ showTime = false, compact = false }: TimezoneInfoProps) {
  const [timezoneInfo, setTimezoneInfo] = useState(getTimezoneInfo())
  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const timezoneDisplayName = getTimezoneDisplayName(timezoneInfo.timezone)

  if (compact) {
    return (
      <Tooltip title={`${timezoneDisplayName} (${timezoneInfo.offset})`}>
        <Chip
          icon={<LanguageIcon />}
          label={timezoneInfo.offset}
          size="small"
          variant="outlined"
          sx={{ 
            fontSize: '0.7rem',
            height: 20,
            '& .MuiChip-icon': { fontSize: 12 }
          }}
        />
      </Tooltip>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
      <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {timezoneDisplayName}
        </Typography>
        {showTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled">
              {currentTime.time}
            </Typography>
          </Box>
        )}
      </Box>
      <Chip
        label={timezoneInfo.offset}
        size="small"
        variant="outlined"
        sx={{ 
          fontSize: '0.7rem',
          height: 20,
          minWidth: 'auto'
        }}
      />
    </Box>
  )
}
