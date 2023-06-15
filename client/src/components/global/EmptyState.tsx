import Button from "./Button";
import emptysetimg from "../../images/emptyset_img.png";
import { Box, Typography } from "@mui/material";
import SchemaButtonUpload from "../../images/icons/schema/SchemaButtonUpload";
import TopBarPlus from "../../images/icons/Plus";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  actionButtons: ReactNode;
}

const EmptyState = ({ title, message, actionButtons }: EmptyStateProps) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={512}
      m="auto"
      alignContent="center"
      alignItems="center"
    >
      <img src={emptysetimg} alt="no schema" />
      <Box mt={2} sx={{ width: 352 }}>
        <Typography
          textAlign="center"
          variant="h6"
          sx={{ fontWeight: 600, fontSize: 18 }}
        >
          {title}
        </Typography>
        <Typography
          textAlign="center"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 400, fontSize: 14 }}
        >
          {message}
        </Typography>
      </Box>
      <Box mt={4}>{actionButtons}</Box>
    </Box>
  );
};

export default EmptyState;
