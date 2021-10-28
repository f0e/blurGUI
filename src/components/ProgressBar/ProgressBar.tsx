import { Box, LinearProgress, Typography } from '@mui/material';

import './ProgressBar.scss';

export default function LinearProgressWithLabel(props: any) {
  const ProgressLabel = () => (
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">{`${Math.round(
        props.value
      )}%`}</Typography>
    </Box>
  );

  const labelSide = props.labelSide ? props.labelSide : 'right';

  return (
    <div className="progress-bar">
      {labelSide === 'left' && <ProgressLabel />}

      <div
        className={`progress-bar-bar${
          labelSide === 'right' ? ' label-right' : ' label-left'
        }`}
      >
        <LinearProgress variant="determinate" {...props} />
      </div>

      {labelSide === 'right' && <ProgressLabel />}
    </div>
  );
}
