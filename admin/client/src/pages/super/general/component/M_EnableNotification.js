import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Modal, Typography, useMediaQuery } from "@mui/material";

import useGeneral from "../../../../hooks/super/useGeneral";

import { Check as CheckIcon } from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, Button, IconButton } from "../../../../components/pages/application/common/styled";

function EnableNotificationModal({ type, open, handleClose, id, name }) {
  const theme = useTheme();
  const isMD = useMediaQuery(theme.breakpoints.up("md"));

  const { updateNotification } = useGeneral();

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <Box sx={{ width: isMD ? "640px" : "90vw" }}>
          <Grid container>
            <Grid item xs={12} borderBottom={"solid 1px #ccc"}>
              <Grid container pt={2} pb={2}>
                <Grid item sx={{ margin: "auto" }}>
                  <Typography variant="h2">Enable Notification</Typography>
                </Grid>
                <Grid item xs></Grid>
                <Grid item display="flex" alignItems="center">
                  <IconButton onClick={handleClose} size="large">
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container pt={4}>
            <Grid
              item
              xs={12}
              sx={{
                margin: "auto",
                textAlign: "left",
              }}
            >
              Are you sure you want to enable this notification?
              <br />
              <br />
              {name} ({id})
            </Grid>
            <Grid item xs={12} mt={8} textAlign={"right"}>
              <Button variant="outlined" color="primary" onClick={handleClose} mr={4}>
                <CloseIcon
                  sx={{
                    marginRight: "4px",
                    fillOpacity: "0.5",
                  }}
                />
                No
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  await updateNotification(id, {
                    enable: true,
                  });
                  handleClose();
                }}
              >
                <CheckIcon
                  sx={{
                    marginRight: "4px",
                  }}
                />
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default EnableNotificationModal;
