import {
  Box,
  Avatar,
  Typography,
  Paper,
  Grid,
} from '@mui/material'
import { ROBOT_AVATARS, USER_AVATARS } from '../../utils/avatarUtils'

interface AvatarPreviewProps {
  showRobots?: boolean
  showUsers?: boolean
  maxCount?: number
}

export default function AvatarPreview({ 
  showRobots = true, 
  showUsers = true, 
  maxCount = 12 
}: AvatarPreviewProps) {
  const robotAvatars = showRobots ? ROBOT_AVATARS.slice(0, maxCount) : []
  const userAvatars = showUsers ? USER_AVATARS.slice(0, maxCount) : []

  return (
    <Box sx={{ p: 2 }}>
      {showRobots && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            🤖 Robot Avatars
          </Typography>
          <Grid container spacing={1}>
            {robotAvatars.map((avatar, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Avatar
                  src={avatar}
                  sx={{ width: 40, height: 40 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {showUsers && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            👤 User Avatars
          </Typography>
          <Grid container spacing={1}>
            {userAvatars.map((avatar, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Avatar
                  src={avatar}
                  sx={{ width: 40, height: 40 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  )
}
